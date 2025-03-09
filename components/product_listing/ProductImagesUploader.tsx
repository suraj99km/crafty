"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { uploadImage } from "@/lib/supabase-storage/uploadImage";
import supabase from "@/lib/supabase-db/supabaseClient";
import { ImagePlus } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "@/components/product_listing/SortableItem";

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

  // Fetch logged-in user's email
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

  const sensors = useSensors(useSensor(PointerSensor));

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
      const updatedImages = [...images, ...validImages].slice(0, 6); // Limit to 6 images
      setImages(updatedImages);
      updateProduct("images", updatedImages);
      toast.success(`${validImages.length} images uploaded successfully!`);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    updateProduct("images", updatedImages);
    toast.success("Image removed.");
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((img) => img === active.id);
    const newIndex = images.findIndex((img) => img === over.id);

    const updatedImages = arrayMove(images, oldIndex, newIndex);
    setImages(updatedImages);
    updateProduct("images", updatedImages);
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-semibold text-gray-700">
        Product Images <span className="text-red-500">*</span>
      </label>
      <p className="text-xs text-gray-500">Info: Uploaded images will be set in a 1:1 aspect ratio by default.</p>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={images} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-3 gap-3">
            {images.map((image, index) => (
              <SortableItem key={image} id={image} index={index} handleRemoveImage={() => handleRemoveImage(index)} />
            ))}

            {images.length < 6 && (
              <label className="relative w-full aspect-square flex flex-col items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-500 transition">
                <ImagePlus size={32} className="text-gray-500" />
                <span className="text-xs text-gray-500 mt-1">Upload</span>
                <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleImageUpload} multiple />
              </label>
            )}
          </div>
        </SortableContext>
      </DndContext>

      {images.length < 3 && <p className="text-xs text-red-500">At least 3 images are required.</p>}
      {loading && <p className="text-sm text-gray-500">Uploading...</p>}
    </div>
  );
}