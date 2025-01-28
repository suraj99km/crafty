import supabase from '@/db/supabaseClient';
import { Product, Artist } from '@/Types';

export const fetchProductsWithArtists = async (): Promise<Product[] | null> => {
  const { data: products, error } = await supabase
    .from('Products')
    .select('id, title, description, price, image_url, category, artist_id')
    .order('sales_count', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return null;
  }

  // Temporarily add 'artist_name' to each product
  const productsWithArtistName = products!.map((product) => ({
    ...product,
    artist_name: 'Unknown Artist', // Default value
  }));

  // Fetch artist name for each product and update it
  for (const product of productsWithArtistName) {
    const { data: artist, error: artistError } = await supabase
      .from('Artists')
      .select('name')
      .eq('id', product.artist_id)
      .single();

    if (artistError) {
      console.error('Error fetching artist:', artistError);
      product['artist_name'] = 'Unknown Artist';
    } else {
      product['artist_name'] = artist?.name || 'Unknown Artist';
    }
  }

  // Cast the result to Product[] (since we're sure it's correctly transformed)
  return productsWithArtistName as Product[];
};



export const fetchPopularArtists = async () => {
  const { data: artists, error } = await supabase
    .from('Artists')
    .select('id, name, profile_picture, bio, Products(sales_count)'); // Fetch artists with their products' sales count

  if (error) {
    console.error('Error fetching artists:', error);
    return null; // Return null if there's an error
  }

  // Sum sales count for each artist
  const artistsWithSalesCount = artists?.map(artist => {
    // Calculate the total sales for the artist
    const totalSales = artist.Products?.reduce((sum, product) => sum + (product.sales_count || 0), 0) || 0;
    
    return {
      ...artist, // Spread existing artist data
      totalSales, // Add total sales
    };
  });

  // Sort artists by total sales in descending order
  const sortedArtists = artistsWithSalesCount?.sort((a, b) => b.totalSales - a.totalSales);

  return sortedArtists; // Return sorted artists
};

export const fetchLatestProductsWithCategories = async () => {
  const { data: products, error } = await supabase
    .from('Products')
    .select('id, title, description, price, image_url, category, artist_id, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return { products: [], categories: [] };
  }

  // Extract unique categories
  const categories = [...new Set(products.map((product) => product.category))];

  // Fetch artist names
  const productsWithArtists = await Promise.all(
    products.map(async (product) => {
      const { data: artist, error: artistError } = await supabase
        .from('Artists')
        .select('name')
        .eq('id', product.artist_id)
        .single();

      return {
        ...product,
        artist_name: artist?.name || 'Unknown Artist',
      };
    })
  );

  return { products: productsWithArtists, categories };
};
