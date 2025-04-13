import { MouseEventHandler } from "react";

export interface CustomButtonProps {
    title: string;
    containerStyles?: string;
    handleClick?: MouseEventHandler<HTMLButtonElement>;
    btnType: "button" | "submit";
}

export interface Product {
  id: string;
  title: string;
  category?: string;
  description?: string;
  images: string[];
  demo_video?: string | null;
  dimensions?: {
      length?: number | null;
      width?: number | null;
      height?: number | null;
      weight?: number | null;
  };
  material?: string;
  prep_time?: number | null;
  artist_price?: number | null;
  platform_price?: number | null;
  is_discount_enabled?: boolean;
  artist_sale_price?: number | null;
  final_sale_price?: number | null;
  payment_method_id?: string;
  shipping_address_id?: string;
  stock_quantity?: number | null;
  quantity_selected?: number;
  made_to_order?: boolean;
  customization_available?: boolean;
  customization_instructions?: string;
  requires_assembly?: boolean;
  assembly_instructions?: string;
  care_instructions?: string;
  return_policy?: string;
  artist_id?: string;
  artist_name?: string;
  verified?: boolean;
  admin_notes?: string;
  sales_count?: number;
  created_at?: string;
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
    id: string;
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