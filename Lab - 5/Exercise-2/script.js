let xmlDoc;
const tableBody = document.getElementById("bookTable");
const message = document.getElementById("message");

// Load XML
function loadXML() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "books.xml", true);

  xhr.onload = function () {
    if (xhr.status === 200) {
      xmlDoc = xhr.responseXML;

      if (!xmlDoc) {
        showMessage("Malformed XML", "error");
        return;
      }

      displayBooks();
    } else {
      showMessage("Error loading XML", "error");
    }
  };

  xhr.send();
}

// Display books
function displayBooks() {
  tableBody.innerHTML = "";
  const books = xmlDoc.getElementsByTagName("book");

  for (let i = 0; i < books.length; i++) {
    const book = books[i];

    const id = book.getElementsByTagName("id")[0].textContent;
    const title = book.getElementsByTagName("title")[0].textContent;
    const author = book.getElementsByTagName("author")[0].textContent;
    const status = book.getElementsByTagName("status")[0].textContent;

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${id}</td>
      <td>${title}</td>
      <td>${author}</td>
      <td>${status}</td>
      <td>
        <button onclick="toggleStatus(${i})">Toggle Status</button>
        <button onclick="deleteBook(${i})">Delete</button>
      </td>
    `;

    tableBody.appendChild(row);
  }
}

// Add book
function addBook() {
  const id = document.getElementById("id").value.trim();
  const title = document.getElementById("title").value.trim();
  const author = document.getElementById("author").value.trim();

  if (!id || !title || !author) {
    showMessage("All fields required", "error");
    return;
  }

  const books = xmlDoc.getElementsByTagName("book");

  // Prevent duplicate ID
  for (let i = 0; i < books.length; i++) {
    const existingId = books[i].getElementsByTagName("id")[0].textContent;
    if (existingId === id) {
      showMessage("Book ID already exists", "error");
      return;
    }
  }

  const newBook = xmlDoc.createElement("book");

  const idNode = xmlDoc.createElement("id");
  idNode.textContent = id;

  const titleNode = xmlDoc.createElement("title");
  titleNode.textContent = title;

  const authorNode = xmlDoc.createElement("author");
  authorNode.textContent = author;

  const statusNode = xmlDoc.createElement("status");
  statusNode.textContent = "Available";

  newBook.appendChild(idNode);
  newBook.appendChild(titleNode);
  newBook.appendChild(authorNode);
  newBook.appendChild(statusNode);

  xmlDoc.documentElement.appendChild(newBook);

  showMessage("Book added successfully", "success");
  displayBooks();
}

// Toggle availability
function toggleStatus(index) {
  const book = xmlDoc.getElementsByTagName("book")[index];
  const statusNode = book.getElementsByTagName("status")[0];

  statusNode.textContent =
    statusNode.textContent === "Available" ? "Issued" : "Available";

  showMessage("Status updated", "success");
  displayBooks();
}

// Delete book
function deleteBook(index) {
  const book = xmlDoc.getElementsByTagName("book")[index];
  book.parentNode.removeChild(book);

  showMessage("Book deleted", "success");
  displayBooks();
}

// Message
function showMessage(text, type) {
  message.textContent = text;
  message.className = "msg " + type;
}

// Initial load
loadXML();
