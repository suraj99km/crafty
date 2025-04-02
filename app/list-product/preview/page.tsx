"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import supabase from '@/lib/supabase-db/supabaseClient';
import { ArrowLeft, Check, AlertCircle, Heart, Share2, ArrowRight, ShoppingCart, MapPin, Phone, Mail } from 'lucide-react';
import { getArtistId } from '@/lib/supabase-db/utils';
import { ProductData, Address } from '@/Types';
import MediaGallery from '@/components/product_listing/Preview/MediaGallery';

const PreviewPage = () => {
  const router = useRouter();
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isPreviewMode, setIsPreviewMode] = useState(true);
  const [addressDetails, setAddressDetails] = useState<Address | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

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

  // Separate useEffect for fetching address and payment details
  useEffect(() => {
    if (!productData) return;
    
    const fetchSensitiveInfo = async () => {
      try {
        // Fetch shipping address if ID exists
        if (productData.shippingAddressId) {
          const { data: addressData, error: addressError } = await supabase
            .from("user_information")
            .select("*")
            .eq("id", productData.shippingAddressId)
            .single();
          
          if (addressError) throw addressError;
          setAddressDetails(addressData);
        }
        
        // Fetch payment method if ID exists
        if (productData.paymentMethodId) {
          const { data: paymentData, error: paymentError } = await supabase
            .from("artist_paymentmethods")
            .select("*")
            .eq("id", productData.paymentMethodId)
            .single();
          
          if (paymentError) throw paymentError;
          setPaymentDetails(paymentData);
        }
      } catch (err) {
        console.error("Error fetching sensitive information:", err);
      }
    };
    
    fetchSensitiveInfo();
  }, [productData]);

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

  const newLocal = <div className="sticky top-0 z-10 bg-white shadow-sm">
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="h-16 flex items-center justify-center">
        <div className="absolute left-4">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-red-500 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
        </div>
        <div className="flex items-center justify-center">
          <h2 className="text-xl font-bold text-white bg-red-500 rounded-lg px-4 py-1">
            Product Preview
          </h2>
        </div>
      </div>
    </div>
  </div>;

  
  return (
    <div className="mt-14 min-h-screen bg-gray-50">
      {newLocal}

      <main className="max-w-4xl mx-auto px-4 py-6 sm:px-6">
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h3 className="font-semibold text-amber-800 mb-1">Artist Review Mode</h3>
          <p className="text-sm text-amber-800">
            Please review all your product details carefully before submitting. This is how your product information will be stored in our system.
          </p>
        </div>
        
        {/* Product Preview Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="border-b border-gray-100 p-4">
            <h2 className="text-lg font-semibold text-gray-900">Product Preview</h2>
            <p className="text-sm text-gray-500">This section shows how your product will appear to buyers</p>
          </div>
          
          <div className="md:flex">
            <div className="md:w-1/2 p-4">
              {/* Pass the productData to the MediaGallery component */}
              {productData && <MediaGallery productData={productData} />}
            </div>
            {/* ... rest of the preview section ... */}
          </div>
        </div>

        {/* Artist's Product Details Review */}
        <div className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 p-4">
              <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Product Title</label>
                  <p className="mt-1 text-gray-900">{productData.title || "Not specified"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Category</label>
                  <p className="mt-1 text-gray-900">{productData.category || "Not specified"}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500">Description</label>
                  <p className="mt-1 text-gray-900 whitespace-pre-line">{productData.description || "Not specified"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Details */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 p-4">
              <h2 className="text-lg font-semibold text-gray-900">Pricing Information</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Customer Price</label>
                  <p className="mt-1 text-gray-900">₹{productData.platformPrice || "Not set"}</p>
                </div>
                {productData.isDiscountEnabled && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Sale Price</label>
                      <p className="mt-1 text-gray-900">₹{productData.finalSalePrice || "Not set"}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Discount</label>
                      <p className="mt-1 text-red-600 font-medium">
                        {productData.platformPrice && productData.finalSalePrice ? 
                          Math.round(((productData.platformPrice - productData.finalSalePrice) / productData.platformPrice) * 100) : 0}% off
                      </p>
                    </div>
                  </>
                )}
                
                {/* Artist Earnings Section */}
                <div className="md:col-span-2 mt-4 bg-green-50 p-4 rounded-lg border border-green-100">
                  <h3 className="text-md font-semibold text-green-800 mb-2">Your Earnings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Base Earnings</label>
                      <p className="mt-1 text-green-700 font-medium">₹{productData.artistPrice || "Not set"}</p>
                    </div>
                    {productData.isDiscountEnabled && (
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Earnings During Sale</label>
                        <p className="mt-1 text-green-700 font-medium">
                          ₹{productData.artistSalePrice || "Not set"}
                        </p>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-3">
                    This is the amount you'll receive after the sale of the product.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Specifications */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 p-4">
              <h2 className="text-lg font-semibold text-gray-900">Product Specifications</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Material</label>
                  <p className="mt-1 text-gray-900">{productData.material || "Not specified"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Dimensions</label>
                  <p className="mt-1 text-gray-900">{formatDimensions(productData.dimensions)}</p>
                </div>
                {productData.dimensions?.weight && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Weight</label>
                    <p className="mt-1 text-gray-900">{productData.dimensions.weight} grams</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Inventory & Shipping */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 p-4">
              <h2 className="text-lg font-semibold text-gray-900">Inventory & Shipping</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Stock Type</label>
                  <p className="mt-1 text-gray-900">{productData.madeToOrder ? "Made to Order" : "Ready Stock"}</p>
                </div>
                {!productData.madeToOrder && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Stock Quantity</label>
                    <p className="mt-1 text-gray-900">{productData.stockQuantity || "Not specified"} units</p>
                  </div>
                )}
                {productData.prepTime && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Preparation Time</label>
                    <p className="mt-1 text-gray-900">{productData.prepTime} days</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 p-4">
              <h2 className="text-lg font-semibold text-gray-900">Additional Information</h2>
            </div>
            <div className="p-6 space-y-6">
              {productData.customizationAvailable && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Customization Instructions</label>
                  <p className="mt-1 text-gray-900">{productData.customizationInstructions || "Not provided"}</p>
                </div>
              )}
              {productData.requiresAssembly && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Assembly Instructions</label>
                  <p className="mt-1 text-gray-900">{productData.assemblyInstructions || "Not provided"}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-500">Care Instructions</label>
                <p className="mt-1 text-gray-900">{productData.careInstructions || "Not provided"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Return Policy</label>
                <p className="mt-1 text-gray-900">{productData.returnPolicy || "Not provided"}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 p-4">
              <h2 className="text-lg font-semibold text-gray-900">Shipping From</h2>
            </div>
            <div className="p-6">
              {addressDetails ? (
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">
                      {addressDetails.first_name} {addressDetails.last_name}
                    </h3>
                    {addressDetails.phone && (
                      <div className="flex items-center text-gray-500 text-sm">
                        <Phone className="h-4 w-4 mr-1" />
                        {addressDetails.phone}
                      </div>
                    )}
                  </div>

                  <p className="text-gray-600 mt-3 flex items-start">
                    <MapPin className="h-5 w-5 mr-2 text-red-500 flex-shrink-0" />
                    <span>
                      {addressDetails.address_line1}, 
                      {addressDetails.address_line2 && ` ${addressDetails.address_line2}, `}
                      {addressDetails.landmark && `near ${addressDetails.landmark}, `}
                      {addressDetails.city}, {addressDetails.state} - {addressDetails.pincode}
                    </span>
                  </p>

                  {addressDetails.email && (
                    <div className="flex items-center text-gray-500 text-sm mt-3">
                      <Mail className="h-4 w-4 mr-1" />
                      {addressDetails.email}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-red-500">No shipping address selected</p>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 p-4">
              <h2 className="text-lg font-semibold text-gray-900">Payment Details</h2>
            </div>
            <div className="p-6">
              {paymentDetails ? (
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <div className="flex justify-between items-center font-semibold">
                    <span>{paymentDetails.payment_method}</span>
                  </div>
                  <div className="text-gray-600 mt-2">
                    {paymentDetails.payment_method === "BANK" ? (
                      <>
                        <p className="mb-1">Account Holder: {paymentDetails.details?.accountHolder || paymentDetails.account_holder_name}</p>
                        <p className="mb-1">
                          Account No: {paymentDetails.details?.bankAccount 
                            ? `XXXX XXXX ${paymentDetails.details.bankAccount.slice(-4)}` 
                            : paymentDetails.account_number 
                              ? `XXXX XXXX ${paymentDetails.account_number.slice(-4)}`
                              : 'Not provided'}
                        </p>
                        <p className="mb-1">IFSC: {paymentDetails.details?.ifsc || paymentDetails.ifsc_code || 'Not provided'}</p>
                        <p>Bank: {paymentDetails.bank_name || 'Not provided'}</p>
                      </>
                    ) : (
                      <p>UPI ID: {paymentDetails.details?.upiId || paymentDetails.upi_id || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-red-500">No payment method selected</p>
              )}
            </div>
          </div>

          {/* Submit Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mt-8">
            <div className="p-6">
              <div className="flex flex-col items-center">
                <div className="mb-6 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Submit?</h3>
                  <p className="text-sm text-gray-500 max-w-md">
                    Please ensure all details are correct. Once submitted, your product will be reviewed by our team.
                  </p>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full max-w-md px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? "Submitting..." : "Submit Product for Review"}
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default PreviewPage;