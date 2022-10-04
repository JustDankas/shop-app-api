const { json } = require('express');
const express = require('express')
const router = express.Router();

const Item = require('../models/product');
const Category = require('../models/categories');
const Review = require('../models/reviews');

router.get('/',async (req,res)=>{
    try{
        const items = await Item.find();
        res.status(200).json({products:items})
    }
    catch(e){
        res.status(500).json({message:"Internal Server Error!"})
    }

})

router.post('/product/new',async (req,res)=>{
    
    try{
        const item = await Item.create(req.body);
        await item.save()
        res.status(200).json({Success:true,item,message:'Product created!'})
        
    }
    catch(e){
        res.status(500).json({Success:false,message:'Could not create product, check if it exists!'})
    }
})

router.put('/product/update/:id',async (req,res)=>{
    
    try{
        const item = await Item.findById(req.params.id);
        if(item){
            await item.updateOne(req.body)
            res.status(200).json({item,message:"Updated!"})
        }
        else{
            res.status(404).json({message:'Item Does not Exist'})
        }
    }
    catch(e){
        console.log(e)
        res.status(400).json({message:'Incorrect inputs'})
    }
})

router.delete('/product/delete/:id',async (req,res)=>{
    try{
        console.log(req.params.id)
        const item = await Item.findById(req.params.id)
        if(item){
            await Item.deleteOne({_id:req.params.id})
            await Review.deleteMany({productId:req.params.id})
            res.status(200).json({item,message:"Deleted!"})
        }
        else{
            res.status(404).json({message:'Item Does not Exist'})
        }
        
    }
    catch(e){
        res.status(500).json({message:'Server Internal Error!'})
    }
})

router.get('/categories',async (req,res)=>{
    try{
        const categories = await Category.find();
        res.status(200).json({categories})
    }
    catch(e){
        res.status(500).json({message:'Internal Server Error!'})
    }

})

router.post('/category/new',async (req,res)=>{
    
    try{
        const category = await Category.create(req.body);
        await category.save()
        res.status(200).json({Success:true,message:'Category Created!',category})
        
    }
    catch(e){
        res.status(400).json({Success:false,message:'Category was not created...'})
    }
})

router.put('/category/update/:categoryName',async (req,res)=>{
    try{
        const category = await Category.findOne({name:req.params.categoryName});
        if(category){
            await category.updateOne(req.body)
            res.status(200).json({Success:true,category,message:"Update Successful!"})
        }
        else{
            res.status(404).json({Success:false,message:'Category Not Found!'})
        }
    }
    catch(e){
        res.status(500).json({Success:false,message:'Category Not Updated!'})
    }
})

router.delete('/category/delete/:categoryName',async (req,res)=>{
    try{
        const category = await Category.findOne({name:req.params.categoryName})
        if(category){
            await category.deleteOne()
            res.status(200).json({Success:true,message:"Deleted!"})
        }
        else{
            res.status(404).json({Success:false,message:"Category Not Found!"})
        }
    }
    catch(e){
        res.status(500).json({message:"Internal Server Error!"})
    }

})

module.exports = router
