"use client";
// Add proper type imports
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import supabase from '@/lib/supabase-db/supabaseClient';
import { 
  ArrowLeft, Check, AlertCircle, Heart, Share2, ArrowRight, 
  ShoppingCart, CircleCheckBig, MapPin, Phone, Mail,
  ChevronDown, ChevronUp, Camera, Package, Truck, Info, IndianRupee 
} from 'lucide-react';
import { getArtistId } from '@/lib/supabase-db/utils';
import { Product, Address } from '@/Types';
import MediaGallery from '@/components/product_listing/Preview/MediaGallery';

// Fix the AccordionSection component props type
type AccordionSectionProps = {
  title: string;
  icon?: React.ReactNode;
  id: string;
  children: React.ReactNode;
  isOpen: boolean;
  toggleFn: (id: string) => void;
  hasBadge?: boolean;
  badgeText?: string;
};

const PreviewPage = () => {
  const router = useRouter();
  const [productData, setProductData] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [addressDetails, setAddressDetails] = useState<Address | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  // Add missing state for sale preview toggle
  const [showSalePreview, setShowSalePreview] = useState(false);
  
  // Add a helper function to format prices with two decimal places
  const formatPrice = (price: number | undefined | null): string => {
    if (price === undefined || price === null) return "Not set";
    return price.toFixed(2);
  };
  
  // State for accordion sections
  const [openSections, setOpenSections] = useState({
    basicInfo: true,
    pricing: false,
    specifications: false,
    inventory: false,
    additional: false,
    shipping: false,
    payment: false
  });

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
        if (productData.shipping_address_id) {
          const { data: addressData, error: addressError } = await supabase
            .from("user_information")
            .select("*")
            .eq("id", productData.shipping_address_id)
            .single();
          
          if (addressError) throw addressError;
          setAddressDetails(addressData);
        }
        
        // Fetch payment method if ID exists
        if (productData.payment_method_id) {
          const { data: paymentData, error: paymentError } = await supabase
            .from("artist_paymentmethods")
            .select("*")
            .eq("id", productData.payment_method_id)
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
      
      // Format all price fields to have maximum two decimal places
      const formattedPriceData = {
        ...productData,
        platform_price: productData.platform_price ? parseFloat(parseFloat(productData.platform_price.toString()).toFixed(2)) : null,
        artist_price: productData.artist_price ? parseFloat(parseFloat(productData.artist_price.toString()).toFixed(2)) : null,
        final_sale_price: productData.final_sale_price ? parseFloat(parseFloat(productData.final_sale_price.toString()).toFixed(2)) : null,
        artist_sale_price: productData.artist_sale_price ? parseFloat(parseFloat(productData.artist_sale_price.toString()).toFixed(2)) : null,
      };
      
      // Prepare product data for submission with formatted prices
      const submissionData = {
        ...formattedPriceData,
        artist_id: artistId,
        created_at: new Date().toISOString(),
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

  // Add type definition for section names
  type SectionName = 'basicInfo' | 'pricing' | 'specifications' | 'inventory' | 'additional' | 'shipping' | 'payment';
  
  // Add type definition for AccordionSection props
  type AccordionSectionProps = {
    title: string;
    icon?: React.ReactNode;
    id: SectionName;
    children: React.ReactNode;
    isOpen: boolean;
    toggleFn: (id: SectionName) => void;
    hasBadge?: boolean;
    badgeText?: string;
  };
  
  // Update the toggleSection function to use the correct type
  const toggleSection = (section: SectionName) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Format dimensions as a string
  const formatDimensions = (dimensions: Product['dimensions']) => {
    if (!dimensions) return 'Dimensions not specified';
    
    const length = dimensions.length !== undefined && dimensions.length !== null ? dimensions.length : 'N/A';
    const width = dimensions.width !== undefined && dimensions.width !== null ? dimensions.width : 'N/A';
    const height = dimensions.height !== undefined && dimensions.height !== null ? dimensions.height : 'N/A';
    
    if (length === 'N/A' && width === 'N/A' && height === 'N/A') {
      return 'Dimensions not specified';
    }
    
    return `${length} × ${width} × ${height} cm`;
  };

  // Generic section component for accordion with proper type annotations
  const AccordionSection: React.FC<AccordionSectionProps> = ({ 
    title, 
    icon, 
    id, 
    children, 
    isOpen, 
    toggleFn,
    hasBadge = false,
    badgeText = ''
  }) => {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-3">
        <button 
          onClick={() => toggleFn(id)}
          className="w-full border-b border-gray-100 p-4 flex items-center justify-between"
        >
          <div className="flex items-center">
            {icon && <span className="text-red-500 mr-3">{icon}</span>}
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            {hasBadge && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">
                {badgeText}
              </span>
            )}
          </div>
          {isOpen ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
        </button>
        
        {isOpen && (
          <div className="p-4 animate-fadeIn">
            {children}
          </div>
        )}
      </div>
    );
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
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-md w-full bg-white p-8 rounded-lg shadow-md"
        >
          <div className="flex items-center justify-center text-green-500 mb-4">
            <Check size={48} />
          </div>
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-4">Product Submitted!</h2>
          <p className="text-center text-gray-600 mb-6">Your product has been successfully submitted for review.</p>
        </motion.div>
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
    <div className="mt-16 min-h-screen bg-gray-100">
      {/* Fixed header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-red-500 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={20} className="mr-1" />
              <span className="text-sm">Edit</span>
            </button>
            <h2 className="text-xl font-bold text-white bg-red-500 rounded-lg px-4 py-1">
              Product Preview
            </h2>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="text-sm font-medium text-red-600 hover:text-red-800"
            >
              {loading ? "..." : "Submit"}
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-xl mx-auto px-4 py-4">
        {/* Quick summary box */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
          <div className="p-4 flex items-center space-x-4">
            <div className="w-24 h-24 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
              {productData.images && productData.images.length > 0 && (
                <img 
                  src={productData.images[0]} 
                  alt={productData.title} 
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-gray-900 truncate">{productData.title}</h1>
              <p className="text-sm text-gray-500 mb-1">{productData.category}</p>
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="text-lg font-bold text-red-600">
                    ₹{formatPrice(productData.is_discount_enabled && showSalePreview ? 
                      productData.final_sale_price : productData.platform_price)}
                  </span>
                  {productData.is_discount_enabled && showSalePreview && productData.final_sale_price && productData.platform_price && (
                    <span className="ml-2 text-sm text-gray-500 line-through">
                      ₹{formatPrice(productData.platform_price)}
                    </span>
                  )}
                </div>
                {productData.is_discount_enabled && showSalePreview && productData.final_sale_price && productData.platform_price && (
                  <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded w-fit mt-1">
                    {Math.round(((productData.platform_price - productData.final_sale_price) / productData.platform_price) * 100)}% OFF
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Artist earnings banner */}
          <div className="bg-gradient-to-r from-red-50 to-red-100 p-3 border-t border-red-200">
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-red-700 font-medium">Your Earnings</p>
                {productData.is_discount_enabled && (
                  <div className="flex items-center">
                    <span className="text-xs text-gray-600 mr-2">Sale Preview:</span>
                    <button 
                      onClick={() => setShowSalePreview(prev => !prev)}
                      className={`relative inline-flex h-5 w-10 items-center rounded-full ${showSalePreview ? 'bg-red-500' : 'bg-gray-300'}`}
                    >
                      <span className="sr-only">Toggle sale preview</span>
                      <span 
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${showSalePreview ? 'translate-x-5' : 'translate-x-1'}`} 
                      />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  {productData.is_discount_enabled ? (
                    <p className="font-bold text-red-800">
                      ₹{formatPrice(showSalePreview ? productData.artist_sale_price : productData.artist_price)}
                      <span className="text-xs font-normal ml-1">
                        {showSalePreview ? '(sale)' : '(regular)'}
                      </span>
                    </p>
                  ) : (
                    <p className="font-bold text-red-800">
                      ₹{formatPrice(productData.artist_price)}
                    </p>
                  )}
                </div>
                <div className="text-xs text-red-700 text-right">
                  {productData.made_to_order ? "Made to Order" : `${productData.stock_quantity || 0} in stock`}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Artist review mode banner */}
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <span className="font-semibold">Review Mode:</span> Verify all details before submitting.
          </p>
        </div>

        {/* Collapsible sections */}
        <AccordionSection 
          title="Basic Information" 
          icon={<Info size={18} />}
          id="basicInfo" 
          isOpen={openSections.basicInfo} 
          toggleFn={toggleSection}
        >
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500">Product Title</label>
              <p className="text-gray-900">{productData.title || "Not specified"}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500">Category</label>
              <p className="text-gray-900">{productData.category || "Not specified"}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500">Description</label>
              <p className="text-gray-900 text-sm whitespace-pre-line">{productData.description || "Not specified"}</p>
            </div>
          </div>
        </AccordionSection>

        <AccordionSection 
          title="Pricing Information" 
          icon={<ShoppingCart size={18} />}
          id="pricing" 
          isOpen={openSections.pricing} 
          toggleFn={toggleSection}
          hasBadge={productData.is_discount_enabled}
          badgeText="Sale"
        >
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-500">Customer Price</label>
                <p className="text-gray-900">₹{formatPrice(productData.platform_price)}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500">Your Earnings</label>
                <p className="text-green-700 font-medium">₹{formatPrice(productData.artist_price)}</p>
              </div>
            </div>
            
            {productData.is_discount_enabled && (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-dashed border-gray-200">
                <div>
                  <label className="block text-xs font-medium text-gray-500">Sale Price</label>
                  <p className="text-red-600">₹{formatPrice(productData.final_sale_price)}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500">Sale Earnings</label>
                  <p className="text-green-700 font-medium">₹{formatPrice(productData.artist_sale_price)}</p>
                </div>
              </div>
            )}
          </div>
        </AccordionSection>

        <AccordionSection 
          title="Product Specifications" 
          icon={<Package size={18} />}
          id="specifications" 
          isOpen={openSections.specifications} 
          toggleFn={toggleSection}
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500">Material</label>
              <p className="text-gray-900">{productData.material || "Not specified"}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500">Dimensions</label>
              <p className="text-gray-900">{formatDimensions(productData.dimensions)}</p>
            </div>
            {productData.dimensions?.weight && (
              <div>
                <label className="block text-xs font-medium text-gray-500">Weight</label>
                <p className="text-gray-900">{productData.dimensions.weight} grams</p>
              </div>
            )}
          </div>
        </AccordionSection>

        <AccordionSection 
          title="Inventory & Shipping" 
          icon={<Truck size={18} />}
          id="inventory" 
          isOpen={openSections.inventory} 
          toggleFn={toggleSection}
        >
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500">Stock Type</label>
                <p className="text-gray-900">{productData.made_to_order ? "Made to Order" : "Ready Stock"}</p>
              </div>
              {!productData.made_to_order && (
                <div>
                  <label className="block text-xs font-medium text-gray-500">Stock Quantity</label>
                  <p className="text-gray-900">{productData.stock_quantity || "0"} units</p>
                </div>
              )}
              {productData.prep_time && (
                <div>
                  <label className="block text-xs font-medium text-gray-500">Preparation Time</label>
                  <p className="text-gray-900">{productData.prep_time} days</p>
                </div>
              )}
            </div>
          </div>
        </AccordionSection>

        <AccordionSection 
          title="Additional Information" 
          icon={<Info size={18} />}
          id="additional" 
          isOpen={openSections.additional} 
          toggleFn={toggleSection}
        >
          <div className="space-y-3">
            {productData.customization_available && (
              <div>
                <label className="block text-xs font-medium text-gray-500">Customization Instructions</label>
                <p className="text-sm text-gray-900">{productData.customization_instructions || "Not provided"}</p>
              </div>
            )}
            {productData.requires_assembly && (
              <div>
                <label className="block text-xs font-medium text-gray-500">Assembly Instructions</label>
                <p className="text-sm text-gray-900">{productData.assembly_instructions || "Not provided"}</p>
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-gray-500">Care Instructions</label>
              <p className="text-sm text-gray-900">{productData.care_instructions || "Not provided"}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500">Return Policy</label>
              <p className="text-sm text-gray-900">{productData.return_policy || "Not provided"}</p>
            </div>
          </div>
        </AccordionSection>

        <AccordionSection 
          title="Shipping Address" 
          icon={<MapPin size={18} />}
          id="shipping" 
          isOpen={openSections.shipping} 
          toggleFn={toggleSection}
        >
          {addressDetails ? (
            <div className="bg-white rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">
                  {addressDetails.first_name} {addressDetails.last_name}
                </h3>
                {addressDetails.phone && (
                  <div className="flex items-center text-gray-500 text-xs">
                    <Phone className="h-3 w-3 mr-1" />
                    {addressDetails.phone}
                  </div>
                )}
              </div>

              <p className="text-gray-600 text-sm mt-2 flex items-start">
                <MapPin className="h-4 w-4 mr-1 text-red-500 flex-shrink-0" />
                <span>
                  {addressDetails.address_line1}, 
                  {addressDetails.address_line2 && ` ${addressDetails.address_line2}, `}
                  {addressDetails.landmark && `near ${addressDetails.landmark}, `}
                  {addressDetails.city}, {addressDetails.state} - {addressDetails.pincode}
                </span>
              </p>

              {addressDetails.email && (
                <div className="flex items-center text-gray-500 text-xs mt-2">
                  <Mail className="h-3 w-3 mr-1" />
                  {addressDetails.email}
                </div>
              )}
            </div>
          ) : (
            <p className="text-red-500 text-sm">No shipping address selected</p>
          )}
        </AccordionSection>

        <AccordionSection 
          title="Payment Details" 
          id="payment" 
          icon={<IndianRupee size={18} />}
          isOpen={openSections.payment} 
          toggleFn={toggleSection}
        >
          {paymentDetails ? (
            <div className="bg-white rounded-lg">
              <div className="flex justify-between items-center font-semibold">
                <span>{paymentDetails.payment_method}</span>
              </div>
              <div className="text-gray-600 mt-2 text-sm">
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
                  </>
                ) : (
                  <p>UPI ID: {paymentDetails.details?.upiId || paymentDetails.upi_id || 'Not provided'}</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-red-500 text-sm">No payment method selected. Your earnings will be credited to your wallet.</p>
          )}
        </AccordionSection>

        {/* Media Gallery Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
          <div className="border-b border-gray-100 p-4 flex items-center">
            <Camera size={18} className="text-red-500 mr-3" />
            <h2 className="text-lg font-semibold text-gray-900">Media Gallery</h2>
          </div>
          <div className="p-4">
            {/* Use the existing MediaGallery component */}
            {productData && <MediaGallery productData={productData} />}
          </div>
        </div>

        {/* Submit Section - Fixed at bottom on mobile */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-10 md:relative md:mt-6 md:mb-8 md:border-t-0 md:rounded-xl md:shadow-sm">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full px-4 py-3.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Product"}
            {!loading && <CircleCheckBig strokeWidth={2.5} className="w-5 h-5 ml-2" />}
          </button>
        </div>
        
        {/* Extra space at bottom to ensure content isn't hidden behind fixed submit button on mobile */}
        <div className="h-20 md:h-0"></div>
      </main>
    </div>
  );
};

export default PreviewPage;