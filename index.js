const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.urlencoded({extended: true}));
app.use(express.json())

const uri = process.env.URI_MONGODB

async function connect(){
    try{
        await mongoose.connect(uri,{
            useNewUrlParser: true,
            // useUnifiedTopology:true,
        })
        console.log('connected')
    }
    catch(e){
        console.log(e)
    }
}
connect();

const port = process.env.PORT || 8080

// const usersRouter = require('./routes/Users.js');
// app.use('/auth',usersRouter);

const itemRouter = require('./routes/admin.js');
app.use('/admin',itemRouter);

const productRouter = require('./routes/products')
app.use('/products',productRouter);

const filterRouter = require('./routes/filters')
app.use('/category',filterRouter);

const userRouter = require('./routes/Users')
app.use('/auth',userRouter);

const cartRouter = require('./routes/cart')
app.use('/cart',cartRouter);

app.listen(port,()=>{console.log(`Listening to port ${port}`)})