import supabase from './supabaseClient';

/**
 * Get a configuration value from the global_config table
 * @param key The configuration key to retrieve
 * @param defaultValue Default value to return if the key is not found
 */
export const getGlobalConfig = async <T>(key: string, defaultValue: T): Promise<T> => {
  try {
    // First check if the table exists by making a minimal query
    const { error: tableCheckError } = await supabase
      .from('global_config')
      .select('key')
      .limit(1);
    
    // If table doesn't exist or there's an error accessing it, return default value
    if (tableCheckError) {
      console.log('Global config table may not exist yet:', tableCheckError.message);
      return defaultValue;
    }
    
    // If table exists, try to get the specific config
    const { data, error } = await supabase
      .from('global_config')
      .select('value')
      .eq('key', key)
      .single();
    
    if (error) {
      // If the specific key doesn't exist, just return default without error
      if (error.code === 'PGRST116') {
        console.log(`Config key "${key}" not found, using default value`);
        return defaultValue;
      }
      throw error;
    }
    
    return data?.value ?? defaultValue;
  } catch (err) {
    console.error(`Error fetching global config for key ${key}:`, err);
    return defaultValue;
  }
};

/**
 * Get current date and time in Indian Standard Time (IST)
 * @returns Date object in IST
 */
export const getCurrentISTDate = (): Date => {
  const now = new Date();
  
  // Convert to IST (UTC+5:30)
  const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
  
  return istTime;
};

/**
 * Convert a date string to IST
 * @param dateString Date string to convert
 * @returns Date object in IST
 */
export const convertToIST = (dateString: string): Date => {
  const date = new Date(dateString);
  
  // Convert to IST (UTC+5:30)
  const istTime = new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
  
  return istTime;
};

/**
 * Format a date to IST string representation
 * @param date Date to format
 * @returns Formatted date string in IST
 */
export const formatISTDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  
  return new Intl.DateTimeFormat('en-IN', options).format(date);
};

export async function getGlobalSaleInfo() {
  try {
    const { data: endDateRow } = await supabase
      .from('global_config')
      .select('value')
      .eq('key', 'global_sale_end_ist')
      .single();

    if (endDateRow) {
      return {
        isActive: true,
        endDate: new Date(endDateRow.value)
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching global sale info:', error);
    return null;
  }
}

export async function isGlobalSaleActive() {
  try {
    const saleInfo = await getGlobalSaleInfo();
    if (!saleInfo || !saleInfo.endDate) return false;
    
    return new Date() < new Date(saleInfo.endDate);
  } catch (error) {
    console.error('Error checking global sale status:', error);
    return false;
  }
}