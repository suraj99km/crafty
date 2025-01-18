import supabase from '@/db/supabaseClient';

export const fetchProductsWithArtists = async () => {
  try {
    const { data, error } = await supabase
      .from('Products')
      .select(`
        id,
        title,
        price,
        image_url,
        Artists (
          name
        )
      `); // Query to join Products with Artists table

    if (error) {
      console.error('Error fetching products with artists:', error);
      return null;
    }

    console.log('Products with Artists fetched:', data);
    return data; // Returning the combined data
  } catch (err) {
    console.error('Unexpected error fetching products with artists:', err);
    return null;
  }
};

export const fetchPopularArtists = async () => {
    const { data, error } = await supabase
      .from('Artists')
      .select('id, name, profile_picture, bio') // Adjust columns based on your Artists table
      ; // You can modify the limit if you want to fetch more artists
  
    if (error) {
      console.error('Error fetching artists:', error);
      throw error;
    }
  
    return data;
  };
