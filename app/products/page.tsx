// app/products/page.tsx (Product Listing Page)
import React from "react";
import ProductList from "@/components/products/ProductList";

const ProductsPage = () => {
  return (
    <div className="container mx-auto p-4">
      <ProductList />
    </div>
  );
};

export default ProductsPage;