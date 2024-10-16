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
  return response.send({ msg: "Hello Aswin" });
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

app.post("/api/signup", async (request, response)=>{
  const { name, email, phoneNumber, address, preferences, password, confirmPassword } = request.body;

  // Basic validation (you can add more checks as needed)
  if (!name || !email || !phoneNumber || !address || !password || password !== confirmPassword) {
      return response.status(400).json({ message: 'Invalid data provided' });
  }



  // Query to insert data into the clients table
  const query = 'INSERT INTO clients (name, email, phoneNumber, address, preferences, password) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [name, email, phoneNumber, address, preferences, password];

  // // Use pool.query to insert data
  // pool.query(query, values, (err, result) => {
  //     if (err) {
  //         console.error('Error inserting data into database:', err);
  //         return response.status(500).json({ message: 'Internal server error' });
  //     }

  //     // Respond with success message and the ID of the newly created client
  //     response.status(200).json({ message: 'Signup successful', clientID: result.insertId });
  // });

  try {
    console.log('Signing up User with values:', values);
    const [result] = await pool.query(query, values);
    console.log('Signup successfully');
    response.status(200).json({ message: 'Signup  successfully!', transportationID: result.insertId });
  } catch (error) {
    console.error('Error signingup user:', error);
    response.status(500).json({ message: 'Internal server error' });
  }


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

// Route to fetch available locations based on packageID
app.get('/locations/:packageID', async (req, res) => {
  const { packageID } = req.params;
  try {
    // Assuming you have a table or predefined locations based on package ID
    const locations = [
      { id: 1, name: 'Himalayas, India' },
      { id: 2, name: 'Kyoto, Japan' },
      { id: 3, name: 'Maldives' },
      { id: 4, name: 'Masai Mara, Kenya' },
      { id: 5, name: 'Agra, India' },
      { id: 6, name: 'Caribbean Sea' },
    ].filter(location => location.id == packageID); // Filter based on packageID

    res.status(200).json(locations);
  } catch (err) {
    console.error('Error fetching locations:', err);
    res.status(500).json({ msg: 'Error fetching locations' });
  }
});
app.get('/hotels/:location', async (req, res) => {
  const { location } = req.params;
  try {
    // Define hotels based on location
    const hotels = {
      'Himalayas, India': [
        { id: 1, name: 'Mountain Retreat Lodge' },
        { id: 2, name: 'Himalayan Heights Resort' },
        { id: 3, name: 'Snow Peak Inn' },
        { id: 4, name: 'Valley View Hotel' },
        { id: 5, name: 'Alpine Meadows Resort' }
      ],
      'Kyoto, Japan': [
        { id: 6, name: 'Kyoto Royal Hotel' },
        { id: 7, name: 'Zen Garden Ryokan' },
        { id: 8, name: 'Cherry Blossom Inn' },
        { id: 9, name: 'Imperial Palace View Hotel' },
        { id: 10, name: 'Bamboo Grove Resort' }
      ],
      'Maldives': [
        { id: 11, name: 'Maldives Beach Resort' },
        { id: 12, name: 'Coral Reef Suites' },
        { id: 13, name: 'Turquoise Lagoon Hotel' },
        { id: 14, name: 'Ocean Breeze Villas' },
        { id: 15, name: 'Paradise Island Resort' }
      ],
      'Masai Mara, Kenya': [
        { id: 16, name: 'Mara Safari Lodge' },
        { id: 17, name: 'Savannah Sunset Camp' },
        { id: 18, name: 'Wildlife View Resort' },
        { id: 19, name: 'Lion Pride Hotel' },
        { id: 20, name: 'Acacia Tree Camp' }
      ],
      'Agra, India': [
        { id: 21, name: 'Heritage Hotel' },
        { id: 22, name: 'Taj View Palace' },
        { id: 23, name: 'Mughal Era Resort' },
        { id: 24, name: 'Riverside Retreat' },
        { id: 25, name: 'Marble Wonder Hotel' }
      ],
      'Caribbean Sea': [
        { id: 26, name: 'Caribbean Cruise Line' },
        { id: 27, name: 'Tropical Paradise Resort' },
        { id: 28, name: 'Beachfront Bungalows' },
        { id: 29, name: 'Island Breeze Hotel' },
        { id: 30, name: 'Palm Tree Paradise' }
      ],
    };


    const selectedHotels = hotels[location] || [];
    res.status(200).json(selectedHotels);
  } catch (err) {
    console.error('Error fetching hotels:', err);
    res.status(500).json({ msg: 'Error fetching hotels' });
  }
});
// POST endpoint to insert accommodation data
app.post('/accommodations', async (req, res) => {
  const { PackageID, HotelName, Location, CheckInDate, CheckOutDate, RoomType } = req.body;

  // SQL query to insert into the Accommodations table
  const query = `
    INSERT INTO Accommodations (PackageID, HotelName, Location, CheckInDate, CheckOutDate, RoomType)
    VALUES (?, ?, ?, ?, ?, ?)
  `;


  const values = [PackageID, HotelName, Location, CheckInDate, CheckOutDate, RoomType];

  try {
    console.log('Inserting accommodation with values:', values);
    const [result] = await pool.query(query, values);
    console.log('Accommodation inserted successfully');
    res.status(200).json({ message: 'Accommodation saved successfully!', accommodationID: result.insertId });
  } catch (error) {
    console.error('Error inserting accommodation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.post('/bookings', (req, res) => {
  const { ClientID, PackageID, BookingDate, NumberOfPeople, TotalCost } = req.body;
  const sql = `INSERT INTO Bookings (ClientID, PackageID, BookingDate, NumberOfPeople, TotalCost) 
               VALUES (?, ?, ?, ?, ?)`;

  db.query(sql, [ClientID, PackageID, BookingDate, NumberOfPeople, TotalCost], (err, result) => {
    if (err) {
      return res.status(500).send('Error saving booking');
    }
    res.status(200).send('Booking saved successfully!');
  });
});
app.post('/transportation', async (req, res) => {
  const { PackageID, TransportType, Company, DepartureDate, ReturnDate } = req.body;

  const query = `
    INSERT INTO Transportation (PackageID, TransportType, Company, DepartureDate, ReturnDate)
    VALUES (?, ?, ?, ?, ?)
  `;

  const values = [PackageID, TransportType, Company, DepartureDate, ReturnDate];

  try {
    console.log('Inserting transportation with values:', values);
    const [result] = await pool.query(query, values);
    console.log('Transportation inserted successfully');
    res.status(200).json({ message: 'Transportation saved successfully!', transportationID: result.insertId });
  } catch (error) {
    console.error('Error inserting transportation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Login Route
app.post('/api/login', async (request, response) => {
  const { clientIDorEmail, password } = request.body;

  // Basic validation
  if (!clientIDorEmail || !password) {
    return response.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    // Query to check if the client exists and fetch the client ID
    const query = `
      SELECT clientid, password FROM Clients
      WHERE (email = ? OR clientid = ?)
    `;
    const values = [clientIDorEmail, clientIDorEmail];

    const [results] = await pool.query(query, values);

    if (results.length > 0) {
      const user = results[0];
      // Compare the provided password with the stored password
      if (user.password === password) {
        // If password matches
        console.log('Login successful:', user);
        return response.status(200).json({ message: 'Login successful', clientID: user.clientid });
      } else {
        // If password does not match
        return response.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      // If user does not exist
      return response.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return response.status(500).json({ message: 'Internal server error' });
  }
});
// Fetch specific package details
app.get('/packages/:packageID', async (req, res) => {
  const { packageID } = req.params;
  try {
    const [results] = await pool.query('SELECT * FROM TravelPackages WHERE PackageID = ?', [packageID]);
    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).json({ message: 'Package not found' });
    }
  } catch (err) {
    console.error("Error fetching package details: ", err);
    res.status(500).json({ message: "Error fetching package details" });
  }
});

// Create a new booking
app.post('/bookings', async (req, res) => {
  const { ClientID, PackageID, BookingDate, NumberOfPeople, TotalCost } = req.body;
  const query = `INSERT INTO Bookings (ClientID, PackageID, BookingDate, NumberOfPeople, TotalCost) 
                 VALUES (?, ?, ?, ?, ?)`;

  try {
    const [result] = await pool.query(query, [ClientID, PackageID, BookingDate, NumberOfPeople, TotalCost]);
    res.status(200).json({ message: 'Booking saved successfully!', bookingID: result.insertId });
  } catch (error) {
    console.error('Error saving booking:', error);
    res.status(500).json({ message: 'Error saving booking' });
  }
});

// Fetch user's bookings
app.get('/bookings/:clientID', async (req, res) => {
  const { clientID } = req.params;
  try {
    const query = `
      SELECT b.*, tp.Name as PackageName
      FROM Bookings b
      JOIN TravelPackages tp ON b.PackageID = tp.PackageID
      WHERE b.ClientID = ?
    `;
    const [results] = await pool.query(query, [clientID]);
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching user bookings: ", err);
    res.status(500).json({ message: "Error fetching user bookings" });
  }
});



// Start Server
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});

export { pool };
