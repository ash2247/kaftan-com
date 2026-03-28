-- Create backup tables without RLS for service role access

-- Drop existing tables if they exist
DROP TABLE IF EXISTS backup_data CASCADE;
DROP TABLE IF EXISTS database_backups CASCADE;

-- Create database_backups table
CREATE TABLE database_backups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  size INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create backup_data table
CREATE TABLE backup_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  backup_id UUID NOT NULL REFERENCES database_backups(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_database_backups_created_at ON database_backups(created_at DESC);
CREATE INDEX idx_backup_data_backup_id ON backup_data(backup_id);

-- Create trigger to update updated_at
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
