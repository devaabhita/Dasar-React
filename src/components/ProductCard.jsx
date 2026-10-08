import { Link } from "react-router-dom";
import { useCart } from "../utils/CartContext";

export default function ProductCard({ p }) {
      const { addToCart } = useCart();

      return (
            <div key={p.id} className="border rounded-lg p-4 shadow hover:shadow-lg flex justify-between gap-4">
                  <div className="flex-1">
                        <h2 className="font-semibold">{p.name}</h2>
                        <p className="text-gray-600">{p.price}</p>

                        <Link
                              to={`/product/${p.slug}`}
                              state={p}
                              className="text-[#28acae] hover:underline mt-2 block"
                        >
                              Lihat Detail
                        </Link>

                        {/* Fungsi Tambah ke cart */}
                        <button
                              onClick={() => addToCart(p)}
                              className="mt-3 px-4 py-2 bg-[#216869] text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                        >
                              Add to Cart
                        </button>
                  </div>

                  <div className="w-24 h-32 flex-shrink-0">
                        <img 
                              src={p.img}  
                              alt={p.name} 
                              className="w-full h-full object-contain rounded-md" 
                        />
                  </div>
            </div>
      );
}
