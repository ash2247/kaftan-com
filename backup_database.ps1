# ========================================
# Kaftan-Com Full Database Backup Script (PowerShell)
# Created: 2025-03-19
# Usage: .\backup_database.ps1
# ========================================

param(
    [string]$BackupDir = ".\database_backups",
    [string]$ProjectId = "nhwoqzokmujucwxbdtjk"
)

# Error handling
$ErrorActionPreference = "Stop"

# Colors for output
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Log-Info {
    param([string]$Message)
    Write-ColorOutput "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $Message" "Cyan"
}

function Log-Success {
    param([string]$Message)
    Write-ColorOutput "[SUCCESS] $Message" "Green"
}

function Log-Warning {
    param([string]$Message)
    Write-ColorOutput "[WARNING] $Message" "Yellow"
}

function Log-Error {
    param([string]$Message)
    Write-ColorOutput "[ERROR] $Message" "Red"
}

try {
    # Configuration
    $Date = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
    $BackupName = "kaftan_com_backup_$Date"
    $ProjectDir = Join-Path $BackupDir $BackupName

    Log-Info "Starting database backup process..."

    # Create backup directory
    Log-Info "Creating backup directory..."
    New-Item -ItemType Directory -Force -Path $BackupDir | Out-Null
    New-Item -ItemType Directory -Force -Path $ProjectDir | Out-Null

    # Check if Supabase CLI is installed
    try {
        $null = Get-Command supabase -ErrorAction Stop
    }
    catch {
        Log-Warning "Supabase CLI not found. Please install it first:"
        Log-Warning "npm install -g supabase"
        throw "Supabase CLI required"
    }

    # 1. Backup Database Schema
    Log-Info "Backing up database schema..."
    $SchemaFile = Join-Path $ProjectDir "schema_$Date.sql"
    supabase db dump --data-only=false --schema=public | Out-File -FilePath $SchemaFile -Encoding UTF8

    # 2. Backup All Data
    Log-Info "Backing up all database data..."
    $DataFile = Join-Path $ProjectDir "data_$Date.sql"
    supabase db dump --data-only --schema=public | Out-File -FilePath $DataFile -Encoding UTF8

    # 3. Create CSV export queries
    Log-Info "Creating CSV export scripts..."
    
    $ProductsQuery = @"
COPY (
    SELECT 
        id::text,
        name,
        description,
        price,
        original_price,
        in_stock,
        category,
        COALESCE(colors, '{}')::text,
        COALESCE(sizes, '{}')::text,
        COALESCE(images, '{}')::text,
        created_at,
        updated_at
    FROM products
    ORDER BY created_at DESC
) TO '$ProjectDir\products.csv' WITH CSV HEADER;
"@

    $CollectionsQuery = @"
COPY (
    SELECT 
        id::text,
        name,
        description,
        slug,
        image_url,
        is_active,
        sort_order,
        created_at,
        updated_at
    FROM collections
    ORDER BY sort_order, name
) TO '$ProjectDir\collections.csv' WITH CSV HEADER;
"@

    $OrdersQuery = @"
COPY (
    SELECT 
        id::text,
        customer_name,
        customer_email,
        customer_phone,
        shipping_address::text,
        billing_address::text,
        total_amount,
        status,
        payment_status,
        payment_method,
        notes,
        created_at,
        updated_at
    FROM orders
    ORDER BY created_at DESC
) TO '$ProjectDir\orders.csv' WITH CSV HEADER;
"@

    # Execute CSV exports
    Log-Info "Exporting products data..."
    supabase db shell --command $ProductsQuery

    Log-Info "Exporting collections data..."
    supabase db shell --command $CollectionsQuery

    Log-Info "Exporting orders data..."
    supabase db shell --command $OrdersQuery

    # 4. Backup Storage Files
    Log-Info "Backing up storage files..."
    $StorageDir = Join-Path $ProjectDir "storage"
    New-Item -ItemType Directory -Force -Path $StorageDir | Out-Null
    New-Item -ItemType Directory -Force -Path (Join-Path $StorageDir "products") | Out-Null
    New-Item -ItemType Directory -Force -Path (Join-Path $StorageDir "collections") | Out-Null

    try {
        Log-Info "Downloading product images..."
        supabase storage download --bucket products --path "$StorageDir\products\"
    }
    catch {
        Log-Warning "Could not download products bucket"
    }

    try {
        Log-Info "Downloading collection images..."
        supabase storage download --bucket collections --path "$StorageDir\collections\"
    }
    catch {
        Log-Warning "Could not download collections bucket"
    }

    # 5. Backup Configuration Files
    Log-Info "Backing up configuration files..."
    
    if (Test-Path ".env") {
        Copy-Item ".env" (Join-Path $ProjectDir ".env.backup")
    } else {
        Log-Warning ".env file not found"
    }

    Copy-Item "package.json" (Join-Path $ProjectDir "package.json.backup")

    if (Test-Path "supabase\config.toml") {
        Copy-Item "supabase\config.toml" (Join-Path $ProjectDir "supabase_config.backup")
    } else {
        Log-Warning "supabase config file not found"
    }

    # 6. Create Restore Script
    Log-Info "Creating restore script..."
    $RestoreScript = @"
# Kaftan-Com Database Restore Script (PowerShell)
# Usage: .\restore.ps1

param(
    [string]`$BackupDir = `$PSScriptRoot
)

`$ErrorActionPreference = "Stop"

Write-Host "Starting database restore..." -ForegroundColor Green

# Restore schema
Write-Host "Restoring database schema..." -ForegroundColor Cyan
supabase db reset
supabase db push "`$BackupDir\schema_*.sql"

# Restore data
Write-Host "Restoring data..." -ForegroundColor Cyan
supabase db shell --file "`$BackupDir\data_*.sql"

# Restore CSV data
Write-Host "Restoring CSV data..." -ForegroundColor Cyan

if (Test-Path "`$BackupDir\products.csv") {
    Write-Host "Restoring products..." -ForegroundColor Yellow
    supabase db shell --command "COPY products FROM '`$BackupDir\products.csv' WITH CSV HEADER;"
}

if (Test-Path "`$BackupDir\collections.csv") {
    Write-Host "Restoring collections..." -ForegroundColor Yellow
    supabase db shell --command "COPY collections FROM '`$BackupDir\collections.csv' WITH CSV HEADER;"
}

# Restore storage
Write-Host "Restoring storage files..." -ForegroundColor Cyan

if (Test-Path "`$BackupDir\storage\products") {
    supabase storage upload --bucket products --recursive "`$BackupDir\storage\products\*"
}

if (Test-Path "`$BackupDir\storage\collections") {
    supabase storage upload --bucket collections --recursive "`$BackupDir\storage\collections\*"
}

Write-Host "Restore completed successfully!" -ForegroundColor Green
"@

    $RestoreScript | Out-File -FilePath (Join-Path $ProjectDir "restore.ps1") -Encoding UTF8

    # 7. Create Backup Summary
    Log-Info "Creating backup summary..."
    $ReadmeContent = @"
# Kaftan-Com Database Backup

**Backup Date:** $(Get-Date)
**Project ID:** $ProjectId

## Files Included:

### Database Files:
- `schema_$Date.sql` - Complete database schema
- `data_$Date.sql` - All database data
- `products.csv` - Products table data
- `collections.csv` - Collections table data
- `orders.csv` - Orders table data

### Storage Files:
- `storage/products/` - Product images
- `storage/collections/` - Collection banner images

### Configuration:
- `.env.backup` - Environment variables
- `package.json.backup` - Package configuration
- `supabase_config.backup` - Supabase configuration

### Scripts:
- `restore.ps1` - Automated restore script (PowerShell)

## Restore Instructions:

### Quick Restore (PowerShell):
```powershell
cd $BackupName
.\restore.ps1
```

### Manual Restore:
```powershell
# Create new Supabase project
# Update .env with new project details
# Restore schema: supabase db push schema_*.sql
# Restore data: supabase db shell < data_*.sql
# Upload storage files via dashboard or CLI
```

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

**Backup Location:** $ProjectDir
**Generated:** $(Get-Date)
"@

    $ReadmeContent | Out-File -FilePath (Join-Path $ProjectDir "README.md") -Encoding UTF8

    # 8. Compress Backup
    Log-Info "Compressing backup..."
    $ZipFile = Join-Path $BackupDir "$BackupName.zip"
    Compress-Archive -Path $ProjectDir -DestinationPath $ZipFile -Force

    # 9. Cleanup
    Log-Info "Cleaning up temporary files..."
    Remove-Item -Recurse -Force $ProjectDir

    # 10. Generate Backup Report
    $BackupSize = [math]::Round((Get-Item $ZipFile).Length / 1MB, 2)
    
    Log-Success "Backup completed successfully!"
    Log-Success "Backup file: $ZipFile"
    Log-Success "Backup size: $BackupSize MB"
    Log-Success "Files included: Schema, Data, Storage, Configuration"

    # Display backup summary
    Write-Host ""
    Write-Host "=== BACKUP SUMMARY ===" -ForegroundColor Magenta
    Write-Host "Date: $(Get-Date)" -ForegroundColor White
    Write-Host "File: $ZipFile" -ForegroundColor White
    Write-Host "Size: $BackupSize MB" -ForegroundColor White
    Write-Host "Project: $ProjectId" -ForegroundColor White
    Write-Host "========================" -ForegroundColor Magenta

    Write-Host ""
    Write-Host "To restore:" -ForegroundColor Yellow
    Write-Host "1. Extract the zip file" -ForegroundColor White
    Write-Host "2. Navigate to the extracted folder" -ForegroundColor White
    Write-Host "3. Run: .\restore.ps1" -ForegroundColor White

}
catch {
    Log-Error "Backup failed: $($_.Exception.Message)"
    exit 1
}
