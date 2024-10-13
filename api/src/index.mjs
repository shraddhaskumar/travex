import express from 'express';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt'; // Import bcrypt for password hashing

const pool = mysql.createPool({
  host: 'localhost',    // your DB host
  user: 'root',         // your MySQL username
  password: 'batman',   // your MySQL password
  database: 'travex',   // your database name
});

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3033;

// Sign Up Route
app.post('/signup', async (request, response) => {
  const { Name, Email, PhoneNumber, Address, Preferences, Password } = request.body;

  try {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Insert new client into the database
    const [result] = await pool.query(
      'INSERT INTO Clients (Name, Email, PhoneNumber, Address, Preferences, Password) VALUES (?, ?, ?, ?, ?, ?)',
      [Name, Email, PhoneNumber, Address, Preferences, hashedPassword]
    );

    return response.status(201).send({ msg: 'User registered successfully!', ClientID: result.insertId });
  } catch (err) {
    console.error("Error during sign-up: ", err);
    return response.status(500).send({ msg: 'Error during sign-up. Please try again.' });
  }
});

// Login Route
app.post('/login', async (request, response) => {
  const { loginIdentifier, Password } = request.body;

  try {
    // Fetch user based on ClientID or Email
    const [rows] = await pool.query(
      'SELECT * FROM Clients WHERE ClientID = ? OR Email = ?',
      [loginIdentifier, loginIdentifier]
    );

    if (rows.length === 0) {
      return response.status(401).send({ msg: 'Invalid credentials' });
    }

    const user = rows[0];

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(Password, user.Password);

    if (!isMatch) {
      return response.status(401).send({ msg: 'Invalid credentials' });
    }

    return response.status(200).send({ msg: 'Login successful!', ClientID: user.ClientID });
  } catch (err) {
    console.error("Error during login: ", err);
    return response.status(500).send({ msg: 'Error during login. Please try again.' });
  }
});

// Test Route
app.get("/", (request, response) => {
  return response.send({ msg: "Hello Bitch" });
});

// Fetch Clients Route
app.get('/data', async (request, response) => {
  try {
    const [results] = await pool.query('SELECT * FROM Clients');
    return response.status(200).send(results);
  } catch (err) {
    console.error("Error while fetching clients: ", err);
    return response.status(500).send({ msg: "Error while fetching clients" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});

export { pool };
