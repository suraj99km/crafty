"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FileUploadProps {
  label: string;
  field: string;
  onUpload: (url: string) => void;
  acceptedFormats?: string;
  description?: string;
  required?: boolean;
}

export default function FileUpload({ label, field, onUpload, acceptedFormats = "image/*", description, required }: FileUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Dummy upload process (Replace with actual Supabase or other upload logic)
    const fileUrl = URL.createObjectURL(file); // Simulate a file upload
    onUpload(fileUrl);
    setFileName(file.name);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label} {required && <span className="text-red-500">*</span>}</label>
      <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-3 py-2">
        <Upload className="w-5 h-5 text-gray-500" />
        <Input type="file" accept={acceptedFormats} className="hidden" id={field} onChange={handleFileChange} />
        <label htmlFor={field} className="cursor-pointer flex-1 text-gray-500">
          {fileName || "Choose a file"}
        </label>
      </div>
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
  );
}
