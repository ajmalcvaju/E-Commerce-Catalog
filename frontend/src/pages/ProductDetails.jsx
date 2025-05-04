import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { gsap } from "gsap";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductById } from "../apis/api";

export default function ProductDetails() {
  const { id } = useParams();
  const [transformOrigin, setTransformOrigin] = useState("center");
  const [currentIndex, setCurrentIndex] = useState(0);
  const imageRef = useRef(null);
  const [product, setProduct] = useState(null); // Start with null
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await fetchProductById(id);
        setProduct(res.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };
    fetchProductDetails();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!product?.image_urls?.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % product.image_urls.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [product?.image_urls?.length]);

  useEffect(() => {
    if (imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 1 }
      );
    }
  }, [currentIndex]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setTransformOrigin(`${x}% ${y}%`);
  };

  const handleMouseLeave = () => {
    setTransformOrigin("center");
  };

  // Early return if product is still loading
  if (!product) return <div className="p-10 text-center">Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-gray-200 w-full px-4 sm:px-6 md:px-10 lg:px-20 py-10 sm:py-14 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-14"
    >
      <div className="space-y-6">
        <div
          className="overflow-hidden rounded-2xl shadow-xl"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <img
            ref={imageRef}
            src={product.image_urls[currentIndex]}
            alt={`product-${currentIndex}`}
            style={{ transformOrigin }}
            className="w-full h-[28rem] object-cover rounded-2xl transform transition-transform duration-300 ease-out hover:scale-150 cursor-grabbing"
          />
        </div>

        <div className="flex gap-4 overflow-x-auto">
          {product.image_urls.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`thumb-${i}`}
              onClick={() => setCurrentIndex(i)}
              className={`w-20 h-20 object-cover rounded-lg border ${
                currentIndex === i
                  ? "border-blue-500 ring-2 ring-blue-300"
                  : "border-gray-300"
              } hover:shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105`}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-between space-y-10">
        <div>
          <p className="text-xs text-blue-500 uppercase tracking-wider font-semibold mb-2">
            {product.category}
          </p>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            {product.name}
          </h2>
          <p className="text-blue-600 text-3xl font-extrabold mb-6">
            ₹{product.price}
          </p>
          <p className="text-gray-700 leading-relaxed text-base">
            {product.description}
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex w-full items-center gap-2 text-sm bg-gray-800 text-white hover:text-gray-200 cursor-pointer transition px-3 py-2 rounded-md hover:cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Products
        </button>
      </div>
    </motion.div>
  );
}
