// server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API endpoint to add week data and get interpretation
app.post('/api/add-week-data', async (req, res) => {
    const {weekData } = req.body;
    const pythonScript = '../model/model.py'; // Adjust the path as needed
    const data = JSON.stringify(weekData);
    
    try {
      // Execute the Python script asynchronously
      const { stdout, stderr } = await execAsync(`python ${pythonScript} ${data}`);
  
      // Check for errors
      if (stderr) {
        console.error(`Error executing Python script: ${stderr}`);
        return res.status(500).json({ error: 'An error occurred while processing the data.' });
      }
  
      // Parse the output (prediction) from the Python script
      const prediction = JSON.parse(stdout);
      console.log("prediction : ",prediction)
  
      // Return the prediction as response
      res.json({ prediction });
    } catch (error) {
      console.error(`Error executing Python script: ${error}`);
      res.status(500).json({ error: 'An error occurred while processing the data.' });
    }
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
