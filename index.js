const express = require('express');
const connectDB = require('./config/database');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const tweetRoutes = require('./routes/tweet');
const relationRoutes = require('./routes/relation');
const fileRoutes = require('./routes/file');

// App and port
const app = express();
const port = process.env.PORT || 4000;

// Database
connectDB();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Enable public folder
app.use(express.static('uploads'));

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', tweetRoutes);
app.use('/api', relationRoutes);
app.use('/api', fileRoutes);

app.listen(port, '0.0.0.0', () => {
    console.log(`The server is running on the port: ${port}`)
});