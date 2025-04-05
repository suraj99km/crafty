"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { uploadImage } from "@/lib/supabase-storage/uploadImage";
import supabase from "@/lib/supabase-db/supabaseClient";
import { ImagePlus, X } from "lucide-react";

export default function ProductImagesUploader({
  product,
  updateProduct,
}: {
  product: { images: string[] };
  updateProduct: (key: string, value: string[]) => void;
}) {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>(product.images || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUserEmail = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        setUserEmail(null);
        return;
      }
      setUserEmail(data.user.email?.replace(/[@.]/g, "_") || null);
    };

    getUserEmail();
  }, []);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !userEmail) {
      toast.error("User not logged in or no files selected.");
      return;
    }

    const files = Array.from(event.target.files);
    if (images.length + files.length > 6) {
      toast.error("Maximum 6 images allowed!");
      return;
    }

    setLoading(true);
    const uploadedImages = await Promise.all(
      files.map(async (file) => {
        const folderPath = `products/${userEmail}/${new Date().toISOString().split("T")[0]}`;
        const imageUrl = await uploadImage(file, folderPath);
        return imageUrl || null;
      })
    );

    setLoading(false);
    const validImages = uploadedImages.filter((url) => url !== null) as string[];
    if (validImages.length > 0) {
      const updatedImages = [...images, ...validImages].slice(0, 6);
      setImages(updatedImages);
      updateProduct("images", updatedImages);
      toast.success(`Successfully Uploaded!`);
    }
  };

  const handleRemoveImage = async (index: number) => {
    try {
      const currentImages = [...images];
      const updatedImages = currentImages.filter((_, i) => i !== index);
      setImages(updatedImages);
      updateProduct("images", updatedImages);
    } catch (error) {
      toast.error("Failed to remove image");
      console.error("Error removing image:", error);
    }
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-semibold text-gray-700">
        Product Images <span className="text-red-500">*</span>
      </label>
      <p className="text-xs text-gray-500">Info: Uploaded images will be set in a 1:1 aspect ratio by default.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
        {images.map((image, index) => (
          <div key={`${image}-${index}`} className="relative aspect-square group">
            <img
              src={image}
              alt={`Product ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              onClick={() => handleRemoveImage(index)}
              className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shadow-md"
              aria-label="Remove image"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {images.length < 6 && (
          <label className="relative w-full aspect-square flex flex-col items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-500 active:border-gray-600 transition">
            <ImagePlus size={28} className="text-gray-500" />
            <span className="text-xs text-gray-500 mt-2">Upload</span>
            <input 
              type="file" 
              accept="image/png, image/jpeg" 
              className="hidden" 
              onChange={handleImageUpload} 
              multiple 
            />
          </label>
        )}
      </div>

      {images.length < 3 && <p className="text-xs text-red-500">At least 3 images are required.</p>}
      {loading && <p className="text-sm text-gray-500">Uploading...</p>}
    </div>
  );
}