const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const bodyParser = require("body-parser");
const axios = require("axios"); // To send images to Python
const path = require('path');

const PORT = 3000;
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


// Configure MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Atharva",
  database: "facego"
});

db.connect((err) => {
  if (err) console.log("MySQL Connection Error: ", err);
  else console.log("MySQL Connected...");
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/home.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
  });
  

// User Registration
app.post("/register", (req, res) => {
    const { user_id, email, password } = req.body;
  
    // Check if user already exists
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error, try again." });
      }
  
      if (result.length > 0) {
        return res.status(400).json({ error: "User already exists!" });
      }
  
      // Insert new user
      db.query(
        "INSERT INTO users (user_id, email, password) VALUES (?, ?, ?)",
        [user_id, email, password],
        (err, result) => {
          if (err) {
            return res.status(500).json({ error: "Failed to register user." });
          }
          res.json({ message: "Registration successful!" });
        }
      );
    });
  });
  

// User Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, result) => {
      if (err) res.status(500).json({ error: err });
      else if (result.length > 0) res.json({ message: "Login successful!" });
      else res.status(401).json({ error: "Invalid credentials" });
    }
  );
});

// Store Ticket Booking Details
/*app.post("/book-ticket", (req, res) => {
  const { user_id, payment_method } = req.body;
  db.query(
    "INSERT INTO tickets (user_id, payment_method) VALUES (?, ?)",
    [user_id, payment_method],
    (err, result) => {
      if (err) res.status(500).json({ error: err });
      else res.json({ message: "Ticket booked successfully!" });
    }
  );
});*/




app.post("/book-ticket", (req, res) => {
    const { user_id, payment_method } = req.body;

    // Check if user_id exists in the users table
    db.query("SELECT user_id FROM users WHERE user_id = ?", [user_id], (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.redirect("/error.html");
        }

        if (results.length === 0) {
            // User ID does not exist, redirect to error page
            console.error("Error: User ID does not exist");
            return res.redirect("/error.html");
        }

        // If user_id exists, insert into tickets table
        db.query(
            "INSERT INTO tickets (user_id, payment_method) VALUES (?, ?)",
            [user_id, payment_method],
            (err, result) => {
                if (err) {
                    console.error("Ticket Booking Error:", err);
                    return res.redirect("/error.html");
                }else{
                    return res.redirect("/home.html");
                }
            }
        );
    });
});

  

// Upload & Process Face Scan
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/scan-face", upload.single("image"), async (req, res) => {
  try {
    const imageBuffer = req.file.buffer.toString("base64");
    const response = await axios.post("http://127.0.0.1:3000/process-face", { image: imageBuffer });

    if (response.data.success) {
      res.json({ message: "Face scan successful!", face_encoding: response.data.face_encoding });
    } else {
      res.status(400).json({ error: "Face scan failed" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error processing face scan" });
  }
});

// Increase request size limit
app.use(bodyParser.json({ limit: '50mb' }));  
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Route to handle image upload
app.post('/upload', (req, res) => {
  const image = req.body.image;
  if (!image) {
    return res.status(400).json({ error: 'No image received' });
  }
  console.log('Image received');
  res.status(200).json({ message: 'Image uploaded successfully!' });
});

// **KEEP ONLY ONE app.listen()**
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
