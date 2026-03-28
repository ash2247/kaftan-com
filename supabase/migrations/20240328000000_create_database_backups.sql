-- Create database_backups table
CREATE TABLE IF NOT EXISTS database_backups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  size INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create backup_data table
CREATE TABLE IF NOT EXISTS backup_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  backup_id UUID NOT NULL REFERENCES database_backups(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_database_backups_created_at ON database_backups(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_database_backups_created_by ON database_backups(created_by);
CREATE INDEX IF NOT EXISTS idx_backup_data_backup_id ON backup_data(backup_id);

-- Enable RLS
ALTER TABLE database_backups ENABLE ROW LEVEL SECURITY;
ALTER TABLE backup_data ENABLE ROW LEVEL SECURITY;

-- RLS policies for database_backups
CREATE POLICY "Admins can view all backups" ON database_backups
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Admins can insert backups" ON database_backups
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Admins can update backups" ON database_backups
  FOR UPDATE USING (
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Admins can delete backups" ON database_backups
  FOR DELETE USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- RLS policies for backup_data
CREATE POLICY "Admins can view all backup data" ON backup_data
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Admins can insert backup data" ON backup_data
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Admins can delete backup data" ON backup_data
  FOR DELETE USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update updated_at
CREATE TRIGGER update_database_backups_updated_at
  BEFORE UPDATE ON database_backups
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
