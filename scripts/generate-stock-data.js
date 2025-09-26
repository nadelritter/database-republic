const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

try {
  const csvPath = path.join(__dirname, '..', 'data', 'trade_republic_aktien_25_09_25.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf8');

  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  const stockData = records.map((record, index) => ({
    id: index + 1,
    name: (record.Name || record.name || '').replace(/[\x00-\x1F\x7F-\x9F]/g, '').replace(/"/g, '\\"').replace(/'/g, "\\'"),
    isin: record.ISIN || record.isin || '',
    image: '/placeholder.svg',
    added: '2025-09-26',
    removed: false,
  }));

  let jsContent = 'export const stockData = [\n';
  stockData.forEach((stock, index) => {
    jsContent += '  {\n';
    jsContent += `    id: ${stock.id},\n`;
    jsContent += `    name: "${stock.name}",\n`;
    jsContent += `    isin: "${stock.isin}",\n`;
    jsContent += `    image: "${stock.image}",\n`;
    jsContent += `    added: "${stock.added}",\n`;
    jsContent += `    removed: ${stock.removed}\n`;
    jsContent += '  }';
    if (index < stockData.length - 1) jsContent += ',';
    jsContent += '\n';
  });
  jsContent += '];\n';

  const outputPath = path.join(__dirname, '..', 'lib', 'stock-data.js');
  fs.writeFileSync(outputPath, jsContent, 'utf8');
  console.log(`Generated stock data with ${stockData.length} stocks`);
} catch (error) {
  console.error('Error:', error.message);
}
