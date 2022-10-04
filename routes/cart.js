const express = require('express');
const router = express.Router();

const Item = require('../models/product');
const Review = require('../models/reviews');
const Users = require('../models/Users');
const Category = require('../models/categories');


router.post('/:username',async (req,res)=>{
    try {
        const user = await Users.findOneAndUpdate({username:req.params.username},{$push:{cart:req.body.productId}},{new:true}).populate('cart')
        res.status(200).json({cart:user.cart})
    } catch (error) {
        res.status(404).json({error:error.message})
    }
})
router.get('/:username',async (req,res)=>{
    try {
        const user = await Users.findOne({username:req.params.username}).populate('cart')
        res.status(200).json({cart:user.cart})
    } catch (error) {
        res.status(404).json({error:error.message})
    }
})
router.put('/:username',async (req,res)=>{
    try {
        const user = await Users.findOneAndUpdate({username:req.params.username},{$pull:{cart:req.body.productId}},{new:true}).populate('cart')
        res.status(200).json({cart:user.cart})
    } catch (error) {
        res.status(404).json({error:error.message})
    }
})


module.exports = router;