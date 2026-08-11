import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Structured styles tailored for clean landscape layouts
const pdfStyles = StyleSheet.create({
  page: { 
    padding: 30, 
    fontFamily: "Helvetica", 
    fontSize: 9, 
    color: "#1e293b" 
  },
  titleHeader: { 
    fontSize: 16, 
    color: "#059669", // emerald-600 thematic color
    fontWeight: "bold", 
    marginBottom: 4 
  },
  subtitle: {
    fontSize: 9,
    color: "#64748b",
    marginBottom: 20
  },
  tableHeader: { 
    flexDirection: "row", 
    backgroundColor: "#059669", 
    padding: 6, 
    color: "#ffffff", 
    fontWeight: "bold",
    borderRadius: 4
  },
  tableRow: { 
    flexDirection: "row", 
    borderBottomWidth: 1, 
    borderBottomColor: "#e2e8f0", 
    padding: 6, 
    alignItems: "center" 
  },
  // Exact column sizing constraints
  colIdx: { width: "5%" },
  colName: { width: "20%" },
  colPhone: { width: "15%" },
  colEmail: { width: "20%" },
  colAddress: { width: "20%" },
  colProduct: { width: "20%" },
  
  textHeader: { 
    color: "#ffffff", 
    fontWeight: "bold" 
  }
});

const SupplierPDFReport = ({ suppliersList }) => {
  const safeSuppliers = Array.isArray(suppliersList) ? suppliersList : [];

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={pdfStyles.page}>
        <Text style={pdfStyles.titleHeader}>Supplier Management Directory Report</Text>
        <Text style={pdfStyles.subtitle}>Generated on: {new Date().toLocaleString()}</Text>
        
        <View style={pdfStyles.tableHeader}>
          <View style={pdfStyles.colIdx}><Text style={pdfStyles.textHeader}>#</Text></View>
          <View style={pdfStyles.colName}><Text style={pdfStyles.textHeader}>Supplier Name</Text></View>
          <View style={pdfStyles.colPhone}><Text style={pdfStyles.textHeader}>Phone</Text></View>
          <View style={pdfStyles.colEmail}><Text style={pdfStyles.textHeader}>Email</Text></View>
          <View style={pdfStyles.colAddress}><Text style={pdfStyles.textHeader}>Address</Text></View>
          <View style={pdfStyles.colProduct}><Text style={pdfStyles.textHeader}>Product Supplied</Text></View>
        </View>

        {safeSuppliers.map((supplier, index) => (
          <View key={supplier?._id || index} style={pdfStyles.tableRow}>
            <View style={pdfStyles.colIdx}><Text>{index + 1}</Text></View>
            <View style={pdfStyles.colName}>
              <Text>{supplier?.name || "N/A"}</Text>
            </View>
            <View style={pdfStyles.colPhone}>
              <Text>{supplier?.contactInfo?.phone || "—"}</Text>
            </View>
            <View style={pdfStyles.colEmail}>
              <Text>{supplier?.contactInfo?.email || "—"}</Text>
            </View>
            <View style={pdfStyles.colAddress}>
              <Text>{supplier?.contactInfo?.address || "—"}</Text>
            </View>
            <View style={pdfStyles.colProduct}>
              {/* Handles your populated object structure securely */}
              <Text>{supplier?.productsSupplied?.name || "None Listed"}</Text>
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default SupplierPDFReport;