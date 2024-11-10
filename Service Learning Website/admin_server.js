const express = require('express');
const path = require('path');
const xlsx = require('xlsx');  // Import the xlsx library

const PORT = 2000;
const cors = require('cors');
const app = express();


app.use(cors());

app.use(express.static(path.join(__dirname, 'admin')));

// Function to read data from the Excel file
const readExcelData = () => {
    const workbook = xlsx.readFile("C:/Users/KRISH PANCHAL/Documents/Service Learning Website/Website/Service Learning Project/lib_survey_form.xlsx"); // Adjust this path as necessary
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);
    console.log('Survey Data:', data); 
    return data;
};

// API endpoint to get survey data
app.get('/api/library', (req, res) => {
    const libraryData = readExcelData();  
    res.json(libraryData);        
});

// Route for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'admin_page.html')); 
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


