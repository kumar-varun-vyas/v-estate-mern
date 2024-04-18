const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const userRouter = require('./routes/user.route')
const authRouter = require('./routes/auth.route')
const app = express()
app.use(express.json())
const PORT = 3000

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("mongodb connected successfully")
}).catch(err => {
    console.log("mongodb connection err -", err)
})

app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)


app.listen(PORT, () => {
    console.log("app is listning on ", PORT)
})