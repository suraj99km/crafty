"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase-db/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { XCircle, UploadCloud, Loader2, AlertTriangle } from "lucide-react";

type ProductVideoKeys = "demo_video";

type ProductWithVideos = {
  demo_video: string | null;
};

export default function ProductVideosUploader({
  product,
  updateProduct,
}: {
  product: ProductWithVideos;
  updateProduct: (key: ProductVideoKeys, value: string | null) => void;
}) {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [uploading, setUploading] = useState<{ [key in ProductVideoKeys]?: boolean }>({});
  const [uploadError, setUploadError] = useState<{ [key in ProductVideoKeys]?: string }>({});
  const [fileNames, setFileNames] = useState<{ [key in ProductVideoKeys]?: string }>({});
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Fetch logged-in user's email
  useEffect(() => {
    const getUserEmail = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error("Auth error:", error);
          setUserEmail(null);
          toast.error("Authentication error. Please try logging in again.");
        } else if (data?.user) {
          setUserEmail(data.user.email?.replace(/[@.]/g, "_") || null);
        } else {
          setUserEmail(null);
        }
      } catch (err) {
        console.error("Failed to get user:", err);
        setUserEmail(null);
      } finally {
        setIsAuthReady(true);
      }
    };

    getUserEmail();
  }, []);

  // Extract filename from URL for existing videos
  useEffect(() => {
    const extractFileNames = () => {
      const newFileNames: { [key in ProductVideoKeys]?: string } = {};
      
      Object.keys(product).forEach((key) => {
        const url = product[key as ProductVideoKeys];
        if (url) {
          try {
            // Extract filename from the URL
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/');
            const filename = pathParts[pathParts.length - 1];
            
            // Decode any URL encoded characters and remove timestamp prefix if present
            const decodedName = decodeURIComponent(filename).replace(/^\d+_/, '');
            newFileNames[key as ProductVideoKeys] = decodedName;
          } catch (e) {
            // If URL parsing fails, use a generic name
            newFileNames[key as ProductVideoKeys] = "Uploaded video";
          }
        }
      });
      
      setFileNames(newFileNames);
    };
    
    extractFileNames();
  }, [product]);

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>, key: ProductVideoKeys) => {
    if (!event.target.files?.length) return;
    
    const file = event.target.files[0];
    await handleFileUpload(file, key);
    
    // Reset the input to allow re-uploading the same file
    event.target.value = '';
  };

  const handleFileUpload = async (file: File, key: ProductVideoKeys) => {
    if (!userEmail) {
      setUploadError(prev => ({ ...prev, [key]: "Please log in before uploading" }));
      toast.error("Please log in before uploading");
      return;
    }

    setUploading(prev => ({ ...prev, [key]: true }));
    setUploadError(prev => ({ ...prev, [key]: undefined }));
    // Save the original filename
    setFileNames(prev => ({ ...prev, [key]: file.name }));

    try {
      // Check file size - limit to 50MB for direct upload
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        throw new Error(`File is too large. Maximum size is 50MB.`);
      }

      // Define folder path with a more reliable structure
      const timestamp = new Date().toISOString().split("T")[0];
      const folderPath = `product-demos/${userEmail}/${timestamp}`;
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const fullPath = `${folderPath}/${fileName}`;

      // Upload the file
      const { data, error } = await supabase.storage
        .from("craftid.in-images")
        .upload(fullPath, file, {
          cacheControl: "3600",
          upsert: true // Changed to true to handle retries better
        });

      if (error) {
        throw error;
      }

      if (!data?.path) {
        throw new Error("Upload response missing path");
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("craftid.in-images")
        .getPublicUrl(data.path);

      if (urlData?.publicUrl) {
        updateProduct(key, urlData.publicUrl);
        toast.success(`Demo Video uploaded successfully!`);
      } else {
        throw new Error("Failed to get public URL");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      const errorMessage = error.message || "An error occurred during upload";
      setUploadError(prev => ({ ...prev, [key]: errorMessage }));
      toast.error(errorMessage);
    } finally {
      setUploading(prev => ({ ...prev, [key]: false }));
    }
  };

  const removeVideo = (key: ProductVideoKeys) => {
    updateProduct(key, null);
    setFileNames(prev => {
      const newFileNames = { ...prev };
      delete newFileNames[key];
      return newFileNames;
    });
    toast.info(`Demo Video removed.`);
  };

  const videoFields: Array<{
    key: ProductVideoKeys;
    label: string;
    required: boolean;
  }> = [
    { key: "demo_video", label: "Product Demo Video *", required: true },
  ];

  return (
    <div className="space-y-4">
      {videoFields.map(({ key, label, required }) => (
        <div key={key} className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
              {label}
            </label>
          </div>
          
          {product[key] ? (
            <div className="relative rounded-lg overflow-hidden border border-gray-200">
              <video 
                controls 
                className="w-full h-100 object-contain rounded-t-lg"
                src={product[key]}
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
              <div className="absolute top-2 right-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeVideo(key)}
                  className="flex gap-1 items-center px-2 py-1 text-xs h-8 bg-white text-red-500 hover:bg-red-50 border border-red-200 shadow-sm"
                >
                  <XCircle size={14} />
                  Remove
                </Button>
              </div>
              <div className="p-2 text-xs text-gray-500 bg-gray-50 border-t border-gray-200 truncate">
                <span className="font-medium">File:</span> {fileNames[key] || "Uploaded video"}
              </div>
            </div>
          ) : (
            <div className="relative w-full aspect-video flex flex-col items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-500 transition">
              <Input
                type="file"
                accept="video/mp4,video/quicktime,video/x-msvideo"
                onChange={(e) => handleVideoUpload(e, key)}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                disabled={!!uploading[key]}
              />
              
              {!uploading[key] && (
                <>
                  <UploadCloud className="w-8 h-8 text-gray-500 mb-1" />
                  <span className="text-xs text-gray-500">Upload Demo Video</span>
                  <span className="text-xs text-gray-400 mt-1">Max size: 50MB</span>
                  <span className="text-xs text-gray-400">Formats: MP4</span>
                </>
              )}
              
              {uploading[key] && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 rounded-lg p-4">
                  <Loader2 className="animate-spin text-gray-600 mb-2" size={24} />
                  <span className="text-sm text-gray-600 mb-2">Uploading...</span>
                  <div className="w-full max-w-xs bg-blue-100 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full animate-pulse" />
                  </div>
                  <span className="text-xs text-gray-400 mt-3">Please wait, this may take a moment...</span>
                  {fileNames[key] && (
                    <span className="text-xs text-gray-500 mt-1 font-medium">{fileNames[key]}</span>
                  )}
                </div>
              )}
              
              {uploadError[key] && (
                <div className="mt-2 flex flex-col items-center gap-1 text-xs text-red-500 p-2 bg-red-50 rounded w-full">
                  <div className="flex items-center gap-1">
                    <AlertTriangle size={12} />
                    <span>{uploadError[key]}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-1 h-6 text-xs"
                    onClick={() => setUploadError(prev => ({ ...prev, [key]: undefined }))}
                  >
                    Dismiss
                  </Button>
                </div>
              )}
            </div>
          )}
          {required && !product[key] && (
            <span className="text-red-500 text-xs">Product Demo Video is required</span>
          )}
        </div>
      ))}
      
        <div className="text-xs text-gray-500 space-y-1">
        <span className="font-medium block">Upload Tips:</span> 
        <ul className="ml-1 space-y-0.5">
        <li>• Keep videos short, engaging, and visually appealing.</li>  
        <li>• Upload in portrait mode for the best viewing experience.</li>  
        <li>• Make it creative and interactive to stand out on CraftID.in's social channels.</li>
        </ul>
        </div>
    </div>
  );
}