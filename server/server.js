const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();
const cors = require('cors');

const userRouter = require('./routes/users');
const postRouter = require('./routes/posts');	
const authRouter = require('./routes/auth');	

const uri = process.env.ATLAS_URI;
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
})

// Set CORS header
app.use(cors());

// Error Handler
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data; // Passing original error data
  res.status(status).json({ message: message, data: data });
});

app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/auth', authRouter);

// DB connection
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(result => {
    const port = process.env.PORT || 4000;
    const server = app.listen(port, () => {
      console.log(`Listening on port ${port}...`);
    });

    //https://github.com/EllisMin/mern-demo-production
		//https://github.com/EllisMin/MERN-demo-production/blob/master/app.js
    // Create socket io connection
    const io = require("./socket").init(server);
    // Connection listeners with client
    io.on("connection", socket => {
      console.log("Client connected");
    });
  })
  .catch(err => {
    // Handle error
  });