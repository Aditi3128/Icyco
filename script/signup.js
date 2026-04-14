
    // const passwordInput = document.getElementById("password-input-field");
    // const strengthText = document.getElementById("password-strength-text");
    // const strengthBar = document.getElementById("strength-bar");

    // passwordInput.addEventListener("input", function () {
    //     const password = passwordInput.value;
    //     const result = zxcvbn(password);
    //     const strength = result.score;

    //     // Update strength bar and text
    //     strengthBar.style.width = `${(strength + 1) * 20}%`;
    //     const strengthLevels = ["Very Weak", "Weak", "Okay", "Good", "Strong"];
    //     strengthText.textContent = strengthLevels[strength];
        
    //     const colors = ["#ff4d4d", "#ff944d", "#ffd24d", "#d2ff4d", "#4dff88"];
    //     strengthBar.style.backgroundColor = colors[strength];
    // });

    // // Form validation logic
    // document.querySelector("form").addEventListener("submit", function (event) {
    //     event.preventDefault();

    //     const firstName = document.querySelector("input[placeholder='First name']");
    //     const lastName = document.querySelector("input[placeholder='Last name']");
    //     const email = document.querySelector("input[type='email']");
    //     const password = document.getElementById("password-input-field");

    //     clearErrors();

    //     let isValid = true;

    //     if (firstName.value.trim() === "") {
    //         showError(firstName, "First name is required");
    //         isValid = false;
    //     }

    //     if (lastName.value.trim() === "") {
    //         showError(lastName, "Last name is required");
    //         isValid = false;
    //     }

    //     if (email.value.trim() === "") {
    //         showError(email, "Email is required");
    //         isValid = false;
    //     }

    //     if (password.value.trim() === "") {
    //         showError(password, "Password is required");
    //         isValid = false;
    //     }

    //     if (isValid) {
    //         this.submit();
    //     }
    // });

    // function showError(inputElement, message) {
    //     inputElement.classList.add("error");

    //     const errorMessage = document.createElement("div");
    //     errorMessage.className = "error-message show-message";
    //     errorMessage.innerText = message;

    //     inputElement.parentNode.appendChild(errorMessage);
    // }

    // function clearErrors() {
    //     const inputs = document.querySelectorAll(".input-field");
    //     inputs.forEach(input => input.classList.remove("error"));

    //     const errorMessages = document.querySelectorAll(".error-message");
    //     errorMessages.forEach(message => message.remove());
    // }
// script/signup.js

// ---------------------------
// Password strength meter
// ---------------------------
// script/signup.js

// ---------------- Password strength ----------------
const passwordInput = document.getElementById("password-input-field");
const strengthText = document.getElementById("password-strength-text");
const strengthBar = document.getElementById("strength-bar");

if (passwordInput && strengthText && strengthBar) {
  passwordInput.addEventListener("input", function () {
    const password = passwordInput.value;
    const result = zxcvbn(password);   // library loaded in HTML
    const strength = result.score;     // 0-4

    const strengthLevels = ["Very Weak", "Weak", "Okay", "Good", "Strong"];
    const colors = ["#ff4d4d", "#ff944d", "#ffd24d", "#d2ff4d", "#4dff88"];

    strengthBar.style.width = `${(strength + 1) * 20}%`;
    strengthBar.style.backgroundColor = colors[strength];
    strengthText.textContent = strengthLevels[strength];
  });
}

// ---------------- Signup + validation + backend ----------------
const signupForm = document.getElementById("signup-form");

if (signupForm) {
  signupForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const firstName = document.querySelector("input[placeholder='First name']");
    const lastName = document.querySelector("input[placeholder='Last name']");
    const email = document.querySelector("input[type='email']");
    const password = document.getElementById("password-input-field");

    clearErrors();
    let isValid = true;

    if (!firstName.value.trim()) {
      showError(firstName, "First name is required");
      isValid = false;
    }

    if (!lastName.value.trim()) {
      showError(lastName, "Last name is required");
      isValid = false;
    }

    if (!email.value.trim()) {
      showError(email, "Email is required");
      isValid = false;
    }

    if (!password.value.trim()) {
      showError(password, "Password is required");
      isValid = false;
    }

    if (!isValid) return;

    // ✅ Backend call
    try {
      const res = await fetch("http://127.0.0.1:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName.value.trim(),
          lastName: lastName.value.trim(),
          email: email.value.trim(),
          password: password.value,
        }),
      });

      const data = await res.json();
      console.log("REGISTER RESPONSE:", data);

      if (!res.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      alert("✅ Account created successfully! Please login.");
      // signup success -> login page
      window.location.href = "login.html";
    } catch (err) {
      console.error("REGISTER ERROR (frontend):", err);
      alert("Server error. Please check if backend is running.");
    }
  });
}

// ---------------- Helper functions ----------------
function showError(inputElement, message) {
  inputElement.classList.add("error");

  const errorMessage = document.createElement("div");
  errorMessage.className = "error-message show-message";
  errorMessage.innerText = message;

  inputElement.parentNode.appendChild(errorMessage);
}

function clearErrors() {
  const inputs = document.querySelectorAll(".input-field");
  inputs.forEach((input) => input.classList.remove("error"));

  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach((message) => message.remove());
}
