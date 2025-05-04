import React, { useState } from "react";
import axios from "axios";
import { addProduct } from "../apis/api";

const AddProduct = ({ setShowForms }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image_urls: [],
  });

  const [uploading, setUploading] = useState(false);
  const [warning, setWarning] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const categories = [
    "Men's Kurta",
    "Women's Midi",
    "Men's Sharwani",
    "Women's Skirt",
    "Men's Party Wear",
    "Women's Baniyan",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 3 - formData.image_urls.length;

    if (files.length > remainingSlots) {
      setWarning(`You can only upload up to 3 images.`);
      return;
    }

    setWarning("");
    setUploading(true);

    try {
      const uploadPromises = files.map((file) => {
        const data = new FormData();
        data.append("file", file);

        data.append("upload_preset", "playbook_Message");
        data.append("cloud_name", "diffyfwwy");

        return axios
          .post("https://api.cloudinary.com/v1_1/diffyfwwy/image/upload", data)
          .then((res) => res.data);
      });

      const results = await Promise.all(uploadPromises);
      const newUrls = results.map((res) => res.secure_url);

      console.log(newUrls);

      setFormData((prev) => ({
        ...prev,
        image_urls: [...prev.image_urls, ...newUrls],
      }));
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addProduct(formData);
      setMessage("Product added successfully!");
      setMessageType("success");
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        image_urls: [],
      });
    } catch (error) {
      console.error("Failed to add product:", error);
      setMessage("Product Added With Partial Contents.");
      setMessageType("error");
    } finally {
      window.location.reload();
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      image_urls: prevData.image_urls.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  return (
    <>
      {message && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-500 bg-opacity-75">
          <div className="bg-white border border-gray-300 shadow-xl rounded-lg p-6 w-80 relative text-center">
            <p
              className={`text-md font-semibold mb-4 ${
                messageType === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>

            <button
              onClick={() => {
                setMessage("");
                setMessageType("");
                setShowForms(false);
              }}
              className="mt-2 px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md hover:cursor-pointer"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div className="fixed inset-0 z-30 flex items-center justify-center bg-blue-500 bg-opacity-75 p-4">
        <div className="bg-white border border-gray-300 rounded-xl shadow-lg w-full max-w-md p-4 relative">
          <h2 className="text-xl font-semibold text-center text-blue-700 mb-4">
            Add Product
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Product Name */}
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />

            {/* Product Description */}
            <textarea
              name="description"
              placeholder="Product Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
              rows={2}
            ></textarea>

            {/* Product Price */}
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />

            {/* Product Category */}
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
              <option value="" disabled>
                Select Category
              </option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Image Upload */}
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={formData.image_urls.length >= 3}
                className="w-full p-2 border border-gray-300 rounded-md text-sm cursor-pointer"
              />

              {warning && <p className="text-xs text-red-500">{warning}</p>}

              {uploading && (
                <p className="text-xs text-blue-500">Uploading image(s)...</p>
              )}

              <div className="grid grid-cols-3 gap-1 mt-2">
                {formData.image_urls.map((url, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={url}
                      alt={`Uploaded ${idx + 1}`}
                      className="w-full h-24 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full px-1 opacity-0 group-hover:opacity-100 transition hover:cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowForms(false)}
                className="px-4 py-1 bg-gray-200 hover:bg-gray-300 text-xs text-gray-700 rounded-md hover:cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-xs text-white rounded-md hover:cursor-pointer"
              >
                Add Product
              </button>
            </div>
          </form>

          {/* Close Button */}
          <span
            onClick={() => setShowForms(false)}
            className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl cursor-pointer hover:cursor-pointer"
          >
            &times;
          </span>
        </div>
      </div>
    </>
  );
};

export default AddProduct;
