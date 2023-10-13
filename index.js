const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.static('public'))
app.use('/static', express.static('public'))

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 3001
require('dotenv').config()
const mongoose = require('mongoose')
mongoose.set('strictQuery',false)
const mongoURI = process.env.MONGODB_OBJECT_ID;

const connectDB = async()=>{
	try {
		const conn = await mongoose.connect(mongoURI)
		console.log(`Mongodb Connected`)
	} catch (error) {
		console.log(error)
		process.exit(1)
	}
}


app.get('/',(req,res)=>{
	res.send({"Start": true })
})


connectDB().then(()=>{
	app.listen(PORT,()=>{
		console.log(`Server on ${PORT}`);

	})
})

