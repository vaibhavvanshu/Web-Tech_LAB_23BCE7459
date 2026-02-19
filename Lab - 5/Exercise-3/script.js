let students = [];
const tableBody = document.getElementById("studentTable");
const message = document.getElementById("message");

// Load JSON
fetch("students.json")
  .then(res => {
    if (!res.ok) throw new Error("JSON file not found");
    return res.json();
  })
  .then(data => {
    students = data.students;
    displayStudents();
  })
  .catch(() => showMessage("Error parsing JSON", "error"));

// Grade calculation
function getGrade(marks) {
  if (marks >= 85) return "A";
  if (marks >= 70) return "B";
  if (marks >= 50) return "C";
  return "Fail";
}

// Display students
function displayStudents() {
  tableBody.innerHTML = "";

  students.forEach((s, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${s.id}</td>
      <td>${s.name}</td>
      <td>${s.course}</td>
      <td>${s.marks}</td>
      <td>${getGrade(s.marks)}</td>
      <td>
        <button onclick="editStudent(${index})">Edit</button>
        <button onclick="deleteStudent(${index})">Delete</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

// Save (Create/Update)
function saveStudent() {
  const id = document.getElementById("id").value.trim();
  const name = document.getElementById("name").value.trim();
  const course = document.getElementById("course").value.trim();
  const marks = parseInt(document.getElementById("marks").value);

  if (!id || !name || !course || isNaN(marks)) {
    showMessage("All fields required", "error");
    return;
  }

  if (marks < 0 || marks > 100) {
    showMessage("Marks must be 0–100", "error");
    return;
  }

  const existingIndex = students.findIndex(s => s.id === id);

  if (existingIndex !== -1) {
    students[existingIndex] = { id, name, course, marks };
    showMessage("Student updated", "success");
  } else {
    students.push({ id, name, course, marks });
    showMessage("Student added", "success");
  }

  clearFields();
  displayStudents();
}

// Edit
function editStudent(index) {
  const s = students[index];

  document.getElementById("id").value = s.id;
  document.getElementById("name").value = s.name;
  document.getElementById("course").value = s.course;
  document.getElementById("marks").value = s.marks;
}

// Delete
function deleteStudent(index) {
  students.splice(index, 1);
  showMessage("Student deleted", "success");
  displayStudents();
}

// Clear fields
function clearFields() {
  document.getElementById("id").value = "";
  document.getElementById("name").value = "";
  document.getElementById("course").value = "";
  document.getElementById("marks").value = "";
}

// Message
function showMessage(text, type) {
  message.textContent = text;
  message.className = "msg " + type;
}
