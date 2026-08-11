import React, { useEffect, useState } from "react";
import TopNavbar from "../Components/TopNavbar";
import { useDispatch, useSelector } from "react-redux";
import { IoMdAdd } from "react-icons/io";
import { MdKeyboardDoubleArrowLeft, MdFileDownload } from "react-icons/md";
import {
  CreateSupplier,
  gettingallSupplier,
  deleteSupplier,
  SearchSupplier,
  EditSupplier,
} from "../features/SupplierSlice";
import { gettingallproducts } from "../features/productSlice";
import toast from "react-hot-toast";
import FormattedTime from "../lib/FormattedTime ";

// React PDF Engine Imports
import { PDFDownloadLink } from "@react-pdf/renderer";
import SupplierPDFReport from "../downloadable/SupplierPDFReport"; // Make sure path matches where you put the file above

function Supplierpage() {
  const { getallSupplier, searchdata, editedsupplier } = useSelector(
    (state) => state.supplier
  );
  const { getallproduct } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  const [query, setQuery] = useState("");
  const [name, setName] = useState("");
  const [Phone, setPhone] = useState("");
  const [Address, setAddress] = useState("");
  const [Email, setEmail] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [Product, setProduct] = useState("");

  useEffect(() => {
    dispatch(gettingallSupplier());
    dispatch(gettingallproducts());
  }, [dispatch, editedsupplier]);

  // Debounced search logic
  useEffect(() => {
    if (query.trim() !== "") {
      const timeoutId = setTimeout(() => {
        dispatch(SearchSupplier(query));
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      dispatch(gettingallSupplier());
    }
  }, [query, dispatch]);

  const resetForm = () => {
    setName("");
    setPhone("");
    setAddress("");
    setEmail("");
    setProduct("");
    setSelectedSupplier(null);
  };

  const handleEditClick = (supplier) => {
    setSelectedSupplier(supplier);
    setName(supplier.name || "");
    setPhone(supplier.contactInfo?.phone || "");
    setEmail(supplier.contactInfo?.email || "");
    setAddress(supplier.contactInfo?.address || "");

    const initialProduct = Array.isArray(supplier?.productsSupplied)
      ? supplier.productsSupplied[0]?._id || supplier.productsSupplied[0] || ""
      : supplier?.productsSupplied?._id || supplier?.productsSupplied || "";

    setProduct(initialProduct);
    setIsFormVisible(true);
  };

  const handleEditSubmit = (event) => {
    event.preventDefault();
    if (!selectedSupplier) return;

    const updatedData = {
      name,
      contactInfo: {
        phone: Phone,
        email: Email,
        address: Address,
      },
      productsSupplied: Product ? [Product] : [],
    };

    dispatch(EditSupplier({ supplierId: selectedSupplier._id, updatedData }))
      .unwrap()
      .then(() => {
        toast.success("Supplier updated successfully");
        setIsFormVisible(false);
        resetForm();
      })
      .catch(() => {
        toast.error("Failed to update supplier");
      });
  };

  const submitSupplier = async (event) => {
    event.preventDefault();

    const supplierInfo = {
      name,
      contactInfo: {
        phone: Phone,
        email: Email,
        address: Address,
      },
      productsSupplied: Product ? [Product] : [],
    };

    dispatch(CreateSupplier(supplierInfo))
      .unwrap()
      .then(() => {
        toast.success("Supplier added successfully");
        setIsFormVisible(false);
        resetForm();
        dispatch(gettingallSupplier());
      })
      .catch(() => {
        toast.error("Failed to add supplier");
      });
  };

  const handleRemove = async (supplierId) => {
    dispatch(deleteSupplier(supplierId))
      .unwrap()
      .then(() => {
        toast.success("Supplier removed successfully");
      })
      .catch((error) => {
        toast.error(error || "Failed to remove supplier");
      });
  };

  const displaySuppliers = query.trim() !== "" ? searchdata : getallSupplier;

  if (!getallSupplier) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center text-base-content">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="bg-base-100 min-h-screen text-base-content transition-colors duration-300">
      <TopNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metric Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-base-200 border border-base-300 p-6 rounded-2xl shadow-xs">
            <h2 className="text-xs font-semibold uppercase tracking-wider opacity-60">
              Total Suppliers
            </h2>
            <p className="text-3xl font-bold mt-2">
              {getallSupplier?.length || 0}
            </p>
          </div>
        </div>

        {/* Search and Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:w-96 h-11 px-4 bg-base-100 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            placeholder="Search suppliers by name or email..."
          />

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Download Report PDF Hook Trigger Button */}
            <PDFDownloadLink
              document={<SupplierPDFReport suppliersList={displaySuppliers} />}
              fileName="suppliers_directory_report.pdf"
              className="h-11 px-5 bg-base-200 border border-base-300 hover:bg-base-300 text-base-content font-medium rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer text-sm"
            >
              {({ loading }) => (
                <>
                  <MdFileDownload className="text-xl text-rose-500" />
                  <span>{loading ? "Compiling PDF..." : "Download PDF"}</span>
                </>
              )}
            </PDFDownloadLink>

            <button
              onClick={() => {
                resetForm();
                setIsFormVisible(true);
              }}
              className="h-11 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs text-sm"
            >
              <IoMdAdd className="text-xl" /> Add Supplier
            </button>
          </div>
        </div>

        {/* Side Drawer Form Overlay */}
        {isFormVisible && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
            <div className="w-full max-w-md bg-base-100 h-full p-6 border-l border-base-300 overflow-y-auto shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-base-300 mb-6">
                  <h2 className="text-lg font-bold">
                    {selectedSupplier ? "Edit Supplier" : "Add Supplier"}
                  </h2>
                  <button
                    onClick={() => setIsFormVisible(false)}
                    className="p-2 hover:bg-base-200 rounded-lg transition-colors"
                  >
                    <MdKeyboardDoubleArrowLeft className="text-2xl" />
                  </button>
                </div>

                <form
                  id="supplier-form"
                  onSubmit={selectedSupplier ? handleEditSubmit : submitSupplier}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold uppercase mb-1 opacity-70">
                      Supplier Name
                    </label>
                    <input
                      value={name}
                      placeholder="e.g. Acme Logistics"
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                      className="w-full h-10 px-3 bg-base-200 border border-base-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase mb-1 opacity-70">
                      Phone Number
                    </label>
                    <input
                      value={Phone}
                      placeholder="+254 700 000 000"
                      onChange={(e) => setPhone(e.target.value)}
                      type="text"
                      className="w-full h-10 px-3 bg-base-200 border border-base-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase mb-1 opacity-70">
                      Email Address
                    </label>
                    <input
                      value={Email}
                      placeholder="contact@supplier.com"
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      className="w-full h-10 px-3 bg-base-200 border border-base-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase mb-1 opacity-70">
                      Physical Address
                    </label>
                    <input
                      type="text"
                      placeholder="City, Industrial Area"
                      value={Address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full h-10 px-3 bg-base-200 border border-base-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase mb-1 opacity-70">
                      Product Supplied
                    </label>
                    <select
                      value={Product}
                      onChange={(e) => setProduct(e.target.value)}
                      className="w-full h-10 px-3 bg-base-200 border border-base-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">Select a product (optional)</option>
                      {getallproduct?.map((prod) => (
                        <option key={prod._id} value={prod._id}>
                          {prod.name}
                        </option>
                      ))}
                    </select>
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
                  form="supplier-form"
                  className="w-1/2 h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-sm transition-colors"
                >
                  {selectedSupplier ? "Update" : "Save Supplier"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Suppliers Data Table */}
        <div className="bg-base-100 border border-base-300 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-base-300">
            <h2 className="font-semibold text-lg">Supplier Directory</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-base-200/50 border-b border-base-300 text-xs uppercase opacity-70">
                <tr>
                  <th className="px-4 py-3 w-12 text-center">#</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Address</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3 text-center w-48">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-300">
                {Array.isArray(displaySuppliers) && displaySuppliers.length > 0 ? (
                  displaySuppliers.map((supplier, index) => (
                    <tr
                      key={supplier._id}
                      className="hover:bg-base-200/30 transition-colors"
                    >
                      <td className="px-4 py-3 text-center font-mono opacity-60">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 font-semibold">{supplier.name}</td>
                      <td className="px-4 py-3 font-mono opacity-80">
                        {supplier.contactInfo?.phone || "N/A"}
                      </td>
                      <td className="px-4 py-3 opacity-80">
                        {supplier.contactInfo?.email || "N/A"}
                      </td>
                      <td className="px-4 py-3 opacity-70">
                        {supplier.contactInfo?.address || "N/A"}
                      </td>
                      <td className="px-4 py-3 opacity-60 text-xs">
                        <FormattedTime timestamp={supplier.createdAt} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(supplier)}
                            className="px-3 py-1.5 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-lg text-xs font-semibold transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleRemove(supplier._id)}
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
                    <td colSpan="7" className="text-center py-12 opacity-50">
                      No suppliers found matching your criteria.
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

export default Supplierpage;