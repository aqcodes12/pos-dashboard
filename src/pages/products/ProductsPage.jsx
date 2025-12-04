import React, { useState } from "react";
import { Plus, Pencil, Trash2, Package } from "lucide-react";

const Products = () => {
  const [products, setProducts] = useState([
    { id: 1, name: "Fresh Chicken Breast (1 KG)", price: 28.0, stock: 45 },
    { id: 2, name: "Mutton Boneless (1 KG)", price: 52.0, stock: 23 },
    { id: 3, name: "Chicken Wings (1 KG)", price: 18.5, stock: 150 },
    { id: 4, name: "Beef Mince (1 KG)", price: 34.0, stock: 67 },
    { id: 5, name: "Chicken Drumsticks (1 KG)", price: 22.0, stock: 120 },
    { id: 6, name: "Fresh Lamb Ribs (1 KG)", price: 60.0, stock: 15 },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.price || !formData.stock) return;

    const newProduct = {
      id: products.length + 1,
      name: formData.name,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
    };

    setProducts([...products, newProduct]);
    setIsModalOpen(false);
    setFormData({ name: "", price: "", stock: "" });
  };

  const handleDelete = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  return (
    <div className="min-h-screen w-full  p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header + Add button */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-primary" />
            <h2 className="text-2xl font-bold text-gray-800">Products</h2>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-primary transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>

        {/* Product Table */}
        <div className="bg-white overflow-x-auto border rounded-lg shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700 text-sm font-semibold">
              <tr>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4 font-medium text-gray-800">
                    {product.name}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        product.stock < 10
                          ? "bg-red-100 text-red-700"
                          : product.stock < 30
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {product.stock} units
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2">
                      <button className="text-primary hover:bg-blue-50 p-2 rounded transition">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:bg-red-50 p-2 rounded transition"
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
              Add New Product
            </h3>

            <div className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  placeholder="Enter product name"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  placeholder="0.00"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  placeholder="0"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-primary text-white rounded-md shadow hover:bg-primary transition"
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
