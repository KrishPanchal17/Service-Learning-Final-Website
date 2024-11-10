
const express = require('express');
const path = require('path');
const xlsx = require('xlsx');  // Import the xlsx library

const PORT = 3000;
const cors = require('cors');
const app = express();

app.use(cors());
// Middleware to serve static files from the public directory
app.use(express.static(path.join(__dirname, 'Public')));

// Function to read data from the Excel file
const readExcelData = () => {
    const workbook = xlsx.readFile("C:/users/KRISH PANCHAL/Documents/Service Learning/Website/Service Learning Project/Service Learning.xlsx"); // Adjust this path as necessary
    const sheetName = workbook.SheetNames[0]; // Get the first sheet
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);
    console.log('Student Data:', data); // Log the data to the console
    return data;
};

// API endpoint to get student data
app.get('/api/students', (req, res) => {
    const studentData = readExcelData();  // Call the function to read data
    res.json(studentData);                // Send the data as a JSON response
});

// Route for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'main_page.html')); // Make sure this matches your HTML file name
});
// Route to handle /main
app.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'main_page.html')); // Adjust this to the correct path to your HTML file
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


