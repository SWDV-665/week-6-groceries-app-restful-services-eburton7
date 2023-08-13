const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = new sqlite3.Database('groceries.db');

let groceryItems = [
  'Apples',
  'Cheesecake',
  'Celery',
  'Green Tea',
  'Burgers',
  'Tuna',
  'Pasta',
];


app.post('/api/groceries', (req, res) => {
  const newItem = req.body.item;
  groceryItems.push(newItem);
  res.status(201).send({ message: 'Item added successfully' });
});


app.put('/api/groceries/:id', (req, res) => {
  const itemId = req.params.id;
  const newItem = req.body.item;
  groceryItems[itemId] = newItem;
  res.status(200).send({ message: 'Item updated successfully' });
});


app.delete('/api/groceries/:id', (req, res) => {
  const itemId = req.params.id;
  groceryItems.splice(itemId, 1);
  res.status(200).send({ message: 'Item deleted successfully' });
});

app.get('/api/groceries', (req, res) => {
  db.all('SELECT * FROM groceries', (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(rows);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
