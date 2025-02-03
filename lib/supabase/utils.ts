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


export const fetchLatestProductsWithCategories = async (sortBy: string = "sales_count") => {
  let sortColumn = "sales_count"; // Default: Popularity

  if (sortBy === "recentlyAdded") sortColumn = "created_at";
  else if (sortBy === "recentlyModified") sortColumn = "updated_at";

  // Fetch products sorted by selected column
  const { data: products, error } = await supabase
    .from("Products")
    .select("id, title, description, price, image_url, category, artist_id, updated_at, created_at")
    .order(sortColumn, { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    return null;
  }

  // Fetch all artist names in one batch
  const artistIds = [...new Set(products.map((product) => product.artist_id))];
  const { data: artists, error: artistError } = await supabase
    .from("Artists")
    .select("id, name")
    .in("id", artistIds);

  if (artistError) {
    console.error("Error fetching artists:", artistError);
    return null;
  }

  // Create a mapping of artist IDs to names
  const artistMap = artists.reduce((acc: { [key: number]: string }, artist) => {
    acc[artist.id] = artist.name || "Unknown Artist";
    return acc;
  }, {});

  // Map artist names to the products
  const productsWithArtistName = products.map((product) => ({
    ...product,
    artist_name: artistMap[product.artist_id] || "Unknown Artist", // Default value
  }));

  // Fetch categories & remove duplicates manually
  const categories = [...new Set(productsWithArtistName.map((p) => p.category))];

  return { products: productsWithArtistName, categories };
};

