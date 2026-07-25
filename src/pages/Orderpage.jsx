import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import TopNavbar from "../Components/TopNavbar";
import { useDispatch, useSelector } from "react-redux";
import { IoMdAdd } from "react-icons/io";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import FormattedTime from "../lib/FormattedTime ";
import OrderStatusChart from "../lib/OrderStatusChart";
import {
  createdOrder,
  Removedorder,
  updatestatusOrder,
  gettingallOrder,
  SearchOrder,
} from "../features/orderSlice";

import { gettingallproducts } from "../features/productSlice";
import { gettingallCategory } from "../features/categorySlice";

function Orderpage() {
  const { getorder, searchdata } = useSelector((state) => state.order);
  const { getallproduct } = useSelector((state) => state.product);
  const { Authuser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [status, setstatus] = useState("");
  const [query, setquery] = useState("");
  const [Product, setProduct] = useState("");
  const [Price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [Description, setDescription] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedOrder, setselectedOrder] = useState(null);

  useEffect(() => {
    dispatch(gettingallOrder());
    dispatch(gettingallproducts());
    dispatch(gettingallCategory());
  }, [dispatch, Authuser]);

  useEffect(() => {
    if (query.trim() !== "") {
      const repeatTimeout = setTimeout(() => {
        dispatch(SearchOrder(query));
      }, 500);
      return () => clearTimeout(repeatTimeout);
    } else {
      dispatch(gettingallOrder());
    }
  }, [query, dispatch]);

  const handleEditSubmit = (event) => {
    event.preventDefault();

    if (!selectedOrder) return;

    const updatedData = {
      user: Authuser?.id || "",
      description: Description,
      status,
      products: {
        product: Product,
        quantity: Number(quantity),
        Price: Number(Price),
      },
    };

    dispatch(updatestatusOrder({ OrderId: selectedOrder._id, updatedData }))
      .unwrap()
      .then(() => {
        toast.success("Order updated successfully");
        setIsFormVisible(false);
        setselectedOrder(null);
        resetForm();
        dispatch(gettingallOrder());
      })
      .catch(() => {
        toast.error("Failed to update Order");
      });
  };

  const submitOrder = async (event) => {
    event.preventDefault();

    if (!Product || !Price || !quantity) {
      toast.error("Product, Price and Quantity are required");
      return;
    }

    const orderData = {
      user: Authuser?.id || "",
      Description,
      status,
      Product: {
        product: Product,
        price: Number(Price),
        quantity: Number(quantity),
      },
    };

    try {
      await dispatch(createdOrder(orderData)).unwrap();
      toast.success("Order created successfully");
      setIsFormVisible(false);
      resetForm();
      dispatch(gettingallOrder());
    } catch (error) {
      console.error("Order creation failed:", error);
      toast.error(error?.message || "Failed to create order");
    }
  };

  const resetForm = () => {
    setProduct("");
    setPrice("");
    setQuantity("");
    setDescription("");
    setstatus("");
  };

  const handleEditClick = (order) => {
    setselectedOrder(order);
    setProduct(order.Product?.product?._id || order.Product?.product || "");
    setPrice(order.Product?.price || "");
    setQuantity(order.Product?.quantity || "");
    setstatus(order.status || "");
    setDescription(order.Description || "");
    setIsFormVisible(true);
  };

  const handleremove = async (OrderId) => {
    dispatch(Removedorder(OrderId))
      .unwrap()
      .then(() => {
        toast.success("Order removed successfully");
        dispatch(gettingallOrder());
      })
      .catch((error) => {
        toast.error(error || "Failed to remove Order");
      });
  };

  const displayOrder = query.trim() !== "" ? searchdata : getorder;

  const getStatusBadge = (orderStatus) => {
    switch (orderStatus?.toLowerCase()) {
      case "delivered":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "shipped":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "pending":
      default:
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    }
  };

  return (
    <div className="bg-base-100 min-h-screen text-base-content transition-colors duration-300">
      <TopNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Order Chart Section */}
        <div className="mb-8">
          <OrderStatusChart />
        </div>

        {/* Toolbar & Search Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setquery(e.target.value)}
            className="w-full sm:w-96 h-11 px-4 bg-base-200 border border-base-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
            placeholder="Search orders..."
          />
          <button
            onClick={() => {
              resetForm();
              setselectedOrder(null);
              setIsFormVisible(true);
            }}
            className="w-full sm:w-auto px-6 h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <IoMdAdd className="text-lg" /> Add Order
          </button>
        </div>

        {/* Slide-over Form Drawer */}
        {isFormVisible && (
          <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm flex justify-end">
            <div className="w-full max-w-md bg-base-100 h-full p-6 shadow-2xl border-l border-base-300 overflow-y-auto transition-transform duration-300">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-base-300">
                <h2 className="text-xl font-bold">
                  {selectedOrder ? "Edit Order" : "Add New Order"}
                </h2>
                <button
                  onClick={() => setIsFormVisible(false)}
                  className="p-2 rounded-lg bg-base-200 hover:bg-base-300 text-base-content transition-all"
                >
                  <MdKeyboardDoubleArrowLeft className="text-2xl" />
                </button>
              </div>

              <form onSubmit={selectedOrder ? handleEditSubmit : submitOrder} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-80">
                    Product
                  </label>
                  <select
                    value={Product}
                    onChange={(e) => setProduct(e.target.value)}
                    className="w-full h-11 px-3 bg-base-200 border border-base-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  >
                    <option value="">Select a Product</option>
                    {getallproduct?.map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-80">
                    Description
                  </label>
                  <input
                    value={Description}
                    placeholder="Enter order description"
                    onChange={(e) => setDescription(e.target.value)}
                    type="text"
                    className="w-full h-11 px-3 bg-base-200 border border-base-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-80">
                      Price (Ksh)
                    </label>
                    <input
                      type="number"
                      placeholder="Price"
                      value={Price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full h-11 px-3 bg-base-200 border border-base-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-80">
                      Quantity
                    </label>
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full h-11 px-3 bg-base-200 border border-base-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-80">
                    Status
                  </label>
                  <select
                    className="w-full h-11 px-3 bg-base-200 border border-base-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                    value={status}
                    onChange={(e) => setstatus(e.target.value)}
                  >
                    <option value="">Select status</option>
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl mt-6 transition-all shadow-sm"
                >
                  {selectedOrder ? "Update Order" : "Submit Order"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Orders Table Container */}
        <div className="bg-base-100 rounded-2xl border border-base-300 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-base-300">
            <h2 className="text-xl font-bold tracking-tight">Order List</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-base-200/60 border-b border-base-300 text-xs uppercase tracking-wider opacity-70">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Total Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created By</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-base-300/60">
                {Array.isArray(displayOrder) && displayOrder.length > 0 ? (
                  displayOrder.map((order, index) => (
                    <tr key={order?._id} className="hover:bg-base-200/40 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs opacity-60">{index + 1}</td>
                      <td className="px-4 py-3 font-medium">
                        {order.Product?.product?.name || order.Product?.name || "N/A"}
                      </td>
                      <td className="px-4 py-3">{order.Product?.quantity}</td>
                      <td className="px-4 py-3">Ksh {order.Product?.price}</td>
                      <td className="px-4 py-3 max-w-xs truncate opacity-80">
                        {order?.Description || "-"}
                      </td>
                      <td className="px-4 py-3 font-semibold">Ksh {order?.totalAmount}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${getStatusBadge(
                            order?.status
                          )}`}
                        >
                          {order?.status || "pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3 opacity-90">{order.user?.name || "Unknown"}</td>
                      <td className="px-4 py-3 text-xs opacity-70 whitespace-nowrap">
                        <FormattedTime timestamp={order?.createdAt} />
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(order)}
                            className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 font-medium rounded-lg text-xs transition-all"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleremove(order._id)}
                            className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-medium rounded-lg text-xs transition-all"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center py-10 opacity-60 text-sm">
                      No orders found.
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

export default Orderpage;