const express = require('express');
const router = express.Router();

const Item = require('../models/product');
const Review = require('../models/reviews');
const Users = require('../models/Users');
const Category = require('../models/categories');

router.get('/:category',async (req,res)=>{
    try{
        console.log(req.params.category)
        const items = await Item.find({categories:req.params.category})
        .sortBy(req.query.sortBy);
        res.status(200).json({products:items})
    }
    catch(e){
        res.status(500).json({message:"Internal Server Error!"})
    }
})

router.post('/search/:searchTerm',async (req,res)=>{
    try {
        const categories = await Category.find({keywords:req.params.searchTerm})
        if(categories.length>0){
            res.status(200).json({categories})
        }
        else{
            const regex = new RegExp('[^a-zA-Z]*'+req.params.searchTerm+'[^a-zA-Z]','i')
            const products = await Item.find({title:{$regex:regex}})
            if(products.length>0){
                res.status(200).json({products})
            }
            else{
                res.status(404).json({error:`Nothing matches the term: ${req.params.searchTerm}`})
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({error:'Internal Server Error'})
    }
})

router.route('/product/review/:productId')
.post(async (req,res)=>{
    try {
        const user = await Users.findOne({username:req.body.username})
        const product = await Item.findOne({_id:req.params.productId})
        if(user){
            if(product){
                const totalRating = parseInt(product.totalRating) + parseInt(req.body.rating)
                const ratingCount = parseInt(product.ratingCount)+1
                const review = await Review.create({
                    body:req.body.body,
                    rating:parseInt(req.body.rating),
                    user:req.body.username,
                    productId:req.params.productId
                })
                await review.save()
                await product.updateOne({
                    totalRating,
                    ratingCount,
                    rating:Math.floor(totalRating/ratingCount*10)/10
                })
                res.status(200).json({Success:true,message:"Review created!",review})
            }
            else{
                res.status(404)
                throw new Error('Product not found!')
            }

        }
        else{
            res.status(404)
            throw new Error('User not found!')
        }
    } catch (error) {
        res.json({error})
    }
})
.put(async (req,res)=>{

})

router.put('/recent-product',async (req,res)=>{
    try {
        const user = await Users.findOneAndUpdate({username:req.body.username},{recentItems:req.body.items},{new:true}).populate('recentItems')
        res.status(200).json({recent:user.recentItems})
    } catch (error) {
        console.log(error)
        res.json({error})
    }
})

router.put('/fav/add/:username',async (req,res)=>{
    try {
        const user = await Users.findOneAndUpdate({username:req.params.username},{$push: {favourites:req.body.id}},{new:true}).populate('favourites')
        // .findOne({favourites:{$ne:req.body.id}})

        res.status(200).json({favourites:user.favourites})

    } catch (error) {
        console.log(error)
        res.json({error})
    }
})
router.put('/fav/remove/:username',async (req,res)=>{
    try {
        const user = await Users.findOneAndUpdate({username:req.params.username},{$pull:{favourites:req.body.id}},{new:true}).populate('favourites')

        console.log(user)
        res.status(200).json({favourites:user.favourites})
        

    } catch (error) {
        console.log(error)
        res.json({error})
    }
})


router.get('/favs/get/:username',async (req,res)=>{
    try {
        const user = await Users.findOne({username:req.params.username}).populate('favourites')
        res.status(200).json({
            favourites:user.favourites
        })
        

    } catch (error) {
        console.log(error)
        res.status(404).json({error})
    }
})

router.get('/reviews/user/:username',async (req,res)=>{
    try {
        const reviews = await Review.find({user:req.params.username}).populate('productId')
        res.status(200).json({reviews})
    } catch (error) {
        console.log(error.message)
        res.status(404).json({error:error.message})
    }
})


// GET/DELETE ALL REVIEWS
router.route('/all/reviews')
.get(async (req,res)=>{
    try {
        const review = await Review.find().populate('user')
        res.status(200).json({review})
    } catch (error) {
        res.status(500).json({error})
    }
})
.delete(async (req,res)=>{
    try {
        const reviews = await Review.deleteMany()
        res.status(200).json({message:'Deleted successfully!'})
    } catch (error) {
        res.status(500).json({error})
    }
})

// GET/DELETE SPECIFIC REVIEW
router.route('/reviews/:reviewId')
.get(async (req,res)=>{
    try {
        const review = await Review.findOne({_id:req.params.reviewId})
        res.status(200).json({review})
    } catch (error) {
        res.status(500).json({error})
    }
})
.delete(async (req,res)=>{
    try {
        const review = await Review.findOne({_id:req.params.reviewId})
        const product = await Item.findOne({_id:review.productId||review.productId._id})
        console.log(review.rating)
        if(product){
            const totalRating = product.totalRating - review.rating
            const ratingCount = product.ratingCount-1
            const ratio = ratingCount===0?0:Math.floor(totalRating/ratingCount*10)/10
            await product.updateOne({$set:{totalRating,ratingCount,rating:ratio}})
            await review.delete()
            res.status(200).json({message:'Deleted successfully!'})
        }

    } catch (error) {
        console.log(error,error.message)
        res.status(500).json({error})
    }
})

// GET product
router.get('/product/:productId',async (req,res)=>{
    try {
        const product = await Item.findOne({_id:req.params.productId})
        const reviews = await Review.find({productId:req.params.productId}).sort({createdAt:-1})
        // .populate('user','username')
        if(product && reviews){
            res.status(200).json({product,reviews})
        }else{
            res.status(404)
            throw new Error('Product not found!')
        }
    } catch (error) {
        res.json({message:error.message})
    }
})




const filters = [{
    filterName:'Company',
    values:['samsung']
},
{
    filterName:'RAM',
    values:['16GB']
}]

// async function testParams(){
//     try{
//         // const items = await Item.find({$and: [{"filters.filterName":'Company',"filters.values":'samsung'},{"filters.filterName":{$in:['RAM']}}]})
//         const items = await Item.find().findByFilters(req.body)
//         console.log(items)
//     }
//     catch(e){
//         console.log(e)
//     }
// }
// testParams()

module.exports = router