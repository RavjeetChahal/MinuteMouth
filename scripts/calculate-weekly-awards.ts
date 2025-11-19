#!/usr/bin/env ts-node
/**
 * Weekly Awards Calculator Script
 * 
 * This script calculates weekly awards for MinuteMouth users.
 * Run this script every Sunday at 11:59 PM via cron or as a Supabase Edge Function.
 * 
 * Usage:
 *   npm run awards:calculate
 *   
 * Or with ts-node:
 *   ts-node scripts/calculate-weekly-awards.ts
 */

import { calculateWeeklyAwards } from '../lib/awards';

async function main() {
  console.log('🏆 Starting weekly awards calculation...');
  console.log(`📅 Date: ${new Date().toISOString()}`);
  
  try {
    await calculateWeeklyAwards();
    console.log('✅ Weekly awards calculated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error calculating weekly awards:', error);
    process.exit(1);
  }
}

main();

