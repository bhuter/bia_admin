"use client";
import { useState } from "react";
import Header, { ProductList } from "@/app/comps/products/indexPage";
import AddProduct from "@/app/comps/products/addProduct";
import SetupProduct from "@/app/comps/toggles/Toggles";

const Products = () => {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [setupProductId, setSetupProductId] = useState<number | null>(null);

  const toggleAddProduct = () => {
    setShowAddProduct(true);
  };

  const closeAddProduct = () => {
    setShowAddProduct(false);
  };

  const handleSetupProductClick = (productId: number) => {
    setSetupProductId(productId); // Set the ID for the setup form
  };

  const closeSetupProduct = () => {
    setSetupProductId(null); // Close the setup product form
  };

  return (
    <>
      <header>
        <title>Products</title>
      </header>
      <div>
        <Header onAddProductClick={toggleAddProduct}/>
      </div>
      {showAddProduct && (
        <div className="block">
          <AddProduct onClose={closeAddProduct} />
        </div>
      )}
      {setupProductId && (
        <div className="block">
          <SetupProduct productId={setupProductId} onClose={closeSetupProduct} />
        </div>
      )}
      <div className="bg-white h-[73vh] w-full rounded-lg border">
        <ProductList onSetupProductClick={handleSetupProductClick} />
      </div>
    </>
  );
};

export default Products;
