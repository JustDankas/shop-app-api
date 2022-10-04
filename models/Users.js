const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const usersSchema = new mongoose.Schema({
    "username": {
        type:String,
        required:true,
        unique:true
    },
    "email": {
        type:String,
        required:true,
        unique:true
    },
    "password": {
        type:String,
        required:true,
    },
    "isAdmin": {
        type:Boolean,
        default:false
    },
    "favourites":{
        type: [mongoose.Schema.Types.ObjectId],
        ref:'Item',
        default:[]
    },
    "recentItems":{
        type: [mongoose.Schema.Types.ObjectId],
        ref:'Item',
        default:[]
    },
    "cart":{
        type: [mongoose.Schema.Types.ObjectId],
        ref:'Item',
        default:[]
    }
},{
    timestamps:true
}
);

usersSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
})

usersSchema.methods.matchPassword = async function (password){
    if(!password) throw new Error('Password is missing!');
    return await bcrypt.compare(password,this.password);
}

// usersSchema.pre('save',async function(next){
//     bcrypt.hash(this.password,8,(err,hash)=>{
//         if(err) return next(err);
//         this.password = hash
//         console.log('Hash :',hash)
//         return next()
//     })
// })

// usersSchema.methods.comparePasswords = async function (password){
//     console.log(password)
//     if(!password) throw new Error('Password is missing')

//     try {
//         const result = await bcrypt.compare(password,this.password)
//         return result
//     } catch (error) {
//         console.log('Error while comparing passwords!',error.message)
//     }
// }

module.exports = mongoose.model('Users',usersSchema);