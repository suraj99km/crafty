"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase-db/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Upload, Instagram, Link, Share2, RefreshCw, AlertCircle } from "lucide-react";
import PhoneAuth from "@/components/auth/PhoneAuth";
import { uploadImage } from "@/lib/supabase-storage/uploadImage";
import { toast } from "sonner";

export default function JoinArtistForm() {
  const router = useRouter();
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null); // Profile Picture
  const [govIdImgUrl, setGovIdImgUrl] = useState<string | null>(null); // Gov ID
  
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    profile: "idle" | "uploading" | "success" | "error";
    govId: "idle" | "uploading" | "success" | "error";
  }>({
    profile: "idle",
    govId: "idle"
  });
  const [uploadProgress, setUploadProgress] = useState<{
    profile: number;
    govId: number;
  }>({
    profile: 0,
    govId: 0
  });
  
  const [user, setUser] = useState<{ id: string; firstName: string; lastName: string; email: string } | null>(null);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [form, setForm] = useState({
    name: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    tagline: "",
    bio: "",
    portfolio: "",
    instagram: "",
    other_social: "",
    profile_image: "",
    gov_id: "",
    agreedToTerms: false,
  });

  // Load saved form state on initial load
  useEffect(() => {
    const savedForm = sessionStorage.getItem('artistFormState');
    if (savedForm) {
      try {
        const parsedForm = JSON.parse(savedForm);
        if (parsedForm.first_name || parsedForm.bio || parsedForm.tagline || parsedForm.phone) {
          setForm(prevForm => ({
            ...prevForm,
            ...parsedForm
          }));
        }
        
        // Restore image URLs if available
        if (parsedForm.profile_image) setImageUrl(parsedForm.profile_image);
        if (parsedForm.gov_id) setGovIdImgUrl(parsedForm.gov_id);
      } catch (e) {
        console.error("Error restoring form state:", e);
      }
    }
  }, []);

  // Save form state whenever it changes
  useEffect(() => {
    sessionStorage.setItem('artistFormState', JSON.stringify(form));
  }, [form]);

  useEffect(() => {
    const toCamelCase = (str: string) => {
      return str
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
    };
  
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        setUser(null);
        return;
      }
  
      const fullName = data.user.user_metadata?.full_name || "User";
      const nameParts = fullName.split(" ");
      const firstName = toCamelCase(nameParts[0] || "");
      const lastName = toCamelCase(nameParts.slice(1).join(" ")) || "";
      const email = data.user.email || "";
      const id = data.user.id;
  
      setUser({ id, firstName, lastName, email });
  
      setForm((prev) => ({
        ...prev,
        first_name: firstName,
        last_name: lastName,
        email: email,
      }));
    };
  
    getUser();
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const simulateProgress = (type: "profile" | "govId") => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress <= 90) {
        setUploadProgress(prev => ({
          ...prev,
          [type]: progress
        }));
      } else {
        clearInterval(interval);
      }
    }, 300);
    
    return () => clearInterval(interval);
  };

  const handleUpload = async (file: File, folderName: string) => {
    if (!file || !user?.email) {
      toast.error("User not found. Please log in again.");
      return;
    }
  
    // File validation
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    
    if (file.size > maxSize) {
      toast.error(`File too large. Maximum size is 5MB.`);
      return;
    }
    
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload JPG or PNG files only.");
      return;
    }
  
    setLoading(true);
    
    // Update upload status
    const type = folderName === "artists" ? "profile" : "govId";
    setUploadStatus(prev => ({ ...prev, [type]: "uploading" }));
    
    // Start progress simulation
    const stopSimulation = simulateProgress(type);
    
    // Show toast notification for upload start
    const uploadToast = toast.loading(
      `Uploading ${folderName === "artists" ? "profile picture" : "government ID"}...`
    );
  
    try {
      // Email folder path for storage
      const emailFolder = `${folderName}/${user.email.replace(/[@.]/g, "_")}`;
      
      // Upload file to Supabase storage using the utility
      const uploadedUrl = await uploadImage(file, emailFolder);
      
      // Validate returned URL
      if (uploadedUrl && uploadedUrl.startsWith("https")) { 
        // Update form state with new URL
        setForm((prevForm) => ({
          ...prevForm,
          profile_image: folderName === "artists" ? uploadedUrl : prevForm.profile_image,
          gov_id: folderName === "gov_id" ? uploadedUrl : prevForm.gov_id,
        }));
      
        // Update UI state with new URL
        if (folderName === "artists") {
          setImageUrl(uploadedUrl);
        } else if (folderName === "gov_id") {
          setGovIdImgUrl(uploadedUrl);
        }
        
        // Set progress to 100%
        setUploadProgress(prev => ({ ...prev, [type]: 100 }));
        setUploadStatus(prev => ({ ...prev, [type]: "success" }));
        
        // Update toast notification
        toast.success(
          `${folderName === "artists" ? "Profile picture" : "Government ID"} uploaded successfully!`, 
          { id: uploadToast }
        );
      } else {
        throw new Error("Invalid upload URL received");
      }
    } catch (error) {
      console.error("Upload error:", error);
      
      // Update upload status
      setUploadStatus(prev => ({ ...prev, [type]: "error" }));
      
      // Update toast notification
      toast.error(
        `Failed to upload. Please try again.`, 
        { id: uploadToast }
      );
    } finally {
      setLoading(false);
      stopSimulation();
      
      // Reset status after delay
      setTimeout(() => {
        if (uploadStatus[type] === "success") {
          setUploadStatus(prev => ({ ...prev, [type]: "idle" }));
        }
      }, 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    // Enhanced validation 
    if (!imageUrl) {
      toast.error("Please upload a profile picture.");
      return;
    }
    
    if (!govIdImgUrl) {
      toast.error("Please upload a government ID document.");
      return;
    }

    if (form.tagline.trim().split(/\s+/).length < 5) {
      toast.error("Your tagline should be at least 5 words.");
      return;
    }
    
    if (form.bio.trim().split(/\s+/).length < 30) {
      toast.error("Your bio should be at least 30 words.");
      return;
    }
    
    if (!form.agreedToTerms) {
      toast.error("You must agree to the terms and conditions.");
      return;
    }
    
    if (form.phone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }
  
    setLoading(true);
    
    // Show submission toast
    const submissionToast = toast.loading("Submitting your application...");
  
    try {
      // Insert data into the 'Artists' table
      const { data, error } = await supabase
        .from("Artists")
        .insert([
          {
            name: `${form.first_name} ${form.last_name}`,
            phone: form.phone,
            email_address: form.email,
            tagline: form.tagline,
            bio: form.bio,
            profile_picture: imageUrl,
            created_at: new Date(),
            updated_at: new Date(),
            last_name: form.last_name,
            first_name: form.first_name,
            portfolio: form.portfolio,
            instagram: form.instagram,
            other_social: form.other_social,
            gov_id: govIdImgUrl,
            agreedtoterms: form.agreedToTerms,
          },
        ]);
  
      if (error) {
        throw new Error(error.message);
      }
  
      // Handle successful insertion
      console.log("Data inserted successfully:", data);
      
      toast.success("Your application has been submitted successfully!", {
        id: submissionToast
      });
      
      // Clear saved form data on successful submission
      sessionStorage.removeItem('artistFormState');
  
      setTimeout(() => {
        router.push("/profile");
      }, 1500);
    } catch (error: unknown) {
      setLoading(false);
      if (error instanceof Error) {
        console.error("Error inserting data:", error.message);
        toast.error(`Error: ${error.message}`, {
          id: submissionToast
        });
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <motion.div
      className="flex justify-center items-center min-h-screen bg-gray-100 p-4 mt-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="w-full max-w-xl bg-white shadow-lg rounded-2xl p-1"> 

        <CardContent>
          <form onSubmit={handleSubmit} className="mt-4 space-y-5">

          {/* Profile Image Upload Section - Enhanced with better feedback */}
          <div className="flex items-center justify-between w-full gap-4">
            {/* Left Side: Artist Name */}
            <div className="text-lg font-semibold text-center flex flex-col items-center">
              {imageUrl ? (
                <div className="flex flex-col items-center">
                  {/* Artist ID Label */}
                  <span className="text-white bg-red-500 rounded-lg px-3 py-1 text-sm font-bold shadow-md">
                    ArtistID
                  </span>

                  {/* Artist Name */}
                  <span className="text-black text-lg font-bold mt-1">
                    {form.first_name} {form.last_name}
                  </span>
                </div>
              ) : (
                <p>
                  Get Your{" "}
                  <span className="text-white bg-red-500 rounded-lg p-1 font-bold">
                    ArtistID
                  </span>
                  <br /> & Start Selling
                </p>
              )}
            </div>

            {/* Right Side: Profile Image Upload - Enhanced */}
            <div className="flex flex-col items-center gap-2">
              <label className="relative cursor-pointer group">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (imageUrl && !confirm("Replace current profile picture?")) {
                        return;
                      }
                      setImage(file);
                      handleUpload(file, "artists");
                    }
                  }}
                  disabled={uploadStatus.profile === "uploading"}
                />

                {/* Image Preview or Upload Button with Status Indicators */}
                {imageUrl ? (
                  <div className="relative">
                    <img
                      src={imageUrl}
                      alt="Profile Preview"
                      className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-lg border-2 border-gray-300 transition-all"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                      {uploadStatus.profile !== "uploading" && (
                        <div className="text-white text-sm font-medium">
                          <RefreshCw size={20} className="mx-auto mb-1" />
                          Change Photo
                        </div>
                      )}
                    </div>
                    
                    {/* Error indicator if upload failed */}
                    {uploadStatus.profile === "error" && (
                      <div className="absolute -bottom-1 -right-1 bg-red-500 rounded-full p-1 shadow-md">
                        <AlertCircle size={16} className="text-white" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-24 h-24 md:w-28 md:h-28 bg-gray-100 border-2 border-gray-300 rounded-full flex flex-col items-center justify-center text-gray-500 text-xs font-medium tracking-wide">
                    <Upload size={20} className="text-gray-500 mb-1" />
                    Upload Image
                  </div>
                )}
              </label>
              
              {/* Progress indicator */}
              {uploadStatus.profile === "uploading" && (
                <div className="w-full mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-red-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress.profile}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-1">Uploading...</p>
                </div>
              )}
            </div>
          </div>

          {/* Auto-Filled Name & Email */}
          <div className="grid grid-cols-2 gap-4">
            <Input name="first_name" value={form.first_name} readOnly className="rounded-xl bg-gray-100 text-gray-500" />
            <Input name="last_name" value={form.last_name} readOnly className="rounded-xl bg-gray-100 text-gray-500" />
          </div>
          <Input name="email" type="email" value={form.email} readOnly className="rounded-xl bg-gray-100 text-gray-500" />

          {/* Mobile Number Input */}
          <div className="space-y-2">
            <label className="text-gray-700 font-medium">Contact Number *</label>

            <div className="flex items-center border rounded-lg p-2 focus-within:ring-2 focus-within:ring-red-500">
              <span className="text-gray-600 pr-2">+91</span>
              <input
                type="tel"
                name="phone"
                placeholder="Enter 10-digit mobile number"
                value={form.phone || ""}
                onChange={(e) => {
                  const phone = e.target.value.replace(/\D/g, "").slice(0, 10); // Ensure only 10 digits
                  setForm((prev) => ({ ...prev, phone }));
                }}
                maxLength={10}
                className="w-full outline-none"
              />
            </div>
            {form.phone && form.phone.length !== 10 && (
              <p className="text-xs text-red-500">Please enter a valid 10-digit mobile number</p>
            )}
          </div>

          {/* Government ID Upload - Enhanced with better feedback */}
          <div className="space-y-2">
            <label className="text-gray-700 font-medium">Upload Government ID *</label>
            <p className="text-sm text-gray-500">Accepted: Aadhar Card, PAN Card, Driver's License (JPG, PNG)</p>

            <label className={`flex flex-col items-center justify-center border-2 border-dashed ${uploadStatus.govId === "error" ? "border-red-300" : "border-gray-300"} rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition ${uploadStatus.govId === "uploading" ? "opacity-70" : ""}`}>
              {govIdImgUrl ? (
                <div className="relative group">
                  <img src={govIdImgUrl} alt="Uploaded Gov ID" className="w-64 h-32 object-cover rounded-lg" />
                  <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {uploadStatus.govId !== "uploading" && (
                      <div className="text-white text-sm font-medium">
                        <RefreshCw size={20} className="mx-auto mb-1" />
                        Replace Document
                      </div>
                    )}
                  </div>
                  
                  {/* Error indicator */}
                  {uploadStatus.govId === "error" && (
                    <div className="absolute -bottom-1 -right-1 bg-red-500 rounded-full p-1 shadow-md">
                      <AlertCircle size={16} className="text-white" />
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Upload size={22} className="text-gray-500 mb-2" />
                  <span className="text-gray-600 text-sm">Click to Upload or Drag & Drop</span>
                </>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (govIdImgUrl && !confirm("Replace current ID document?")) {
                      return;
                    }
                    handleUpload(file, "gov_id");
                  }
                }}
                disabled={uploadStatus.govId === "uploading"}
              />
            </label>
            
            {/* Progress indicator */}
            {uploadStatus.govId === "uploading" && (
              <div className="w-full mt-2">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-red-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress.govId}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 text-center mt-1">Uploading...</p>
              </div>
            )}
          </div>

        {/* Short tagline (Minimum 5 Words, Maximum 20 Words) */}
        <div className="relative">
          <Input
            type="text"
            name="tagline"
            placeholder="Give your profile a tagline..."
            value={form.tagline}
            onChange={(e) => {
              const words = e.target.value.trim().split(/\s+/);
              if (words.length <= 20 || words.length === 1) {
                handleChange(e);
              }
            }}
            required
            className="rounded-xl text-md pr-20" // Added padding to prevent overlap with counter
          />
          
          {/* Word Counter */}
          <div
            className={`text-xs absolute right-2 top-1/2 transform -translate-y-1/2 ${
              form.tagline
                ? form.tagline.trim().split(/\s+/).length < 5
                  ? "text-red-500"
                  : form.tagline.trim().split(/\s+/).length >= 15
                  ? "text-orange-500"
                  : "text-gray-600"
                : "text-gray-600"
            }`}
          >
            {form.tagline ? form.tagline.trim().split(/\s+/).length : 0} / 20
          </div>
        </div>

          {/* Short Bio (Minimum 30 Words, Maximum 100 Words) */}
          <div className="relative">
            <Textarea
              name="bio"
              placeholder="Tell us about your art journey..."
              value={form.bio}
              onChange={(e) => {
                const words = e.target.value.trim().split(/\s+/);
                if (words.length <= 100 || words.length === 1) {
                  handleChange(e);
                }
              }}
              required
              className="rounded-xl h-40 text-md pb-10" // Added padding at the bottom to make space for counter
            />
            {/* Word Counter */}
            <div className={`text-xs text-right ${
              form.bio ? (
                form.bio.trim().split(/\s+/).length < 30 
                  ? "text-red-500" 
                  : form.bio.trim().split(/\s+/).length >= 90 
                    ? "text-orange-500" 
                    : "text-gray-600"
              ) : "text-gray-600"
            }`}>
              {form.bio ? form.bio.trim().split(/\s+/).length : 0} / 100 words
              {form.bio && form.bio.trim().split(/\s+/).length < 30 ? 
                " (minimum 30 words required)" : ""}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Link size={20} className="text-gray-500" />
              <Input name="portfolio" placeholder="Portfolio/Website (Optional)" value={form.portfolio} onChange={handleChange} className="rounded-xl" />
            </div>
            <div className="flex items-center gap-2">
              <Instagram size={20} className="text-gray-500" />
              <Input name="instagram" placeholder="Instagram Profile (Optional)" value={form.instagram} onChange={handleChange} className="rounded-xl" />
            </div>
            <div className="flex items-center gap-2">
              <Share2 size={20} className="text-gray-500" />
              <Input name="other_social" placeholder="Other Social links (Optional)" value={form.other_social} onChange={handleChange} className="rounded-xl" />
            </div>
          </div>

          {/* Terms & Conditions Agreement */}
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={form.agreedToTerms}
              onChange={() => setForm({ ...form, agreedToTerms: !form.agreedToTerms })}
              required
            />
            <span className="text-sm text-gray-600">
              I agree to the{" "}
              <a href="/terms" target="_blank" className="text-red-500 underline">
                terms and conditions
              </a>{" "}
              and{" "}
              <a href="/platform-guidelines" target="_blank" className="text-red-500 underline">
                marketplace guidelines
              </a>.
            </span>
          </label>

          <Button
            type="submit"
            disabled={
              loading ||
              uploadStatus.profile === "uploading" ||
              uploadStatus.govId === "uploading" ||
              !imageUrl || 
              !govIdImgUrl || 
              form.bio.trim().split(/\s+/).length < 30 || 
              form.tagline.trim().split(/\s+/).length < 5 ||
              !form.agreedToTerms || 
              form.phone.length !== 10
            }
            className={`w-full text-base md:text-lg py-3 rounded-2xl font-medium tracking-wide shadow-md transition-all ${
              loading ||
              uploadStatus.profile === "uploading" ||
              uploadStatus.govId === "uploading" ||
              !imageUrl || 
              !govIdImgUrl || 
              form.bio.trim().split(/\s+/).length < 30 ||
              form.tagline.trim().split(/\s+/).length < 5 ||  
              !form.agreedToTerms || 
              form.phone.length !== 10
                ? "bg-gray-400 cursor-not-allowed"
                : "text-white bg-red-500 hover:bg-red-600 font-semibold"
            }`}
          >
            {loading ? "Processing..." : "Join CraftID.in"}
          </Button>

          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}