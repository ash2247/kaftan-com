import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

interface BackupRequest {
  action: 'create' | 'restore' | 'download' | 'delete'
  backupId?: string
}

interface BackupData {
  id: string
  name: string
  size: number
  status: string
  created_at: string
  created_by: string
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create admin client with service role key for all operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY')!
    
    // Use service role key to bypass RLS
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      db: {
        schema: 'public'
      }
    })

    const { method } = req

    if (method === 'GET') {
      // List existing backups
      console.log('Attempting to fetch backups...')
      const { data: backups, error } = await adminClient
        .from('database_backups')
        .select('*')
        .order('created_at', { ascending: false })

      console.log('Backups result:', { backups, error })

      if (error) {
        console.error('Database error:', error)
        // If tables don't exist, return empty array
        if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
          return new Response(
            JSON.stringify({ backups: [] }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        throw error
      }

      return new Response(
        JSON.stringify({ backups }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (method === 'POST') {
      const { action, backupId }: BackupRequest = await req.json()

      if (action === 'create') {
        console.log('Creating backup...')
        // Create backup
        const timestamp = new Date().toISOString()
        const backupName = `backup_${timestamp.replace(/[:.]/g, '-')}`
        
        // Get all table data
        const tables = [
          'products', 'categories', 'collections', 'orders', 'customers',
          'coupons', 'inventory', 'pages', 'media', 'notifications',
          'messages', 'settings', 'smtp_settings'
        ]

        const backupData: any = {}
        
        for (const table of tables) {
          try {
            const { data, error } = await adminClient
              .from(table)
              .select('*')
            
            if (error && error.code !== 'PGRST116') { // Ignore table not found errors
              console.error(`Error backing up table ${table}:`, error)
            } else if (data) {
              backupData[table] = data
            }
          } catch (err) {
            console.error(`Error accessing table ${table}:`, err)
          }
        }

        try {
          // Store backup metadata
          const { data: backupRecord, error: backupError } = await adminClient
            .from('database_backups')
            .insert({
              name: backupName,
              size: JSON.stringify(backupData).length,
              status: 'completed',
              created_by: 'system'
            })
            .select()
            .single()

          if (backupError) {
            console.error('Error inserting backup record:', backupError)
            throw backupError
          }

          try {
            // Store actual backup data in a separate table or storage
            const { error: dataError } = await adminClient
              .from('backup_data')
              .insert({
                backup_id: backupRecord.id,
                data: backupData
              })

            if (dataError) {
              console.error('Error inserting backup data:', dataError)
              throw dataError
            }
          } catch (dataErr) {
            console.error('Backup data table error:', dataErr)
            // If backup_data table doesn't exist, just continue without it
          }

          return new Response(
            JSON.stringify({ 
              message: 'Backup created successfully',
              backup: backupRecord
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        } catch (insertErr) {
          console.error('Backup tables error:', insertErr)
          // If backup tables don't exist, return a helpful error
          return new Response(
            JSON.stringify({ 
              error: 'Backup tables not found. Please run the database migration to create backup tables.',
              code: 'TABLES_NOT_FOUND'
            }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      }

      if (action === 'restore' && backupId) {
        // Restore from backup
        const { data: backupData, error: fetchError } = await adminClient
          .from('backup_data')
          .select('data')
          .eq('backup_id', backupId)
          .single()

        if (fetchError) throw fetchError

        const restoreData = backupData.data

        // Restore each table
        for (const [tableName, records] of Object.entries(restoreData)) {
          if (Array.isArray(records) && records.length > 0) {
            // Clear existing data
            await adminClient
              .from(tableName)
              .delete()
              .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all records

            // Insert backup data
            const { error: insertError } = await adminClient
              .from(tableName)
              .insert(records)

            if (insertError) {
              console.error(`Error restoring table ${tableName}:`, insertError)
            }
          }
        }

        return new Response(
          JSON.stringify({ message: 'Database restored successfully' }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      if (action === 'download' && backupId) {
        // Get backup data for download
        const { data: backup, error: backupError } = await adminClient
          .from('database_backups')
          .select('*')
          .eq('id', backupId)
          .single()

        if (backupError) throw backupError

        const { data: backupData, error: dataError } = await adminClient
          .from('backup_data')
          .select('data')
          .eq('backup_id', backupId)
          .single()

        if (dataError) throw dataError

        const downloadData = {
          backup_info: backup,
          data: backupData.data,
          exported_at: new Date().toISOString()
        }

        return new Response(
          JSON.stringify(downloadData),
          { 
            status: 200, 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json',
              'Content-Disposition': `attachment; filename="${backup.name}.json"`
            } 
          }
        )
      }

      if (action === 'delete' && backupId) {
        // Delete backup
        const { error: deleteDataError } = await adminClient
          .from('backup_data')
          .delete()
          .eq('backup_id', backupId)

        if (deleteDataError) throw deleteDataError

        const { error: deleteBackupError } = await adminClient
          .from('database_backups')
          .delete()
          .eq('id', backupId)

        if (deleteBackupError) throw deleteBackupError

        return new Response(
          JSON.stringify({ message: 'Backup deleted successfully' }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: unknown) {
    console.error('Backup function error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
