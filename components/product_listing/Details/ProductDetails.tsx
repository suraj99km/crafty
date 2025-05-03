import React, { useCallback } from 'react';
import { sanitizeString } from '@/lib/encryption';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface ProductDetailsProps {
  product: any;
  updateProduct: (field: string, value: any) => void;
  errors: Record<string, string>;
}

export default function ProductDetails({
  product,
  updateProduct,
  errors
}: ProductDetailsProps) {
  // Debounce and sanitize input updates
  const handleInputChange = useCallback((field: string, value: string) => {
    // Basic input validation
    if (!value || value.length > 2000) return;
    
    // Sanitize input before updating
    const sanitizedValue = sanitizeString(value);
    
    // Prevent script injection
    if (sanitizedValue.includes('script') || 
        sanitizedValue.includes('javascript:') ||
        sanitizedValue.includes('data:') ||
        /on\w+=/i.test(sanitizedValue)) {
      return;
    }
    
    updateProduct(field, sanitizedValue);
  }, [updateProduct]);

  // Character count display with max limit warning
  const getCharacterCount = (value: string, maxLength: number) => {
    const count = value?.length || 0;
    return {
      count,
      warning: count > maxLength * 0.9,
      error: count > maxLength
    };
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <Label htmlFor="title" className="text-base font-medium">
            Product Title
          </Label>
          <input
            id="title"
            type="text"
            value={product.title || ''}
            onChange={(e) => handleInputChange('title', e.target.value)}
            maxLength={100}
            className="w-full mt-2 p-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? 'title-error' : undefined}
          />
          {errors.title && (
            <p id="title-error" className="mt-1 text-sm text-red-500">
              {errors.title}
            </p>
          )}
          <div className="mt-1 text-xs text-gray-500">
            {getCharacterCount(product.title || '', 100).count}/100
          </div>
        </div>

        <div>
          <Label htmlFor="description" className="text-base font-medium">
            Product Description
          </Label>
          <textarea
            id="description"
            value={product.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            maxLength={2000}
            rows={5}
            className="w-full mt-2 p-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            aria-invalid={!!errors.description}
            aria-describedby={errors.description ? 'description-error' : undefined}
          />
          {errors.description && (
            <p id="description-error" className="mt-1 text-sm text-red-500">
              {errors.description}
            </p>
          )}
          <div className="mt-1 text-xs text-gray-500">
            {getCharacterCount(product.description || '', 2000).count}/2000
          </div>
        </div>

        <div>
          <Label htmlFor="category" className="text-base font-medium">
            Category
          </Label>
          <select
            id="category"
            value={product.category || ''}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full mt-2 p-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            aria-invalid={!!errors.category}
            aria-describedby={errors.category ? 'category-error' : undefined}
          >
            <option value="">Select a category</option>
            {[
              'Paintings',
              'Sculptures',
              'Pottery',
              'Textiles',
              'Jewelry',
              'Wood Crafts',
              'Metal Crafts',
              'Glass Art',
              'Other'
            ].map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p id="category-error" className="mt-1 text-sm text-red-500">
              {errors.category}
            </p>
          )}
        </div>

        <div className="text-sm text-gray-500">
          <p>Guidelines for secure product listing:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Avoid including personal contact information</li>
            <li>Do not share external links or social media handles</li>
            <li>Keep descriptions focused on the product</li>
            <li>Use appropriate language and avoid special characters</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}