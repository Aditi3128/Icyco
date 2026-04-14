// // server.js

// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// require("dotenv").config();

// const app = express();

// /* ------------------------------------
//  * 1️⃣ Middlewares
//  * ----------------------------------*/
// app.use(
//   cors({
//     origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   })
// );
// app.use(express.json());

// /* ------------------------------------
//  * 2️⃣ Database Connect
//  * ----------------------------------*/
// const MONGO_URI = process.env.MONGO_URI;

// if (!MONGO_URI) {
//   console.error("❌ MONGO_URI missing in .env file");
//   process.exit(1);
// }

// mongoose.set("strictQuery", true);

// async function connectDB() {
//   try {
//     console.log("⏳ Connecting to MongoDB...");
//     await mongoose.connect(MONGO_URI);
//     console.log("✅ Connected to MongoDB");
//   } catch (err) {
//     console.error("❌ MongoDB Error:", err.message);
//     process.exit(1); // DB nahi mila toh server band kar do
//   }
// }

// /* ------------------------------------
//  * 3️⃣ Models
//  * ----------------------------------*/
// const subscriberSchema = new mongoose.Schema(
//   {
//     email: { type: String, required: true, unique: true, trim: true },
//   },
//   { timestamps: true }
// );

// const Subscriber = mongoose.model("Subscriber", subscriberSchema);

// const userSchema = new mongoose.Schema(
//   {
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     password: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// const User = mongoose.model("User", userSchema);

// /* ------------------------------------
//  * 4️⃣ Test Route
//  * ----------------------------------*/
// app.get("/", (req, res) => {
//   res.send("IcyCo backend is running 🚀");
// });

// /* ------------------------------------
//  * 5️⃣ Subscribe API
//  * ----------------------------------*/
// app.post("/api/subscribe", async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.status(400).json({ message: "Email is required" });
//     }

//     const cleanEmail = email.trim().toLowerCase();

//     const existing = await Subscriber.findOne({ email: cleanEmail });
//     if (existing) {
//       return res.status(400).json({ message: "Email already subscribed!" });
//     }

//     const sub = await Subscriber.create({ email: cleanEmail });

//     console.log("📩 New Subscriber Saved:", sub.email);

//     return res.status(201).json({
//       message: "Subscribed successfully 🎉",
//       subscriber: sub,
//     });
//   } catch (err) {
//     console.error("Subscribe Error:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// });

// /* ------------------------------------
//  * 6️⃣ Auth APIs (Register / Login)
//  * ----------------------------------*/

// // REGISTER
// app.post("/api/auth/register", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res
//         .status(400)
//         .json({ message: "Email & password are required" });
//     }

//     const cleanEmail = email.trim().toLowerCase();

//     const exists = await User.findOne({ email: cleanEmail });
//     if (exists) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const hashed = await bcrypt.hash(password, 10);

//     const user = await User.create({ email: cleanEmail, password: hashed });

//     return res.status(201).json({
//       message: "User registered",
//       userId: user._id,
//     });
//   } catch (err) {
//     console.error("REGISTER ERROR:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // LOGIN
// app.post("/api/auth/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res
//         .status(400)
//         .json({ message: "Email & password are required" });
//     }

//     const cleanEmail = email.trim().toLowerCase();

//     const user = await User.findOne({ email: cleanEmail });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid email/password" });
//     }

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) {
//       return res.status(400).json({ message: "Invalid email/password" });
//     }

//     const token = jwt.sign(
//       { userId: user._id },
//       process.env.JWT_SECRET || "icyco_secret_key",
//       { expiresIn: "1h" }
//     );

//     return res.json({ message: "Login success", token });
//   } catch (err) {
//     console.error("LOGIN ERROR:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// /* ------------------------------------
//  * 7️⃣ Start server AFTER DB connect
//  * ----------------------------------*/
// const PORT = process.env.PORT || 5000;

// async function startServer() {
//   await connectDB(); // pehle DB, phir server

//   app.listen(PORT, () => {
//     console.log(`🚀 Server running on port ${PORT}`);
//   });
// }

// // global unhandled promise rejection guard
// process.on("unhandledRejection", (err) => {
//   console.error("UNHANDLED REJECTION 💥", err);
//   process.exit(1);
// });

// startServer();
// server.js

// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// require("dotenv").config();

// const app = express();

// /* ------------------------------------
//  * 1️⃣ Middlewares
//  * ----------------------------------*/
// app.use(
//   cors({
//     origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   })
// );
// app.use(express.json());

// /* ------------------------------------
//  * 2️⃣ Database Connect
//  * ----------------------------------*/
// const MONGO_URI = process.env.MONGO_URI;

// if (!MONGO_URI) {
//   console.error("❌ MONGO_URI missing in .env file");
//   process.exit(1);
// }

// mongoose.set("strictQuery", true);

// async function connectDB() {
//   try {
//     console.log("⏳ Connecting to MongoDB...");
//     await mongoose.connect(MONGO_URI);
//     console.log("✅ Connected to MongoDB");
//   } catch (err) {
//     console.error("❌ MongoDB Error:", err.message);
//     process.exit(1); // DB nahi mila toh server band kar do
//   }
// }

// /* ------------------------------------
//  * 3️⃣ Models
//  * ----------------------------------*/

// // Subscribers (popup)
// const subscriberSchema = new mongoose.Schema(
//   {
//     email: { type: String, required: true, unique: true, trim: true },
//   },
//   { timestamps: true }
// );
// const Subscriber = mongoose.model("Subscriber", subscriberSchema);

// // Users (auth)
// const userSchema = new mongoose.Schema(
//   {
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     password: { type: String, required: true },
//   },
//   { timestamps: true }
// );
// const User = mongoose.model("User", userSchema);

// // Contacts (Contact Us form)
// const contactSchema = new mongoose.Schema(
//   {
//     firstName: { type: String, required: true, trim: true },
//     lastName: { type: String, required: true, trim: true },
//     email: { type: String, required: true, trim: true, lowercase: true },
//     phone: { type: String, required: true, trim: true },
//     message: { type: String, required: true, trim: true },
//   },
//   { timestamps: true }
// );
// const Contact = mongoose.model("Contact", contactSchema);

// /* ------------------------------------
//  * 4️⃣ Test Route
//  * ----------------------------------*/
// app.get("/", (req, res) => {
//   res.send("IcyCo backend is running 🚀");
// });

// /* ------------------------------------
//  * 5️⃣ Subscribe API (popup)
//  * ----------------------------------*/
// app.post("/api/subscribe", async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.status(400).json({ message: "Email is required" });
//     }

//     const cleanEmail = email.trim().toLowerCase();

//     const existing = await Subscriber.findOne({ email: cleanEmail });
//     if (existing) {
//       return res.status(400).json({ message: "Email already subscribed!" });
//     }

//     const sub = await Subscriber.create({ email: cleanEmail });

//     console.log("📩 New Subscriber Saved:", sub.email);

//     return res.status(201).json({
//       message: "Subscribed successfully 🎉",
//       subscriber: sub,
//     });
//   } catch (err) {
//     console.error("Subscribe Error:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// });

// /* ------------------------------------
//  * 6️⃣ Contact Us API
//  * ----------------------------------*/
// app.post("/api/contact", async (req, res) => {
//   try {
//     const { firstName, lastName, email, phone, message } = req.body;

//     // Basic validation (same jaisa front-end me hai)
//     if (!firstName || !lastName || !email || !phone || !message) {
//       return res
//         .status(400)
//         .json({ message: "All fields are required (fname, lname, email, phone, message)" });
//     }

//     const cleanData = {
//       firstName: firstName.trim(),
//       lastName: lastName.trim(),
//       email: email.trim().toLowerCase(),
//       phone: phone.trim(),
//       message: message.trim(),
//     };

//     const contactDoc = await Contact.create(cleanData);

//     console.log("📨 New Contact Message:", contactDoc.email, "-", contactDoc.firstName);

//     return res.status(201).json({
//       message: "Thanks for contacting us! We will reach out soon 😊",
//       contactId: contactDoc._id,
//     });
//   } catch (err) {
//     console.error("CONTACT ERROR:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// });

// /* ------------------------------------
//  * 7️⃣ Auth APIs (Register / Login)
//  * ----------------------------------*/

// // REGISTER
// app.post("/api/auth/register", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res
//         .status(400)
//         .json({ message: "Email & password are required" });
//     }

//     const cleanEmail = email.trim().toLowerCase();

//     const exists = await User.findOne({ email: cleanEmail });
//     if (exists) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const hashed = await bcrypt.hash(password, 10);

//     const user = await User.create({ email: cleanEmail, password: hashed });

//     return res.status(201).json({
//       message: "User registered",
//       userId: user._id,
//     });
//   } catch (err) {
//     console.error("REGISTER ERROR:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // LOGIN
// app.post("/api/auth/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res
//         .status(400)
//         .json({ message: "Email & password are required" });
//     }

//     const cleanEmail = email.trim().toLowerCase();

//     const user = await User.findOne({ email: cleanEmail });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid email/password" });
//     }

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) {
//       return res.status(400).json({ message: "Invalid email/password" });
//     }

//     const token = jwt.sign(
//       { userId: user._id },
//       process.env.JWT_SECRET || "icyco_secret_key",
//       { expiresIn: "1h" }
//     );

//     return res.json({ message: "Login success", token });
//   } catch (err) {
//     console.error("LOGIN ERROR:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// /* ------------------------------------
//  * 8️⃣ Start server AFTER DB connect
//  * ----------------------------------*/
// const PORT = process.env.PORT || 5000;

// async function startServer() {
//   await connectDB(); // pehle DB, phir server

//   app.listen(PORT, () => {
//     console.log(`🚀 Server running on port ${PORT}`);
//   });
// }

// // global unhandled promise rejection guard
// process.on("unhandledRejection", (err) => {
//   console.error("UNHANDLED REJECTION 💥", err);
//   process.exit(1);
// });

// startServer();
// server.js

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

/* ------------------------------------
 * 1️⃣ Middlewares
 * ----------------------------------*/
app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use(express.json());

/* ------------------------------------
 * 2️⃣ Database Connect
 * ----------------------------------*/
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI missing in .env file");
  process.exit(1);
}

mongoose.set("strictQuery", true);

async function connectDB() {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  }
}

/* ------------------------------------
 * 3️⃣ Models
 * ----------------------------------*/

// Newsletter subscribers
const subscriberSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: true }
);
const Subscriber = mongoose.model("Subscriber", subscriberSchema);

// Contact form submissions
const contactSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);
const Contact = mongoose.model("Contact", contactSchema);

// Users for login/signup
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);

/* ------------------------------------
 * 4️⃣ Test Route
 * ----------------------------------*/
app.get("/", (req, res) => {
  res.send("IcyCo backend is running 🚀");
});

/* ------------------------------------
 * 5️⃣ Subscribe API (popup)
 * ----------------------------------*/
app.post("/api/subscribe", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const cleanEmail = email.trim().toLowerCase();

    const existing = await Subscriber.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(400).json({ message: "Email already subscribed!" });
    }

    const sub = await Subscriber.create({ email: cleanEmail });

    console.log("📩 New Subscriber Saved:", sub.email);

    return res.status(201).json({
      message: "Subscribed successfully 🎉",
      subscriber: sub,
    });
  } catch (err) {
    console.error("Subscribe Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/* ------------------------------------
 * 6️⃣ Contact API (Contact Us form)
 * ----------------------------------*/
app.post("/api/contact", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;

    if (!firstName || !lastName || !email || !phone || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const contact = await Contact.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      message: message.trim(),
    });

    console.log("📨 New contact message saved:", contact._id);

    return res.status(201).json({
      message: "Message sent successfully ✅",
      contactId: contact._id,
    });
  } catch (err) {
    console.error("CONTACT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ------------------------------------
 * 7️⃣ Auth APIs (Register / Login)
 * ----------------------------------*/

// REGISTER
app.post("/api/auth/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    console.log("📥 REGISTER BODY:", req.body);

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email & password are required" });
    }

    const cleanEmail = email.trim().toLowerCase();

    const exists = await User.findOne({ email: cleanEmail });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName: firstName?.trim() || "",
      lastName: lastName?.trim() || "",
      email: cleanEmail,
      password: hashed,
    });

    console.log("✅ New user registered:", user.email);

    return res.status(201).json({
      message: "User registered",
      userId: user._id,
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email & password are required" });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(400).json({ message: "Invalid email/password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid email/password" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "icyco_secret_key",
      { expiresIn: "1h" }
    );

    return res.json({ message: "Login success", token });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ------------------------------------
 * 8️⃣ Start server AFTER DB connect
 * ----------------------------------*/
const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION 💥", err);
  process.exit(1);
});

startServer();
