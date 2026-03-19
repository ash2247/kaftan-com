#!/bin/bash

# ========================================
# Kaftan-Com Full Database Backup Script
# Created: 2025-03-19
# Usage: ./backup_database.sh
# ========================================

set -e  # Exit on any error

# Configuration
BACKUP_DIR="./database_backups"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_NAME="kaftan_com_backup_$DATE"
PROJECT_DIR="./$BACKUP_NAME"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Create backup directory
log "Creating backup directory..."
mkdir -p "$BACKUP_DIR"
mkdir -p "$PROJECT_DIR"

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    warning "Supabase CLI not found. Installing..."
    npm install -g supabase
fi

# 1. Backup Database Schema
log "Backing up database schema..."
supabase db dump --data-only=false --schema=public > "$PROJECT_DIR/schema_$DATE.sql"

# 2. Backup All Data
log "Backing up all database data..."
supabase db dump --data-only --schema=public > "$PROJECT_DIR/data_$DATE.sql"

# 3. Backup Specific Tables as CSV
log "Exporting tables as CSV..."

# Products
log "Exporting products..."
supabase db shell --command "COPY (SELECT id::text, name, description, price, original_price, in_stock, category, COALESCE(colors, '{}')::text, COALESCE(sizes, '{}')::text, COALESCE(images, '{}')::text, created_at, updated_at FROM products ORDER BY created_at DESC) TO '$PROJECT_DIR/products.csv' WITH CSV HEADER;"

# Collections
log "Exporting collections..."
supabase db shell --command "COPY (SELECT id::text, name, description, slug, image_url, is_active, sort_order, created_at, updated_at FROM collections ORDER BY sort_order, name) TO '$PROJECT_DIR/collections.csv' WITH CSV HEADER;"

# Orders
log "Exporting orders..."
supabase db shell --command "COPY (SELECT id::text, customer_name, customer_email, customer_phone, shipping_address::text, billing_address::text, total_amount, status, payment_status, payment_method, notes, created_at, updated_at FROM orders ORDER BY created_at DESC) TO '$PROJECT_DIR/orders.csv' WITH CSV HEADER;"

# Order Items
log "Exporting order items..."
supabase db shell --command "COPY (SELECT id::text, order_id::text, product_id::text, product_name, quantity, unit_price, total_price, size, color, created_at FROM order_items ORDER BY order_id, created_at) TO '$PROJECT_DIR/order_items.csv' WITH CSV HEADER;"

# 4. Backup Storage Files
log "Backing up storage files..."
mkdir -p "$PROJECT_DIR/storage"

# Download product images
log "Downloading product images..."
supabase storage download --bucket products --path "$PROJECT_DIR/storage/products/" 2>/dev/null || warning "Could not download products bucket"

# Download collection images
log "Downloading collection images..."
supabase storage download --bucket collections --path "$PROJECT_DIR/storage/collections/" 2>/dev/null || warning "Could not download collections bucket"

# 5. Backup Configuration Files
log "Backing up configuration files..."
cp .env "$PROJECT_DIR/.env.backup" 2>/dev/null || warning "Could not copy .env file"
cp package.json "$PROJECT_DIR/package.json.backup"
cp supabase/config.toml "$PROJECT_DIR/supabase_config.backup" 2>/dev/null || warning "Could not copy supabase config"

# 6. Create Restore Script
log "Creating restore script..."
cat > "$PROJECT_DIR/restore.sh" << 'EOF'
#!/bin/bash

# Kaftan-Com Database Restore Script
# Usage: ./restore.sh

set -e

RESTORE_DIR=$(dirname "$0")
DATE=$(date +%Y-%m-%d_%H-%M-%S)

echo "Starting database restore..."

# Restore schema
echo "Restoring database schema..."
supabase db reset
supabase db push "$RESTORE_DIR/schema_*.sql"

# Restore data
echo "Restoring data..."
supabase db shell --file "$RESTORE_DIR/data_*.sql"

# Restore CSV data (alternative method)
echo "Restoring CSV data..."
if [ -f "$RESTORE_DIR/products.csv" ]; then
    echo "Restoring products..."
    supabase db shell --command "COPY products FROM '$RESTORE_DIR/products.csv' WITH CSV HEADER;"
fi

if [ -f "$RESTORE_DIR/collections.csv" ]; then
    echo "Restoring collections..."
    supabase db shell --command "COPY collections FROM '$RESTORE_DIR/collections.csv' WITH CSV HEADER;"
fi

# Restore storage
echo "Restoring storage files..."
if [ -d "$RESTORE_DIR/storage/products" ]; then
    supabase storage upload --bucket products --recursive "$RESTORE_DIR/storage/products/*"
fi

if [ -d "$RESTORE_DIR/storage/collections" ]; then
    supabase storage upload --bucket collections --recursive "$RESTORE_DIR/storage/collections/*"
fi

echo "Restore completed successfully!"
EOF

chmod +x "$PROJECT_DIR/restore.sh"

# 7. Create Backup Summary
log "Creating backup summary..."
cat > "$PROJECT_DIR/README.md" << EOF
# Kaftan-Com Database Backup

**Backup Date:** $(date)
**Project ID:** nhwoqzokmujucwxbdtjk

## Files Included:

### Database Files:
- \`schema_$DATE.sql\` - Complete database schema
- \`data_$DATE.sql\` - All database data
- \`products.csv\` - Products table data
- \`collections.csv\` - Collections table data
- \`orders.csv\` - Orders table data
- \`order_items.csv\` - Order items table data

### Storage Files:
- \`storage/products/\` - Product images
- \`storage/collections/\` - Collection banner images

### Configuration:
- \`.env.backup\` - Environment variables
- \`package.json.backup\` - Package configuration
- \`supabase_config.backup\` - Supabase configuration

### Scripts:
- \`restore.sh\` - Automated restore script

## Restore Instructions:

1. **Quick Restore:**
   \`\`\`bash
   cd $BACKUP_NAME
   ./restore.sh
   \`\`\`

2. **Manual Restore:**
   \`\`\`bash
   # Create new Supabase project
   # Update .env with new project details
   # Restore schema: supabase db push schema_*.sql
   # Restore data: supabase db shell < data_*.sql
   # Upload storage files via dashboard or CLI
   \`\`\`

## Important Notes:

- Keep this backup secure as it contains sensitive data
- Test restore in a development environment first
- Update environment variables when restoring to a new project
- Storage buckets need to be recreated before uploading files

## Verification:

After restore, verify:
1. All products are visible
2. Collections are properly configured
3. Orders data is intact
4. Images are loading correctly
5. All functionality works as expected

---

**Backup Size:** $(du -sh "$PROJECT_DIR" | cut -f1)
**Total Files:** $(find "$PROJECT_DIR" -type f | wc -l)
EOF

# 8. Compress Backup
log "Compressing backup..."
cd "$BACKUP_DIR"
tar -czf "$BACKUP_NAME.tar.gz" "$BACKUP_NAME"

# 9. Cleanup
log "Cleaning up temporary files..."
rm -rf "$PROJECT_DIR"

# 10. Generate Backup Report
BACKUP_SIZE=$(du -sh "$BACKUP_NAME.tar.gz" | cut -f1)
success "Backup completed successfully!"
success "Backup file: $BACKUP_DIR/$BACKUP_NAME.tar.gz"
success "Backup size: $BACKUP_SIZE"
success "Files included: Schema, Data, Storage, Configuration"

# Display backup summary
echo ""
echo "=== BACKUP SUMMARY ==="
echo "Date: $(date)"
echo "File: $BACKUP_DIR/$BACKUP_NAME.tar.gz"
echo "Size: $BACKUP_SIZE"
echo "Project: nhwoqzokmujucwxbdtjk"
echo "========================"

echo ""
echo "To restore, extract and run:"
echo "tar -xzf $BACKUP_NAME.tar.gz"
echo "cd $BACKUP_NAME"
echo "./restore.sh"
