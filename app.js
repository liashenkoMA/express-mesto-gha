const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const router = require('./routes');
const app = express();
const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
}).then(() => {
  console.log('Connected to MongoDB');
});

app.use(helmet());
app.use((req, res, next) => {
  req.user = {
    _id: '64d5fcb84109b422d0c7baca',
  };
  next();
});
app.use(bodyParser.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`Connected to ${PORT} port`);
});
