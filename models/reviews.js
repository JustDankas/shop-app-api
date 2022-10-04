const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
    body:{
        type:String,
        required:true
    },
    user:{
        type: String,
        ref:'Users',
        required:true
    },
    rating:{
        type:Number,
        min:0,
        max:5,
        required:true
    },
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Item',
        required:true
    },
    createdAt:{
        type: Date,
        default: () => Date.now(),
        immutable:true
    },
    updatedAt:{
        type: Date,
        default: () => Date.now(),
    },
})

ReviewSchema.pre('save',function(next){
    this.updatedAt = Date.now()
    next()
})

module.exports = mongoose.model('Review',ReviewSchema);