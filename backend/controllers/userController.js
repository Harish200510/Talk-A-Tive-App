const expressAsyncHandler = require("express-async-handler");
const User = require("./../Models/userModel");
const generateToken = require("./../config/generateToken");

const registerUser = expressAsyncHandler(async (req, res) => {
  //Getting the data from the request body
  const { name, email, password, pic } = req.body;

  //Checking the necessary fields are there or not
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Fields");
  }

  //Checking the user is already exist or not
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  //If not we will create a new User
  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      status: "Sucess",
      message: {
        user,
        token: generateToken(user._id),
      },
    });
  } else {
    res.status(400);
    throw new Error("Failed to create the User");
  }
});

const authUser = expressAsyncHandler(async (req, res) => {
     const {email,password}=req.body;

     const user=await User.findOne({email})

     if(user && (await user.matchPassword(password)) ){
        res.status(201).json({
            status:"Success",
            message:{
                _id:user._id,
                name:user.name,
                email:user.email,
                pic:user.pic,
                token:generateToken(user._id)
            }
        })
     }


});


// /api/user?search=harish
const allUsers=expressAsyncHandler(async(req,res)=>{
     const keyword = req.query.search ? {

      $or:[
        {name:{$regex:req.query.search,$options:"i"}},
        {email:{$regex:req.query.search,$options:"i"}}
      ]

     }:{}

     //search for the use but don't show the current user
     const users=await User.find(keyword).find({_id:{$ne:req.user._id}})
     res.send(users)

    

})
module.exports = { registerUser,authUser,allUsers};
