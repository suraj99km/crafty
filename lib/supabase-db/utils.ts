import supabase from '@/lib/supabase-db/supabaseClient';
import { ProductData, Artist } from '@/Types';

// export const fetchProductsWithArtists = async (): Promise<ProductData[] | null> => {
//   const { data: products, error } = await supabase
//     .from('Products')
//     .select('id, title, description, price, image_url, category, artist_id')
//     .order('sales_count', { ascending: false });

//   if (error) {
//     console.error('Error fetching products:', error);
//     return null;
//   }

//   // Collect all unique artist_id values
//   const artistIds = [...new Set(products!.map((product) => product.artist_id))];

//   // Fetch all artists at once
//   const { data: artists, error: artistError } = await supabase
//     .from('Artists')
//     .select('id, name')
//     .in('id', artistIds);

//   if (artistError) {
//     console.error('Error fetching artists:', artistError);
//     return null;
//   }

//   // Create a map of artist_id to artist name
//   const artistMap = artists.reduce((acc: { [key: number]: string }, artist) => {
//     acc[artist.id] = artist.name || 'Unknown Artist';
//     return acc;
//   }, {});

//   // Map the artist names to the products
//   const productsWithArtistName = products!.map((product) => ({
//     ...product,
//     artist_name: artistMap[product.artist_id] || 'Unknown Artist', // Default value
//   }));

//   // Return the transformed products with artist names
//   return productsWithArtistName;
// };

// export const fetchPopularArtists = async () => {
//   const { data: artists, error } = await supabase
//     .from('Artists')
//     .select('id, name, profile_picture, tagline, bio, Products(sales_count)'); // Fetch artists with their products' sales count

//   if (error) {
//     console.error('Error fetching artists:', error);
//     return null; // Return null if there's an error
//   }

//   // Sum sales count for each artist
//   const artistsWithSalesCount = artists?.map(artist => {
//     // Calculate the total sales for the artist
//     const totalSales = artist.Products?.reduce((sum, product) => sum + (product.sales_count || 0), 0) || 0;
    
//     return {
//       ...artist, // Spread existing artist data
//       totalSales, // Add total sales
//     };
//   });

//   // Sort artists by total sales in descending order
//   const sortedArtists = artistsWithSalesCount?.sort((a, b) => b.totalSales - a.totalSales);

//   return sortedArtists; // Return sorted artists
// };


// export const fetchLatestProductsWithCategories = async (sortBy: string = "sales_count") => {
//   let sortColumn = "sales_count"; // Default: Popularity

//   if (sortBy === "recentlyAdded") sortColumn = "created_at";
//   else if (sortBy === "recentlyModified") sortColumn = "updated_at";

//   // Fetch products sorted by selected column
//   const { data: products, error } = await supabase
//     .from("Products")
//     .select("id, title, description, price, image_url, category, artist_id, updated_at, created_at")
//     .order(sortColumn, { ascending: false });

//   if (error) {
//     console.error("Error fetching products:", error);
//     return null;
//   }

//   // Fetch all artist names in one batch
//   const artistIds = [...new Set(products.map((product) => product.artist_id))];
//   const { data: artists, error: artistError } = await supabase
//     .from("Artists")
//     .select("id, name")
//     .in("id", artistIds);

//   if (artistError) {
//     console.error("Error fetching artists:", artistError);
//     return null;
//   }

//   // Create a mapping of artist IDs to names
//   const artistMap = artists.reduce((acc: { [key: number]: string }, artist) => {
//     acc[artist.id] = artist.name || "Unknown Artist";
//     return acc;
//   }, {});

//   // Map artist names to the products
//   const productsWithArtistName = products.map((product) => ({
//     ...product,
//     artist_name: artistMap[product.artist_id] || "Unknown Artist", // Default value
//   }));

//   // Fetch categories & remove duplicates manually
//   const categories = [...new Set(productsWithArtistName.map((p) => p.category))];

//   return { products: productsWithArtistName, categories };
// };



// // Fetch artist details by ID
// export const fetchArtistDetails = async (id: string): Promise<Artist | null> => {
//   const { data: artist, error } = await supabase
//     .from('Artists')
//     .select('*')
//     .eq('id', id)
//     .single();

//   if (error) {
//     console.error('Error fetching artist details:', error);
//     return null;
//   }

//   return artist;
// };

// // Fetch related products by artist_id
// export const fetchRelatedProducts = async (artistId: string): Promise<ProductData[] | null> => {
//   const { data: products, error } = await supabase
//     .from('Products')
//     .select('id, title, price, image_url')
//     .eq('artist_id', artistId);

//   if (error) {
//     console.error('Error fetching related products:', error);
//     return null;
//   }

//   return products;
// };

export const fetchProductDetails = async (id: string) => {
  const { data, error } = await supabase
    .from('Products') // Make sure this matches the actual case-sensitive table name
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching product details:', error.message);
    return null;
  }

  return data;
};

export const getArtistId = async (): Promise<string | null> => {
  try {
    // Fetch authenticated user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user?.email) return null;

    // Fetch artist details based on email
    const { data: artistData, error: artistError } = await supabase
      .from("Artists")
      .select("id")
      .eq("email_address", userData.user.email)
      .single();

    if (artistError || !artistData) return null;

    return artistData.id;
  } catch (error) {
    console.error("Error fetching artist ID:", error);
    return null;
  }
};

