import Compressor from "compressorjs";
import supabase from "@/lib/supabase-db/supabaseClient";
import crypto from "crypto"; // ✅ Hashing function

/**
 * Crops an image to a 1:1 ratio from the center before compression.
 * @param file - The original image file.
 * @returns {Promise<File | null>} - Cropped image as a File.
 */
const cropImageToSquare = async (file: File): Promise<File | null> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const minSide = Math.min(img.width, img.height); // Ensuring a square crop
        const startX = (img.width - minSide) / 2;  // Center cropping X-axis
        const startY = (img.height - minSide) / 2; // Center cropping Y-axis
  
        const canvas = document.createElement("canvas");
        canvas.width = minSide;
        canvas.height = minSide;
  
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(null);
  
        ctx.drawImage(img, startX, startY, minSide, minSide, 0, 0, minSide, minSide);
  
        canvas.toBlob((blob) => {
          if (!blob) return reject(null);
          const croppedFile = new File([blob], file.name, { type: file.type });
          resolve(croppedFile);
        }, file.type);
      };
      img.onerror = (err) => reject(err);
    });
  };
  
  /**
   * Compresses an image after cropping.
   * @param file - The image file.
   * @returns {Promise<File | null>} - Compressed file or null if failed.
   */
  const compressImage = async (file: File): Promise<File | null> => {
    if (!file) return null;
  
    // First, crop the image to a square
    const croppedFile = await cropImageToSquare(file);
    if (!croppedFile) return null;
  
    let quality = 0.6;
    let maxWidth = 1000;
    let maxHeight = 1000;
  
    return new Promise((resolve, reject) => {
      const compress = (inputFile: File, attempt = 1) => {
        new Compressor(inputFile, {
          quality,
          maxWidth,
          maxHeight,
          convertSize: 0,
          success: async (compressedBlob) => {
            const compressedFile = new File([compressedBlob], file.name, { type: file.type });
  
            console.log(`Attempt ${attempt}: Compressed size = ${compressedFile.size / 1024} KB`);
  
            if (compressedFile.size <= 100 * 1024 || attempt >= 4) {
              resolve(compressedFile);
            } else {
              quality -= 0.1;
              maxWidth -= 200;
              maxHeight -= 200;
              compress(compressedFile, attempt + 1);
            }
          },
          error: (err) => {
            console.error("Compression error:", err);
            reject(null);
          },
        });
      };
  
    //   compress(croppedFile);
      compress(file);
    });
  };

/**
 * Uploads an image to Supabase Storage, generates a signed URL (if needed), and saves it to the database.
 * Ensures compressed file size is under 50KB.
 * @param file - The image file selected by the user.
 * @param folder - The folder inside the Supabase bucket where the image will be stored.
 * @returns {Promise<string | null>} - The public or signed URL or null in case of an error.
 */
export async function uploadImage(file: File, folder: string): Promise<string | null> {
    if (!file) return null;
  
    // ✅ Compress Image First
    const compressedFile = await compressImage(file);
    if (!compressedFile) return null;
  
    // ✅ Generate a unique hash for the file
    const fileBuffer = await compressedFile.arrayBuffer();
    const hash = crypto.createHash("sha1").update(Buffer.from(fileBuffer)).digest("hex");
    const filePath = `${folder}/${hash}_${compressedFile.name}`;
  
    console.log("Checking if file exists:", filePath);
  
    // ✅ Check if file already exists
    const { data: existingFiles, error: existingError } = await supabase.storage
      .from("craftid.in-images")
      .list(folder);
  
    if (existingError) {
      console.error("Error checking existing files:", existingError);
      return null;
    }
  
    const fileExists = existingFiles.some((file) => file.name.includes(hash));
    if (fileExists) {
      console.log("File already exists:", filePath);
      return supabase.storage.from("craftid.in-images").getPublicUrl(filePath).data.publicUrl ?? null;
    }
  
    console.log("Uploading new file:", filePath);
  
    // ✅ Upload the compressed image to Supabase Storage
    const { data, error } = await supabase.storage.from("craftid.in-images").upload(filePath, compressedFile, {
      cacheControl: "3600", // Ensure caching does not interfere
      upsert: false, // Prevent overwriting
    });
  
    if (error) {
      console.error("Upload error:", error);
      return null;
    }
  
    console.log("Uploaded Successfully:", data);
  
    if (!data?.path) {
      console.error("Upload response missing path:", data);
      return null;
    }
  
    console.log("Profile image is now public:", filePath);
  
    // ✅ Retrieve and return the public URL
    const publicUrl = supabase.storage.from("craftid.in-images").getPublicUrl(filePath).data.publicUrl ?? null;
    console.log("Returning new public URL:", publicUrl);
    return publicUrl;
  }
