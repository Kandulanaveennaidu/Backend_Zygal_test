const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

function readData() {
    try {
        const data = fs.readFileSync('data.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return {};
    }
}

function writeData(data) {
    fs.writeFileSync('data.json', JSON.stringify(data));
}

app.get('/api/data', (req, res) => {
    const data = readData();
    res.json(data);
});

app.post('/api/data', (req, res) => {
    const number = parseInt(req.body.number);
    
    if (isNaN(number) || number < 1 || number > 100) {
        return res.status(400).json({ error: 'Number must be between 1 and 100' });
    }

    const data = readData();
    data[number] = (data[number] || 0) + 1;
    writeData(data);

    res.json(data);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));