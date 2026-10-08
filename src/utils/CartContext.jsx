import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

// nama Provider CartProvider (Bebas)
export function CartProvider({ children }) {
   // Inisialisasi cart dari localStorage agar data tidak hilang saat di-refresh
   const [cart, setCart] = useState(() => {
      try {
         const savedCart = localStorage.getItem("cart");
         return savedCart ? JSON.parse(savedCart) : [];
      } catch (error) {
         console.error("Gagal memuat cart dari localStorage:", error);
         return [];
      }
   });

   // Simpan cart ke localStorage setiap kali terjadi perubahan
   useEffect(() => {
      try {
         localStorage.setItem("cart", JSON.stringify(cart));
      } catch (error) {
         console.error("Gagal menyimpan cart ke localStorage:", error);
      }
   }, [cart]);

   // Tambah ke cart
   const addToCart = (product) => {
      setCart((prev) => {
         const existing = prev.find((item) => item.id === product.id);

         if (existing) {
               return prev.map((item) =>
                  item.id === product.id
                     ? { ...item, qty: item.qty + 1 }
                     : item
               );
         }

         return [...prev, { ...product, qty: 1 }];
      });
   };

   // Update qty
   const updateQty = (id, qty) => {
      setCart((prev) =>
         prev.map((item) =>
               item.id === id
                  ? { ...item, qty: Math.max(1, qty) }
                  : item
         )
      );
   };

   // Hapus item
   const removeFromCart = (id) => {
      setCart((prev) => prev.filter((item) => item.id !== id));
   };

   const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

   return (
      <CartContext.Provider
         value={{
               cart,
               addToCart,
               updateQty,
               removeFromCart,
               totalQty,
         }}
      >
         {children}
      </CartContext.Provider>
   );
}

export const useCart = () => useContext(CartContext);