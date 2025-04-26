const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const port = 3001;

app.use(cors());

app.get('/api/daily-close-tasks', async (req, res) => {
  try {
    const stepsPath = path.join(__dirname, './Ecommerce_Data/daily_close_steps.csv');
    const substepsPath = path.join(__dirname, './Ecommerce_Data/daily_close_substeps.csv');
    
    const [stepsCSV, substepsCSV] = await Promise.all([
      fs.readFile(stepsPath, 'utf-8'),
      fs.readFile(substepsPath, 'utf-8')
    ]);

    res.json({
      steps: stepsCSV,
      substeps: substepsCSV
    });
  } catch (error) {
    console.error('Error reading CSV files:', error);
    res.status(500).json({ error: 'Failed to read CSV files' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 