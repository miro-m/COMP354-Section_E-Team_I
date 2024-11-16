const express = require('express');
const app = express();
const xlsx = require('xlsx');
const bodyParser = require('body-parser');
const fs = require('fs');

app.use(express.static(__dirname)); // Serve static files (HTML, CSS, JS)
app.use(bodyParser.json());

// Endpoint to append data to the Excel file
app.post('/export', (req, res) => {
  const { functiontype, input, output } = req.body;

  let workbook, worksheet;
  const outputFile = 'output.xlsx';

  // Check if the workbook exists
  if (fs.existsSync(outputFile)) {
    workbook = xlsx.readFile(outputFile);
    worksheet = workbook.Sheets["ETERNITY"];

    if (!worksheet) {
      worksheet = xlsx.utils.aoa_to_sheet([["Function Type", "Input", "Output"]]);
      xlsx.utils.book_append_sheet(workbook, worksheet, "ETERNITY");
    }
  } else {
    workbook = xlsx.utils.book_new();
    worksheet = xlsx.utils.aoa_to_sheet([["Function Type", "Input", "Output"]]);
    xlsx.utils.book_append_sheet(workbook, worksheet, "ETERNITY");
  }

  // Append new data
  const dataRow = [functiontype, input, output];
  const existingData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
  existingData.push(dataRow);
  const updatedWorksheet = xlsx.utils.aoa_to_sheet(existingData);

  workbook.Sheets["ETERNITY"] = updatedWorksheet;

  xlsx.writeFile(workbook, outputFile);
  res.json({ message: 'Data exported successfully!' });
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
