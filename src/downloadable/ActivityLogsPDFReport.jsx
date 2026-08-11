import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Structured vector styles tailored for landscape typography layouts
const pdfStyles = StyleSheet.create({
  page: { 
    padding: 30, 
    fontFamily: "Helvetica", 
    fontSize: 9, 
    color: "#1e293b" 
  },
  titleHeader: { 
    fontSize: 16, 
    color: "#0f766e", 
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
    backgroundColor: "#0f766e", 
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
  // Exact column constraints map matching the data viewport
  colIdx: { width: "5%" },
  colUser: { width: "15%" },
  colAction: { width: "15%" },
  colEntity: { width: "10%" },
  colDesc: { width: "30%" },
  colTime: { width: "15%" },
  colIp: { width: "10%" },
  
  textHeader: { 
    color: "#ffffff", 
    fontWeight: "bold" 
  }
});

// Structural template layout mapping for PDF compilation engine
const ActivityLogsPDFReport = ({ dataLogs }) => {
  const safeLogs = Array.isArray(dataLogs) ? dataLogs : [];

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={pdfStyles.page}>
        <Text style={pdfStyles.titleHeader}>System Security Audit & Activity Trail Logs</Text>
        <Text style={pdfStyles.subtitle}>Generated on: {new Date().toLocaleString()}</Text>
        
        <View style={pdfStyles.tableHeader}>
          <View style={pdfStyles.colIdx}><Text style={pdfStyles.textHeader}>#</Text></View>
          <View style={pdfStyles.colUser}><Text style={pdfStyles.textHeader}>User / Email</Text></View>
          <View style={pdfStyles.colAction}><Text style={pdfStyles.textHeader}>Action</Text></View>
          <View style={pdfStyles.colEntity}><Text style={pdfStyles.textHeader}>Part</Text></View>
          <View style={pdfStyles.colDesc}><Text style={pdfStyles.textHeader}>Description</Text></View>
          <View style={pdfStyles.colTime}><Text style={pdfStyles.textHeader}>Timestamp</Text></View>
          <View style={pdfStyles.colIp}><Text style={pdfStyles.textHeader}>IP</Text></View>
        </View>

        {safeLogs.map((log, index) => (
          <View key={log?._id || index} style={pdfStyles.tableRow}>
            <View style={pdfStyles.colIdx}><Text>{index + 1}</Text></View>
            <View style={pdfStyles.colUser}>
              <Text>{log?.userId?.name || "System/Unknown"}</Text>
            </View>
            <View style={pdfStyles.colAction}><Text>{log?.action || "EVENT"}</Text></View>
            <View style={pdfStyles.colEntity}><Text>{log?.entity || "System"}</Text></View>
            <View style={pdfStyles.colDesc}><Text>{log?.description || "No details provided"}</Text></View>
            <View style={pdfStyles.colTime}>
              <Text>{log?.createdAt ? new Date(log.createdAt).toLocaleString() : "-"}</Text>
            </View>
            <View style={pdfStyles.colIp}><Text>{log?.ipAddress || "—"}</Text></View>
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default ActivityLogsPDFReport;