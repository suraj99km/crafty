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
  }

export interface Artist {
    id?: string;
    name: string;
    bio?: string;
    profile_picture: string;
}