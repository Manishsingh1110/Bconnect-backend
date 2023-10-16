const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(express.static('uploads'))
app.use('/uploads', express.static('uploads'));

app.use(express.urlencoded({ extended: true }));

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

app.use('/app/createGroup',require('./routes/create/group'))
app.use('/app/createuser',require('./routes/create/user'))
app.use('/app/createpost',require('./routes/create/post'))


app.use('/app/getGroup',require('./routes/get/group'))
app.use('/app/getuser',require('./routes/get/user'))
app.use('/app/getpost',require('./routes/get/post'))


app.use('/app/updateGroup',require('./routes/update/group'))
app.use('/app/updateuser',require('./routes/update/user'))
app.use('/app/updatepost',require('./routes/update/post'))


app.use('/app/deleteGroup',require('./routes/delete/group'))
app.use('/app/deleteuser',require('./routes/delete/user'))
app.use('/app/deletepost',require('./routes/delete/post'))


app.get('/',(req,res)=>{
	res.send({"Start": true })
})


connectDB().then(()=>{
	app.listen(PORT,()=>{
		console.log(`Server on ${PORT}`);

	})
})
