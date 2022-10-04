const mongoose = require('mongoose');

const itemSchema = new  mongoose.Schema({
    title: {
        type:String,
        required:true,
        unique:true
    },
    price: {
        type:Number,
        min:0
    },
    image: {
        type:String,
        required:true
    },
    description: {
        type:String,
        required:true
    },
    rating: {
        type:Number,
        required:true,
        min:0,
        max:5,
        default:0
    },
    totalRating: {
        type:Number,
        required:true,
        min:0,
        default:0
    },
    // ratings:{
    //     type:[mongoose.Schema.Types.ObjectId],
    //     ref:'Review',
    //     default:[]
    // },
    ratingCount:{
        type:Number,
        required:true,
        min:0,
        default:0
    },
    categories:{
        type: String,
        required:true,
        // validate:{
        //     validator: v=> {
        //         console.log(v)
        //         return v.length > 0
        //     },
        //     message: props => "No categories inserted"
        // }
        
    },
    filters: [{
        filterName:String,
        values:[String]
    }]

})


itemSchema.query.sortBy = function(sortBy){
    console.log(sortBy)
    if(sortBy=='popularity') return this.sort({ratingCount:-1})
    else if(sortBy=='highest') return this.sort({price:-1})
    else if(sortBy=='lowest') return this.sort({price:1})
    else if(sortBy=='rating') return this.sort({rating:-1})
}

const filters = [{
    filterName:'Company',
    values:['samsung']
},
{
    filterName:'RAM',
    values:['16GB']
}]

itemSchema.query.findByFilters = function(body){
    let query =  {}
    const queryArray = []
    const filters = body.filters
    for(let i in filters){
        const obj = {}
        const f = filters[i]
        obj['filters.filterName'] = f.filterName
        obj["filters.values"] = {$in:f.values}
        queryArray.push(obj)
    }
    query = {$and:queryArray}
    console.log(queryArray)
    // 'filters.filterName':'Company','filters.values':{$in:['samsung','apple']}
    return this.find(query)
}

module.exports = mongoose.model('Item',itemSchema);