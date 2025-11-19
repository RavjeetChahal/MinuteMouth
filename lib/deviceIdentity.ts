import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { supabase } from './supabase';
import { generateRandomAlias } from '@/constants/aliases';
import { generateUUID } from '@/utils/uuid';

const DEVICE_UUID_KEY = 'device_uuid';
const ONBOARDING_COMPLETE_KEY = 'onboarding_complete';

// Web-compatible storage
async function getStoredUUID(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return typeof window !== 'undefined' ? window.localStorage.getItem(DEVICE_UUID_KEY) : null;
  }
  return await SecureStore.getItemAsync(DEVICE_UUID_KEY);
}

async function setStoredUUID(uuid: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DEVICE_UUID_KEY, uuid);
    }
    return;
  }
  await SecureStore.setItemAsync(DEVICE_UUID_KEY, uuid);
}

export async function isOnboardingComplete(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return typeof window !== 'undefined' ? 
      window.localStorage.getItem(ONBOARDING_COMPLETE_KEY) === 'true' : false;
  }
  const result = await SecureStore.getItemAsync(ONBOARDING_COMPLETE_KEY);
  return result === 'true';
}

export async function setOnboardingComplete(): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
    }
    return;
  }
  await SecureStore.setItemAsync(ONBOARDING_COMPLETE_KEY, 'true');
}

export async function getOrCreateDeviceIdentity(): Promise<string> {
  // Check storage for existing UUID
  let uuid = await getStoredUUID();
  
  if (!uuid) {
    // Generate new UUID and store locally ONLY
    // Do NOT create in database yet - wait for onboarding
    uuid = generateUUID();
    await setStoredUUID(uuid);
    console.log('Generated new device UUID (not in database yet):', uuid);
  } else {
    // Existing user - ensure they exist in database
    const { data, error } = await supabase
      .from('users')
      .select('uuid')
      .eq('uuid', uuid)
      .maybeSingle();
    
    if (!data && !error) {
      // User doesn't exist in database, they need to complete onboarding again
      console.log('User not found in database, will redirect to onboarding:', uuid);
      // Clear onboarding flag so they go through onboarding
      await clearOnboardingComplete();
    }
  }
  
  return uuid;
}

async function clearOnboardingComplete(): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(ONBOARDING_COMPLETE_KEY);
    }
    return;
  }
  await SecureStore.deleteItemAsync(ONBOARDING_COMPLETE_KEY);
}

export async function createUserInDatabase(uuid: string, alias: string): Promise<boolean> {
  console.log('Creating user in database:', { uuid, alias });
  
  // Create user in Supabase with chosen alias
  const { data, error } = await supabase
    .from('users')
    .insert({
      uuid,
      alias,
      badges: [],
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating user:', error);
    // Retry once if failed
    await new Promise(resolve => setTimeout(resolve, 500));
    const { error: retryError } = await supabase
      .from('users')
      .insert({
        uuid,
        alias,
        badges: [],
      });
    
    if (retryError) {
      console.error('Retry failed:', retryError);
      return false;
    }
  } else {
    console.log('User created successfully:', data);
  }
  
  return true;
}

export async function getDeviceUUID(): Promise<string | null> {
  return await getStoredUUID();
}

export async function getUserAlias(): Promise<string | null> {
  const uuid = await getDeviceUUID();
  if (!uuid) return null;
  
  const { data } = await supabase
    .from('users')
    .select('alias')
    .eq('uuid', uuid)
    .single();
  
  return data?.alias || null;
}

