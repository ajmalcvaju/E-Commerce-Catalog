import React, { useEffect, useMemo, useState } from "react";
import AddProduct from "../components/AddProduct";
import EditProduct from "../components/EditProduct";
import { useSelector, useDispatch } from "react-redux";
import { addProducts, setSearchQuery } from "../redux/productSlice";
import {
  setCategoryFilter,
  setMaxPrice,
  setSortOption,
  resetFilter,
} from "../redux/filterSlice";
import { Link } from "react-router-dom";
import { deleteProductById, fetchAllProducts } from "../apis/api";

const ProductList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showForms, setShowForms] = useState(false);
  const [showEditForms, setShowEditForms] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const products = useSelector((state) => state.products.items);
  const searchQuery = useSelector((state) => state.products.searchQuery);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const categories = [
    "Men's Kurta",
    "Women's Midi",
    "Men's Sharwani",
    "Women's Skirt",
    "Men's Party Wear",
    "Women's Baniyan",
  ];

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      console.log(searchQuery);
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const { categoryFilter, maxPrice, sortOption } = useSelector(
    (state) => state.filters
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetchAllProducts();
        console.log(res.data);
        dispatch(addProducts(res.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);

  const getNumericPrice = (price) => {
    if (typeof price === "string") {
      if (price.includes("₹")) return parseFloat(price.replace(/[₹$,]/g, ""));
      if (price.includes("$"))
        return parseFloat(price.replace(/[₹$,]/g, "")) * 83;
      return parseFloat(price);
    }
    return price;
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = filteredProducts.filter((product) => {
      const withinPrice = getNumericPrice(product.price) <= maxPrice;
      const inCategory =
        categoryFilter === "All" || product.category === categoryFilter;
      return withinPrice && inCategory;
    });

    if (sortOption === "Price: Low to High") {
      filtered.sort(
        (a, b) => getNumericPrice(a.price) - getNumericPrice(b.price)
      );
    } else if (sortOption === "Price: High to Low") {
      filtered.sort(
        (a, b) => getNumericPrice(b.price) - getNumericPrice(a.price)
      );
    } else if (sortOption === "Name: A-Z") {
      filtered.sort((a, b) => {
        if (!a.name || !b.name) return 0; // skip sorting if name is missing
        return a.name.localeCompare(b.name);
      });
    }

    return filtered;
  }, [products, maxPrice, categoryFilter, sortOption, filteredProducts]);

  // Pagination
  const PRODUCTS_PER_PAGE = 6;
  const totalPages = Math.ceil(
    filteredAndSortedProducts.length / PRODUCTS_PER_PAGE
  );
  const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
  const currentProducts = filteredAndSortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const reset = () => {
    setMaxPrice(12000);
    setCurrentPage(1);
    setSortOption("Default");
    setCategoryFilter("All");
  };

  const handleAddProduct = () => {
    console.log("hi");
    setShowForms(true);
  };
  const handleEditProduct = (id) => {
    setEditProductId(id);
    setShowEditForms(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteProductById(id);
      dispatch(addProducts(products.filter((product) => product._id !== id)));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {showForms && (
        <>
          <AddProduct setShowForms={setShowForms} />
        </>
      )}
      {showEditForms && (
        <>
          <EditProduct
            setShowEditForms={setShowEditForms}
            editProductId={editProductId}
          />
        </>
      )}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-blue-500 bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-6">
              Do you really want to delete{" "}
              <strong>{productToDelete.name}</strong>? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 hover:cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDelete(productToDelete._id);
                  setShowDeleteModal(false);
                }}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 hover:cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col min-h-screen">
        <div className="flex flex-col md:flex-row flex-grow bg-gray-200">
          <aside className="w-full md:w-64 bg-gray-300 p-6 text-gray-800 space-y-10 border-b md:border-b-0 md:border-r border-gray-300">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Price
              </h2>
              <input
                type="range"
                min="0"
                max="12000"
                value={maxPrice}
                onChange={(e) => dispatch(setMaxPrice(Number(e.target.value)))}
                className="w-full accent-indigo-600"
              />
              <div className="mt-3 text-md text-gray-600">
                <span className="font-bold text-indigo-600">₹{maxPrice}</span>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Sort By
              </h2>
              <select
                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={sortOption}
                onChange={(e) => {
                  console.log(e.target.value);
                  dispatch(setSortOption(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option>Default</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Name: A-Z</option>
              </select>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Filter by Category
              </h2>
              <select
                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={categoryFilter}
                onChange={(e) => {
                  dispatch(setCategoryFilter(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value="All">All</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </aside>

          {currentProducts.length > 0 ? (
            <div className="flex flex-col">
              <div className="p-4 flex justify-center">
                <div className="relative w-full sm:w-96">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    {/* Heroicons search icon */}
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                      />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200"
                    value={searchQuery}
                    onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center p-6 bg-gray-200 flex-grow">
                  {currentProducts.map((product) => (
                    <div
                      key={product._id}
                      className="group relative w-80 sm:w-72 lg:w-80 overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-lg bg-gray-200"
                    >
                      <div className="absolute top-3 left-3 z-20 flex gap-2">
                        <button
                          onClick={() => {
                            setProductToDelete(product);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 bg-red-500 hover:bg-red-600 rounded-full text-white shadow-md transition hover:cursor-pointer"
                          title="Delete"
                          aria-label="Delete Product"
                        >
                          {/* Trash Icon (Heroicons) */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0a1 1 0 011 1v0a1 1 0 01-1 1H7a1 1 0 01-1-1v0a1 1 0 011-1h10z"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className="absolute top-3 right-3 z-20 flex gap-2">
                        <span
                          onClick={() => handleEditProduct(product._id)}
                          className="p-2 bg-blue-500 hover:bg-blue-600 rounded-full text-white shadow-md transition hover:cursor-pointer"
                          title="Edit"
                          aria-label="Edit Product"
                        >
                          {/* Pencil Icon (Heroicons) */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-5M16.5 3.5l4 4L13 15H9v-4L16.5 3.5z"
                            />
                          </svg>
                        </span>
                      </div>

                      <div className="relative">
                        <img
                          src={product.image_urls[0]}
                          alt={product.alt}
                          className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105 rounded-t-lg"
                        />
                        <img
                          src={product.image_urls[1]}
                          alt={product.alt}
                          className="w-full h-80 object-cover absolute top-0 left-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:scale-105 rounded-t-lg"
                        />
                        <Link to={`/product/${product._id}`}>
                          <button className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-70 text-white text-center py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-lg hover:cursor-pointer">
                            <span className="font-semibold">View Details</span>
                          </button>
                        </Link>
                      </div>

                      <div className="bg-gray-300 p-4 rounded-b-lg">
                        <p className="text-gray-500 text-sm mb-1">
                          {product.category}
                        </p>
                        <h3 className="text-gray-800 font-semibold text-lg leading-tight mb-2 truncate">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xl font-bold text-gray-900">
                            {product.price}
                          </span>
                          <div className="text-yellow-400 text-sm">
                            ⭐⭐⭐⭐⭐
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {currentPage === totalPages && (
                    <div
                      onClick={handleAddProduct}
                      className="flex flex-col items-center justify-center w-80 sm:w-72 lg:w-80 h-80 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-100 transition-all duration-300 group"
                    >
                      <div className="text-6xl text-blue-400 group-hover:text-blue-600 transition">
                        +
                      </div>
                      <p className="mt-2 text-blue-500 font-medium text-sm group-hover:text-blue-700 transition">
                        Add New Product
                      </p>
                    </div>
                  )}
                </div>

                <div className="hidden sm:block bg-gray-200">
                  {filteredAndSortedProducts.length > PRODUCTS_PER_PAGE && (
                    <div className="flex justify-center items-center space-x-4 my-6 bg-gray-200 p-4 rounded-md shadow-md w-fit mx-auto">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="hover:cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-500 hover:bg-blue-600 transition duration-200"
                      >
                        Prev
                      </button>

                      <span className="px-4 py-2 text-blue-700 font-medium">
                        Page {currentPage} of {totalPages}
                      </span>

                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="hover:cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-500 hover:bg-blue-600 transition duration-200"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center w-full min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl border border-blue-300 shadow-inner p-8">
              <div className="mb-6 p-4 bg-white/70 rounded-full shadow">
                <svg
                  className="w-12 h-12 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.75 9.75L14.25 14.25M14.25 9.75L9.75 14.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-blue-900">
                No Products Found
              </h2>
              <p className="text-base text-blue-800 mt-3 max-w-md">
                There are currently no products matching your filter. Try
                changing your category, price range, or sort option.
              </p>
              <button
                onClick={() => {
                  dispatch(resetFilter());
                  dispatch(setSearchQuery(""));
                }}
                className="mt-6 px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow transition duration-300 hover:cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductList;
