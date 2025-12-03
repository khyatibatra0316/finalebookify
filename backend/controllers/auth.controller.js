import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from "../models/userModel.js";
// import transporter from '../config/nodemailer.js';

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    const mailOptions={
        from:process.env.SENDER_EMAIL,
        to:email,
        subject:"Welcome to eBookify",
        text:`Welcome to eBookify, your account has been created with email id ${email}`
    }
    // await transporter.sendMail(mailOptions)
    return res.json({ success: true });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: "Email and password are required" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({ success: true });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
    });

    return res.json({ success: true, message: "Logged Out" });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const isAuthenticated=async(req,res)=>{
    try{
        return res.json({success:true})
    }catch(error){
        res.json({scucess:false, message:error.message})
    }
}

export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { email,newPassword } = req.body;
  
    try {
    //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userModel.findById({email});
  
      if (!user) {
        return res.json({ success: false, message: "User not found" });
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
  
      return res.json({ success: true, message: "Password reset successful!" });
    } catch (error) {
      return res.json({ success: false, message: "Invalid or expired token" });
    }
  };

  
export const generateResetToken = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "10m" });
    return res.json({
      success: true,
      message: "Token generated for testing (valid for 10 minutes)",
      token
    });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


// export const googleLogin = async (req, res) => {
//   try {
//     const { name, email, picture } = req.body;

//     if (!email) {
//       return res.json({ success: false, message: "No email found" });
//     }

//     // Check if user exists
//     let user = await userModel.findOne({ email });

//     if (!user) {
//       // Auto-create new Google user
//       user = new userModel({
//         name,
//         email,
//         password: "",  // No password for Google login
//         isAccountVerified: true,
//         profilePic: picture
//       });

//       await user.save();
//     }

//     // Create token
//     const token = jwt.sign(
//       { id: user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     // Set cookie
//     res.cookie("token", token, {
//       httpOnly: true,
//       sameSite: "lax",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     return res.json({ success: true });

//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };
  