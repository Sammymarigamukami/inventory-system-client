import React, { useEffect, useState } from "react";
import TopNavbar from "../Components/TopNavbar";
import { IoMdAdd } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { gettingallproducts } from '../features/productSlice';
import FormattedTime from "../lib/FormattedTime ";
import {
  CreateSales, gettingallSales, EditSales, searchsalesdata
} from "../features/salesSlice";
import SalesChart from '../lib/Salesgraph';
import toast from "react-hot-toast";

function Salespage() {
  const { getallsales, searchdata } = useSelector((state) => state.sales);
  const { getallproduct } = useSelector((state) => state.product);

  const dispatch = useDispatch();
  const [query, setquery] = useState("");

  const [name, setName] = useState("");
  const [Product, setProduct] = useState("");
  const [Payment, setPayment] = useState("");
  const [Price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [paymentStatus, setpaymentStatus] = useState("");
  const [Status, setStatus] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedSales, setselectedSales] = useState(null);

  useEffect(() => {
    dispatch(gettingallSales());
    dispatch(gettingallproducts());
  }, [dispatch]);

  useEffect(() => {
    if (query.trim() !== "") {
      const repeatTimeout = setTimeout(() => {
        dispatch(searchsalesdata(query));
      }, 500);
      return () => clearTimeout(repeatTimeout);
    } else {
      dispatch(gettingallSales());
    }
  }, [query, dispatch]);

  const handleProductSelect = (productId) => {
    setProduct(productId);
    const selectedProd = getallproduct?.find((p) => p._id === productId);
    if (selectedProd) {
      setPrice(selectedProd.price || 0);
    } else {
      setPrice("");
    }
  };

  const handleEditSubmit = (event) => {
    event.preventDefault();
    if (!selectedSales) return;

    const updatedData = {
      customerName: name,
      products: {
        product: Product,
        quantity: Number(quantity),
        price: Number(Price)
      },
      paymentMethod: Payment,
      paymentStatus,
      status: Status
    };

    dispatch(EditSales({ salesId: selectedSales._id, updatedData }))
      .unwrap()
      .then(() => {
        toast.success("Sale updated successfully");
        setIsFormVisible(false);
        setselectedSales(null);
        resetForm();
      })
      .catch((error) => {
        console.error("Error updating sale:", error);
        toast.error("Failed to update sale");
      });
  };

  const submitsales = async (event) => {
    event.preventDefault();

    const salesData = {
      customerName: name,
      products: { product: Product, quantity: Number(quantity), price: Number(Price) },
      paymentMethod: Payment,
      paymentStatus,
      status: Status
    };

    dispatch(CreateSales(salesData))
      .unwrap()
      .then(() => {
        toast.success("Sales added successfully");
        setIsFormVisible(false);
        resetForm();
      })
      .catch(() => {
        toast.error("Sales add unsuccessful");
      });
  };

  const resetForm = () => {
    setName("");
    setProduct("");
    setPayment("");
    setPrice("");
    setQuantity("");
    setpaymentStatus("");
    setStatus("");
  };

  const handleEditClick = (sales) => {
    setselectedSales(sales);
    const prodId = sales.products?.product?._id || sales.products?.product || "";
    setName(sales.customerName || "");
    setProduct(prodId);
    setPayment(sales.paymentMethod || "");
    
    // Set price from sale item or lookup from product catalog
    const catalogProduct = getallproduct?.find((p) => p._id === prodId);
    setPrice(sales.products?.price ?? catalogProduct?.price ?? 0);

    setQuantity(sales.products?.quantity || "");
    setpaymentStatus(sales.paymentStatus || "");
    setStatus(sales.status || "");
    setIsFormVisible(true);
  };

  const displaySales = query.trim() !== "" ? searchdata : getallsales;

  return (
    <div className="bg-base-100 min-h-screen text-base-content transition-colors duration-300">
      <TopNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        
        {/* Header Bar */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 bg-clip-text text-transparent">
              Sales Dashboard
            </h1>
            <p className="text-sm opacity-70 mt-1">Manage, search, and track transactions</p>
          </div>
        </div>

        {/* Analytics Chart Container */}
        <div className="p-6 rounded-2xl border border-base-300 bg-base-200/50 shadow-sm mb-8">
          <SalesChart />
        </div>

        {/* Action Bar (Search & Add) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="relative w-full sm:w-96">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50 text-lg" />
            <input
              value={query}
              onChange={(e) => setquery(e.target.value)}
              type="text"
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-base-300 bg-base-200/50 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder="Search product or customer..."
            />
          </div>

          <button
            onClick={() => {
              setIsFormVisible(true);
              setselectedSales(null);
              resetForm();
            }}
            className="w-full sm:w-auto h-12 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all duration-200"
          >
            <IoMdAdd className="text-xl" />
            <span>Add New Sale</span>
          </button>
        </div>

        {/* --- MODAL DIALOGUE --- */}
        {isFormVisible && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
              onClick={() => setIsFormVisible(false)}
            ></div>

            <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-6 sm:p-8 border border-base-300 bg-base-100 shadow-2xl transition-all scale-100">
              
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-base-300">
                <div>
                  <h2 className="text-xl font-bold">
                    {selectedSales ? "Edit Transaction" : "Record New Sale"}
                  </h2>
                  <p className="text-xs opacity-70 mt-0.5">Fill in the details below to update records</p>
                </div>
                <button 
                  onClick={() => setIsFormVisible(false)}
                  className="p-2 rounded-lg opacity-60 hover:opacity-100 hover:bg-base-200 transition-colors"
                >
                  <MdClose className="text-2xl" />
                </button>
              </div>

              <form onSubmit={selectedSales ? handleEditSubmit : submitsales} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1.5">Customer Name</label>
                  <input
                    value={name}
                    placeholder="e.g. John Doe"
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    required
                    className="w-full h-11 px-3.5 rounded-xl border border-base-300 bg-base-200/50 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1.5">Product</label>
                    <select
                      value={Product}
                      onChange={(e) => handleProductSelect(e.target.value)}
                      required
                      className="w-full h-11 px-3.5 rounded-xl border border-base-300 bg-base-200/50 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    >
                      <option value="">Select Product</option>
                      {getallproduct?.map((product) => (
                        <option key={product._id} value={product._id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1.5">
                      Unit Price (Ksh) <span className="text-[10px] lowercase text-amber-500">(auto-filled)</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={Price}
                      readOnly
                      disabled
                      className="w-full h-11 px-3.5 rounded-xl border border-base-300 bg-base-300/40 opacity-70 text-sm cursor-not-allowed font-medium select-none focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1.5">Quantity</label>
                    <input
                      type="number"
                      placeholder="1"
                      value={quantity}
                      required
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-base-300 bg-base-200/50 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1.5">Payment Method</label>
                    <select
                      className="w-full h-11 px-3.5 rounded-xl border border-base-300 bg-base-200/50 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      value={Payment}
                      required
                      onChange={(e) => setPayment(e.target.value)}
                    >
                      <option value="">Method</option>
                      <option value={"cash"}>Cash</option>
                      <option value={"creditcard"}>Credit Card</option>
                      <option value={"banktransfer"}>Bank Transfer</option>
                      <option value={"mpesa"}>M-Pesa</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1.5">Payment Status</label>
                    <select
                      className="w-full h-11 px-3.5 rounded-xl border border-base-300 bg-base-200/50 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      value={paymentStatus}
                      required
                      onChange={(e) => setpaymentStatus(e.target.value)}
                    >
                      <option value="">Status</option>
                      <option value={"pending"}>Pending</option>
                      <option value={"paid"}>Paid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1.5">Order Status</label>
                    <select
                      className="w-full h-11 px-3.5 rounded-xl border border-base-300 bg-base-200/50 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      value={Status}
                      required
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="">Order Status</option>
                      <option value={"pending"}>Pending</option>
                      <option value={"completed"}>Completed</option>
                      <option value={"cancelled"}>Cancelled</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-12 mt-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-500/20 active:scale-98 transition-all duration-200"
                >
                  {selectedSales ? "Save Changes" : "Create Transaction"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* --- SALES TABLE --- */}
        <div className="rounded-2xl border border-base-300 bg-base-100 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-base-300">
            <h2 className="text-lg font-bold">Recent Transactions</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-base-300 bg-base-200/60 font-semibold opacity-80">
                  <th className="px-5 py-3.5">#</th>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Product Details</th>
                  <th className="px-5 py-3.5">Total Amount</th>
                  <th className="px-5 py-3.5">Order Status</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5">Payment</th>
                  <th className="px-5 py-3.5">Pay Status</th>
                  <th className="px-5 py-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-300">
                {Array.isArray(displaySales) && displaySales.length > 0 ? (
                  displaySales.map((sales, index) => (
                    <tr key={sales?._id} className="hover:bg-base-200/40 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs opacity-60">{index + 1}</td>
                      <td className="px-5 py-4 font-medium">{sales?.customerName}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-base-content/90">
                            {sales.products?.product?.name || "Deleted Product"}
                          </span>
                          <span className="text-xs opacity-60">
                            Ksh{sales.products?.price ?? 0} × {sales.products?.quantity ?? 0} unit(s)
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-semibold text-emerald-500">
                        Ksh{sales?.totalAmount}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          sales?.status === 'completed' 
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                            : sales?.status === 'pending' 
                            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                            : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                        }`}>
                          {sales?.status || "pending"}
                        </span>
                      </td>
                      <td className="px-5 py-4 opacity-70 text-xs">
                        <FormattedTime timestamp={sales?.createdAt} />
                      </td>
                      <td className="px-5 py-4 opacity-70 capitalize">{sales?.paymentMethod}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          sales?.paymentStatus === 'paid' 
                            ? 'bg-teal-500/10 text-teal-500 border border-teal-500/20' 
                            : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        }`}>
                          {sales?.paymentStatus || "pending"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => handleEditClick(sales)}
                          className="px-4 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 hover:bg-indigo-600 hover:text-white transition-all text-xs font-semibold active:scale-95"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-12 opacity-50">
                      No transactions match your query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Salespage;