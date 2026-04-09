import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCartPlus, FaRegBookmark, FaBookmark } from "react-icons/fa";

const Card = ({
  id,
  image,
  title,
  author,
  genre,
  price,
  originalPrice,
  badge, // "New" | "Sale" | null
  onAddToCart,
}) => {
  const navigate = useNavigate();
  const [wishlisted, setWishlisted] = React.useState(false);

  const handleWishlist = (e) => {
    e.stopPropagation();
    setWishlisted((prev) => !prev);
  };

  return (
    <div
      onClick={() => navigate(`/books/${id}`)}
      className="w-64 flex-shrink-0 group bg-white border border-stone-100 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:border-stone-200 hover:shadow-md flex flex-col"
    >
      {/* Cover — taller for full book cover display */}
      <div className="relative w-full aspect-[2/3] bg-white flex items-center justify-center">
        {image ? (
          <img

            src={image}
            alt={title}
            className="w-full h-full object-contain"
          />

        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-200 to-amber-500 flex items-center justify-center px-5">
            <span className="font-serif text-xl font-bold text-white/95 text-center leading-snug">
              {title}
            </span>
          </div>
        )}

        {/* Badge */}
        {badge && (
          <span
            className={`absolute top-2.5 left-2.5 z-10 text-[11px] font-medium px-2.5 py-0.5 rounded
              ${badge === "New"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
              }`}
          >
            {badge}
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white border border-stone-100 flex items-center justify-center text-sm transition-colors hover:bg-stone-50"
          aria-label="Wishlist"
        >
          {wishlisted
            ? <FaBookmark />  
            : <FaRegBookmark />     
          }
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-3.5">
        {genre && (
          <p className="text-[10px] font-medium tracking-widest uppercase text-stone-400 mb-1">
            {genre}
          </p>
        )}

        <h3 className="font-serif text-[15px] font-bold text-stone-900 leading-snug mb-0.5 line-clamp-2">
          {title}
        </h3>

        <p className="text-[12px] text-stone-500 mb-3">{author}</p>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3 mt-auto">
          <span className="text-[17px] font-medium text-stone-900">
            Rs. {price.toFixed(2)}
          </span>
          {originalPrice && (
            <span className="text-[12px] text-stone-400 line-through">
              Rs. {originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          className={`w-full py-2.5 rounded-md text-[11px] font-medium tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-150 active:scale-95
          bg-[#b87333] text-[#faf7f2] hover:bg-[#925925]`}>
          Add to Cart <FaCartPlus />
        </button>
      </div>
    </div>
  );
};

export default Card;