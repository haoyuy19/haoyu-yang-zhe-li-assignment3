const express = require('express');
const connectDB = require('./config/db');
const urlRouter = require('./url');

const app = express();
const router = express.Router();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

connectDB();

var cors = require('cors');

app.use(cors());

//app.get('/', (req, res) => res.send('API'));
app.use('/url', urlRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on prot ${PORT}`));
