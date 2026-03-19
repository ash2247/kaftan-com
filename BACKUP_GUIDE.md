# Database Backup Guide for Kaftan-Com

## Quick Backup Options

### Option 1: Automated PowerShell Script (Recommended)
```powershell
.\backup_database.ps1
```

### Option 2: Manual Supabase Dashboard Export
1. Go to https://supabase.com/dashboard
2. Select your project: nhwoqzokmujucwxbdtjk
3. Go to Settings → Database → Backups
4. Create a new backup

### Option 3: Manual SQL Export
```sql
-- Run in Supabase SQL Editor
-- Export all data
COPY products TO 'products_backup.csv' WITH CSV HEADER;
COPY collections TO 'collections_backup.csv' WITH CSV HEADER;
COPY orders TO 'orders_backup.csv' WITH CSV HEADER;
COPY order_items TO 'order_items_backup.csv' WITH CSV HEADER;
COPY wishlist TO 'wishlist_backup.csv' WITH CSV HEADER;
COPY cart TO 'cart_backup.csv' WITH CSV HEADER;
```

## What's Included in Full Backup

### Database Schema
- All table structures
- Indexes and constraints
- Row Level Security policies
- Triggers and functions

### Database Data
- Products (63 Paradise collection products)
- Collections
- Orders and order items
- Customer data (wishlist, cart)
- Categories
- Newsletter subscribers

### Storage Files
- Product images (JPG files for Paradise collection)
- Collection banner images
- Any uploaded media

### Configuration
- Environment variables (.env)
- Package configuration
- Supabase configuration

## Backup Files Created

1. **database_backup_2025-03-19.sql** - Complete schema definition
2. **data_export_script_2025-03-19.sql** - Data export queries
3. **backup_database.ps1** - Automated PowerShell backup script
4. **backup_database.sh** - Bash script (for Linux/Mac)

## Restore Process

### Quick Restore
```powershell
# Extract backup
tar -xzf kaftan_com_backup_*.tar.gz
cd kaftan_com_backup_*
./restore.ps1
```

### Manual Restore Steps
1. Create new Supabase project
2. Run schema SQL file
3. Import data using CSV files or SQL dump
4. Recreate storage buckets
5. Upload product images
6. Update environment variables
7. Test all functionality

## Security Notes

- Store backup files securely
- Backup contains sensitive customer data
- Update environment variables for new projects
- Test restore in development first

## Verification Checklist

After restore, verify:
- [ ] All Paradise collection products visible
- [ ] Product images loading correctly
- [ ] Collections properly configured
- [ ] Orders data intact
- [ ] Website functionality working
- [ ] No broken links or missing images

## Automated Backup Schedule

For production, consider:
- Daily automated backups
- Weekly full exports
- Monthly offsite storage
- Retention policy (keep last 30 days)

## Contact Information

For backup issues:
- Supabase Support: https://supabase.com/support
- Project ID: nhwoqzokmujucwxbdtjk
- Database: PostgreSQL (Supabase)
