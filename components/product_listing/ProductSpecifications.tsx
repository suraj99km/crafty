import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Types
type Dimension = "length" | "width" | "height" | "weight" | "prepTime";
type ErrorRecord = Partial<Record<Dimension | "material" | "customMaterial", string>>;

interface DimensionSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  unit: string;
  required?: boolean;
}

interface ProductSpecificationsProps {
  product: {
    dimensions?: {
      length?: number;
      width?: number;
      height?: number;
      weight?: number;
    };
    prepTime?: number;
    material?: string;
    customMaterial?: string;
  };
  updateProduct: (field: string, value: any) => void;
}

// Material categories that align with the product categories
const materialCategories = [
  "Wood", 
  "Canvas", 
  "Paper", 
  "Metal", 
  "Stone", 
  "Clay", 
  "Fabric", 
  "Glass",
  "Leather",
  "Ceramic",
  "Mixed Media",
  "Other"
];

// DimensionSlider Component
const DimensionSlider = ({ 
  label, value, onChange, min, max, unit, required = false 
}: DimensionSliderProps) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <Label className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <span className="text-sm font-medium text-gray-800">
        {value} {unit}
      </span>
    </div>
    <Slider
      value={[value]}
      onValueChange={(values) => onChange(values[0])}
      min={min}
      max={max}
      step={1}
      className="py-2 w-full h-2 bg-red-400 rounded-lg relative"
    />
    <div className="flex justify-between text-xs text-gray-500">
      <span>{min} {unit}</span>
      <span>{max} {unit}</span>
    </div>
  </div>
);

// Main Component
const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({ product, updateProduct }) => {
  const [dimensions, setDimensions] = useState({
    length: product?.dimensions?.length || 50,
    width: product?.dimensions?.width || 50,
    height: product?.dimensions?.height || 50,
    weight: product?.dimensions?.weight || 1000,
    prepTime: product?.prepTime || 1
  });
  const [material, setMaterial] = useState(product?.material || "");
  const [customMaterial, setCustomMaterial] = useState(product?.customMaterial || "");
  const [errors, setErrors] = useState<ErrorRecord>({});

  // Validate on changes
  useEffect(() => {
    validateInputs();
  }, [dimensions, material, customMaterial]);

  const validateInputs = () => {
    const newErrors: ErrorRecord = {};
    
    // Validate dimensions
    Object.entries(dimensions).forEach(([key, value]) => {
      if (value <= 0 && key !== "prepTime") {
        newErrors[key as Dimension] = `${key.charAt(0).toUpperCase() + key.slice(1)} must be greater than zero`;
      }
    });
    
    // Material is required
    if (!material) {
      newErrors.material = "Please select a material";
    }
    
    // Validate custom material if "Other" is selected
    if (material === "Other" && (!customMaterial || customMaterial.trim() === "")) {
      newErrors.customMaterial = "Please specify material";
    }
    
    // Check if custom material is more than 2 words
    if (customMaterial && customMaterial.trim().split(/\s+/).length > 2) {
      newErrors.customMaterial = "Maximum 2 words allowed";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDimensionChange = (field: Dimension) => (newValue: number) => {
    setDimensions(prev => ({ ...prev, [field]: newValue }));
    
    if (newValue > 0) {
      if (field === "prepTime") {
        updateProduct(field, newValue);
      } else {
        updateProduct("dimensions", {
          ...(product?.dimensions || {}),
          [field]: newValue
        });
      }
    }
  };

  const handleMaterialChange = (value: string) => {
    setMaterial(value);
    updateProduct("material", value);
    
    // Clear custom material if not "Other"
    if (value !== "Other") {
      setCustomMaterial("");
      updateProduct("customMaterial", "");
    }
  };

  const handleCustomMaterialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomMaterial(value);
    updateProduct("customMaterial", value);
  };

  return (
    <motion.div
      className="flex justify-center items-center w-full p-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-3xl shadow-lg rounded-2xl border border-gray-200 bg-white">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-center space-x-3 border-b pb-3">
            {/* <span className="rounded-full h-8 w-8 flex items-center justify-center bg-red-500 text-white text-lg font-bold">2</span> */}
            <h2 className="text-xl font-semibold text-white bg-red-500 rounded-lg px-4 py-1">Product Specifications</h2>
          </div>
          
          {/* {Object.keys(errors).length > 0 && ( true
            // <Alert className="bg-red-50 border border-red-200 text-red-800">
            //   <AlertCircle className="h-4 w-4 text-red-500" />
            //   <AlertDescription>
            //     Please correct the highlighted fields before proceeding.
            //   </AlertDescription>
            // </Alert>
          )} */}
          
          <div className="space-y-6">
            {/* Dimension Sliders */}
            {[
              { key: "length", label: "Length", max: 200, unit: "cm" },
              { key: "width", label: "Width", max: 200, unit: "cm" },
              { key: "height", label: "Height", max: 200, unit: "cm" },
              { key: "weight", label: "Weight", max: 5000, unit: "gm" },
              { key: "prepTime", label: "Preparation Time", max: 14, unit: "day(s)" }
            ].map(({ key, label, max, unit }) => (
              <React.Fragment key={key}>
                <DimensionSlider
                  label={label}
                  value={dimensions[key as Dimension]}
                  onChange={handleDimensionChange(key as Dimension)}
                  min={1}
                  max={max}
                  unit={unit}
                  required={true}
                />
                {errors[key as Dimension] && 
                  <p className="text-red-500 text-xs mt-1">{errors[key as Dimension]}</p>
                }
              </React.Fragment>
            ))}
            
            {/* Material Dropdown */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Material <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={material} 
                onValueChange={handleMaterialChange}
              >
                <SelectTrigger className={`w-full focus:ring-red-500 focus:border-red-500 ${errors.material ? "border-red-500 ring-1 ring-red-500" : ""}`}>
                  <SelectValue placeholder="Select Material" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {materialCategories.map(option => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.material && <p className="text-red-500 text-xs mt-1">{errors.material}</p>}
              
              {/* Custom Material Input (shows only when "Other" is selected) */}
              {material === "Other" && (
                <div className="mt-3">
                  <Label className="text-sm font-medium">
                    Specify Material <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    value={customMaterial} 
                    onChange={handleCustomMaterialChange}
                    placeholder="Enter custom material"
                    className={`mt-2 ${errors.customMaterial ? "border-red-500 ring-1 ring-red-500" : ""}`}
                  />
                  {errors.customMaterial && <p className="text-red-500 text-xs mt-1">{errors.customMaterial}</p>}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductSpecifications;