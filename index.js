const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// MySQL Connection Configuration

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  port: process.env.MYSQL_PORT,
  database: process.env.MYSQL_DATABASE,
});

// Connect to MySQL
pool.getConnection((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Registration
app.post("/register", (req, res) => {
  const { username, password, userEmail } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10); // Hash the password

  const sql =
    "INSERT INTO Users (id,username, password,email) VALUES (?, ?, ?,?)";
  const id = Math.floor(Math.random() * 1000) + 1;
  const values = [id, username, hashedPassword, userEmail];

  pool.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error creating user:", err);
      res.status(500).json({ error: "Failed to create user" });
      return;
    }

    res.status(201).json({ message: "User created successfully" });
  });
});
//login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM Users WHERE username = ?";
  const values = [username];

  pool.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error retrieving user:", err);
      res.status(500).json({ error: "Failed to retrieve user" });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const user = results[0];
    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ error: "Incorrect password" });
      return;
    }

    res.json({ message: "Login successful", user });
  });
});

//get specific user
app.get("/tutorials/user/:user_id", (req, res) => {
  const userId = req.params.user_id;
  const sql = "SELECT * FROM tutorial WHERE user_id = ?";
  const values = [userId];

  pool.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error retrieving tutorials:", err);
      res.status(500).json({ error: "Failed to retrieve tutorials" });
      return;
    }

    res.json(results);
  });
});
//get specific user tutorials
app.get("/users/:user_id/tutorials", (req, res) => {
  const userId = req.params.user_id;
  const sql = "SELECT * FROM tutorial WHERE user_id = ?";
  const values = [userId];

  pool.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error retrieving user tutorials:", err);
      res.status(500).json({ error: "Failed to retrieve user tutorials" });
      return;
    }

    res.json(results);
  });
});
//create specific user tutorial
app.post("/tutorials/user/:user_id", (req, res) => {
  const userId = req.params.user_id;
  const {
    title,
    start_date,
    end_date,
    start_time,
    end_time,
    days,
    max_people,
    level,
    images,
    tutorial_role,
  } = req.body;

  const sql =
    "INSERT INTO tutorial (title, start_date, end_date, start_time, end_time, days, max_people, level, images, tutorial_role, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [
    title,
    start_date,
    end_date,
    start_time,
    end_time,
    days,
    max_people,
    level,
    images,
    tutorial_role,
    userId,
  ];

  pool.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error creating tutorial:", err);
      res.status(500).json({ error: "Failed to create tutorial" });
      return;
    }

    res.status(201).json({ message: "Tutorial created successfully" });
  });
});
// Create a new tutorial
app.post("/tutorials", (req, res) => {
  const {
    tutorialname,
    tutorialStartDate,
    tutorialEndDate,
    tutorialStartTime,
    tutorialEndTime,
    tutorialDays,
    tutorialNumberOfPeople,
    tutorialLevel,
    selectedImage,
    tutorial_role,
    id,
  } = req.body;
  const tutorialDaysToString = tutorialDays.join(",");
  const sql =
    "INSERT INTO tutorial (title, start_date, end_date, start_time, end_time, days, max_people, level, images, tutorial_role, user_id) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [
    tutorialname,
    tutorialStartDate,
    tutorialEndDate,
    tutorialStartTime,
    tutorialEndTime,
    tutorialDaysToString,
    tutorialNumberOfPeople,
    tutorialLevel,
    selectedImage,
    "admin",
    id,
  ];
  pool.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error creating tutorial:", err);
      res.status(500).json({ error: "Failed to create tutorial" });
      return;
    }

    res.status(201).json({ message: "Tutorial created successfully" });
  });
});
app.post("/tutorials/signup", (req, res) => {
  const {
    tutorialName,
    startDate,
    endDate,
    startTime,
    endTime,
    daysToString,
    amount,
    maxAmount,
    level,
    image,
    tutorial_role,
    id,
  } = req.body;
  const sql =
    "INSERT INTO tutorial (title, start_date, end_date, start_time, end_time, days,current_people, max_people, level, images, tutorial_role, user_id) VALUES ( ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [
    tutorialName,
    startDate,
    endDate,
    startTime,
    endTime,
    daysToString,
    amount,
    maxAmount,
    level,
    image,
    "student",
    id,
  ];
  pool.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error creating tutorial:", err);
      res.status(500).json({ error: "Failed to create tutorial" });
      return;
    }

    res.status(201).json({ message: "Tutorial created successfully" });
  });
});

// Get all tutorials
app.get("/tutorials", (req, res) => {
  const sql = "SELECT * FROM tutorial";

  pool.query(sql, (err, results) => {
    if (err) {
      console.error("Error retrieving tutorials:", err);
      res.status(500).json({ error: "Failed to retrieve tutorials" });
      return;
    }

    res.json(results);
  });
});
app.get("/users", (req, res) => {
  const sql = "SELECT * FROM Users";

  pool.query(sql, (err, results) => {
    if (err) {
      console.error("Error retrieving tutorials:", err);
      res.status(500).json({ error: "Failed to retrieve tutorials" });
      return;
    }

    res.json(results);
  });
});

// Get a specific tutorial by ID
app.get("/tutorials/:tutorial_id", (req, res) => {
  const tutorialId = req.params.tutorial_id;
  const sql = "SELECT * FROM tutorial WHERE tutorial_id = ?";
  const values = [tutorialId];

  pool.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error retrieving tutorial:", err);
      res.status(500).json({ error: "Failed to retrieve tutorial" });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: "Tutorial not found" });
      return;
    }

    res.json(results[0]);
  });
});

// Update a  specyfic tutorial
app.put("/tutorials/:tutorial_id", (req, res) => {
  const {
    tutorialname,
    tutorialStartDate,
    tutorialEndDate,
    tutorialStartTime,
    tutorialEndTime,
    tutorialDays,
    tutorialNumberOfPeople,
    tutorialLevel,
    selectedImage,
    tutorialRole,
    id,
    index,
  } = req.body;

  const filteredDays = tutorialDays.filter((day) => day.length > 1);
  const daysToString = filteredDays.join(",");
  console.log(daysToString);
  const sql =
    "UPDATE tutorial SET title = ?, start_date = ?, end_date = ?, start_time = ?, end_time = ?, days = ?, max_people = ?, level = ?, tutorial_role = ?, user_id = ? WHERE tutorial_id = ?";
  const values = [
    tutorialname,
    tutorialStartDate,
    tutorialEndDate,
    tutorialStartTime,
    tutorialEndTime,
    daysToString,
    tutorialNumberOfPeople,
    tutorialLevel,
    tutorialRole,
    id,
    index,
  ];
  pool.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error updating tutorial:", err);
      res.status(500).json({ error: "Failed to update tutorial" });
      return;
    }

    res.json({ message: "Tutorial updated successfully" });
  });
});

// Delete a tutorial
app.delete("/tutorials/:tutorial_id", (req, res) => {
  const tutorialId = req.params.tutorial_id;
  const sql = "DELETE FROM tutorial WHERE tutorial_id = ?";
  const values = [tutorialId];

  pool.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error deleting tutorial:", err);
      res.status(500).json({ error: "Failed to delete tutorial" });
      return;
    }

    res.json({ message: "Tutorial deleted successfully" });
  });
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
