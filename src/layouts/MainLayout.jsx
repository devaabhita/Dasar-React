import { createContext, useContext, useState } from "react";
import { Outlet, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";

export const CategoryContext = createContext();
export const useCategory = () => useContext(CategoryContext);

export default function MainLayout() {
   const [searchParams, setSearchParams] = useSearchParams();
   const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");

   return (
      <CategoryContext.Provider value={{ selectedCategory, setSelectedCategory }}>
         <div className="flex flex-col min-h-screen">

            {/* Header/Navbar */}
            <Navbar />

            {/* Search & Filter */}
            <header className="bg-gray-100 p-4 flex flex-col md:flex-row gap-2 justify-between items-center">
               <input
                  type="text"
                  placeholder="Cari produk..."
                  className="w-full md:w-1/3 px-4 py-2 border rounded-lg"
                  value={searchParams.get("q") || ""}
                  onChange={(e) => {
                     if (e.target.value) {
                        setSearchParams({ q: e.target.value });
                     } else {
                        setSearchParams({});
                     }
                  }}
               />

               <select 
                  className="px-4 py-2 border rounded-lg"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
               >
                  <option value="Semua Kategori">Semua Kategori</option>
                  <option value="Pendidikan">Pendidikan</option>
                  <option value="Novel">Novel</option>
                  <option value="Pengembangan Diri">Pengembangan Diri</option>
                  <option value="Sejarah">Sejarah</option>
                  <option value="Sains">Sains</option>
               </select>
            </header>

            {/* Main Section */}
            <main className="flex-1 p-6">
               <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white text-center p-4">
               <p>© 2026 Ruang Buku | Deva Dev</p>
            </footer>

         </div>
      </CategoryContext.Provider>
   );
}
