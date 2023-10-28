import User from "../../models/User.js";
import jwt from "jsonwebtoken";



/* LOGGING IN */

export const AdminLogin = async (req, res) => {
  console.log("sdfsdf");
  try {
    console.log(req.body);
    const { email, password } = req.body;
    if (email == "admin@gmail.com" && password == "123") {
      const token = jwt.sign({ id: 88888}, process.env.JWT_SECRET,{expiresIn:300});
      
      res.status(200).json({login:true, token  });
    }else{
      return res.status(400).json({ login: false, msg: "Invalid credentials. " });
    }  


  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* USER LIST */

export const getallUser = async (req, res) => {
  try {
  
    const user = await User.find();
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


/* DELETE USER */

export const DeleteUser = async (req , res) => {
  try {
    console.log("pppppppppp");
    const userId = req.body.userid;
    console.log(userId);
    const deleteuser =await User.findByIdAndDelete(userId)
    const user =await User.find()
    console.log("88888888888888", user);
    res.status(201).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

/* BlockUnblock */

export const BlockUnblock = async (req , res) => {
  console.log("3333333333");
  try {
    const userId = req.body.userid;
    console.log(userId);
    const users =await User.findById(userId)
    if(users.block == true) {
      users.block = false;
    }else {
      users.block = true;
    }
    users.save()
    const user =await User.find()
   
    res.status(201).json(user);
    
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

/* SEARCH USER */
export const SearchUser = async (req, res) => {
  console.log("bbbbbbbbbbb");
  console.log(req.body);
  try {
    const searchTerm = req.body.searchterm; // Assuming the search term is sent from the frontend

    // Perform the search operation on the User model using a regular expression
    const regex = new RegExp(searchTerm, "i");
    let users =await User.find({
      $or: [
        { firstName: { $regex: searchTerm } }, // Case-insensitive search on the 'name' field
        // { email: { $regex: searchTerm } }, // Case-insensitive search on the 'email' field
      ],
    })
     console.log(users,"users");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
