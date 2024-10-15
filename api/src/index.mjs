import express from 'express';
import mysql from 'mysql2/promise';
import cors from "cors";

const pool = mysql.createPool({
  host: 'localhost',    // your DB host
  user: 'root',         // your MySQL username
  password: 'batman',   // your MySQL password
  database: 'travex',   // your database name
});

const app = express();

app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3033;


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

app.post("/api/signup", (request, response)=>{
  const { name, email, phoneNumber, address, preferences, password, confirmPassword } = request.body;

  // Basic validation (you can add more checks as needed)
  if (!name || !email || !phoneNumber || !address || !password || password !== confirmPassword) {
      return response.status(400).json({ message: 'Invalid data provided' });
  }



  // Query to insert data into the clients table
  const query = 'INSERT INTO clients (name, email, phoneNumber, address, preferences, password) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [name, email, phoneNumber, address, preferences, password];

  // Use pool.query to insert data
  pool.query(query, values, (err, result) => {
      if (err) {
          console.error('Error inserting data into database:', err);
          return response.status(500).json({ message: 'Internal server error' });
      }

      // Respond with success message and the ID of the newly created client
      response.status(200).json({ message: 'Signup successful', clientID: result.insertId });
  }); 
})

// Assuming you're using Express and MySQL
app.get("/packages", async (req, res) => {
  console.log("Pack")
  try {
    const [results] = await pool.query('SELECT * FROM TravelPackages');
    return res.status(200).json(results); // Send the results as JSON
  } catch (err) {
    console.error("Error fetching packages: ", err);
    return res.status(500).json({ msg: "Error fetching packages" });
  }
});
app.get('/packages', async (req, res) => {
  const [results] = await pool.query('SELECT * FROM TravelPackages');
  res.json(results);
});

app.get('/accommodations/:packageID', async (req, res) => {
  const { packageID } = req.params;
  const [results] = await pool.query('SELECT * FROM Accommodations WHERE PackageID = ?', [packageID]);
  res.json(results);
});
// Fixed accommodations data for each packageID
const fixedAccommodations = {
  1: { HotelName: 'Mountain Retreat Lodge', Location: 'Himalayas, India' },
  2: { HotelName: 'Kyoto Royal Hotel', Location: 'Kyoto, Japan' },
  3: { HotelName: 'Maldives Beach Resort', Location: 'Maldives' },
  4: { HotelName: 'Mara Safari Lodge', Location: 'Masai Mara, Kenya' },
  5: { HotelName: 'Heritage Hotel', Location: 'Agra, India' },
  6: { HotelName: 'Caribbean Cruise Line', Location: 'Caribbean Sea' }
};

// POST endpoint to insert accommodation data
app.post('/accommodations', (req, res) => {
  const { PackageID, CheckInDate, CheckOutDate, RoomType } = req.body;

  // Get fixed data based on PackageID
  const accommodationDetails = fixedAccommodations[PackageID];
  if (!accommodationDetails) {
    return res.status(400).json({ message: 'Invalid PackageID' });
  }

  const { HotelName, Location } = accommodationDetails;

  // SQL query to insert into the Accommodations table
  const query = `
    INSERT INTO Accommodations (PackageID, HotelName, Location, CheckInDate, CheckOutDate, RoomType)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [PackageID, HotelName, Location, CheckInDate, CheckOutDate, RoomType];

  pool.query(query, values, (error, result) => {
    if (error) {
      console.error('Error inserting data:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.status(200).json({ message: 'Accommodation saved successfully!', accommodationID: result.insertId });
  });
});
app.post('/transportation', (req, res) => {
  const { PackageID, TransportType, Company, DepartureDate, ReturnDate } = req.body;

  const query = `
    INSERT INTO Transportation (PackageID, TransportType, Company, DepartureDate, ReturnDate)
    VALUES (?, ?, ?, ?, ?)
  `;

  const values = [PackageID, TransportType, Company, DepartureDate, ReturnDate];

  pool.query(query, values, (error, result) => {
    if (error) {
      console.error('Error inserting transportation data:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.status(200).json({ message: 'Transportation saved successfully!', transportationID: result.insertId });
  });
});



// Start Server
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});

export { pool };
