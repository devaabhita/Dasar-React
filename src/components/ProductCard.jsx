import { Link } from "react-router-dom";
import { useCart } from "../utils/CartContext";

export default function ProductCard({ p }) {
   const { addToCart } = useCart();

   return (
      <div key={p.id} className="border rounded-lg p-4 shadow hover:shadow-lg">
         <h2 className="font-semibold">{p.name}</h2>

         <p className="text-gray-600">{p.price}</p>

         <Link
               to={`/product/${p.slug}`}
               className="text-blue-600 hover:underline mt-2 block"
         >
               Lihat Detail
         </Link>

         {/* Fungsi Tambah ke cart */}
         <button
               onClick={() => addToCart(p)}
               className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
         >
               Add to Cart
         </button>
      </div>
   );
}
