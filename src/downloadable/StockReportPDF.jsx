import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
  },
  headerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 15,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#059669", // Emerald-600 color match
  },
  subtitle: {
    fontSize: 10,
    color: "#6b7280",
    marginTop: 4,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 0,
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    alignItems: "center",
    minHeight: 28,
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    alignItems: "center",
    minHeight: 32,
  },
  // Column sizing rules
  colIdx: { width: "6%", textAlign: "center", fontSize: 9, fontWeight: "bold", color: "#374151" },
  colDate: { width: "24%", fontSize: 9, paddingLeft: 5, color: "#374151" },
  colProduct: { width: "25%", fontSize: 9, paddingLeft: 5, color: "#374151" },
  colType: { width: "15%", fontSize: 9, paddingLeft: 5, color: "#374151" },
  colQty: { width: "12%", fontSize: 9, textAlign: "center", color: "#374151" },
  colSup: { width: "18%", fontSize: 9, paddingLeft: 5, color: "#374151" },

  textHeader: {
    fontWeight: "bold",
    color: "#4b5563",
  },
  badgeIn: {
    color: "#10b981",
    fontWeight: "bold",
  },
  badgeOut: {
    color: "#f43f5e",
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 25,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 8,
    color: "#9ca3af",
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    paddingTop: 10,
  }
});

function StockReportPDF({ data }) {
  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Header Block */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Stock Transaction Report</Text>
          <Text style={styles.subtitle}>
            Generated on: {new Date().toLocaleString()} | Total Transactions: {data?.length || 0}
          </Text>
        </View>

        {/* Dynamic Data Table */}
        <View style={styles.table}>
          {/* Table Headers */}
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.colIdx, styles.textHeader]}>#</Text>
            <Text style={[styles.colDate, styles.textHeader]}>Date / Time</Text>
            <Text style={[styles.colProduct, styles.textHeader]}>Product</Text>
            <Text style={[styles.colType, styles.textHeader]}>Type</Text>
            <Text style={[styles.colQty, styles.textHeader]}>Quantity</Text>
            <Text style={[styles.colSup, styles.textHeader]}>Supplier</Text>
          </View>

          {/* Table Body Content Rows */}
          {Array.isArray(data) && data.length > 0 ? (
            data.map((item, index) => (
              <View style={styles.tableRow} key={item._id || index}>
                <Text style={styles.colIdx}>{index + 1}</Text>
                <Text style={styles.colDate}>{formatDate(item.transactionDate)}</Text>
                <Text style={styles.colProduct}>{item.product?.name || "N/A"}</Text>
                <Text style={[
                  styles.colType, 
                  item.type?.toLowerCase() === "stock-in" ? styles.badgeIn : styles.badgeOut
                ]}>
                  {item.type || "N/A"}
                </Text>
                <Text style={[styles.colQty, { fontWeight: "bold" }]}>{item.quantity}</Text>
                <Text style={styles.colSup}>{item.supplier?.name || "N/A"}</Text>
              </View>
            ))
          ) : (
            <View style={styles.tableRow}>
              <Text style={{ width: "100%", textAlign: "center", fontSize: 10, padding: 15, color: "#9ca3af" }}>
                No records available to display.
              </Text>
            </View>
          )}
        </View>

        {/* Footer Running Note */}
        <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
          `Inventory Management System Platform — Page ${pageNumber} of ${totalPages}`
        )} />
      </Page>
    </Document>
  );
}

export default StockReportPDF;