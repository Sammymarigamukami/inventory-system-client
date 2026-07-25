import React, { useState, useEffect } from "react";
import { IoMdAdd } from "react-icons/io";
import { MdClose } from "react-icons/md";
import FormattedTime from "../lib/FormattedTime ";
import TopNavbar from "../Components/TopNavbar";
import { useDispatch, useSelector } from "react-redux";
import {
  gettingallCategory,
  CreateCategory,
  RemoveCategory,
  SearchCategory,
} from "../features/categorySlice";
import toast from "react-hot-toast";

function Categorypage() {
  const { getallCategory, searchdata } = useSelector((state) => state.category);
  const dispatch = useDispatch();

  const [query, setQuery] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    dispatch(gettingallCategory());
  }, [dispatch]);

  // Debounced search effect
  useEffect(() => {
    if (query.trim() !== "") {
      const timeoutId = setTimeout(() => {
        dispatch(SearchCategory(query));
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      dispatch(gettingallCategory());
    }
  }, [query, dispatch]);

  const handleRemove = async (categoryId) => {
    dispatch(RemoveCategory(categoryId))
      .unwrap()
      .then(() => {
        toast.success("Category removed successfully");
        dispatch(gettingallCategory());
      })
      .catch((error) => {
        toast.error(error || "Failed to remove category");
      });
  };

  const handleOpenCreateForm = () => {
    setEditingCategory(null);
    resetForm();
    setIsFormVisible(true);
  };

  const handleOpenEditForm = (category) => {
    setEditingCategory(category);
    setName(category.name || "");
    setDescription(category.description || "");
    setIsFormVisible(true);
  };

  const submitCategory = async (event) => {
    event.preventDefault();
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    const categoryData = { name, description };

    if (editingCategory) {
      // Dispatch your update action here if present in categorySlice
      toast.error("Edit action not connected in Redux yet");
    } else {
      dispatch(CreateCategory(categoryData))
        .unwrap()
        .then(() => {
          toast.success("Category added successfully");
          resetForm();
          setIsFormVisible(false);
          dispatch(gettingallCategory());
        })
        .catch((err) => {
          toast.error(err || "Category add failed");
        });
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setEditingCategory(null);
  };

  const displayCategory = query.trim() !== "" ? searchdata : getallCategory;

  return (
    <div className="bg-base-100 min-h-screen text-base-content transition-colors duration-300">
      <TopNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-base-200 border border-base-300 rounded-2xl p-6 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider opacity-60">
                Total Categories
              </p>
              <h2 className="text-3xl font-extrabold mt-1">
                {getallCategory?.length || 0}
              </h2>
            </div>
          </div>
        </div>

        {/* Action Controls & Search Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search categories..."
            className="w-full sm:w-80 px-4 py-2.5 bg-base-100 border border-base-300 rounded-xl focus:outline-hidden focus:border-emerald-500 text-sm"
          />

          <button
            onClick={handleOpenCreateForm}
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <IoMdAdd className="text-lg" />
            Add Category
          </button>
        </div>

        {/* Data Table Container */}
        <div className="bg-base-200 border border-base-300 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-base-300">
            <h2 className="text-base font-bold">Category List</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-base-300/40 text-xs uppercase tracking-wider opacity-70 border-b border-base-300">
                <tr>
                  <th className="px-4 py-3 w-12 text-center">#</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Total Products</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Created At</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-300/60">
                {Array.isArray(displayCategory) && displayCategory.length > 0 ? (
                  displayCategory.map((category, index) => (
                    <tr
                      key={category._id || index}
                      className="hover:bg-base-300/20 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-center opacity-60">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        {category.name}
                      </td>
                      <td className="px-4 py-3 font-mono">
                        {category.productCount || 0}
                      </td>
                      <td className="px-4 py-3 opacity-80 max-w-xs truncate">
                        {category.description || "—"}
                      </td>
                      <td className="px-4 py-3 opacity-60 text-xs font-mono">
                        <FormattedTime timestamp={category.createdAt} />
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditForm(category)}
                          className="px-3 py-1 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 font-medium text-xs rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleRemove(category._id)}
                          className="px-3 py-1 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 font-medium text-xs rounded-lg transition-colors"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-8 opacity-50 text-sm"
                    >
                      No categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Slide-over Side Drawer Form */}
      {isFormVisible && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity">
          <div className="w-full max-w-md bg-base-100 h-full p-6 shadow-2xl border-l border-base-300 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-base-300 mb-6">
                <h2 className="text-lg font-bold">
                  {editingCategory ? "Edit Category" : "Add Category"}
                </h2>
                <button
                  onClick={() => setIsFormVisible(false)}
                  className="p-1 rounded-lg hover:bg-base-200 transition-colors"
                >
                  <MdClose className="text-xl" />
                </button>
              </div>

              <form onSubmit={submitCategory} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider opacity-70 block mb-1">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Electronics, Footwear"
                    className="w-full px-3 py-2 bg-base-200 border border-base-300 rounded-xl focus:outline-hidden focus:border-emerald-500 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider opacity-70 block mb-1">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter category description..."
                    className="w-full px-3 py-2 bg-base-200 border border-base-300 rounded-xl focus:outline-hidden focus:border-emerald-500 text-sm resize-none"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormVisible(false)}
                    className="flex-1 py-2.5 bg-base-200 hover:bg-base-300 text-sm font-medium rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition-colors"
                  >
                    {editingCategory ? "Update" : "Save Category"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Categorypage;