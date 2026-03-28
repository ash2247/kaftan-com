## Debugging Banner Issues

### Step 1: Check if Database Table Exists

First, you need to run the SQL script in your Supabase dashboard:

1. Go to: https://supabase.com/dashboard/project/nhwoqzokmujucwxbdtjk/sql
2. Copy the entire content from `CREATE_BANNER_TABLE.sql`
3. Paste and run it in the SQL editor
4. You should see "Success" message

### Step 2: Test the Connection

After running the SQL, open your browser console and try these steps:

1. **Add a banner from admin panel**
2. **Check the console for these messages:**
   - `💾 Saving banner content for page: home`
   - `✅ Banner content created/updated successfully`
3. **Refresh the homepage and check for:**
   - `🚀 Starting to fetch home page content...`
   - `🔍 Fetching banner content for page: home`
   - `📦 Found banner data from Supabase:`

### Step 3: Common Issues

**If you see "No banner data found":**
- The SQL script wasn't run
- The save operation failed
- Check for authentication issues

**If you see Supabase errors:**
- Check RLS policies
- Verify table exists
- Check network connection

**If you see "localStorage fallback":**
- Supabase connection failed
- Table doesn't exist
- Permission issues

### Step 4: Manual Check

You can also check the data directly in Supabase:

1. Go to your Supabase dashboard
2. Click on "Table Editor" 
3. Select the "banner_content" table
4. You should see a row with page_key = "home"

### Step 5: Clear Cache

If everything looks correct but banners still don't show:

1. Clear browser cache
2. Clear localStorage: `localStorage.clear()`
3. Refresh the page

Let me know what console messages you see!
