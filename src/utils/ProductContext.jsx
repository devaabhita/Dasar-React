import { createContext, useContext, useState, useEffect } from "react";
import { products as initialProducts } from "./data";

export const ProductContext = createContext();

export function ProductProvider({ children }) {
   // Inisialisasi daftar produk dari localStorage atau fallback ke initialProducts
   const [products, setProducts] = useState(() => {
      try {
         const saved = localStorage.getItem("admin_products");
         if (saved) {
            return JSON.parse(saved);
         }
      } catch (err) {
         console.error("Gagal membaca produk dari localStorage:", err);
      }
      return initialProducts;
   });

   // Sinkronisasi ke localStorage setiap ada perubahan pada products
   useEffect(() => {
      try {
         localStorage.setItem("admin_products", JSON.stringify(products));
      } catch (err) {
         console.error("Gagal menyimpan produk ke localStorage:", err);
      }
   }, [products]);

   // Create: Tambah produk baru
   const addProduct = (productData) => {
      const nextId =
         products.length > 0
            ? Math.max(...products.map((p) => Number(p.id) || 0)) + 1
            : 1;

      const slug =
         productData.name
            ?.toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "") || `buku-${nextId}`;

      const newProduct = {
         id: nextId,
         name: productData.name.trim(),
         slug,
         price: Number(productData.price) || 0,
         stock: Number(productData.stock) || 0,
         category: Number(productData.category) || 1,
         category_name: productData.category_name || "Novel",
         rating: Number(productData.rating) || 5,
         img:
            productData.img?.trim() ||
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&auto=format&fit=crop&q=80",
      };

      setProducts((prev) => [newProduct, ...prev]);
   };

   // Update: Edit produk
   const updateProduct = (id, updatedData) => {
      setProducts((prev) =>
         prev.map((item) => {
            if (item.id === id) {
               const slug = updatedData.name
                  ? updatedData.name
                       .toLowerCase()
                       .trim()
                       .replace(/[^a-z0-9]+/g, "-")
                       .replace(/(^-|-$)+/g, "")
                  : item.slug;

               return {
                  ...item,
                  ...updatedData,
                  slug,
                  price: Number(updatedData.price) ?? item.price,
                  stock: Number(updatedData.stock) ?? item.stock,
                  rating: Number(updatedData.rating) ?? item.rating,
               };
            }
            return item;
         })
      );
   };

   // Delete: Hapus produk
   const deleteProduct = (id) => {
      setProducts((prev) => prev.filter((item) => item.id !== id));
   };

   // Reset ke data awal bawaan
   const resetProducts = () => {
      setProducts(initialProducts);
      localStorage.setItem("admin_products", JSON.stringify(initialProducts));
   };

   return (
      <ProductContext.Provider
         value={{
            products,
            addProduct,
            updateProduct,
            deleteProduct,
            resetProducts,
         }}
      >
         {children}
      </ProductContext.Provider>
   );
}

export const useProducts = () => useContext(ProductContext);
