import { MouseEventHandler } from "react";

export interface CustomButtonProps {
    title: string;
    containerStyles?: string;
    handleClick?:MouseEventHandler<HTMLButtonElement>;
    btnType: "button" | "submit";
}
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
    id?: string;
    name: string;
    bio?: string;
    profile_picture: string;
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
  