const usernameInput = document.getElementById("username");
const statusDiv = document.getElementById("status");
const form = document.getElementById("registerForm");

let debounceTimer;
let isAvailable = false;

// Debounce function
usernameInput.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  const username = usernameInput.value.trim();

  if (username.length < 3) {
    statusDiv.textContent = "Minimum 3 characters required";
    statusDiv.className = "status taken";
    isAvailable = false;
    return;
  }

  statusDiv.textContent = "Checking...";
  statusDiv.className = "status loading";

  debounceTimer = setTimeout(() => {
    checkUsername(username);
  }, 500);
});

function checkUsername(username) {
  fetch("users.json")
    .then(response => response.json())
    .then(data => {
      const exists = data.usernames.includes(username.toLowerCase());

      if (exists) {
        statusDiv.textContent = "Username already taken";
        statusDiv.className = "status taken";
        isAvailable = false;
      } else {
        statusDiv.textContent = "Username available";
        statusDiv.className = "status available";
        isAvailable = true;
      }
    })
    .catch(error => {
      statusDiv.textContent = "Error checking username";
      statusDiv.className = "status taken";
      isAvailable = false;
    });
}

// Prevent submission if username not available
form.addEventListener("submit", (e) => {
  if (!isAvailable) {
    e.preventDefault();
    alert("Please choose an available username before submitting.");
  } else {
    alert("Registration successful!");
  }
});
