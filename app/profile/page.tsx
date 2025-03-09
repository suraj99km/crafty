"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, XCircle, Instagram, Globe, Edit2, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import supabase from "@/lib/supabase-db/supabaseClient";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { uploadImage } from "@/lib/supabase-storage/uploadImage";

const ArtistProfile = () => {
  const [user, setUser] = useState<any>(null);
  const [artist, setArtist] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("idle");
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) return setLoading(false);
      setUser(user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchArtist = async () => {
      if (!user?.email) return;
      const { data, error } = await supabase
        .from("Artists")
        .select("*")
        .eq("email_address", user.email)
        .single();
      if (error) {
        toast.error("Artist profile not found.");
        setLoading(false);
        return;
      }
      setArtist(data);
      setLoading(false);
    };
    if (user) fetchArtist();
  }, [user]);
  
  const handleUpdate = async (field: string, value: string) => {
    if (!artist) return;
    
    const { data, error } = await supabase
      .from("Artists")
      .update({ [field]: value })
      .eq('email_address', artist.email_address)
      .select(); // Add .select() to return the updated record
  
    if (error) {
      console.error("Update error:", error);
      toast.error("Update failed. Try again.");
    } else if (data && data.length > 0) {
      setArtist(data[0]); // Update the entire artist object with the returned data
      toast.success("Profile updated!");
    }
    setEditing(null);
  };
  const handleProfileImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!artist) return;
  
    const fileInput = event.target;
    const file = fileInput.files?.[0];
    if (!file) return;
  
    // Reset the file input so selecting the same file works again
    fileInput.value = "";
  
    // File validation
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
  
    if (file.size > maxSize) {
      toast.error("File too large. Maximum size is 5MB.");
      return;
    }
  
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload JPG or PNG files only.");
      return;
    }
  
    setUploadStatus("uploading");
    const uploadToast = toast.loading("Uploading profile picture...");
  
    try {
      // Store in user-specific folder inside "images/"
      const emailFolder = `images/${artist.email_address.replace(/[@.]/g, "_")}`;
      
      // Upload file to Supabase storage
      const uploadedUrl = await uploadImage(file, emailFolder);
      if (!uploadedUrl) throw new Error("Failed to upload image");
  
      // Ensure the image is available before updating DB
      let retries = 3;
      while (retries > 0) {
        const response = await fetch(uploadedUrl, { method: "HEAD" });
        if (response.ok) break;
  
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 sec
        retries--;
      }
  
      // Update Supabase database with new profile picture URL
      const { data, error } = await supabase
        .from("Artists")
        .update({ profile_picture: uploadedUrl })
        .eq("email_address", artist.email_address)
        .select();
  
      if (error) throw error;
  
      if (data && data.length > 0) {
        setArtist(data[0]); // Update artist state
        toast.success("Profile picture updated!", { id: uploadToast });
      }
  
      setUploadStatus("success");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Image upload failed. Try again.", { id: uploadToast });
      setUploadStatus("error");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-gray-300 rounded-full animate-spin border-t-red-500"></div>
      </div>
    );
  }

  if (!artist) {
    return <p className="text-center text-gray-500 mt-10">Artist profile not found.</p>;
  }

  return (
    <div className="mt-16 max-w-4xl mx-auto p-6 space-y-6">
      
      {/* Profile Header */}
      <Card className="shadow-lg bg-white rounded-2xl border border-gray-200">
        <CardContent className="flex items-center gap-4 p-4 sm:p-6">
        <div className="relative group">
            <img
              src={artist.profile_picture || "/placeholder.png"}
              alt="Profile Picture"
              width={150}
              height={150}
              className="rounded-full shadow-md object-cover"
            />
            <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileImageUpload}
              />
              {uploadStatus === "uploading" ? (
                <RefreshCw className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <RefreshCw className="w-6 h-6" />
                  <span className="text-xs ml-2">Change Photo</span>
                </>
              )}
            </label>
          </div>


          <div className="space-y-1 w-full">
            <span className="inline-block bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md shadow">
              ArtistID
            </span>
            <h2 className="text-lg font-bold text-gray-900 truncate">{artist.name}</h2>
            <p className="pb-1 text-sm text-gray-600 truncate">{artist.email_address}</p>
            <div className="flex items-center gap-1 text-xs font-medium">
              {artist.gov_id === "verified" ? (
                <>
                  <BadgeCheck className="text-green-500 w-4 h-4" />
                  <span className="text-green-600">Verified</span>
                </>
              ) : (
                <>
                  <XCircle className="text-red-500 w-4 h-4" />
                  <span className="text-red-600">Verification Pending</span>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tagline */}
      <Card className="shadow-md bg-white rounded-2xl border border-gray-200">
        <CardContent className="p-4 sm:p-6 relative">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Tagline</h3>
          {editing === "tagline" ? (
            <Input
              value={artist.tagline || ""}
              onChange={(e) => setArtist({ ...artist, tagline: e.target.value })}
              onBlur={() => handleUpdate("tagline", artist.tagline)}
              autoFocus
            />
          ) : (
            <p className="italic font-medium text-gray-700">{artist.tagline || "No tagline provided"}</p>
          )}
      <button
        className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
        onClick={() => setEditing("tagline")}
      >
        <Edit2 className="w-4 h-4" />
      </button>
        </CardContent>
      </Card>

<Card className="shadow-md bg-white rounded-2xl border border-gray-200">
  <CardContent className="p-4 sm:p-6 space-y-4">
    <h3 className="text-sm font-semibold text-gray-900">Social Links</h3>

    {/* Instagram */}
    <div className="relative">
      <h4 className="text-xs font-medium text-gray-600 mb-1">Instagram</h4>
      {editing === "instagram" ? (
        <div className="relative">
          <Input
            value={artist.instagram || ""}
            onChange={(e) => setArtist({ ...artist, instagram: e.target.value })}
            onBlur={() => handleUpdate("instagram", artist.instagram)}
            autoFocus
            className="pr-10" // Extra padding to avoid overlap
          />
          <button
            className="absolute top-[-10px] right-0 flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition shadow"
            onClick={() => setEditing(null)} // Clicking hides edit mode
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <p className="text-gray-700 truncate">{artist.instagram || "No link added"}</p>
          <button
            className="ml-2 flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition shadow"
            onClick={() => setEditing("instagram")}
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>

    {/* Portfolio */}
    <div className="relative">
      <h4 className="text-xs font-medium text-gray-600 mb-1">Portfolio</h4>
      {editing === "portfolio" ? (
        <div className="relative">
          <Input
            value={artist.portfolio || ""}
            onChange={(e) => setArtist({ ...artist, portfolio: e.target.value })}
            onBlur={() => handleUpdate("portfolio", artist.portfolio)}
            autoFocus
            className="pr-10"
          />
          <button
            className="absolute top-[-10px] right-0 flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition shadow"
            onClick={() => setEditing(null)}
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <p className="text-gray-700 truncate">{artist.portfolio || "No link added"}</p>
          <button
            className="ml-2 flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition shadow"
            onClick={() => setEditing("portfolio")}
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>

    {/* Other Social */}
    <div className="relative">
      <h4 className="text-xs font-medium text-gray-600 mb-1">Other Social</h4>
      {editing === "other_social" ? (
        <div className="relative">
          <Input
            value={artist.other_social || ""}
            onChange={(e) => setArtist({ ...artist, other_social: e.target.value })}
            onBlur={() => handleUpdate("other_social", artist.other_social)}
            autoFocus
            className="pr-10"
          />
          <button
            className="absolute top-[-10px] right-0 flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition shadow"
            onClick={() => setEditing(null)}
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <p className="text-gray-700 truncate">{artist.other_social || "No link added"}</p>
          <button
            className="ml-2 flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition shadow"
            onClick={() => setEditing("other_social")}
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  </CardContent>
</Card>


      {/* My Story */}
      <Card className="shadow-md bg-white rounded-2xl border border-gray-200">
        <CardContent className="p-4 sm:p-6 relative">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">My Story</h3>
          {editing === "bio" ? (
            <Textarea
              value={artist.bio || ""}
              onChange={(e) => setArtist({ ...artist, bio: e.target.value })}
              onBlur={() => handleUpdate("bio", artist.bio)}
              autoFocus
              rows={6} // Adjust this number as needed
            />

          ) : (
            <p className="text-gray-700 leading-relaxed">{artist.bio || "No bio added yet."}</p>
          )}
      <button
        className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
        onClick={() => setEditing("bio")}
      >
        <Edit2 className="w-4 h-4" />
      </button>
        </CardContent>
      </Card>


    </div>
  );
};

export default ArtistProfile;