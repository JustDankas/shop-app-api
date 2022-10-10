const express = require("express");
const router = express.Router();

const Users = require("../models/Users");

const { generateToken, authenticateToken } = require("../utils/generateToken");
// require('dotenv')
// router.post('/login',async (req,res)=>{
//     try {
//         const user = await Users.findOne({username:req.body.username})
//         if(user){
//             console.log(user.password)
//             console.log(req.body.password)
//             const result = await bcrypt.compare(req.body.password,user.password).catch(v=>console.log(v))
//             console.log(result)
//             if(result){
//                 res.status(200).json({
//                     user:{
//                         username:user.username,
//                         email:user.email,
//                         isAdmin:user.isAdmin
//                     },
//                     message:'Login Successful!'
//                 })
//             }
//             else{
//                 res.status(400).json({message:'Incorrect password!'})
//             }
//         }
//         else{
//             res.status(404).json({message:'User not found!'})
//         }
//     } catch (error) {
//         res.status(500).json({message:'Internal Server Error!',error})
//     }

// })

router.post("/auto/login", authenticateToken, async (req, res) => {
  try {
    const { id } = req.userId;
    if (id) {
      const user = await Users.findOne({ _id: id }).populate([
        "recentItems",
        "favourites",
      ]);
      res.status(200).json({
        Success: true,
        message: "Login Successfull!",
        data: {
          user: {
            username: user.username,
            isAdmin: user.isAdmin,
            email: user.email,
            favourites: user.favourites,
            recentItems: user.recentItems,
          },
        },
      });
    } else {
      res.status(404);
      throw new Error("User not found!");
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await Users.findOne({ username: req.body.username });
    if (user && (await user.matchPassword(req.body.password))) {
      res.status(200).json({
        Success: true,
        message: "Login Successfull!",
        data: {
          token: generateToken(user._id),
          user: {
            username: user.username,
            isAdmin: user.isAdmin,
            email: user.email,
          },
        },
      });
    } else {
      res.status(404).json({ Success: false, message: "User does not exist!" });
    }
  } catch (error) {
    res.json({ Success: false, message: error.message });
  }
});

router.post("/register", validatePassword, async (req, res) => {
  try {
    console.log(req.message);
    const usernameExists = await Users.findOne({ username: req.body.username });
    const emailExists = await Users.findOne({ email: req.body.email });
    if (usernameExists) {
      // res.status(400).json({Success:false,message:'Username/Email already in use'})
      res.status(400);
      throw new Error("Username already in use");
    } else if (emailExists) {
      // res.status(400).json({Success:false,message:'Username/Email already in use'})
      res.status(400);
      throw new Error("Email already in use");
    } else if (req.message !== undefined) {
      res.status(400);
      throw new Error(req.message);
    } else {
      const user = await Users.create(req.body);
      await user.save();
      // res.status(200).json({Success:true,message:'User Registered!',user:{
      //     username:user.username,
      //     email:user.email,
      //     isAdmin:user.isAdmin,
      //     token:generateToken(user._id)
      // }})
      res.status(200).json({
        Success: true,
        message: "User Registered!",
        data: {
          token: generateToken(user._id),
          user,
        },
      });
    }
  } catch (error) {
    console.log("dasdas", error.message);
    res.json({ Success: false, message: error.message });
  }
});

router.put("/:username", async (req, res) => {
  try {
    const { newUsername } = req.body;
    const user = await Users.findOne({ username: newUsername });
    if (!user) {
      await Users.findOneAndUpdate(
        { username: req.params.username },
        { username: newUsername }
      );
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await Users.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
  }
});
router.delete("/", async (req, res) => {
  try {
    await Users.deleteMany();
    res.status(200).json({ message: "Success!" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
  }
});

function validatePassword(req, res, next) {
  const { password } = req.body;
  const passwordRegex = new RegExp(/^[a-zA-Z]+[a-zA-Z]*[0-9]+/);
  const dashRegex = new RegExp(/\-/);
  if (!passwordRegex.test(password) || dashRegex.test(password)) {
    req.message =
      "Password must start with a letter and contain atleast 1 number!";
  } else if (password.length < 8) {
    req.message = "Password must be atleast 8 characters long!";
  }
  next();
}

module.exports = router;
