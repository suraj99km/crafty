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
 * Check if global sale is active
 * @returns Boolean indicating if global sale is active
 */
export const isGlobalSaleActive = async (): Promise<boolean> => {
  const isActive = await getGlobalConfig<boolean>('global_sale_active', false);
  
  // If there are dates set, check if current date is within range
  const startDate = await getGlobalConfig<string | null>('global_sale_start_date', null);
  const endDate = await getGlobalConfig<string | null>('global_sale_end_date', null);
  
  if (isActive && startDate && endDate) {
    const now = getCurrentISTDate();
    const start = convertToIST(startDate);
    const end = convertToIST(endDate);
    
    return now >= start && now <= end;
  }
  
  return isActive;
};

/**
 * Get global sale information
 * @returns Object containing sale information
 */
export const getGlobalSaleInfo = async () => {
  const isActive = await isGlobalSaleActive();
  
  if (!isActive) {
    return {
      isActive: false,
      discountPercentage: 0,
      startDate: null,
      endDate: null
    };
  }
  
  const discountPercentage = await getGlobalConfig<number>('global_sale_discount_percentage', 0);
  const startDate = await getGlobalConfig<string | null>('global_sale_start_date', null);
  const endDate = await getGlobalConfig<string | null>('global_sale_end_date', null);
  
  return {
    isActive,
    discountPercentage,
    startDate: startDate ? convertToIST(startDate) : null,
    endDate: endDate ? convertToIST(endDate) : null
  };
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