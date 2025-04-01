import { MouseEventHandler } from "react";

export interface CustomButtonProps {
    title: string;
    containerStyles?: string;
    handleClick?:MouseEventHandler<HTMLButtonElement>;
    btnType: "button" | "submit";
}

export interface ProductData {
  title: string;
  category: string;
  description: string;
  images: string[];
  demoVideo: string | null;
  dimensions: {
    length?: number | null;
    width?: number | null;
    height?: number | null;
    weight?: number | null;
  };
  material: string;
  prepTime?: number | null;
  artistPrice?: number | null;
  platformPrice?: number | null;
  isDiscountEnabled: boolean;
  artistSalePrice?: number | null;
  finalSalePrice?: number | null;
  paymentMethodId: string;
  shippingAddressId: string;
  stockQuantity?: number | null;
  madeToOrder: boolean;
  customizationAvailable: boolean;
  customizationInstructions: string;
  requiresAssembly: boolean;
  assemblyInstructions: string;
  careInstructions: string;
  returnPolicy: string;
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
  