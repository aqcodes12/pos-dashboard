import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import { showSuccessToast } from "../../utils/toastConfig";

import chicken from "../../assets/chicken.png";
import beef from "../../assets/beef.png";
import meat from "../../assets/meat.png";
import mutton from "../../assets/motton.png";
import DominoLoader from "../../components/DominoLoader";

const imageMapper = (name) => {
  name = name.toLowerCase();
  if (name.includes("chicken")) return chicken;
  if (name.includes("beef")) return beef;
  if (name.includes("mutton")) return mutton;
  return meat;
};

const Products = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    unit: "WEIGHT",
    weight: "",
    purchasePrice: "",
    sellingPrice: "",
    stock: "",
  });

  // ---------------------------------------------
  // FETCH ALL PRODUCTS
  // ---------------------------------------------
  const getProducts = async () => {
    try {
      const res = await axios.get("/product/getAll");
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (error) {
      console.error("Fetch products failed:", error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  // ---------------------------------------------
  // HANDLE INPUTS
  // ---------------------------------------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ---------------------------------------------
  // CREATE PRODUCT (POST)
  // ---------------------------------------------
  const handleSubmit = async () => {
    const { name, unit, weight, purchasePrice, sellingPrice, stock } = formData;

    if (!name || !purchasePrice || !sellingPrice) return;

    try {
      const payload = {
        name,
        unit,
        purchasePrice: Number(purchasePrice),
        sellingPrice: Number(sellingPrice),
      };

      if (unit === "WEIGHT") payload.weight = Number(weight);
      if (stock) payload.stock = Number(stock);

      const res = await axios.post("/product/create", payload);

      if (res.data.success) {
        showSuccessToast("Product added!");
        getProducts(); // refresh table
        setIsModalOpen(false);

        setFormData({
          name: "",
          weight: "",
          unit: "WEIGHT",
          purchasePrice: "",
          sellingPrice: "",
          stock: "",
        });
      }
    } catch (error) {
      console.error("Product create failed:", error);
    }
  };

  // ---------------------------------------------
  // DELETE (UI ONLY for now)
  // ---------------------------------------------
  const handleDelete = async (id) => {
    const confirmed = confirm("Delete this product?");
    if (!confirmed) return;

    try {
      await axios.delete(`/product/delete/${id}`);
      showSuccessToast("Product deleted");
      getProducts();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <DominoLoader />
      </div>
    );
  }

  // ---------------------------------------------
  // UI
  // ---------------------------------------------
  return (
    <div className="min-h-screen w-full p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-primary" />
            <h2 className="text-2xl font-bold text-gray-800">Products</h2>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg shadow flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Add Product
          </button>
        </div>

        {/* PRODUCT TABLE */}
        <div className="bg-white border rounded-lg shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700 text-sm font-semibold">
              <tr>
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Weight</th>
                <th className="py-3 px-4">Purchase Price</th>
                <th className="py-3 px-4">Selling Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4">
                    <img
                      src={imageMapper(product.name)}
                      className="w-16 h-16 rounded object-contain"
                      alt={product.name}
                    />
                  </td>

                  <td className="py-3 px-4 font-medium text-gray-800">
                    {product.name}
                  </td>

                  <td className="py-3 px-4 text-gray-600">
                    {product.unit === "WEIGHT" ? `${product.weight}g` : "-"}
                  </td>

                  <td className="py-3 px-4">SAR {product.purchasePrice}</td>

                  <td className="py-3 px-4 font-semibold">
                    SAR {product.sellingPrice}
                  </td>

                  <td className="py-3 px-4">{product.stock || "-"}</td>

                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2">
                      <button className="text-primary hover:bg-blue-50 p-2 rounded">
                        <Pencil className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:bg-red-50 p-2 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ----------------------- ADD PRODUCT MODAL ---------------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-xl">
            <h3 className="text-xl font-bold mb-4">Add Product</h3>

            <div className="space-y-4">
              <div>
                <label className="block mb-1">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block mb-1">Unit</label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="WEIGHT">WEIGHT</option>
                  <option value="PIECE">PIECE</option>
                </select>
              </div>

              {formData.unit === "WEIGHT" && (
                <div>
                  <label className="block mb-1">Weight (grams)</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              )}

              <div>
                <label className="block mb-1">Purchase Price</label>
                <input
                  type="number"
                  name="purchasePrice"
                  value={formData.purchasePrice}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block mb-1">Selling Price</label>
                <input
                  type="number"
                  name="sellingPrice"
                  value={formData.sellingPrice}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block mb-1">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="px-4 py-2 border rounded-md"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>

                <button
                  className="px-4 py-2 bg-primary text-white rounded-md"
                  onClick={handleSubmit}
                >
                  Save Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
