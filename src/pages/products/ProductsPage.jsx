import React, { useState } from "react";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import meat from "../../assets/meat.png";
import chicken from "../../assets/chicken.png";
import beef from "../../assets/beef.png";
import mutton from "../../assets/motton.png";

const Products = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      image: chicken,
      name: "Fresh Chicken Breast",
      weight: "1 KG",
      purchasePrice: 20,
      sellingPrice: 28,
    },
    {
      id: 2,
      image: mutton,
      name: "Mutton Boneless",
      weight: "1 KG",
      purchasePrice: 40,
      sellingPrice: 52,
    },
    {
      id: 3,
      image: beef,
      name: "Beef Mince",
      weight: "1 KG",
      purchasePrice: 22,
      sellingPrice: 34,
    },
    {
      id: 4,
      image: meat,
      name: "Fresh Chicken Breast",
      weight: "1 KG",
      purchasePrice: 20,
      sellingPrice: 28,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    image: "",
    name: "",
    weight: "",
    purchasePrice: "",
    sellingPrice: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const { image, name, weight, purchasePrice, sellingPrice } = formData;
    if (!name || !weight || !purchasePrice || !sellingPrice) return;

    setProducts([
      ...products,
      {
        id: products.length + 1,
        image,
        name,
        weight,
        purchasePrice: parseFloat(purchasePrice),
        sellingPrice: parseFloat(sellingPrice),
      },
    ]);

    setIsModalOpen(false);
    setFormData({
      image: "",
      name: "",
      weight: "",
      purchasePrice: "",
      sellingPrice: "",
    });
  };

  const handleDelete = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

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

        {/* Product Table */}
        <div className="bg-white border rounded-lg shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700 text-sm font-semibold">
              <tr>
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Weight</th>
                <th className="py-3 px-4">Purchase Price</th>
                <th className="py-3 px-4">Selling Price</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4">
                    <img
                      src={product.image}
                      className="w-16 h-16 rounded object-contain"
                      alt={product.name}
                    />
                  </td>

                  <td className="py-3 px-4 font-medium text-gray-800">
                    {product.name}
                  </td>

                  <td className="py-3 px-4 text-gray-600">{product.weight}</td>

                  <td className="py-3 px-4 text-gray-600">
                    ₹{product.purchasePrice.toFixed(2)}
                  </td>

                  <td className="py-3 px-4 text-gray-800 font-semibold">
                    ₹{product.sellingPrice.toFixed(2)}
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2">
                      <button className="text-primary hover:bg-blue-50 p-2 rounded">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Add Product
            </h3>

            <div className="space-y-4">
              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border rounded-md focus:ring-primary"
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium mb-1">Weight</label>
                <input
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="1 KG, 500g, etc."
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              {/* Purchase Price */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Purchase Price
                </label>
                <input
                  type="number"
                  name="purchasePrice"
                  value={formData.purchasePrice}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              {/* Selling Price */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Selling Price
                </label>
                <input
                  type="number"
                  name="sellingPrice"
                  value={formData.sellingPrice}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              {/* Buttons */}
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
