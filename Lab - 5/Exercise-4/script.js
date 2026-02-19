let products = [];
const tableBody = document.getElementById("productTable");
const message = document.getElementById("message");
const totalValueSpan = document.getElementById("totalValue");
const totalCountSpan = document.getElementById("totalCount");
const categorySearch = document.getElementById("categorySearch");

// Load JSON
fetch("inventory.json")
  .then(res => {
    if (!res.ok) throw new Error("JSON load error");
    return res.json();
  })
  .then(data => {
    products = data.products;
    populateCategories();
    displayProducts(products);
  })
  .catch(() => showMessage("Error loading inventory", "error"));

// Populate category dropdown
function populateCategories() {
  const categories = [...new Set(products.map(p => p.category))];

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySearch.appendChild(option);
  });
}

// Display products
function displayProducts(list) {
  tableBody.innerHTML = "";
  let totalValue = 0;

  list.forEach((p, index) => {
    const row = document.createElement("tr");

    if (p.stock === 0) row.classList.add("out-stock");
    else if (p.stock < 5) row.classList.add("low-stock");

    totalValue += p.price * p.stock;

    row.innerHTML = `
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>${p.category}</td>
      <td>${p.price}</td>
      <td>${p.stock}</td>
      <td>
        <button onclick="editProduct(${index})">Edit</button>
        <button onclick="deleteProduct(${index})">Delete</button>
      </td>
    `;

    tableBody.appendChild(row);
  });

  totalValueSpan.textContent = totalValue;
  totalCountSpan.textContent = list.length;
}

// Save (Create/Update)
function saveProduct() {
  const id = document.getElementById("id").value.trim();
  const name = document.getElementById("name").value.trim();
  const category = document.getElementById("category").value.trim();
  const price = parseFloat(document.getElementById("price").value);
  const stock = parseInt(document.getElementById("stock").value);

  if (!id || !name || !category || isNaN(price) || isNaN(stock)) {
    showMessage("All fields required", "error");
    return;
  }

  if (price <= 0 || stock < 0) {
    showMessage("Invalid price or stock", "error");
    return;
  }

  const existingIndex = products.findIndex(p => p.id === id);

  if (existingIndex !== -1) {
    products[existingIndex] = { id, name, category, price, stock };
    showMessage("Product updated", "success");
  } else {
    products.push({ id, name, category, price, stock });
    showMessage("Product added", "success");
    populateCategories();
  }

  clearFields();
  displayProducts(products);
}

// Edit
function editProduct(index) {
  const p = products[index];

  document.getElementById("id").value = p.id;
  document.getElementById("name").value = p.name;
  document.getElementById("category").value = p.category;
  document.getElementById("price").value = p.price;
  document.getElementById("stock").value = p.stock;
}

// Delete
function deleteProduct(index) {
  products.splice(index, 1);
  showMessage("Product deleted", "success");
  displayProducts(products);
}

// Search by category
function searchCategory() {
  const selected = categorySearch.value;

  if (selected === "all") {
    displayProducts(products);
  } else {
    const filtered = products.filter(p => p.category === selected);
    displayProducts(filtered);
  }
}

// Clear fields
function clearFields() {
  document.getElementById("id").value = "";
  document.getElementById("name").value = "";
  document.getElementById("category").value = "";
  document.getElementById("price").value = "";
  document.getElementById("stock").value = "";
}

// Message
function showMessage(text, type) {
  message.textContent = text;
  message.className = "msg " + type;
}
