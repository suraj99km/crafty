export interface Product {
    id: string;
    title: string;
    price: number;
    image_url: string;
    artist_name?: string;
    description?: string;
    artist_id?: string;
    quantity?: number;
    category?: string; 
  }
  

  export interface Artist {
    id: string;
    name: string;
    bio: string;
    tagline?: string;
    profile_picture: string;
    portfolio?: string;
    instagram?: string;
    other_social?: string;
}


export interface Address {
    id: number;
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  }
  