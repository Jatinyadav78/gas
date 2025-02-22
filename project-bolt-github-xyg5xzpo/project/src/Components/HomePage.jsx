import React, { useState } from "react";
import * as XLSX from "xlsx";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import "./HomePage.css";

const HomePage = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDates, setSelectedDates] = useState([dayjs(), dayjs()]);
  const [showPicker, setShowPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [variationRange, setVariationRange] = useState([null, null]);
  const [isLoading, setIsLoading] = useState(false);
  const rowsPerPage = 10;

  const columnNames = [
    "Date",
    "Time",
    "Cylinder Sr. No.",
    "Quarter",
    "DUE YEAR",
    "DUE DATE",
    "SET WEIGHT(KG)",
    "TARE WEIGHT(KG)",
    "NET WEIGHT(KG)",
    "GROSS WEIGHT(KG)",
    "VARIATION(KG)",
    "Weight Status",
    "VALUE LEAK",
    "ORING LEAK",
    "SEAL",
    "BUNG STATUS",
    "CYLINDER STATUS",
  ];

  // Mock data for demonstration
  const mockData = [
    {
      createdAt: dayjs().format("YYYY-MM-DD"),
      time: "09:00:00",
      cylinderSrNo: "CYL001",
      quarter: "Q1",
      dueYear: "2025",
      dueDate: "2025-12-31",
      setWeight: "14.2",
      tareWeight: "13.2",
      netWeight: "1.0",
      grossWeight: "14.2",
      variation: "0.0",
      weightStatus: "OK",
      valueLeak: "NO",
      oringLeak: "NO",
      seal: "OK",
      bungStatus: "OK",
      cylinderStatus: "PASS"
    },
    // Add more mock data as needed
  ];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call with mock data
      setTimeout(() => {
        setData(mockData);
        setFilteredData(mockData);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data. Please try again.");
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    fetchData();
    setShowPicker(false);
    setCurrentPage(1);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredBySearch = filteredData.filter((row) =>
    row.cylinderSrNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBySearch.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentTableData = filteredBySearch.slice(indexOfFirstRow, indexOfLastRow);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prevPage) => prevPage - 1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDownload = () => {
    const workbook = XLSX.utils.book_new();
    const worksheetData = [
      columnNames,
      ...filteredBySearch.map((item) => [
        item.date || "N/A",
        item.time || "N/A",
        item.cylinderSrNo || "N/A",
        item.quarter || "N/A",
        item.dueYear || "N/A",
        item.dueDate || "N/A",
        item.setWeight || "N/A",
        item.tareWeight || "N/A",
        item.netWeight || "N/A",
        item.grossWeight || "N/A",
        item.variation || "N/A",
        item.weightStatus || "N/A",
        item.valueLeak || "N/A",
        item.oringLeak || "N/A",
        item.seal || "N/A",
        item.bungStatus || "N/A",
        item.cylinderStatus || "N/A",
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "SQC Report");
    XLSX.writeFile(workbook, "SQC_Report.xlsx");
  };

  const handleReset = () => {
    setFilteredData([]);
    setData([]);
    setSelectedDates([dayjs(), dayjs()]);
    setSearchQuery("");
    setVariationRange([null, null]);
    setShowPicker(false);
  };

  return (
    <div className="table-container">
      <div className="button-container">
        <button onClick={() => setShowPicker(true)} className="sort-button">
          Filter
        </button>
        <button onClick={handleReset} className="reset-button">
          Reset
        </button>
      </div>

      <div className="date-range-display">
        <span>
          Date Range: {selectedDates[0].format("YYYY-MM-DD")} to{" "}
          {selectedDates[1].format("YYYY-MM-DD")}
        </span>
      </div>

      <div className="search-bar-container">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by Cylinder Sr. No."
          className="search-bar"
        />
      </div>

      {isLoading && (
        <div className="loader">
          <CircularProgress />
        </div>
      )}

      {showPicker && (
        <div className="modal-overlay" onClick={() => setShowPicker(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="box-date">
                <DatePicker
                  label="Start Date"
                  value={selectedDates[0]}
                  onChange={(newValue) => setSelectedDates([newValue, selectedDates[1]])}
                />
                <DatePicker
                  label="End Date"
                  value={selectedDates[1]}
                  onChange={(newValue) => setSelectedDates([selectedDates[0], newValue])}
                />
              </div>

              <div className="variation-filter">
                <TextField
                  label="From (KG)"
                  type="number"
                  value={variationRange[0] || ""}
                  onChange={(e) => setVariationRange([e.target.value || 0, variationRange[1]])}
                />
                <TextField
                  label="To (KG)"
                  type="number"
                  value={variationRange[1] || ""}
                  onChange={(e) => setVariationRange([variationRange[0], e.target.value || 0])}
                />
              </div>
            </LocalizationProvider>

            <button onClick={applyFilters} className="ok-button">
              OK
            </button>
          </div>
        </div>
      )}

      <div className="table-wrapper">
        <div className="frozen-columns">
          <table>
            <thead>
              <tr>
                {columnNames.slice(0, 3).map((name, index) => (
                  <th key={index}>{name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentTableData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td>{dayjs(row.createdAt).format("DD-MM-YYYY")}</td>
                  <td>{dayjs(row.time, "HH:mm:ss").format("HH:mm")}</td>
                  <td>{row.cylinderSrNo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="scrollable-table">
          <table>
            <thead>
              <tr>
                {columnNames.slice(3).map((name, index) => (
                  <th key={index}>{name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentTableData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td>{row.quarter}</td>
                  <td>{row.dueYear}</td>
                  <td>{row.dueDate}</td>
                  <td>{row.setWeight}</td>
                  <td>{row.tareWeight}</td>
                  <td>{row.netWeight}</td>
                  <td>{row.grossWeight}</td>
                  <td>{row.variation}</td>
                  <td>{row.weightStatus}</td>
                  <td>{row.valueLeak}</td>
                  <td>{row.oringLeak}</td>
                  <td>{row.seal}</td>
                  <td>{row.bungStatus}</td>
                  <td>{row.cylinderStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="pagination-container">
        <div className="pagination">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Previous
          </button>
          {[...Array(totalPages).keys()].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`pagination-button ${currentPage === index + 1 ? "active" : ""}`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next
          </button>
        </div>
        <button onClick={handleDownload} className="download-button">
          Export
        </button>
      </div>
    </div>
  );
};

export default HomePage;