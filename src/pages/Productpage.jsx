import React, { useEffect, useState } from "react";
import TopNavbar from "../Components/TopNavbar";
import { IoMdAdd } from "react-icons/io";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import FormattedTime from "../lib/FormattedTime ";
import {
  Addproduct,
  gettingallproducts,
  Searchproduct,
  Removeproduct,
  EditProduct,
} from "../features/productSlice";
import { gettingallCategory } from "../features/categorySlice";
import toast from "react-hot-toast";

function Productpage() {
  const { getallproduct, editedProduct, isproductadd, searchdata } = useSelector(
    (state) => state.product
  );
  const { getallCategory } = useSelector((state) => state.category);
  const dispatch = useDispatch();

  const [query, setquery] = useState("");
  const [name, setName] = useState("");
  const [Category, setCategory] = useState("");
  const [Price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [Desciption, setDesciption] = useState("");
  const [dateAdded, setDateAdded] = useState(new Date().toISOString().split("T")[0]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    dispatch(gettingallproducts());
    dispatch(gettingallCategory());
  }, [dispatch, editedProduct, isproductadd]);

  // Debounced Search Handler
  useEffect(() => {
    if (query.trim() !== "") {
      const repeatTimeout = setTimeout(() => {
        dispatch(Searchproduct(query));
      }, 500);
      return () => clearTimeout(repeatTimeout);
    } else {
      dispatch(gettingallproducts());
    }
  }, [query, dispatch]);

  const resetForm = () => {
    setName("");
    setCategory("");
    setPrice("");
    setQuantity("");
    setDesciption("");
    setSelectedProduct(null);
    setDateAdded(new Date().toISOString().split("T")[0]);
  };

  const handleremove = async (productId) => {
    dispatch(Removeproduct(productId))
      .unwrap()
      .then(() => {
        toast.success("Product removed successfully");
      })
      .catch((error) => {
        toast.error(error || "Failed to remove product");
      });
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setName(product.name || "");
    setCategory(product.Category?._id || product.Category || "");
    setPrice(product.Price || "");
    setQuantity(product.quantity || "");
    setDesciption(product.Desciption || "");
    setIsFormVisible(true);
  };

  const handleEditSubmit = (event) => {
    event.preventDefault();
    if (!selectedProduct) return;

    const updatedData = {
      name,
      Category,
      Price: Number(Price),
      quantity: Number(quantity),
      Desciption,
      dateAdded: selectedProduct.dateAdded || new Date().toISOString(),
    };

    dispatch(EditProduct({ id: selectedProduct._id, updatedData }))
      .unwrap()
      .then(() => {
        toast.success("Product updated successfully");
        setIsFormVisible(false);
        resetForm();
      })
      .catch(() => {
        toast.error("Failed to update product");
      });
  };

  const submitProduct = async (event) => {
    event.preventDefault();
    const productData = {
      name,
      Desciption,
      Category,
      Price: Number(Price),
      quantity: Number(quantity),
      dateAdded: new Date(dateAdded).toISOString(),
    };

    dispatch(Addproduct(productData))
      .unwrap()
      .then(() => {
        toast.success("Product added successfully");
        setIsFormVisible(false);
        resetForm();
      })
      .catch(() => {
        toast.error("Failed to add product");
      });
  };

  const displayProducts = query.trim() !== "" ? searchdata : getallproduct;

  // Total inventory valuation calculation
  const totalStoreValue =
    getallproduct?.reduce((total, prod) => {
      const price = Number(prod.Price) || 0;
      const qty = Number(prod.quantity) || 1;
      return total + price * qty;
    }, 0) || 0;

  return (
    <div className="bg-base-100 min-h-screen text-base-content transition-colors duration-300">
      <TopNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-base-200 border border-base-300 p-6 rounded-2xl shadow-sm">
            <h2 className="text-xs font-semibold uppercase tracking-wider opacity-60">
              Total Products
            </h2>
            <p className="text-3xl font-bold mt-2">{getallproduct?.length || 0}</p>
          </div>

          <div className="bg-base-200 border border-base-300 p-6 rounded-2xl shadow-sm">
            <h2 className="text-xs font-semibold uppercase tracking-wider opacity-60">
              Total Store Value
            </h2>
            <p className="text-3xl font-bold mt-2 text-emerald-500">
              Ksh {totalStoreValue.toLocaleString()}
            </p>
          </div>

          <div className="bg-base-200 border border-base-300 p-6 rounded-2xl shadow-sm">
            <h2 className="text-xs font-semibold uppercase tracking-wider opacity-60">
              Total Categories
            </h2>
            <p className="text-3xl font-bold mt-2">{getallCategory?.length || 0}</p>
          </div>
        </div>

        {/* Action & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setquery(e.target.value)}
            className="w-full sm:w-96 h-11 px-4 bg-base-100 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            placeholder="Search products by name..."
          />

          <button
            onClick={() => {
              resetForm();
              setIsFormVisible(true);
            }}
            className="w-full sm:w-auto h-11 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <IoMdAdd className="text-xl" /> Add New Product
          </button>
        </div>

        {/* Sliding Side Form Drawer Overlay */}
        {isFormVisible && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
            <div className="w-full max-w-md bg-base-100 h-full p-6 border-l border-base-300 overflow-y-auto shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-base-300 mb-6">
                  <h2 className="text-lg font-bold">
                    {selectedProduct ? "Edit Product" : "Add Product"}
                  </h2>
                  <button
                    onClick={() => setIsFormVisible(false)}
                    className="p-2 hover:bg-base-200 rounded-lg transition-colors"
                  >
                    <MdKeyboardDoubleArrowLeft className="text-2xl" />
                  </button>
                </div>

                <form
                  id="product-form"
                  onSubmit={selectedProduct ? handleEditSubmit : submitProduct}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold uppercase mb-1 opacity-70">
                      Product Name
                    </label>
                    <input
                      value={name}
                      placeholder="e.g. Wireless Mouse"
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                      className="w-full h-10 px-3 bg-base-200 border border-base-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase mb-1 opacity-70">
                      Category
                    </label>
                    <select
                      value={Category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full h-10 px-3 bg-base-200 border border-base-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                      required
                    >
                      <option value="">Select a category</option>
                      {getallCategory?.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase mb-1 opacity-70">
                      Description
                    </label>
                    <textarea
                      value={Desciption}
                      placeholder="Brief details about the product..."
                      onChange={(e) => setDesciption(e.target.value)}
                      rows={3}
                      className="w-full p-3 bg-base-200 border border-base-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500 resize-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase mb-1 opacity-70">
                        Price (Ksh)
                      </label>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={Price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full h-10 px-3 bg-base-200 border border-base-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                        required
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase mb-1 opacity-70">
                        Quantity
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-full h-10 px-3 bg-base-200 border border-base-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                        required
                        min="0"
                      />
                    </div>
                  </div>
                </form>
              </div>

              <div className="pt-6 border-t border-base-300 mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormVisible(false)}
                  className="w-1/2 h-11 border border-base-300 hover:bg-base-200 rounded-xl font-medium text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="product-form"
                  className="w-1/2 h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-sm transition-colors"
                >
                  {selectedProduct ? "Update" : "Save Product"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Table */}
        <div className="bg-base-100 border border-base-300 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-base-300">
            <h2 className="font-semibold text-lg">Inventory List</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-base-200/50 border-b border-base-300 text-xs uppercase opacity-70">
                <tr>
                  <th className="px-4 py-3 w-12 text-center">#</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3 text-center">Qty</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3 text-center w-48">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-300">
                {Array.isArray(displayProducts) && displayProducts.length > 0 ? (
                  displayProducts.map((product, index) => (
                    <tr
                      key={product._id}
                      className="hover:bg-base-200/30 transition-colors"
                    >
                      <td className="px-4 py-3 text-center font-mono opacity-60">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 font-semibold">{product.name}</td>
                      <td className="px-4 py-3 opacity-80">
                        {product.Category?.name || "Uncategorized"}
                      </td>
                      <td className="px-4 py-3 opacity-70 max-w-xs truncate">
                        {product.Desciption}
                      </td>
                      <td className="px-4 py-3 text-center font-mono">
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-semibold ${
                            product.quantity < 5
                              ? "bg-rose-500/10 text-rose-500"
                              : "bg-base-200"
                          }`}
                        >
                          {product.quantity}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono font-medium">
                        Ksh {Number(product.Price).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 opacity-60 text-xs">
                        <FormattedTime timestamp={product?.createdAt} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(product)}
                            className="px-3 py-1.5 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-lg text-xs font-semibold transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleremove(product._id)}
                            className="px-3 py-1.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 rounded-lg text-xs font-semibold transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-12 opacity-50">
                      No products found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Productpage;