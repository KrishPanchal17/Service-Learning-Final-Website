// Fetch and display library data
async function loadLibraryData() {
    try {
        const response = await fetch('/api/library'); 
        if (!response.ok) throw new Error('Failed to fetch library survey form data');

        const libraryData = await response.json();
        populateTable(libraryData);

        // Store data in a global variable for easy access
        window.libraryData = libraryData;
    } catch (error) {
        console.error('Error loading library survey data:', error);
    }
}

// Populate the table with data
function populateTable(data) {
    const libraryTableBody = document.querySelector('#libraryTable tbody');
    libraryTableBody.innerHTML = ''; // Clear existing rows

    const getValue = (value) => (value ? value : '-');

    data.forEach((entry, index) => {
        let row = `<tr data-index="${index}">
            <td>${getValue(entry['Sr Number'])}</td>
            <td>${getValue(entry['Teachers Name'])}</td>
            <td>${getValue(entry['Contact No'])}</td>
            <td>${getValue(entry['Class Address'])}</td>
            <td>${getValue(entry['Student Name'])}</td>
            <td>${getValue(entry['Gender'])}</td>
            <td>${getValue(entry['Age'])}</td>
            <td>${getValue(entry['School Name'])}</td>
            <td>${getValue(entry['Std.'])}</td>
            <td>${getValue(entry['School Time'])}</td>
            <td>${getValue(entry['Student Contact No'])}</td>
            <td>${getValue(entry['Mothers Education'])}</td>
            <td>${getValue(entry['Fathers Education'])}</td>
        </tr>`;
        libraryTableBody.innerHTML += row;
    });
}

// Search functionality
document.getElementById('searchInput').addEventListener('input', function() {
    const searchField1 = document.getElementById('searchField1').value;
    const searchText = this.value.toLowerCase();

    const filteredData = window.libraryData.filter(entry => {
        return (
            (entry[searchField1] && entry[searchField1].toLowerCase().includes(searchText)) 
        );
    });

    populateTable(filteredData);
});

// Select row functionality
document.querySelector('#libraryTable tbody').addEventListener('click', function(event) {
    if (event.target.tagName === 'TD') {
        const row = event.target.parentElement;
        document.querySelectorAll('#libraryTable tbody tr').forEach(tr => tr.classList.remove('selected'));
        row.classList.add('selected');
    }
    // Variables to track selected row and mode (add/edit)
let selectedRowIndex = null;

// Event listeners for buttons
document.querySelector('.addButton').addEventListener('click', showAddModal);
document.querySelector('.editButton').addEventListener('click', showEditModal);
document.querySelector('.deleteButton').addEventListener('click', deleteRow);
document.getElementById('saveButton').addEventListener('click', saveData);
document.getElementById('cancelButton').addEventListener('click', closeModal);

// Select a single row
document.querySelector('#libraryTable tbody').addEventListener('click', function(event) {
    if (event.target.tagName === 'TD') {
        const row = event.target.parentElement;
        document.querySelectorAll('#libraryTable tbody tr').forEach(tr => tr.classList.remove('selected'));
        row.classList.add('selected');
        selectedRowIndex = row.getAttribute('data-index');
    }
});

// Show the Add Modal
function showAddModal() {
    document.getElementById('popupTitle').textContent = "Add Entry";
    document.getElementById('popupForm').reset(); // Clear form fields
    document.getElementById('popupModal').style.display = "flex";
}

// Show the Edit Modal with data filled in
function showEditModal() {
    if (selectedRowIndex === null) {
        return alert("Please select a row to edit.");
    }
    else {
    const entry = window.libraryData[selectedRowIndex];
    document.getElementById('popupTitle').textContent = "Edit Entry";

    // Populate form fields with data
    document.getElementById('teacherName').value = entry['Teachers Name'] || '';
    document.getElementById('contactNo').value = entry['Contact No'] || '';
    document.getElementById('classAddress').value = entry['Class Address'] || '';
    document.getElementById('studentName').value = entry['Student Name'] || '';
    document.getElementById('gender').value = entry['Gender'] || '';
    document.getElementById('age').value = entry['Age'] || '';
    document.getElementById('schoolName').value = entry['School Name'] || '';
    document.getElementById('std').value = entry['Std.'] || '';
    document.getElementById('schoolTime').value = entry['School Time'] || '';
    document.getElementById('studentContactNo').value = entry['Student Contact No'] || '';
    document.getElementById('mothersEducation').value = entry['Mothers Education'] || '';
    document.getElementById('fathersEducation').value = entry['Fathers Education'] || '';

    document.getElementById('popupModal').style.display = "flex";
    }
}

// Delete the selected row
function deleteRow() {
    if (selectedRowIndex === null) {
        return alert("Please select a row to delete.");
    }
    else{
    window.libraryData.splice(selectedRowIndex, 1); // Remove data from array
    populateTable(window.libraryData); // Refresh table
    selectedRowIndex = null; // Reset selection
    }
}

// Save data from modal form (Add or Edit)
function saveData() {
    const entry = {
        'Sr Number': selectedRowIndex === null ? window.libraryData.length + 1 : window.libraryData[selectedRowIndex]['Sr Number'],
        'Teachers Name': document.getElementById('teacherName').value,
        'Contact No': document.getElementById('contactNo').value,
        'Class Address': document.getElementById('classAddress').value,
        'Student Name': document.getElementById('studentName').value,
        'Gender': document.getElementById('gender').value,
        'Age': document.getElementById('age').value,
        'School Name': document.getElementById('schoolName').value,
        'Std.': document.getElementById('std').value,
        'School Time': document.getElementById('schoolTime').value,
        'Student Contact No': document.getElementById('studentContactNo').value,
        'Mothers Education': document.getElementById('mothersEducation').value,
        'Fathers Education': document.getElementById('fathersEducation').value
    };

    if (selectedRowIndex === null) {
        // Add new entry
        window.libraryData.push(entry);
    } else {
        // Edit existing entry
        window.libraryData[selectedRowIndex] = entry;
    }
    
    closeModal(); // Close modal
    populateTable(window.libraryData); // Refresh table
}

// Close the pop-up modal
function closeModal() {
    document.getElementById('popupModal').style.display = "none";
}

});

// Load data when the page loads
window.onload = loadLibraryData;
