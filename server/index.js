const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const app = express()
const PORT = 3000

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("mongodb connected successfully")
}).catch(err => {
    console.log("mongodb connection err -", err)
})


app.listen(PORT, () => {
    console.log("app is listning on ", PORT)
})