// const express = require("express");
// const http = require("http");
// const socketIo = require("socket.io");
// const mongoose = require('mongoose');
// require('dotenv').config();
// const port = process.env.PORT || 4000;
// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server); // < Interesting!
// const uri = process.env.ATLAS_URI;

// mongoose 
//  .connect(uri, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         useCreateIndex: true,   })   
//  .then(() => console.log("Database connected!"))
//  .catch(err => console.log(err));

// io.on('connection', client => {
//     console.log("New client connected");
//     client.on('disconnect', () => { });
// });

// const userRouter = require('./routes/users')(io);
// const postRouter = require('./routes/posts');	

// app.use('/users', userRouter);
// app.use('/posts', postRouter);

// server.listen(port, function () {
//     console.log('listening on *:4000');
// });

const express = require('express')
const cors = require('cors');
const app = express();
const port = process.env.port || 4000;
const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.ATLAS_URI;
mongoose 
 .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,   })   
 .then(() => console.log("Database connected!"))
 .catch(err => console.log(err));

app.use(cors());
app.use(express.json());

const userRouter = require('./routes/users');
const postRouter = require('./routes/posts');	
const authRouter = require('./routes/auth');	

app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})