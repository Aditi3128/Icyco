// Contact form elements
const contactForm = document.getElementById("contact-form");
const firstname = document.getElementById("fname");
const lastname = document.getElementById("lname");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const message = document.getElementById("message");

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^[0-9]{10}$/;

// ---------------------------
// Contact form submit handler
// ---------------------------
contactForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  let isValid = true;

  // sab purane validations same hi rakhe hain 👇
  if (firstname.value.trim() === "") {
    setError(firstname, "First name is required!");
    isValid = false;
  } else if (/[^a-zA-Z]/.test(firstname.value.trim())) {
    setError(firstname, "Only letters are allowed in first name!");
    isValid = false;
  }

  if (lastname.value.trim() === "") {
    setError(lastname, "Last name is required!");
    isValid = false;
  } else if (/[^a-zA-Z]/.test(lastname.value.trim())) {
    setError(lastname, "Only letters are allowed in last name!");
    isValid = false;
  }

  if (email.value.trim() === "") {
    setError(email, "Email is required!");
    isValid = false;
  } else if (!emailRegex.test(email.value.trim())) {
    setError(email, "Invalid email format!");
    isValid = false;
  }

  if (phone.value.trim() === "") {
    setError(phone, "Phone number is required!");
    isValid = false;
  } else if (!phoneRegex.test(phone.value.trim())) {
    setError(phone, "Contact number must have exactly 10 digits");
    isValid = false;
  }

  if (message.value.trim() === "") {
    setError(message, "Message is required!");
    isValid = false;
  }

  // agar validation fail ho gaya to yahin return
  if (!isValid) return;

  // ✅ yahan se BACKEND CALL — /api/contact
  try {
    const res = await fetch("http://localhost:5000/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: firstname.value.trim(),
        lastName: lastname.value.trim(),
        email: email.value.trim(),
        phone: phone.value.trim(),
        message: message.value.trim(),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Something went wrong");
      return;
    }

    alert(data.message || "Your details were submitted successfully ✅");

    // form clear + error messages clear
    contactForm.reset();
    clearErrors();
  } catch (err) {
    console.error("Contact form error:", err);
    alert("Server error. Please try again later.");
  }
});

// ---------------------------
// Newsletter section scripts
// ---------------------------
const newsletterForm = document.getElementById("news-letter");
const newsletterEmail = document.getElementById("newsletter-email");

newsletterForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  if (newsletterEmail.value.trim() === "") {
    setError(newsletterEmail, "Email is required!");
  } else if (!emailRegex.test(newsletterEmail.value.trim())) {
    setError(newsletterEmail, "Invalid email format!");
  } else {
    // front-end only validation abhi ke liye
    alert("Subscribed to newsletter ✅");
    newsletterForm.reset();
    clearErrors();
  }
});

// ---------------------------
// Helper functions
// ---------------------------
function setError(field, errorMessage) {
  const error = field.parentElement.querySelector("small");
  if (error) error.textContent = errorMessage;
}

function clearErrors() {
  const errorTexts = document.querySelectorAll("#contact-form small, #news-letter small");
  errorTexts.forEach((el) => (el.textContent = ""));
}
