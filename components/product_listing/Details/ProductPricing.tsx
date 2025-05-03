import React, { useCallback, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface ProductPricingProps {
  product: any;
  updateProduct: (field: string, value: any) => void;
  errors: Record<string, string>;
}

export default function ProductPricing({
  product,
  updateProduct,
  errors
}: ProductPricingProps) {
  const [lastValidPrice, setLastValidPrice] = useState({
    artist_price: product.artist_price || 0,
    platform_price: product.platform_price || 0,
    final_sale_price: product.final_sale_price || 0
  });

  // Validate price input with secure checks
  const validatePrice = useCallback((value: string): number | null => {
    // Remove any non-numeric characters except decimal point
    const sanitized = value.replace(/[^\d.]/g, '');
    
    // Validate numeric format
    if (!/^\d+(\.\d{0,2})?$/.test(sanitized)) {
      return null;
    }

    const numValue = parseFloat(sanitized);
    
    // Check reasonable price range (0 to 1,000,000)
    if (numValue < 0 || numValue > 1000000) {
      return null;
    }

    return numValue;
  }, []);

  // Handle price changes with security checks
  const handlePriceChange = useCallback((field: string, value: string) => {
    const validatedPrice = validatePrice(value);
    
    if (validatedPrice === null) {
      // Revert to last valid price if validation fails
      updateProduct(field, lastValidPrice[field as keyof typeof lastValidPrice]);
      return;
    }

    // Additional validation for sale price
    if (field === 'final_sale_price' && product.is_discount_enabled) {
      const minPrice = product.platform_price * 0.1; // Minimum 10% of original price
      if (validatedPrice < minPrice) {
        updateProduct(field, lastValidPrice.final_sale_price);
        return;
      }
      if (validatedPrice >= product.platform_price) {
        updateProduct(field, lastValidPrice.final_sale_price);
        return;
      }
    }

    // Store last valid price
    setLastValidPrice(prev => ({
      ...prev,
      [field]: validatedPrice
    }));

    updateProduct(field, validatedPrice);
  }, [updateProduct, product.is_discount_enabled, product.platform_price, lastValidPrice]);

  // Handle discount toggle with validation
  const handleDiscountToggle = useCallback((enabled: boolean) => {
    updateProduct('is_discount_enabled', enabled);
    if (!enabled) {
      updateProduct('final_sale_price', null);
    } else if (product.platform_price) {
      // Set default sale price to 10% off
      const defaultSalePrice = Math.round(product.platform_price * 0.9 * 100) / 100;
      updateProduct('final_sale_price', defaultSalePrice);
    }
  }, [updateProduct, product.platform_price]);

  // Protect against price manipulation attempts
  useEffect(() => {
    const validateExistingPrices = () => {
      if (product.platform_price < product.artist_price) {
        updateProduct('platform_price', product.artist_price);
      }
      if (product.is_discount_enabled && product.final_sale_price >= product.platform_price) {
        updateProduct('final_sale_price', Math.round(product.platform_price * 0.9 * 100) / 100);
      }
    };

    validateExistingPrices();
  }, [product.artist_price, product.platform_price, product.is_discount_enabled, product.final_sale_price, updateProduct]);

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <Label htmlFor="artist_price" className="text-base font-medium">
            Your Price (₹)
          </Label>
          <input
            id="artist_price"
            type="text"
            inputMode="decimal"
            value={product.artist_price || ''}
            onChange={(e) => handlePriceChange('artist_price', e.target.value)}
            className="w-full mt-2 p-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            aria-invalid={!!errors.artist_price}
            aria-describedby={errors.artist_price ? 'artist-price-error' : undefined}
          />
          {errors.artist_price && (
            <p id="artist-price-error" className="mt-1 text-sm text-red-500">
              {errors.artist_price}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="platform_price" className="text-base font-medium">
            Platform Price (₹)
          </Label>
          <input
            id="platform_price"
            type="text"
            inputMode="decimal"
            value={product.platform_price || ''}
            onChange={(e) => handlePriceChange('platform_price', e.target.value)}
            className="w-full mt-2 p-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            aria-invalid={!!errors.platform_price}
            aria-describedby={errors.platform_price ? 'platform-price-error' : undefined}
          />
          {errors.platform_price && (
            <p id="platform-price-error" className="mt-1 text-sm text-red-500">
              {errors.platform_price}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="discount_switch" className="text-base font-medium">
            Enable Discount
          </Label>
          <Switch
            id="discount_switch"
            checked={product.is_discount_enabled || false}
            onCheckedChange={handleDiscountToggle}
          />
        </div>

        {product.is_discount_enabled && (
          <div>
            <Label htmlFor="final_sale_price" className="text-base font-medium">
              Sale Price (₹)
            </Label>
            <input
              id="final_sale_price"
              type="text"
              inputMode="decimal"
              value={product.final_sale_price || ''}
              onChange={(e) => handlePriceChange('final_sale_price', e.target.value)}
              className="w-full mt-2 p-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              aria-invalid={!!errors.final_sale_price}
              aria-describedby={errors.final_sale_price ? 'sale-price-error' : undefined}
            />
            {errors.final_sale_price && (
              <p id="sale-price-error" className="mt-1 text-sm text-red-500">
                {errors.final_sale_price}
              </p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Sale price must be between {Math.ceil(product.platform_price * 0.1)} and {Math.floor(product.platform_price * 0.99)} ₹
            </p>
          </div>
        )}

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900">Price Guidelines:</h4>
          <ul className="mt-2 space-y-1 text-sm text-gray-600">
            <li>• Platform price must be higher than your price</li>
            <li>• Sale price must be at least 10% lower than platform price</li>
            <li>• Maximum price limit is ₹1,000,000</li>
            <li>• Prices are in Indian Rupees (₹)</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}