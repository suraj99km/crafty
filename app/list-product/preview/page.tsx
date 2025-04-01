"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import supabase from '@/lib/supabase-db/supabaseClient';
import { ArrowLeft, Check, AlertCircle, Heart, Share2, ArrowRight, ShoppingCart } from 'lucide-react';
import { getArtistId } from '@/lib/supabase-db/utils';
import { ProductData } from '@/Types';

const PreviewPage = () => {
  const router = useRouter();
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isPreviewMode, setIsPreviewMode] = useState(true);

  useEffect(() => {
    // Retrieve product data from localStorage
    const storedData = localStorage.getItem('productData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setProductData(parsedData);
      } catch (err) {
        console.error('Error parsing product data:', err);
        setError('Unable to load product preview. Please go back and try again.');
      }
    } else {
      setError('No product data found. Please complete the product listing form first.');
    }
  }, []);

  const handleSubmit = async () => {
    if (!productData) return;
    
    setLoading(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login?redirect=/list-product');
        return;
      }
      
      // Get artist ID using the utility function
      const artistId = await getArtistId();
      
      if (!artistId) {
        setError('Artist profile not found. Please complete your artist profile first.');
        setLoading(false);
        return;
      }
      
      // Prepare product data for submission
      const submissionData = {
        ...productData,
        artist_id: artistId,
        created_at: new Date().toISOString(),
        status: 'pending'
      };
      
      // Submit to database
      const { data, error: submitError } = await supabase
        .from('Products')
        .insert(submissionData)
        .select();
      
      if (submitError) {
        throw submitError;
      }
      
      // Clear localStorage after successful submission
      localStorage.removeItem('productData');
      setSuccess(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/profile');
      }, 2000);
      
    } catch (err: any) {
      console.error('Error submitting product:', err);
      setError(err.message || 'Failed to submit product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const scrollToNext = () => {
    if (productData && productData.images) {
      setActiveImageIndex((prevIndex) => 
        prevIndex === productData.images.length + (productData.demoVideo ? 0 : -1) 
          ? 0 
          : prevIndex + 1
      );
    }
  };

  const scrollToPrev = () => {
    if (productData && productData.images) {
      setActiveImageIndex((prevIndex) => 
        prevIndex === 0 
          ? productData.images.length + (productData.demoVideo ? 0 : -1) 
          : prevIndex - 1
      );
    }
  };

  const MediaGallery = () => {
    if (!productData) return null;
    
    const allMedia = [
      ...(productData.images || []),
      ...(productData.demoVideo ? [productData.demoVideo] : [])
    ];

    if (allMedia.length === 0) {
      return (
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center">
          <p className="text-gray-400">No images provided</p>
        </div>
      );
    }

    return (
      <div className="relative">
        <div className="w-full overflow-hidden rounded-xl bg-gray-100">
          <div className="relative aspect-square w-full overflow-hidden">
            {activeImageIndex < (productData.images?.length || 0) ? (
              <img 
                src={allMedia[activeImageIndex]} 
                alt={`${productData.title || 'Product'} image`}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
            ) : (
              <video 
                src={productData.demoVideo || ''} 
                controls
                className="w-full h-full object-cover"
                poster={productData.images?.[0] || ''}
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>
        
        {/* Thumbnail navigation */}
        {allMedia.length > 1 && (
          <div className="mt-4 overflow-x-auto no-scrollbar">
            <div className="flex space-x-2 pb-2">
              {allMedia.map((media, index) => (
                <button 
                  key={index} 
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative shrink-0 rounded-md overflow-hidden w-16 h-16 border-2 ${
                    activeImageIndex === index ? 'border-red-500' : 'border-transparent'
                  }`}
                >
                  {index < (productData.images?.length || 0) ? (
                    <img 
                      src={media} 
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                        <div className="w-0 h-0 border-t-4 border-t-transparent border-l-8 border-l-white border-b-4 border-b-transparent ml-1"></div>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Navigation arrows - only show if there are multiple media items */}
        {allMedia.length > 1 && (
          <>
            <button 
              onClick={scrollToPrev}
              className="absolute left-2 top-1/3 z-10 h-8 w-8 rounded-full bg-white/80 flex items-center justify-center shadow-md hover:bg-white"
              aria-label="Previous image"
            >
              <ArrowLeft size={16} />
            </button>
            <button 
              onClick={scrollToNext}
              className="absolute right-2 top-1/3 z-10 h-8 w-8 rounded-full bg-white/80 flex items-center justify-center shadow-md hover:bg-white"
              aria-label="Next image"
            >
              <ArrowRight size={16} />
            </button>
          </>
        )}
      </div>
    );
  };

  // Format dimensions as a string
  const formatDimensions = (dimensions: ProductData['dimensions']) => {
    if (!dimensions) return 'Dimensions not specified';
    
    const length = dimensions.length !== undefined && dimensions.length !== null ? dimensions.length : 'N/A';
    const width = dimensions.width !== undefined && dimensions.width !== null ? dimensions.width : 'N/A';
    const height = dimensions.height !== undefined && dimensions.height !== null ? dimensions.height : 'N/A';
    
    if (length === 'N/A' && width === 'N/A' && height === 'N/A') {
      return 'Dimensions not specified';
    }
    
    return `${length} × ${width} × ${height} cm`;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <div className="flex items-center justify-center text-red-500 mb-4">
            <AlertCircle size={48} />
          </div>
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-center text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleBack}
            className="w-full py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <div className="flex items-center justify-center text-green-500 mb-4">
            <Check size={48} />
          </div>
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-4">Product Submitted!</h2>
          <p className="text-center text-gray-600 mb-6">Your product has been successfully submitted for review.</p>
        </div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="mt-14 min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={handleBack}
                className="p-2 mr-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                {isPreviewMode ? 'Product Preview' : productData.title || "Untitled Product"}
              </h1>
            </div>
            
            {isPreviewMode && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsPreviewMode(false)}
                  className="text-sm text-red-600 font-medium hover:underline"
                >
                  View as Buyer
                </button>
              </div>
            )}
            
            {!isPreviewMode && (
              <div className="flex items-center space-x-4">
                <button 
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Save to favorites"
                >
                  <Heart size={20} />
                </button>
                <button 
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Share product"
                >
                  <Share2 size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <main className="max-w-4xl mx-auto px-4 py-6 sm:px-6">
        {isPreviewMode && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              This is a preview of how your product will appear to buyers. Review all details before submitting.
            </p>
          </div>
        )}
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="md:flex">
            {/* Left side - Product Gallery */}
            <div className="md:w-1/2 p-4">
              <MediaGallery />
            </div>
            
            {/* Right side - Product Info */}
            <div className="md:w-1/2 p-4 md:border-l border-gray-100">
              {/* Title and pricing */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">{productData.title || "Untitled Product"}</h1>
                <div className="mt-2 flex items-end">
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{productData.isDiscountEnabled && productData.finalSalePrice ? 
                      productData.finalSalePrice : 
                      productData.artistPrice || 0}
                  </p>
                  
                  {productData.isDiscountEnabled && productData.artistPrice && productData.finalSalePrice && (
                    <div className="flex items-center ml-2">
                      <p className="text-sm text-gray-500 line-through mr-2">₹{productData.artistPrice}</p>
                      <p className="text-sm font-medium px-2 py-0.5 bg-red-50 text-red-600 rounded">
                        {Math.round(((productData.artistPrice - productData.finalSalePrice) / productData.artistPrice) * 100)}% off
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Authenticity Badge */}
                <div className="mt-4 flex items-center">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center mr-2">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">CraftID Verified Authentic Indian Craft</p>
                </div>
              </div>
              
              {/* Stock Information */}
              <div className="mt-4 py-4 border-t border-gray-100">
                {productData.madeToOrder ? (
                  <div className="flex items-center text-blue-600">
                    <Check className="w-4 h-4 mr-2" />
                    <p className="text-sm font-medium">Made to Order</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-700">
                    {productData.stockQuantity ? `${productData.stockQuantity} in stock` : 'Stock not specified'}
                  </p>
                )}
                
                {/* Shipping Information */}
                <p className="text-sm text-gray-600 mt-2">
                  Ships from: {productData.shippingAddressId ? 'Artisan location' : 'Not specified'}
                </p>
                
                {productData.prepTime && (
                  <p className="text-sm text-gray-600 mt-2">
                    Preparation time: {productData.prepTime} days
                  </p>
                )}
              </div>
              
              {/* Buy Button */}
              <div className="mt-6 flex gap-2">
                <button className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </button>
                <button className="py-3 px-4 border border-red-500 text-red-600 rounded-full hover:bg-red-50 transition-all duration-300">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
              
              {/* Customization Info */}
              {productData.customizationAvailable && (
                <div className="mt-6 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-blue-800">Customization Available</p>
                      {productData.customizationInstructions && (
                        <p className="text-sm text-blue-700 mt-1">{productData.customizationInstructions}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Product Details Tabs */}
        <div className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Product Details</h2>
            
            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">About this product</h3>
              <p className="text-gray-700 whitespace-pre-line">{productData.description || "No description provided."}</p>
            </div>
            
            {/* Specifications */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Specifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {productData.category && (
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium">{productData.category}</p>
                  </div>
                )}
                
                {productData.material && (
                  <div>
                    <p className="text-sm text-gray-500">Material</p>
                    <p className="font-medium">{productData.material}</p>
                  </div>
                )}
                
                {productData.dimensions && (
                  <div className="col-span-full">
                    <p className="text-sm text-gray-500">Dimensions</p>
                    <p className="font-medium">
                      {formatDimensions(productData.dimensions)}
                      {productData.dimensions.weight !== undefined && productData.dimensions.weight !== null && 
                        ` • Weight: ${productData.dimensions.weight} kg`}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Care Instructions */}
            {productData.careInstructions && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Care Instructions</h3>
                <p className="text-gray-700">{productData.careInstructions}</p>
              </div>
            )}
            
            {/* Assembly */}
            {productData.requiresAssembly && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Assembly Information</h3>
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 mr-2" />
                  <div>
                    <p className="font-medium">Assembly Required</p>
                    {productData.assemblyInstructions && (
                      <p className="text-sm text-gray-600 mt-1">{productData.assemblyInstructions}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Return Policy */}
            {productData.returnPolicy && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Return Policy</h3>
                <p className="text-gray-700">{productData.returnPolicy}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Submit Button (only in preview mode) */}
        {isPreviewMode && (
          <div className="mt-8 mb-16 bg-white rounded-xl shadow-sm overflow-hidden p-6">
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-500 mb-4 text-center max-w-md">
                By submitting, you confirm that all details are correct and comply with our guidelines.
              </p>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit Product"}
                {!loading && <Check className="w-5 h-5 ml-2" />}
              </button>
              <button
                onClick={handleBack}
                className="mt-3 px-8 py-2 text-gray-600 hover:text-red-600 hover:underline transition-all duration-300"
              >
                Go Back to Edit
              </button>
            </div>
          </div>
        )}
        
        {/* Floating bottom bar for mobile - Buy Now (in buyer view) */}
        {!isPreviewMode && (
          <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4 sm:hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-bold text-gray-900">
                  ₹{productData.isDiscountEnabled && productData.finalSalePrice ? 
                    productData.finalSalePrice : 
                    productData.artistPrice || 0}
                </p>
                {productData.isDiscountEnabled && productData.artistPrice && productData.finalSalePrice && (
                  <p className="text-xs text-green-600">
                    {Math.round(((productData.artistPrice - productData.finalSalePrice) / productData.artistPrice) * 100)}% off
                  </p>
                )}
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PreviewPage;