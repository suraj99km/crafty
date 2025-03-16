"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileHeader from "@/components/profile/ProfileHeader";
import supabase from "@/lib/supabase-db/supabaseClient";
import { toast } from "sonner";
import ArtistProfileDetails from "@/components/profile/ProfileDetails";
import { uploadImage } from "@/lib/supabase-storage/uploadImage";
import WalletBalance from "@/components/profile/WalletBalance";
import PaymentMethods from "@/components/profile/PaymentMethods";
import ArtistAddresses from "@/components/profile/ArtistAddresses";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ArtistProfile = () => {
  const [user, setUser] = useState<any>(null);
  const [artist, setArtist] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [activeTab, setActiveTab] = useState<string>("profile");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTab = sessionStorage.getItem("artistProfileActiveTab");
      if (savedTab) setActiveTab(savedTab);
    }
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("artistProfileActiveTab", tab);
    }
  };

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
      .select();
  
    if (error) {
      console.error("Update error:", error);
      toast.error("Update failed. Try again.");
    } else if (data && data.length > 0) {
      setArtist(data[0]);
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
      const emailFolder = `artists/${artist.email_address.replace(/[@.]/g, "_")}`;
      
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
      
      <ProfileHeader 
        artist={artist} 
        uploadStatus={uploadStatus === "uploading" ? "uploading" : "idle"} 
        handleProfileImageUpload={handleProfileImageUpload} 
        />

<Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="relative flex mb-6 p-1 bg-white rounded-xl shadow-sm border border-gray-100 z-[5] overflow-hidden">
        <div
          className="absolute h-[calc(100%-8px)] top-1 transition-all duration-300 ease-out bg-red-500 rounded-lg shadow-md z-[4]"
          style={{
            width: "calc(50% - 8px)",
            left: "4px",
            transform: `translateX(${activeTab === "business" ? "100%" : "0%"})`,
          }}
        />
        
        <TabsTrigger
          value="profile"
          className="relative flex-1 text-sm py-3 font-medium z-10 transition-all duration-300 ease-out rounded-lg 
            data-[state=active]:text-white data-[state=inactive]:text-gray-700"
          onClick={() => setActiveTab("profile")}
        >
          Profile Details
        </TabsTrigger>
        <TabsTrigger
          value="business"
          className="relative flex-1 text-sm py-3 font-medium z-10 transition-all duration-300 ease-out rounded-lg 
            data-[state=active]:text-white data-[state=inactive]:text-gray-700"
          onClick={() => setActiveTab("business")}
        >
          Business Details
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="space-y-6 transition-all duration-500 ease-in-out transform origin-top">
      <ArtistProfileDetails artist={artist} setArtist={setArtist} handleUpdate={handleUpdate} />
      </TabsContent>

      <TabsContent value="business" className="space-y-6 transition-all duration-500 ease-in-out transform origin-top">
      <WalletBalance />
    <PaymentMethods />
    <ArtistAddresses />
      </TabsContent>
    </Tabs>


    </div>
  );
};

export default ArtistProfile;