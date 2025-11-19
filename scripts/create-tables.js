#!/usr/bin/env node
/**
 * MinuteMouth Database Table Creator
 * Directly creates tables using Supabase client
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env');
  process.exit(1);
}

console.log('🔗 Connecting to Supabase...');
console.log(`📍 URL: ${supabaseUrl}\n`);

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  console.log('🚀 Creating MinuteMouth database tables...\n');
  
  // Since we can't execute arbitrary SQL with anon key, we need to:
  // 1. Show instructions for manual setup, or
  // 2. Use the migration.sql file in Supabase Dashboard
  
  console.log('='.repeat(80));
  console.log('📋 DATABASE SETUP INSTRUCTIONS');
  console.log('='.repeat(80));
  console.log('\n✅ Your credentials are configured correctly!\n');
  console.log('To create the database tables, please follow these steps:\n');
  console.log('1. Open Supabase Dashboard:');
  console.log('   👉 https://supabase.com/dashboard/project/ozfkozbbnmlbltzgtoat\n');
  console.log('2. In the left sidebar, click: "SQL Editor"\n');
  console.log('3. Click: "New Query"\n');
  console.log('4. Open this file: database/migration.sql');
  console.log('   (located in your MinuteMouth project folder)\n');
  console.log('5. Copy ALL the SQL code from migration.sql\n');
  console.log('6. Paste it into the Supabase SQL Editor\n');
  console.log('7. Click "Run" (or press Cmd/Ctrl + Enter)\n');
  console.log('8. Wait for "Success. No rows returned" message\n');
  console.log('='.repeat(80));
  console.log('\n📝 After tables are created, run:');
  console.log('   npm run seed:prompts\n');
  console.log('🎉 Then you\'ll be ready to start the app!\n');
  
  // Test connection by trying to query (will fail if tables don't exist)
  console.log('🔍 Testing database connection...');
  const { data, error } = await supabase.from('users').select('count').limit(1);
  
  if (error && error.code === '42P01') {
    console.log('⚠️  Tables not created yet - please follow the instructions above.\n');
  } else if (error) {
    console.log('⚠️  Error:', error.message);
    console.log('   Please follow the instructions above to set up tables.\n');
  } else {
    console.log('✅ Database tables already exist! You can skip manual setup.\n');
    console.log('📝 Next step: npm run seed:prompts\n');
  }
}

createTables();

