const express = require('express')
const router = express.Router();

const Category = require('../models/categories');

router.get('/:categoryName',async (req,res)=>{
    try{
        const filters = await Category.find({name:req.params.categoryName})
        res.status(200).json({category:filters})
    }
    catch(e){
        res.status(500).json({message:"Internal Server Error!"})
    }
})

// async function removeAllCategories(){
//     await Category.deleteMany()
// }
// removeAllCategories()
module.exports = router;