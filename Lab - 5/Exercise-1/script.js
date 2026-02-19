let xmlDoc;
const tableBody = document.getElementById("employeeTable");
const message = document.getElementById("message");

// Load XML using AJAX
function loadXML() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "employees.xml", true);

  xhr.onload = function () {
    if (xhr.status === 200) {
      xmlDoc = xhr.responseXML;

      if (!xmlDoc) {
        showMessage("Malformed XML", "error");
        return;
      }

      displayEmployees();
    } else {
      showMessage("Error loading XML", "error");
    }
  };

  xhr.send();
}

// Display employees
function displayEmployees() {
  tableBody.innerHTML = "";

  const employees = xmlDoc.getElementsByTagName("employee");

  if (employees.length === 0) {
    showMessage("No employee records found", "error");
    return;
  }

  for (let i = 0; i < employees.length; i++) {
    const emp = employees[i];

    const id = emp.getElementsByTagName("id")[0].textContent;
    const name = emp.getElementsByTagName("name")[0].textContent;
    const dept = emp.getElementsByTagName("department")[0].textContent;
    const salary = emp.getElementsByTagName("salary")[0].textContent;

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${id}</td>
      <td>${name}</td>
      <td>${dept}</td>
      <td>${salary}</td>
      <td>
        <button onclick="editEmployee(${i})">Edit</button>
        <button onclick="deleteEmployee(${i})">Delete</button>
      </td>
    `;

    tableBody.appendChild(row);
  }
}

// Save (Create/Update)
function saveEmployee() {
  let id = document.getElementById("id").value.trim();
  const name = document.getElementById("name").value.trim();
  const dept = document.getElementById("dept").value.trim();
  const salary = document.getElementById("salary").value.trim();

  if (!name || !dept || !salary) {
    showMessage("All fields required", "error");
    return;
  }

  if (salary <= 0) {
    showMessage("Salary must be greater than 0", "error");
    return;
  }

  if (!id) {
    id = Math.floor(100 + Math.random() * 900).toString();
  }

  const employees = xmlDoc.getElementsByTagName("employee");

  for (let i = 0; i < employees.length; i++) {
    const empId = employees[i].getElementsByTagName("id")[0].textContent;

    if (empId === id) {
      employees[i].getElementsByTagName("department")[0].textContent = dept;
      employees[i].getElementsByTagName("salary")[0].textContent = salary;
      showMessage("Employee updated", "success");
      displayEmployees();
      return;
    }
  }

  // Create new employee node
  const newEmp = xmlDoc.createElement("employee");

  const idNode = xmlDoc.createElement("id");
  idNode.textContent = id;

  const nameNode = xmlDoc.createElement("name");
  nameNode.textContent = name;

  const deptNode = xmlDoc.createElement("department");
  deptNode.textContent = dept;

  const salaryNode = xmlDoc.createElement("salary");
  salaryNode.textContent = salary;

  newEmp.appendChild(idNode);
  newEmp.appendChild(nameNode);
  newEmp.appendChild(deptNode);
  newEmp.appendChild(salaryNode);

  xmlDoc.documentElement.appendChild(newEmp);

  showMessage("Employee added", "success");
  displayEmployees();
}

// Edit
function editEmployee(index) {
  const emp = xmlDoc.getElementsByTagName("employee")[index];

  document.getElementById("id").value =
    emp.getElementsByTagName("id")[0].textContent;

  document.getElementById("name").value =
    emp.getElementsByTagName("name")[0].textContent;

  document.getElementById("dept").value =
    emp.getElementsByTagName("department")[0].textContent;

  document.getElementById("salary").value =
    emp.getElementsByTagName("salary")[0].textContent;
}

// Delete
function deleteEmployee(index) {
  const emp = xmlDoc.getElementsByTagName("employee")[index];
  emp.parentNode.removeChild(emp);
  showMessage("Employee deleted", "success");
  displayEmployees();
}

// Message display
function showMessage(text, type) {
  message.textContent = text;
  message.className = "msg " + type;
}

// Initial load
loadXML();
