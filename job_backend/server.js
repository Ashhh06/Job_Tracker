const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorHandler');

dotenv.config();

const app = express();

//middleware
app.use(cors());
app.use(express.json());

//routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/applications', require('./routes/applications'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

//connect to mongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    //start server
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });