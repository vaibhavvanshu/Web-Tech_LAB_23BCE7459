let students = [];
const tableBody = document.getElementById("studentTable");
const form = document.getElementById("studentForm");
const message = document.getElementById("message");

const idField = document.getElementById("id");
const nameField = document.getElementById("name");
const deptField = document.getElementById("dept");
const marksField = document.getElementById("marks");

// Simulate GET request
function fetchStudents() {
  fetch("students.json")
    .then(res => {
      if (!res.ok) throw new Error("404 Not Found");
      return res.json();
    })
    .then(data => {
      students = data.students;
      renderTable();
    })
    .catch(() => showMessage("Error loading students", "error"));
}

// Render table
function renderTable() {
  tableBody.innerHTML = "";

  students.forEach((s, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${s.id}</td>
      <td>${s.name}</td>
      <td>${s.dept}</td>
      <td>${s.marks}</td>
      <td>
        <button onclick="editStudent(${index})">Edit</button>
        <button onclick="deleteStudent(${index})">Delete</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

// Show message
function showMessage(text, type) {
  message.textContent = text;
  message.className = "msg " + type;
}

// Create or Update student
form.addEventListener("submit", e => {
  e.preventDefault();

  let id = idField.value.trim();
  const name = nameField.value.trim();
  const dept = deptField.value.trim();
  const marks = parseInt(marksField.value);

  if (marks < 0 || marks > 100) {
    showMessage("Marks must be between 0 and 100", "error");
    return;
  }

  // Auto-generate ID
  if (!id) {
    id = Math.floor(100 + Math.random() * 900).toString();
  }

  const existingIndex = students.findIndex(s => s.id === id);

  if (existingIndex !== -1) {
    // UPDATE
    students[existingIndex] = { id, name, dept, marks };
    showMessage("Student updated successfully (200)", "success");
  } else {
    // CREATE
    students.push({ id, name, dept, marks });
    showMessage("Student added successfully (200)", "success");
  }

  form.reset();
  renderTable();
});

// Edit student
function editStudent(index) {
  const s = students[index];
  idField.value = s.id;
  nameField.value = s.name;
  deptField.value = s.dept;
  marksField.value = s.marks;
}

// Delete student
function deleteStudent(index) {
  if (!students[index]) {
    showMessage("Student not found (404)", "error");
    return;
  }

  students.splice(index, 1);
  renderTable();
  showMessage("Student deleted successfully (200)", "success");
}

// Simulate server error example
function simulateServerError() {
  showMessage("Internal server error (500)", "error");
}

// Initial load
fetchStudents();
