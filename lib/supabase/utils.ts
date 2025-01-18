import supabase from '@/db/supabaseClient';

// Fetch products with associated artists
export const fetchProductsWithArtists = async () => {
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
    `); // Fetch products with artist names

  if (error) {
    console.error('Error fetching products with artists:', error);
    return null;
  }

  return data; // Return the fetched data
};

// Fetch popular artists
export const fetchPopularArtists = async () => {
  const { data, error } = await supabase
    .from('Artists')
    .select('id, name, profile_picture, bio'); // Fetch popular artists' details

  if (error) {
    console.error('Error fetching artists:', error);
    throw error;
  }

  return data; // Return the fetched data
};
