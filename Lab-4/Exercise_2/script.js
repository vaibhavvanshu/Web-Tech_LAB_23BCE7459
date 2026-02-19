const searchInput = document.getElementById("search");
const resultsDiv = document.getElementById("results");
const statusDiv = document.getElementById("status");
const categoryFilter = document.getElementById("categoryFilter");

let debounceTimer;
let productsData = [];

// Load products once
fetch("products.json")
  .then(res => res.json())
  .then(data => {
    productsData = data.products;
  })
  .catch(() => {
    statusDiv.textContent = "Error loading products";
  });

// Debounced search
searchInput.addEventListener("input", handleSearch);
categoryFilter.addEventListener("change", handleSearch);

function handleSearch() {
  clearTimeout(debounceTimer);

  statusDiv.textContent = "Searching...";
  statusDiv.className = "loading";

  debounceTimer = setTimeout(() => {
    performSearch();
  }, 400);
}

function performSearch() {
  const query = searchInput.value.toLowerCase();
  const category = categoryFilter.value;

  const filtered = productsData.filter(product => {
    const matchesName = product.name.toLowerCase().includes(query);
    const matchesCategory =
      category === "all" || product.category === category;
    return matchesName && matchesCategory;
  });

  displayResults(filtered, query);
}

function highlight(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(regex, '<span class="highlight">$1</span>');
}

function displayResults(products, query) {
  resultsDiv.innerHTML = "";
  statusDiv.textContent = "";

  if (products.length === 0) {
    resultsDiv.innerHTML = "<p>No results found</p>";
    return;
  }

  products.forEach(product => {
    const div = document.createElement("div");
    div.classList.add("product");

    div.innerHTML = `
      <strong>${highlight(product.name, query)}</strong><br>
      Price: ₹${product.price}<br>
      Category: ${product.category}
    `;

    resultsDiv.appendChild(div);
  });
}
