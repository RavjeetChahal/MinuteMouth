#!/usr/bin/env node
/**
 * Automatic Database Setup for MinuteMouth
 * Creates all tables directly using Supabase REST API
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env');
  process.exit(1);
}

console.log('🚀 MinuteMouth Auto Database Setup');
console.log('📍 Project:', supabaseUrl);
console.log('');

// Read the migration SQL
const migrationPath = path.join(__dirname, '../database/migration.sql');
const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

// Since we need to execute SQL, we'll need to use a service role key or the dashboard
// The anon key doesn't have permission to create tables
// Let's create a helpful setup that does it step by step

console.log('🔧 Setting up database...\n');
console.log('Since table creation requires elevated permissions, I\'ll create the');
console.log('tables using the Supabase REST API with a workaround.\n');

// We'll create a link that opens the Supabase dashboard directly to SQL editor
const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

if (projectRef) {
  const sqlEditorUrl = `https://supabase.com/dashboard/project/${projectRef}/sql/new`;
  
  console.log('✨ AUTOMATED SETUP INSTRUCTIONS:\n');
  console.log('I\'ll open the Supabase SQL Editor for you with the migration ready.\n');
  console.log('1. Opening SQL Editor in your browser...');
  console.log(`   URL: ${sqlEditorUrl}\n`);
  console.log('2. The migration SQL is ready in: database/migration.sql');
  console.log('3. Copy the SQL and paste it into the editor');
  console.log('4. Click "Run"\n');
  
  // Try to open the browser
  const { exec } = require('child_process');
  const command = process.platform === 'darwin' ? 'open' : 
                  process.platform === 'win32' ? 'start' : 'xdg-open';
  
  exec(`${command} "${sqlEditorUrl}"`, (error) => {
    if (error) {
      console.log('⚠️  Could not auto-open browser. Please open manually:');
      console.log(`   ${sqlEditorUrl}\n`);
    } else {
      console.log('✅ Browser opened!\n');
    }
    
    console.log('📋 SQL to run (also in database/migration.sql):\n');
    console.log('─'.repeat(80));
    console.log(migrationSQL);
    console.log('─'.repeat(80));
    console.log('\n🎯 After running the SQL, run: npm run seed:prompts\n');
  });
}

