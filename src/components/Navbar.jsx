import { Link } from "react-router-dom";
import { useCart } from "../utils/CartContext";
export default function Navbar() {
    // Mengambil totalQty dari context UseCart
    const { totalQty } = useCart();
    return (
        <nav className="bg-[#216869] text-white px-6 py-4 flex justify-between
items-center">
            {/* Logo */}
            <Link to="/" className="font-bold text-xl">
                Ruang Buku
            </Link>
            {/* Menu Navigasi */}
            <div className="flex gap-6">
                {/* Dashboard Links */}
                <Link to="/dashboard" className="hover:text-gray-200">
                    Dashboard
                </Link>
                <Link to="/cart" className="hover:text-gray-200">
                    Keranjang
                    {/* Menampilkan totalQty jika ada item di keranjang */}
                    {totalQty > 0 && (
                        <span className=" bg-red-500 text-xs px-2 rounded-full">
                            {totalQty}
                        </span>
                    )}
                </Link>
                <Link to="/checkout" className="hover:text-gray-200">
                    Checkout
                </Link>
            </div>
        </nav>
    );
}