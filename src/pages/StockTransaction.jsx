import React, { useEffect, useState } from "react";
import TopNavbar from "../Components/TopNavbar";
import { IoMdAdd } from "react-icons/io";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import FormattedTime from "../lib/FormattedTime ";
import Stocktanscationgraph from "../lib/Stocktanscationgraph";
import {
  createStockTransaction,
  getAllStockTransactions,
  searchstockdata,
} from "../features/stocktransactionSlice";
import { gettingallSupplier } from "../features/SupplierSlice";
import { gettingallproducts } from "../features/productSlice";
import toast from "react-hot-toast";

function StockTransaction() {
  const { getallStocks, iscreatedStocks, searchdata } = useSelector(
    (state) => state.stocktransaction
  );
  const { getallSupplier } = useSelector((state) => state.supplier);
  const { getallproduct } = useSelector((state) => state.product);

  const dispatch = useDispatch();

  const [query, setquery] = useState("");
  const [product, setproduct] = useState("");
  const [type, settype] = useState("Stock-in");
  const [quantity, setquantity] = useState("");
  const [supplier, setsupplier] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    if (query.trim() !== "") {
      const repeatTimeout = setTimeout(() => {
        dispatch(searchstockdata(query));
      }, 500);
      return () => clearTimeout(repeatTimeout);
    } else {
      dispatch(getAllStockTransactions());
    }
  }, [query, dispatch]);

  useEffect(() => {
    dispatch(gettingallproducts());
    dispatch(getAllStockTransactions());
    dispatch(gettingallSupplier());
  }, [dispatch]);

  const resetForm = () => {
    setproduct("");
    settype("Stock-in");
    setquantity("");
    setsupplier("");
  };

  const submitstocktranscation = async (event) => {
    event.preventDefault();

    if (!product || !quantity || !type) {
      toast.error("Product, Type, and Quantity are required");
      return;
    }

    const StocksData = { product, type, quantity: Number(quantity), supplier };

    dispatch(createStockTransaction(StocksData))
      .unwrap()
      .then(() => {
        toast.success("Stock transaction added successfully");
        resetForm();
        setIsFormVisible(false);
        dispatch(getAllStockTransactions());
      })
      .catch((error) => {
        const errorMessage =
          error?.message ||
          error?.data?.message ||
          (typeof error === "string" ? error : "Failed to add stock transaction");

        toast.error(errorMessage);
      });
  };

  const displaystock = query.trim() !== "" ? searchdata : getallStocks;

  const getTypeBadge = (transactionType) => {
    switch (transactionType?.toLowerCase()) {
      case "stock-in":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "stock-out":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <div className="bg-base-100 min-h-screen text-base-content transition-colors duration-300">
      <TopNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stock Transaction Graph Section */}
        <div className="mb-8">
          <Stocktanscationgraph />
        </div>

        {/* Toolbar & Search Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setquery(e.target.value)}
            className="w-full sm:w-96 h-11 px-4 bg-base-200 border border-base-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
            placeholder="Search stock transactions..."
          />
          <button
            onClick={() => {
              resetForm();
              setIsFormVisible(true);
            }}
            className="w-full sm:w-auto px-6 h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <IoMdAdd className="text-lg" /> Add Stock
          </button>
        </div>

        {/* Slide-Over Drawer Form */}
        {isFormVisible && (
          <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm flex justify-end">
            <div className="w-full max-w-md bg-base-100 h-full p-6 shadow-2xl border-l border-base-300 overflow-y-auto transition-transform duration-300">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-base-300">
                <h2 className="text-xl font-bold">Add Stock Transaction</h2>
                <button
                  onClick={() => setIsFormVisible(false)}
                  className="p-2 rounded-lg bg-base-200 hover:bg-base-300 text-base-content transition-all"
                >
                  <MdKeyboardDoubleArrowLeft className="text-2xl" />
                </button>
              </div>

              <form onSubmit={submitstocktranscation} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-80">
                    Product
                  </label>
                  <select
                    value={product}
                    onChange={(e) => setproduct(e.target.value)}
                    className="w-full h-11 px-3 bg-base-200 border border-base-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  >
                    <option value="">Select a product</option>
                    {/* Safe Array Guard */}
                    {Array.isArray(getallproduct) &&
                      getallproduct.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-80">
                    Transaction Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => settype(e.target.value)}
                    className="w-full h-11 px-3 bg-base-200 border border-base-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  >
                    <option value="Stock-in">Stock-in</option>
                    <option value="Stock-out">Stock-out</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-80">
                    Quantity
                  </label>
                  <input
                    type="number"
                    placeholder="Enter quantity"
                    value={quantity}
                    onChange={(e) => setquantity(e.target.value)}
                    className="w-full h-11 px-3 bg-base-200 border border-base-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-80">
                    Supplier
                  </label>
                  <select
                    value={supplier}
                    onChange={(e) => setsupplier(e.target.value)}
                    className="w-full h-11 px-3 bg-base-200 border border-base-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  >
                    <option value="">Select a supplier</option>
                    {/* Safe Array Guard Fix */}
                    {Array.isArray(getallSupplier) &&
                      getallSupplier.map((sup) => (
                        <option key={sup._id} value={sup._id}>
                          {sup.name}
                        </option>
                      ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={iscreatedStocks}
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl mt-6 transition-all shadow-sm disabled:opacity-50"
                >
                  {iscreatedStocks ? "Adding Stock..." : "Add Stock"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Stock Transaction Table */}
        <div className="bg-base-100 rounded-2xl border border-base-300 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-base-300">
            <h2 className="text-xl font-bold tracking-tight">Stock Transaction List</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-base-200/60 border-b border-base-300 text-xs uppercase tracking-wider opacity-70">
                <tr>
                  <th className="px-4 py-3 w-12">#</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Quantity</th>
                  <th className="px-4 py-3">Supplier</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-base-300/60">
                {Array.isArray(displaystock) && displaystock.length > 0 ? (
                  displaystock.map((Stocks, index) => (
                    <tr key={Stocks._id} className="hover:bg-base-200/40 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs opacity-60">{index + 1}</td>
                      <td className="px-4 py-3 text-xs opacity-80 whitespace-nowrap">
                        <FormattedTime timestamp={Stocks.transactionDate} />
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {Stocks.product?.name || "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${getTypeBadge(
                            Stocks.type
                          )}`}
                        >
                          {Stocks.type || "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold">{Stocks.quantity}</td>
                      <td className="px-4 py-3 opacity-80">
                        {Stocks.supplier?.name || "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-10 opacity-60 text-sm">
                      No stock transactions found.
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

export default StockTransaction;