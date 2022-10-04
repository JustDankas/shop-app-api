const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required:true,
        unique:true,
        lowercase:true
    },
    keywords: [String],
    image: String,
    filters: [{
        filterName: String,
        values: [String],
        isCheckbox: {
            type:Boolean,
            // required:true,
            default:true
        }
    }],

})

// categorySchema.pre('save',function(next){
//     if(!this.filters.isCheckbox){
//         this.filters.values.push('All')
//     }
//     console.log('what')
//     next()
// })


module.exports = mongoose.model('Category',categorySchema);