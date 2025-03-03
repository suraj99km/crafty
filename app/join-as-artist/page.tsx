"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase-db/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Upload, Instagram, Link, Share2 } from "lucide-react";
import PhoneAuth from "@/components/auth/PhoneAuth";
import { uploadImage } from "@/lib/supabase-storage/uploadImage";


export default function JoinArtistForm() {
  const router = useRouter();
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null); // Profile Picture
  const [govIdImgUrl, setGovIdImgUrl] = useState<string | null>(null); // Gov ID
  
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ id: string; firstName: string; lastName: string; email: string } | null>(null);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [form, setForm] = useState({
    name: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    bio: "",
    portfolio: "",
    instagram: "",
    other_social: "",
    profile_image: "",
    gov_id: "",
    agreedToTerms: false,
    // user_id: user?.id,
  });

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

  const handleUpload = async (file: File, folderName: string) => {
    if (!file || !user?.email) return;
  
    setLoading(true);
    
    // Set preview URL before upload
    const localPreviewUrl = URL.createObjectURL(file);
    if (folderName === "artists") {
      setImageUrl(localPreviewUrl);
    } else if (folderName === "gov_id") {
      setGovIdImgUrl(localPreviewUrl);
    }
  
    const emailFolder = `${folderName}/${user.email.replace(/[@.]/g, "_")}`;
  
    // Upload file to Supabase storage
    const uploadedUrl = await uploadImage(file, emailFolder);
    
    console.log("Uploaded URL:", uploadedUrl);
  
    if (uploadedUrl && uploadedUrl.startsWith("https")) { 
      setForm((prevForm) => ({
        ...prevForm,
        profile_image: folderName === "artists" ? uploadedUrl : prevForm.profile_image,
        gov_id: folderName === "gov_id" ? uploadedUrl : prevForm.gov_id,
      }));
  
      if (folderName === "artists") {
        setImageUrl(uploadedUrl); // Ensure public URL is used
      } else if (folderName === "gov_id") {
        setGovIdImgUrl(uploadedUrl);
      }
    } else {
      console.error("Invalid upload URL:", uploadedUrl);
    }
  
    setLoading(false);
  };
  
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior
  
    // Ensure all required fields are filled before submitting
    if (!imageUrl || !form.gov_id || form.bio.trim().split(/\s+/).length < 30 || !form.agreedToTerms) {
      alert("Please make sure all fields are filled correctly.");
      return;
    }
  
    setLoading(true);
  
    try {
      // Insert data into the 'Artists' table
      const { data, error } = await supabase
        .from("Artists")
        .insert([
          {
            name: `${form.first_name} ${form.last_name}`,
            phone: form.phone,
            email_address: form.email,
            bio: form.bio,
            profile_picture: imageUrl,
            created_at: new Date(),
            updated_at: new Date(),
            last_name: form.last_name,
            first_name: form.first_name,
            portfolio: form.portfolio,
            instagram: form.instagram,
            other_social: form.other_social,
            gov_id: form.gov_id,
            agreedtoterms: form.agreedToTerms,
            // user_id: form.user_id, // Make sure you're passing the user ID from the form state
          },
        ]);
  
      if (error) {
        throw new Error(error.message);
      }
  
      // Handle successful insertion (e.g., show success message, or redirect)
      console.log("Data inserted successfully:", data);
      alert("Your application has been submitted successfully!");
      router.push("/success"); // Optional: Redirect to another page after submission
  
    } catch (error: unknown) {
      setLoading(false);
      if (error instanceof Error) {
        console.error("Error inserting data:", error.message);
        alert("There was an error while submitting your application. Please try again.");
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
          <form onSubmit={handleSubmit} className=" mt-4 space-y-5">

          {/* Profile Image Upload Section */}
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

  {/* Right Side: Profile Image Upload */}
  <div className="flex flex-col items-center gap-2">
    <label className="relative cursor-pointer group">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setImage(file);
            handleUpload(file, "artists"); // Upload immediately
          }
        }}
      />

      {/* Image Preview or Upload Button */}
      {imageUrl ? (
        <div className="relative">
          <img
            src={imageUrl}
            alt="Profile Preview"
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-lg border-2 border-gray-300 transition-all"
          />
        </div>
      ) : (
        <div className="w-24 h-24 md:w-28 md:h-28 bg-gray-100 border-2 border-gray-300 rounded-full flex flex-col items-center justify-center text-gray-500 text-xs font-medium tracking-wide">
          <Upload size={20} className="text-gray-500 mb-1" />
          Upload Image
        </div>
      )}
    </label>
  </div>
</div>

          
  {/* Auto-Filled Name & Email */}
  <div className="grid grid-cols-2 gap-4">
    <Input name="first_name" value={form.first_name} readOnly className="rounded-xl bg-gray-100 text-gray-500" />
    <Input name="last_name" value={form.last_name} readOnly className="rounded-xl bg-gray-100 text-gray-500" />
  </div>
  <Input name="email" type="email" value={form.email} readOnly className="rounded-xl bg-gray-100 text-gray-500" />

            {/* <PhoneAuth 
              onVerified={(status: boolean) => {
                setIsPhoneVerified(status);
                if (status) {
                  setForm((prev) => ({ ...prev, phone: "verified-phone-number" })); // Replace with actual phone number
                }
              }} 
            />  */}

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
</div>


{/* Government ID Upload */}
<div className="space-y-2">
  <label className="text-gray-700 font-medium">Upload Government ID *</label>
  <p className="text-sm text-gray-500">Accepted: Aadhar Card, PAN Card, Driver's License (JPG, PNG)</p>

  <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition">
    {govIdImgUrl ? (
      <div className="relative">
        <img src={govIdImgUrl} alt="Uploaded Gov ID" className="w-64 h-32 object-cover rounded-lg" />
      </div>
    ) : (
      <>
        <Upload size={22} className="text-gray-500 mb-2" />
        <span className="text-gray-600 text-sm">Click to Upload or Drag & Drop</span>
      </>
    )}
    <input
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) handleUpload(file, "gov_id");
      }}
    />
  </label>
</div>




{/* Short Bio (Minimum 30 Words, Maximum 100 Words) */}
<div className="relative">
  <Textarea
    name="bio"
    placeholder="Tell us about your art journey..."
    value={form.bio}
    onChange={(e) => {
      const words = e.target.value.trim().split(/\s+/);
      if (words.length <= 100) {
        handleChange(e);
      }
    }}
    required
    className="rounded-xl h-40 text-md pb-10" // Added padding at the bottom to make space for counter
  />
  {/* Word Counter */}
  {form.bio.trim().split(/\s+/).length >= 5 && (
    <div className={`text-xs text-right ${form.bio.trim().split(/\s+/).length < 50 ? "text-red-500" : "text-gray-600"}`}>
      {form.bio.trim().split(/\s+/).length} / 100 words
    </div>
  )}
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
    !imageUrl || // Check if profile image URL is available
    !govIdImgUrl|| // Check if government ID image URL is available
    form.bio.trim().split(/\s+/).length < 30 || // Check if bio has at least 50 words
    !form.agreedToTerms || // Check if user has agreed to terms
    form.phone.length !== 10 // Check if phone number is exactly 10 digits
  }
  className={`w-full text-base md:text-lg py-3 rounded-2xl font-medium tracking-wide shadow-md transition-all ${
    !imageUrl || 
    !govIdImgUrl || 
    form.bio.trim().split(/\s+/).length < 30 || 
    !form.agreedToTerms || 
    form.phone.length !== 10
      ? "bg-gray-400 cursor-not-allowed"
      : "text-white bg-red-500 hover:bg-red-600 font-semibold"
  }`}
>
  Join CraftID.in
</Button>





          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
