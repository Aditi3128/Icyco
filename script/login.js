// const togglePassword = document.getElementById("toggle-password");
// const passwordField = document.getElementById("password-input-field");

// passwordField.type = "password"; // default hidden

// togglePassword.addEventListener("click", () => {
//     // toggle type
//     const isPassword = passwordField.type === "password";
//     passwordField.type = isPassword ? "text" : "password";

//     // toggle icon
//     togglePassword.classList.toggle("fa-eye");
//     togglePassword.classList.toggle("fa-eye-slash");
// });
// script/login.js

// 🔐 Login + basic validation + backend call

// script/login.js

console.log("login.js loaded ✅");

const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("login-email");
const passwordInput = document.getElementById("login-password");
const rememberMeCheckbox = document.getElementById("remember-me");
const passwordToggle = document.getElementById("toggle-password");
const submitBtn = document.getElementById("login-submit");

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// 👉 Password show / hide
if (passwordToggle && passwordInput) {
  passwordToggle.addEventListener("click", () => {
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    passwordToggle.classList.toggle("fa-eye");
    passwordToggle.classList.toggle("fa-eye-slash");
  });
}

// 👉 Remembered email load
if (rememberMeCheckbox && emailInput) {
  const savedEmail = localStorage.getItem("icyco_saved_email");
  if (savedEmail) {
    emailInput.value = savedEmail;
    rememberMeCheckbox.checked = true;
  }
}

async function handleLogin() {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // basic validation
  if (!email) {
    alert("Please enter your email");
    return;
  }
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email");
    return;
  }
  if (!password) {
    alert("Please enter your password");
    return;
  }

  try {
    const res = await fetch("http://127.0.0.1:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log("Login response:", data);

    if (!res.ok) {
      alert(data.message || "Login failed");
      return;
    }

    alert("Login successful 🎉");

    if (data.token) {
      localStorage.setItem("icyco_auth_token", data.token);
    }

    if (rememberMeCheckbox?.checked) {
      localStorage.setItem("icyco_saved_email", email);
    } else {
      localStorage.removeItem("icyco_saved_email");
    }

    // redirect to home
    window.location.href = "index.html";
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    alert("Server error. Please try again later.");
  }
}

// 🔥 Button click se login
if (submitBtn) {
  submitBtn.addEventListener("click", (e) => {
    e.preventDefault(); // safety
    handleLogin();
  });
}

// safety: agar user Enter key press kare form me
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleLogin();
  });
}
