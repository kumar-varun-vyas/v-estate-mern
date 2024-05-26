const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
dotenv.config()

const userRouter = require('./routes/user.route')
const authRouter = require('./routes/auth.route')
const listingRouter = require('./routes/listing.route')
const errorHandler = require('./middlewares/errorHandler')

process.on('uncaughtException', function (err) {
    console.log('uncaught exception', err);
}).on('unhandledRejection', (reason, p) => {
    console.log('unhandledRejections reason', reason);
}).on('warning', (warning) => {
    console.log(`warning, ... ${warning}`);
});


const app = express()
app.use(cookieParser())
app.use(express.json())
const PORT = 3000

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("mongodb connected successfully")
}).catch(err => {
    console.log("mongodb connection err -", err)
})

app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/listing', listingRouter)


app.use(errorHandler)

app.listen(PORT, () => {
    console.log("app is listning on ", PORT)
})