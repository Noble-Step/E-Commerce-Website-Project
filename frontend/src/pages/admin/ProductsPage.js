import React, { useState } from "react";
import AdminLayout from "./components/AdminLayout";
import { useProducts } from "../../context/ProductContext";
import { Plus, PencilLine, Trash2, X } from "lucide-react";
import { getImageUrl } from "../../utils/sanitize";
import AlertModal, { ALERT_TYPES } from "../../modals/AlertModal";

const ProductsPage = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    sizes: [],
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [sizeInput, setSizeInput] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages((prev) => [...prev, ...files]);
  };

  const removeSelectedImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imagePath) => {
    setExistingImages((prev) => prev.filter((img) => img !== imagePath));
    setRemovedImages((prev) => [...prev, imagePath]);
  };

  const handleSizeAdd = () => {
    if (sizeInput.trim() && !formData.sizes.includes(sizeInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        sizes: [...prev.sizes, sizeInput.trim()],
      }));
      setSizeInput("");
    }
  };

  const handleSizeRemove = (sizeToRemove) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((size) => size !== sizeToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("stock", formData.stock);
      formDataToSend.append("sizes", JSON.stringify(formData.sizes));

      selectedImages.forEach((file) => {
        formDataToSend.append("images", file);
      });

      if (editingProduct) {
        formDataToSend.append("existingImages", JSON.stringify(existingImages));
        if (removedImages.length > 0) {
          formDataToSend.append("removedImages", JSON.stringify(removedImages));
        }
      }

      if (editingProduct) {
        await updateProduct(
          editingProduct._id || editingProduct.id,
          formDataToSend
        );
        setAlertConfig({
          ...ALERT_TYPES.SUCCESS,
          message: "Product updated successfully",
        });
      } else {
        await addProduct(formDataToSend);
        setAlertConfig({
          ...ALERT_TYPES.SUCCESS,
          message: "Product added successfully",
        });
      }

      setShowAlert(true);
      setShowModal(false);
      resetForm();
    } catch (error) {
      // Prefer server-provided message when available (validation errors)
      // Prefer detailed validation errors (field: message) when provided
      let serverMessage = null;
      if (
        error?.response?.data?.errors &&
        Array.isArray(error.response.data.errors) &&
        error.response.data.errors.length > 0
      ) {
        serverMessage = error.response.data.errors
          .map((e) => (e.field ? `${e.field}: ${e.message}` : e.message))
          .join("; ");
      } else {
        serverMessage = error?.response?.data?.message || null;
      }

      setAlertConfig({
        type: "error",
        title: "Error",
        message: serverMessage || error.message || "Failed to save product",
      });
      setShowAlert(true);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price?.toString() || "",
      category: product.category || "",
      stock: product.stock?.toString() || "",
      sizes: product.sizes || [],
    });
    setExistingImages(product.images || []);
    setSelectedImages([]);
    setRemovedImages([]);
    setSizeInput("");
    setShowModal(true);
  };

  const handleDelete = (product) => {
    setAlertConfig({
      ...ALERT_TYPES.DELETE_CONFIRM,
      onConfirm: async () => {
        try {
          await deleteProduct(product._id || product.id);
          setAlertConfig({
            ...ALERT_TYPES.SUCCESS,
            message: "Product deleted successfully",
          });
        } catch (error) {
          setAlertConfig({
            type: "error",
            title: "Error",
            message: error.message || "Failed to delete product",
          });
        }
        setShowAlert(true);
      },
    });
    setShowAlert(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      sizes: [],
    });
    setSelectedImages([]);
    setExistingImages([]);
    setRemovedImages([]);
    setSizeInput("");
    setEditingProduct(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-4 lg:space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <h1 className="text-xl lg:text-2xl font-bold text-white">Products</h1>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition flex items-center justify-center gap-2 text-sm lg:text-base"
          >
            <Plus size={20} />
            Add Product
          </button>
        </div>

        {/* Products Table */}
        <div className="bg-gray-900 rounded-xl lg:rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 lg:py-4 px-4 lg:px-6 text-gray-400 font-medium text-xs lg:text-sm">
                    Product
                  </th>
                  <th className="text-left py-3 lg:py-4 px-4 lg:px-6 text-gray-400 font-medium text-xs lg:text-sm">
                    Category
                  </th>
                  <th className="text-left py-3 lg:py-4 px-4 lg:px-6 text-gray-400 font-medium text-xs lg:text-sm">
                    Price
                  </th>
                  <th className="text-left py-3 lg:py-4 px-4 lg:px-6 text-gray-400 font-medium text-xs lg:text-sm">
                    Stock
                  </th>
                  <th className="text-left py-3 lg:py-4 px-4 lg:px-6 text-gray-400 font-medium text-xs lg:text-sm hidden md:table-cell">
                    Rating
                  </th>
                  <th className="text-right py-3 lg:py-4 px-4 lg:px-6 text-gray-400 font-medium text-xs lg:text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product._id || product.id}
                    className="border-b border-gray-800"
                  >
                    <td className="py-3 lg:py-4 px-4 lg:px-6">
                      <div className="flex items-center gap-2 lg:gap-3">
                        {product.images && product.images.length > 0 && (
                          <img
                            src={getImageUrl(product.images[0])}
                            alt={product.name}
                            className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-white text-sm lg:text-base truncate">
                            {product.name}
                          </p>
                          {product.sizes && product.sizes.length > 0 && (
                            <p className="text-xs text-gray-400 truncate">
                              Sizes: {product.sizes.join(", ")}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 lg:py-4 px-4 lg:px-6 text-gray-300 text-xs lg:text-sm">
                      {product.category}
                    </td>
                    <td className="py-3 lg:py-4 px-4 lg:px-6 text-gray-300 text-xs lg:text-sm">
                      ${product.price?.toFixed(2)}
                    </td>
                    <td className="py-3 lg:py-4 px-4 lg:px-6 text-gray-300 text-xs lg:text-sm">
                      {product.stock || 0}
                    </td>
                    <td className="py-3 lg:py-4 px-4 lg:px-6 hidden md:table-cell">
                      <div className="flex items-center gap-1 text-yellow-400">
                        <span className="text-xs lg:text-sm">
                          {product.ratings?.average?.toFixed(1) || "0.0"}
                        </span>
                        <svg
                          className="w-3 h-3 lg:w-4 lg:h-4 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-xs text-gray-400">
                          ({product.ratings?.count || 0})
                        </span>
                      </div>
                    </td>
                    <td className="py-3 lg:py-4 px-4 lg:px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition"
                        >
                          <PencilLine
                            size={16}
                            className="lg:w-[18px] lg:h-[18px]"
                          />
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition"
                        >
                          <Trash2
                            size={16}
                            className="lg:w-[18px] lg:h-[18px]"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Product Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl lg:rounded-2xl p-4 lg:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 lg:mb-6">
              <h2 className="text-lg lg:text-xl font-semibold text-white">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-white rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs lg:text-sm text-gray-400 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-black border border-gray-800 rounded-lg px-3 lg:px-4 py-2 text-white focus:border-yellow-400 focus:outline-none text-sm lg:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-xs lg:text-sm text-gray-400 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full bg-black border border-gray-800 rounded-lg px-3 lg:px-4 py-2 text-white focus:border-yellow-400 focus:outline-none text-sm lg:text-base"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3 lg:gap-4">
                <div>
                  <label className="block text-xs lg:text-sm text-gray-400 mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full bg-black border border-gray-800 rounded-lg px-3 lg:px-4 py-2 text-white focus:border-yellow-400 focus:outline-none text-sm lg:text-base"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs lg:text-sm text-gray-400 mb-1">
                    Stock *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full bg-black border border-gray-800 rounded-lg px-3 lg:px-4 py-2 text-white focus:border-yellow-400 focus:outline-none text-sm lg:text-base"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs lg:text-sm text-gray-400 mb-1">
                  Category *
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-black border border-gray-800 rounded-lg px-3 lg:px-4 py-2 text-white focus:border-yellow-400 focus:outline-none text-sm lg:text-base"
                  required
                />
              </div>

              {/* Images Section */}
              <div>
                <label className="block text-xs lg:text-sm text-gray-400 mb-1">
                  Images *
                </label>

                {/* Existing Images (when editing) */}
                {existingImages.length > 0 && (
                  <div className="mb-4 space-y-2">
                    <p className="text-xs text-gray-500">Existing Images:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {existingImages.map((imagePath, index) => (
                        <div key={index} className="relative">
                          <img
                            src={getImageUrl(imagePath)}
                            alt={`Existing ${index + 1}`}
                            className="w-full h-20 lg:h-24 object-cover rounded-lg border border-gray-800"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(imagePath)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                          >
                            <X size={12} className="lg:w-[14px] lg:h-[14px]" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selected New Images Preview */}
                {selectedImages.length > 0 && (
                  <div className="mb-4 space-y-2">
                    <p className="text-xs text-gray-500">New Images:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedImages.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 lg:h-24 object-cover rounded-lg border border-gray-800"
                          />
                          <button
                            type="button"
                            onClick={() => removeSelectedImage(index)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                          >
                            <X size={12} className="lg:w-[14px] lg:h-[14px]" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* File Input */}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="w-full bg-black border border-gray-800 rounded-lg px-3 lg:px-4 py-2 text-white focus:border-yellow-400 focus:outline-none text-xs lg:text-sm file:mr-3 lg:file:mr-4 file:py-1.5 lg:file:py-2 file:px-3 lg:file:px-4 file:rounded-lg file:border-0 file:text-xs lg:file:text-sm file:font-semibold file:bg-yellow-400 file:text-black hover:file:bg-yellow-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  You can select multiple images. Max 10 images, 5MB each.
                </p>
              </div>

              {/* Sizes Section */}
              <div>
                <label className="block text-xs lg:text-sm text-gray-400 mb-1">
                  Sizes (Optional)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={sizeInput}
                    onChange={(e) => setSizeInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSizeAdd();
                      }
                    }}
                    placeholder="Enter size (e.g., 7, 8, 9, M, L)"
                    className="flex-1 bg-black border border-gray-800 rounded-lg px-3 lg:px-4 py-2 text-white focus:border-yellow-400 focus:outline-none text-sm lg:text-base"
                  />
                  <button
                    type="button"
                    onClick={handleSizeAdd}
                    className="px-3 lg:px-4 py-2 bg-yellow-400/20 text-yellow-400 rounded-lg hover:bg-yellow-400/30 transition text-sm lg:text-base whitespace-nowrap"
                  >
                    Add
                  </button>
                </div>
                {formData.sizes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.sizes.map((size, index) => (
                      <span
                        key={index}
                        className="px-2 lg:px-3 py-1 bg-gray-800 rounded-lg text-white text-xs lg:text-sm flex items-center gap-2"
                      >
                        {size}
                        <button
                          type="button"
                          onClick={() => handleSizeRemove(size)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X size={12} className="lg:w-[14px] lg:h-[14px]" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition text-sm lg:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition text-sm lg:text-base font-medium"
                >
                  {editingProduct ? "Update Product" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {alertConfig && (
        <AlertModal
          isOpen={showAlert}
          onClose={() => setShowAlert(false)}
          {...alertConfig}
        />
      )}
    </AdminLayout>
  );
};

export default ProductsPage;
