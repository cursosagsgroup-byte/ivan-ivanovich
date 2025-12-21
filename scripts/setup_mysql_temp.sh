#!/bin/bash

echo "🗄️  Setting up temporary MySQL database for migration..."

# Create database
mysql -u root -e "DROP DATABASE IF EXISTS wordpress_temp;"
mysql -u root -e "CREATE DATABASE wordpress_temp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

echo "✅ Database created: wordpress_temp"

# Import SQL dump
echo "📥 Importing WordPress dump (this may take a few minutes)..."
mysql -u root wordpress_temp < scripts/tutor_lms_export.sql

echo "✅ Import completed!"
echo ""
echo "🚀 Ready to run migration script:"
echo "   npx tsx scripts/migrate_from_wordpress.ts"
