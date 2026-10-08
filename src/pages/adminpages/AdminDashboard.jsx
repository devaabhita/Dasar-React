import { useState } from "react";
import { useProducts } from "../../utils/ProductContext";

const CATEGORIES = [
   "Novel",
   "Pendidikan",
   "Pengembangan Diri",
   "Sejarah",
   "Sains",
];

const CATEGORY_IDS = {
   Pendidikan: 1,
   Novel: 2,
   "Pengembangan Diri": 3,
   Sejarah: 4,
   Sains: 5,
};

const EMPTY_FORM = {
   name: "",
   category_name: "Novel",
   price: "",
   stock: "",
   rating: "4.5",
   img: "",
};

export default function AdminDashboard() {
   const { products, addProduct, updateProduct, deleteProduct, resetProducts } =
      useProducts();

   // State pencarian & filter tabel
   const [searchQuery, setSearchQuery] = useState("");
   const [selectedFilterCategory, setSelectedFilterCategory] = useState("Semua");

   // State modal form (Create & Edit)
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [editingId, setEditingId] = useState(null);
   const [formData, setFormData] = useState(EMPTY_FORM);
   const [formError, setFormError] = useState("");

   // Filter daftar produk
   const filteredProducts = products.filter((item) => {
      const matchQuery = item.name
         ?.toLowerCase()
         .includes(searchQuery.toLowerCase());
      const matchCat =
         selectedFilterCategory === "Semua" ||
         item.category_name === selectedFilterCategory;
      return matchQuery && matchCat;
   });

   // Statistik sederhana
   const totalStock = products.reduce(
      (sum, p) => sum + (Number(p.stock) || 0),
      0
   );
   const avgPrice =
      products.length > 0
         ? Math.round(
              products.reduce((sum, p) => sum + (Number(p.price) || 0), 0) /
                 products.length
           )
         : 0;

   // Buka modal untuk Tambah (Create)
   const handleOpenAdd = () => {
      setEditingId(null);
      setFormData(EMPTY_FORM);
      setFormError("");
      setIsModalOpen(true);
   };

   // Buka modal untuk Edit (Update)
   const handleOpenEdit = (product) => {
      setEditingId(product.id);
      setFormData({
         name: product.name,
         category_name: product.category_name || "Novel",
         price: product.price,
         stock: product.stock,
         rating: product.rating || "5.0",
         img: product.img || "",
      });
      setFormError("");
      setIsModalOpen(true);
   };

   // Tutup modal
   const handleCloseModal = () => {
      setIsModalOpen(false);
      setEditingId(null);
      setFormData(EMPTY_FORM);
      setFormError("");
   };

   // Submit form (Create / Update)
   const handleSubmit = (e) => {
      e.preventDefault();

      if (!formData.name.trim()) {
         setFormError("Judul produk / buku wajib diisi!");
         return;
      }
      if (!formData.price || Number(formData.price) <= 0) {
         setFormError("Harga harus berupa angka lebih dari 0!");
         return;
      }
      if (formData.stock === "" || Number(formData.stock) < 0) {
         setFormError("Stok harus berupa angka 0 atau lebih!");
         return;
      }

      const categoryId = CATEGORY_IDS[formData.category_name] || 1;

      const payload = {
         name: formData.name.trim(),
         category_name: formData.category_name,
         category: categoryId,
         price: Number(formData.price),
         stock: Number(formData.stock),
         rating: Number(formData.rating) || 4.5,
         img: formData.img.trim(),
      };

      if (editingId !== null) {
         // UPDATE
         updateProduct(editingId, payload);
      } else {
         // CREATE
         addProduct(payload);
      }

      handleCloseModal();
   };

   // Hapus produk (Delete)
   const handleDelete = (id, name) => {
      if (window.confirm(`Yakin ingin menghapus produk "${name}"?`)) {
         deleteProduct(id);
      }
   };

   // Reset data awal
   const handleReset = () => {
      if (
         window.confirm(
            "Kembalikan semua data ke produk bawaan? Perubahan kustom akan dihapus."
         )
      ) {
         resetProducts();
      }
   };

   return (
      <div className="space-y-6">
         {/* Header */}
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
               <h1 className="text-2xl font-bold text-gray-800">
                  Manajemen Produk (CRUD)
               </h1>
               <p className="text-sm text-gray-500">
                  Kelola data buku dan inventaris toko secara langsung (tersimpan di localStorage).
               </p>
            </div>
            <div className="flex gap-2">
               <button
                  onClick={handleReset}
                  className="px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                  title="Reset data ke bawaan awal"
               >
                  Reset Default
               </button>
               <button
                  onClick={handleOpenAdd}
                  className="px-4 py-2 bg-[#216869] text-white rounded-lg hover:bg-[#1a5354] transition flex items-center gap-2 font-medium shadow-sm"
               >
                  <span>+</span> Tambah Buku
               </button>
            </div>
         </div>

         {/* Kartu Ringkasan Statistik */}
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
               <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Total Judul Buku
               </span>
               <div className="text-2xl font-bold text-gray-800 mt-1">
                  {products.length}
               </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
               <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Total Stok Tersedia
               </span>
               <div className="text-2xl font-bold text-teal-700 mt-1">
                  {totalStock} <span className="text-sm font-normal text-gray-500">item</span>
               </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
               <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Rata-rata Harga
               </span>
               <div className="text-2xl font-bold text-gray-800 mt-1">
                  Rp {avgPrice.toLocaleString()}
               </div>
            </div>
         </div>

         {/* Bar Pencarian & Filter */}
         <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-3 justify-between items-center">
            <div className="w-full md:w-1/2">
               <input
                  type="text"
                  placeholder="Cari judul buku di admin..."
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>
            <div className="flex gap-2 w-full md:w-auto items-center">
               <span className="text-sm text-gray-600 whitespace-nowrap">Kategori:</span>
               <select
                  className="px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 w-full md:w-auto"
                  value={selectedFilterCategory}
                  onChange={(e) => setSelectedFilterCategory(e.target.value)}
               >
                  <option value="Semua">Semua Kategori</option>
                  {CATEGORIES.map((cat) => (
                     <option key={cat} value={cat}>
                        {cat}
                     </option>
                  ))}
               </select>
            </div>
         </div>

         {/* Tabel Produk (READ) */}
         <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold border-b">
                     <tr>
                        <th className="py-3 px-4">No</th>
                        <th className="py-3 px-4">Cover</th>
                        <th className="py-3 px-4">Judul Buku</th>
                        <th className="py-3 px-4">Kategori</th>
                        <th className="py-3 px-4">Harga</th>
                        <th className="py-3 px-4">Stok</th>
                        <th className="py-3 px-4">Rating</th>
                        <th className="py-3 px-4 text-center">Aksi</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {filteredProducts.length > 0 ? (
                        filteredProducts.map((p, idx) => (
                           <tr
                              key={p.id}
                              className="hover:bg-gray-50/70 transition"
                           >
                              <td className="py-3 px-4 text-gray-500 font-medium">
                                 {idx + 1}
                              </td>
                              <td className="py-3 px-4">
                                 <img
                                    src={p.img}
                                    alt={p.name}
                                    className="w-10 h-14 object-cover rounded shadow-xs bg-gray-100"
                                    onError={(e) => {
                                       e.target.src =
                                          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&auto=format&fit=crop&q=80";
                                    }}
                                 />
                              </td>
                              <td className="py-3 px-4 font-semibold text-gray-800">
                                 {p.name}
                              </td>
                              <td className="py-3 px-4">
                                 <span className="px-2.5 py-1 text-xs rounded-full bg-teal-50 text-teal-700 font-medium">
                                    {p.category_name}
                                 </span>
                              </td>
                              <td className="py-3 px-4 font-medium text-gray-700">
                                 Rp {Number(p.price).toLocaleString()}
                              </td>
                              <td className="py-3 px-4">
                                 <span
                                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                                       p.stock <= 5
                                          ? "bg-red-100 text-red-700"
                                          : p.stock <= 15
                                          ? "bg-amber-100 text-amber-700"
                                          : "bg-green-100 text-green-700"
                                    }`}
                                 >
                                    {p.stock} pcs
                                 </span>
                              </td>
                              <td className="py-3 px-4 text-yellow-500 font-medium">
                                 ★ {p.rating || 5}
                              </td>
                              <td className="py-3 px-4">
                                 <div className="flex items-center justify-center gap-2">
                                    {/* Tombol Edit (UPDATE) */}
                                    <button
                                       onClick={() => handleOpenEdit(p)}
                                       className="px-3 py-1 text-xs font-medium bg-amber-500 hover:bg-amber-600 text-white rounded transition shadow-xs"
                                    >
                                       Edit
                                    </button>
                                    {/* Tombol Hapus (DELETE) */}
                                    <button
                                       onClick={() => handleDelete(p.id, p.name)}
                                       className="px-3 py-1 text-xs font-medium bg-red-500 hover:bg-red-600 text-white rounded transition shadow-xs"
                                    >
                                       Hapus
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        ))
                     ) : (
                        <tr>
                           <td
                              colSpan={8}
                              className="text-center py-8 text-gray-500"
                           >
                              Tidak ada data produk yang sesuai.
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Modal Form Tambah / Edit Produk */}
         {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
               <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-fadeIn">
                  {/* Modal Header */}
                  <div className="bg-[#216869] text-white px-6 py-4 flex justify-between items-center">
                     <h2 className="text-lg font-bold">
                        {editingId !== null ? "Edit Data Buku" : "Tambah Buku Baru"}
                     </h2>
                     <button
                        onClick={handleCloseModal}
                        className="text-white hover:text-gray-200 text-xl font-bold"
                     >
                        ×
                     </button>
                  </div>

                  {/* Modal Body / Form */}
                  <form onSubmit={handleSubmit} className="p-6 space-y-4">
                     {formError && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                           {formError}
                        </div>
                     )}

                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                           Judul Buku <span className="text-red-500">*</span>
                        </label>
                        <input
                           type="text"
                           required
                           className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                           placeholder="Contoh: Belajar Pemrograman Web"
                           value={formData.name}
                           onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                           }
                        />
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">
                              Kategori
                           </label>
                           <select
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-white"
                              value={formData.category_name}
                              onChange={(e) =>
                                 setFormData({
                                    ...formData,
                                    category_name: e.target.value,
                                 })
                              }
                           >
                              {CATEGORIES.map((cat) => (
                                 <option key={cat} value={cat}>
                                    {cat}
                                 </option>
                              ))}
                           </select>
                        </div>

                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">
                              Rating (1 - 5)
                           </label>
                           <input
                              type="number"
                              step="0.1"
                              min="1"
                              max="5"
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                              value={formData.rating}
                              onChange={(e) =>
                                 setFormData({
                                    ...formData,
                                    rating: e.target.value,
                                 })
                              }
                           />
                        </div>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">
                              Harga (Rp) <span className="text-red-500">*</span>
                           </label>
                           <input
                              type="number"
                              min="1"
                              required
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                              placeholder="Contoh: 125000"
                              value={formData.price}
                              onChange={(e) =>
                                 setFormData({
                                    ...formData,
                                    price: e.target.value,
                                 })
                              }
                           />
                        </div>

                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">
                              Stok <span className="text-red-500">*</span>
                           </label>
                           <input
                              type="number"
                              min="0"
                              required
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                              placeholder="Contoh: 20"
                              value={formData.stock}
                              onChange={(e) =>
                                 setFormData({
                                    ...formData,
                                    stock: e.target.value,
                                 })
                              }
                           />
                        </div>
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                           URL Gambar Cover (Opsional)
                        </label>
                        <input
                           type="text"
                           className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                           placeholder="https://... atau biarkan kosong untuk cover default"
                           value={formData.img}
                           onChange={(e) =>
                              setFormData({ ...formData, img: e.target.value })
                           }
                        />
                        {formData.img && (
                           <div className="mt-2 flex items-center gap-3">
                              <span className="text-xs text-gray-500">Preview:</span>
                              <img
                                 src={formData.img}
                                 alt="Preview"
                                 className="w-12 h-16 object-cover rounded border"
                                 onError={(e) => {
                                    e.target.style.display = "none";
                                 }}
                              />
                           </div>
                        )}
                     </div>

                     {/* Modal Actions */}
                     <div className="flex justify-end gap-2 pt-4 border-t">
                        <button
                           type="button"
                           onClick={handleCloseModal}
                           className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 transition text-sm"
                        >
                           Batal
                        </button>
                        <button
                           type="submit"
                           className="px-5 py-2 bg-[#216869] text-white rounded-lg hover:bg-[#1a5354] transition text-sm font-medium shadow-sm"
                        >
                           {editingId !== null ? "Simpan Perubahan" : "Tambah Produk"}
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}
      </div>
   );
}