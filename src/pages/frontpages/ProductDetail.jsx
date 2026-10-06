import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";

export default function ProductDetail() {
   /* Mengambil ID produk dari URL */
   const { id } = useParams();

   // Mengambil state yang dikirim dari Link
   const location = useLocation();

   // state adalah objek produk yang dikirim dari Link
   const p = location.state;

   // State untuk rating dan review
   const [rating, setRating] = useState(0);
   const [review, setReview] = useState("");
   const [reviews, setReviews] = useState([]);

   // Handle submit review
   const handleSubmit = (e) => {
      e.preventDefault();

      if (!rating || !review.trim()) return;

      // Membuat objek review baru
      const newReview = {
         id: Date.now(),
         rating,
         review,
      };

      // Menambahkan review baru ke daftar reviews
      setReviews([...reviews, newReview]);

      setRating(0);
      setReview("");
   };

   return (
      <div className="p-6 space-y-6 flex gap-6">

         <section className="flex-4 gap-6">
               <div className="border rounded-lg p-4 shadow hover:shadow-lg">
                  <h1 className="text-2xl font-bold">
                     {p.name}
                  </h1>

                  <p className="mt-4">
                     {p.price}
                  </p>
               </div>

               <div>
                  <h2 className="text-xl font-semibold mb-3">
                     User Reviews
                  </h2>

                  {reviews.length === 0 ? (
                     <p className="text-gray-500">
                           Belum ada review.
                     </p>
                  ) : (
                     <ul className="space-y-4">
                           {reviews.map((r) => (
                              <li
                                 key={r.id}
                                 className="border rounded-lg p-4 bg-gray-50 shadow-sm"
                              >
                                 <div className="flex items-center gap-2 mb-2">

                                       {/* Menampilkan bintang sesuai rating */}
                                       {[...Array(r.rating)].map((_, i) => (
                                          <span
                                             key={i}
                                             className="text-yellow-500"
                                          >
                                             ★
                                          </span>
                                       ))}

                                       {[...Array(5 - r.rating)].map((_, i) => (
                                          <span
                                             key={i}
                                             className="text-gray-300"
                                          >
                                             ★
                                          </span>
                                       ))}

                                 </div>

                                 <p className="text-gray-700">
                                       {r.review}
                                 </p>
                              </li>
                           ))}
                     </ul>
                  )}
               </div>
         </section>

         <section className="border rounded-lg p-4 shadow hover:shadow-lg flex-1">
               <h2 className="text-xl font-semibold mt-6">
                  Reviews
               </h2>

               {/* Form Rating & Review */}
               <form onSubmit={handleSubmit} className="mb-6">

                  <div className="mb-4">
                     <label className="block text-lg font-medium mb-2">
                           Rating:
                     </label>

                     <div className="flex gap-2">

                           {/* Menampilkan 5 bintang untuk rating */}
                           {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                 type="button"
                                 key={star}
                                 onClick={() => setRating(star)}
                                 className={`text-2xl ${
                                       star <= rating
                                          ? "text-yellow-500"
                                          : "text-gray-300"
                                 }`}
                              >
                                 ★
                              </button>
                           ))}

                     </div>
                  </div>

                  <div className="mb-4">
                     <label className="block text-lg font-medium mb-2">
                           Review:
                     </label>

                     {/* Textarea untuk review */}
                     <textarea
                           value={review}
                           // Menampilkan textarea untuk review
                           onChange={(e) => setReview(e.target.value)}
                           className="w-full border rounded-lg p-3"
                           rows="3"
                           placeholder="Tulis pengalaman Anda..."
                     ></textarea>
                  </div>

                  <button
                     type="submit"
                     className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                     Submit
                  </button>

               </form>
         </section>

      </div>
   );
}
