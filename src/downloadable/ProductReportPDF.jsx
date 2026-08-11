import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#fafafc",
    fontFamily: "Helvetica",
  },
  headerContainer: {
    borderBottomWidth: 2,
    borderBottomColor: "#10b981", 
    paddingBottom: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1e293b",
  },
  subtitle: {
    fontSize: 10,
    color: "#64748b",
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  statBox: {
    alignItems: "center",
    flex: 1,
  },
  statLabel: {
    fontSize: 9,
    color: "#64748b",
    textTransform: "uppercase",
  },
  statValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0f172a",
    marginTop: 2,
  },
  table: {
    width: "auto",
    backgroundColor: "#ffffff",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    minHeight: 28,
    alignItems: "center",
  },
  tableHeader: {
    backgroundColor: "#0f172a",
    borderBottomColor: "#0f172a",
  },
  tableHeaderCell: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 9,
    padding: 6,
  },
  tableCell: {
    fontSize: 9,
    color: "#334155",
    padding: 6,
  },
  colName: { width: "30%" },
  colCategory: { width: "20%" },
  colPrice: { width: "15%", textAlign: "right" },
  colQty: { width: "15%", textAlign: "center" },
  colValue: { width: "20%", textAlign: "right" },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 8,
    color: "#94a3b8",
  }
});

function ProductReportPDF({ productsData }) {
  console.log("productsData received in ProductReportPDF:", productsData);

  // Safely resolve the products variable if it is a flat array or wrapped inside an object
  const products = Array.isArray(productsData)
    ? productsData
    : (productsData?.Products || productsData?.products || []);

  // Compute summary values safely from numerical values
  const totalProductsCount = products.length;
  const totalStockQuantity = products.reduce((acc, curr) => acc + (Number(curr?.quantity) || 0), 0);
  const totalValuation = products.reduce((acc, curr) => acc + ((Number(curr?.Price) || 0) * (Number(curr?.quantity) || 0)), 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Document Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Inventory Valuation Report</Text>
          <Text style={styles.subtitle}>
            Generated on: {new Date().toLocaleDateString()} | System Source: Product API Backend
          </Text>
        </View>

        {/* Dynamic Summary Cards Block */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Unique Items</Text>
            <Text style={styles.statValue}>{totalProductsCount}</Text>
          </View>
          <View style={[styles.statBox, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: "#e2e8f0" }]}>
            <Text style={styles.statLabel}>Total Units on Hand</Text>
            <Text style={styles.statValue}>{totalStockQuantity}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Total Inventory Value</Text>
            <Text style={styles.statValue}>
              Ksh {totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>
        </View>

        {/* Inventory Data Table */}
        <View style={styles.table}>
          {/* Header Row */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableHeaderCell, styles.colName]}>Product Name</Text>
            <Text style={[styles.tableHeaderCell, styles.colCategory]}>Category</Text>
            <Text style={[styles.tableHeaderCell, styles.colPrice]}>Unit Price</Text>
            <Text style={[styles.tableHeaderCell, styles.colQty]}>Stock Qty</Text>
            <Text style={[styles.tableHeaderCell, styles.colValue]}>Total Value</Text>
          </View>

          {/* Rows Data Flow */}
          {products.map((product, idx) => {
            const price = Number(product?.Price) || 0;
            const qty = Number(product?.quantity) || 0;
            const rowValue = price * qty;

            return (
              <View 
                key={product?._id || idx} 
                style={[
                  styles.tableRow, 
                  { backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f8fafc" }
                ]}
                wrap={false}
              >
                <Text style={[styles.tableCell, styles.colName, { fontWeight: "medium" }]}>
                  {product?.name || "Unnamed Item"}
                </Text>
                <Text style={[styles.tableCell, styles.colCategory]}>
                  {product?.Category?.name || "Uncategorized"}
                </Text>
                <Text style={[styles.tableCell, styles.colPrice]}>
                  Ksh {price.toFixed(2)}
                </Text>
                <Text style={[styles.tableCell, styles.colQty, { color: qty === 0 ? "#ef4444" : "#334155" }]}>
                  {qty}
                </Text>
                <Text style={[styles.tableCell, styles.colValue, { fontWeight: "bold" }]}>
                  Ksh {rowValue.toFixed(2)}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Dynamic Running Footer with page numbering pagination */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Confidential - Internal Inventory Management System</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}

export default ProductReportPDF;