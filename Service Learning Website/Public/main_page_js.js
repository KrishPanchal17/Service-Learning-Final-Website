let students = []; // Array to hold the student data

// Fetch data from the backend API
async function loadStudents() {
    try {
        const response = await fetch('/api/students'); // Fetch from the API endpoint
        if (!response.ok) throw new Error('Failed to fetch student data');

        students = await response.json();
        console.log('Fetched Students:', students); // Log the students to check the data

        const studentData = document.querySelector('#studentTable tbody'); // Select the tbody of the student table
        studentData.innerHTML = ''; // Clear existing rows

        // Helper function to handle empty or undefined values
        const getValue = (value) => value ? value : '-';

        // Helper function to convert dates to a readable format in DD-MM-YY
        const formatDate = (dateValue) => {
            if (!dateValue) return '-'; // Return a dash for empty date values

            let date;
            if (typeof dateValue === 'number') {
                date = new Date(dateValue);
            } else if (typeof dateValue === 'string') {
                date = new Date(dateValue);
                if (isNaN(date.getTime())) {
                    console.warn(`Invalid date string: ${dateValue}`);
                    return '-';
                }
            } else {
                console.warn(`Unexpected date format: ${dateValue}`);
                return '-';
            }

            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = String(date.getFullYear()).slice(-2);

            return `${day}-${month}-${year}`;
        };

        // Loop through each student and create a row
        students.forEach((student, index) => {
            let row = `<tr data-index="${index}">
                <td>${getValue(student['Serial Number'])}</td>
                <td>${getValue(student['Full Name of the Student'])}</td>
                <td>${getValue(student['Caste and Sub-caste'])}</td>
                <td>${getValue(student['Place of Birth'])}</td>
                <td>${getValue(formatDate(student['Date, Month, and Year of Birth']))}</td>
                <td>${getValue(student["Mother's Name"])}</td>
                <td>${getValue(student['From Which School and Class (Mention if New)'])}</td>
                <td>${getValue(formatDate(student['Date of Admission to School']))}</td>
                <td>${getValue(student['Admitted to Which Class and Section'])}</td>
                <td>${getValue(student['Mother tongue'])}</td>
                <td>${getValue(formatDate(student['Date of Leaving the School']))}</td>
                <td>${getValue(student['Left School While in Which Class and Section'])}</td>
                <td>${getValue(student['Study'])}</td>
                <td>${getValue(student['Behaviour'])}</td>
                <td>${getValue(student['Reason for Leaving School, (Whether Fees Paid or Not)'])}</td>
                <td>${getValue(formatDate(student['Certificate Issued with Signature and Date']))}</td>
                <td>
                    <button onclick="editStudent(${index})">Edit</button>
                    <button onclick="deleteStudent(${index})">Delete</button>
                </td>
            </tr>`;
            studentData.innerHTML += row;
        });
    } catch (error) {
        console.error('Error loading students:', error);
    }
}

// Search function to filter students by name
function searchStudent() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#studentTable tbody tr');

    rows.forEach(row => {
        const name = row.children[1].textContent.toLowerCase();
        if (name.includes(input)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Show Add Modal
function showAddModal() {
    document.getElementById('popupTitle').textContent = 'Add Student';
    document.getElementById('popupForm').reset();
    document.getElementById('popupModal').style.display = 'flex';
}

// Show Edit Modal with data pre-filled
function editStudent(index) {
    const student = students[index];
    document.getElementById('popupTitle').textContent = 'Edit Student';
    document.getElementById('studentName').value = student['Full Name of the Student'];
    // Add other fields to prefill as needed
    document.getElementById('popupModal').style.display = 'flex';

    // Save edit logic
    document.getElementById('popupForm').onsubmit = (event) => {
        event.preventDefault();
        saveData(index); // Pass the index to update the correct student
    };
}

// Save new or updated student data
async function saveData(index = null) {
    const studentName = document.getElementById('studentName').value;
    // Collect other form data as needed
    const updatedStudent = {
        'Full Name of the Student': studentName,
        // Add other fields here
    };

    try {
        if (index === null) {
            // Add new student
            const response = await fetch('/api/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedStudent),
            });
            if (!response.ok) throw new Error('Failed to save student data');
            alert('Student added successfully!');
        } else {
            // Update existing student
            const response = await fetch(`/api/students/${students[index].id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedStudent),
            });
            if (!response.ok) throw new Error('Failed to update student data');
            alert('Student updated successfully!');
        }
        loadStudents(); // Refresh student list
        closeModal(); // Close modal after saving
    } catch (error) {
        console.error('Error saving student data:', error);
        alert('Error saving student data');
    }
}

// Delete student
async function deleteStudent(index) {
    if (confirm('Are you sure you want to delete this student?')) {
        try {
            const response = await fetch(`/api/students/${students[index].id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete student data');
            alert('Student deleted successfully!');
            loadStudents(); // Refresh student list
        } catch (error) {
            console.error('Error deleting student data:', error);
            alert('Error deleting student data');
        }
    }
}

// Close Modal
function closeModal() {
    document.getElementById('popupModal').style.display = 'none';
}

// Load students when the page loads
window.onload = loadStudents;
