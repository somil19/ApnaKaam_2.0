import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";
import User from "../models/userModel.js";
import sendEmail from "../emailService.js";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const registerUser = async (req, res) => {
  req.on("data", (chunk) => {
    console.log(chunk.toString());
  });
  req.on("end", () => {
    res.status(200).send("File received");
  });
  try {
    const { name, email, password } = req.body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.json({ success: false, message: "Invalid email address." });
    }

    //if email exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.json({ success: false, message: "Email already exists." });
    }

    let imgUrl =
      "https://res.cloudinary.com/dpmkfqeb9/image/upload/v1736221878/bbjw0wjjc9wmulsdhsjk.png";

    // Upload image to Cloudinary if a file is provided

    if (req.file) {
      const fileBuffer = req.file.buffer;
      const cloudinaryResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: "image" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(fileBuffer);
      });

      imgUrl = cloudinaryResponse.secure_url;
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImage: imgUrl,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error registering user." });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(email, password);
    const user = await User.findOne({ email });
    // console.log(user);
    if (!user) {
      return res.json({ success: false, message: "User doesn't exist." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    // console.log(`Password match status: ${isMatch}`, user.password, password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.status(200).json({
        success: true,
        token,
        user: { name: user.name, profileImage: user.profileImage },
      });
    } else {
      return res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export const userDetails = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    return res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    const userId = req.body?.userId;
    const user = await User.findById(userId);
    console.log(user);
    if (req.file) {
      const fileBuffer = req.file.buffer;
      const cloudinaryResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: "image" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(fileBuffer);
      });
      user.profileImage = cloudinaryResponse.secure_url;
    }
    await user.save();
    return res
      .status(200)
      .json({ success: true, profileImage: user.profileImage });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatUserName = async (req, res) => {
  try {
    const { userName } = req.body;
    console.log(userName);
    const userId = req.body?.userId;
    const user = await User.findById(userId);
    user.name = userName;
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Your name has been updated " });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const scheduleEmail = async (req, res) => {
  const { email, title, category, name, sendTime } = req.body;
  console.log(email, title, category, name, sendTime);
  try {
    const subject = `Reminder: ${title.toUpperCase()}`; // Email subject
    const body = `Namaste ${name},\n\nThis is a friendly reminder for your task:\n- Title: ${title.toUpperCase()}\n- Category: ${category}\n\nDon't forget to complete your task on time!\nStay productive and Have a great day😊.\n\nBest regards,\nYour ApnaKaam Team!`;

    sendEmail(email, subject, body, sendTime);
    res.status(200).send("Email scheduled successfully!");
  } catch (error) {
    res.status(500).send("Error scheduling email: " + error.message);
  }
};
export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({
      success: false,
      message: "Email is required",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

    await user.save();

    const subject = "Password Reset OTP";
    const body = `Your OTP for resetting your password is ${otp}. Use this OTP to proceed with resetting your password.`;
    const sendTime = new Date(Date.now() + 500);
    sendEmail(email, subject, body, sendTime);

    return res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.json({
      success: false,
      message: "Email, OTP, and New Password are required",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User Not Found" });
    }

    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    await user.save();

    return res.json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const welcomeEmail = async (req, res) => {
  const { userName, email } = req.body;
  try {
    const subject = "Welcome to ApnaKaam";
    const body = `Namaste ${userName},\n\nWelcome to Apna Kaam! 🎉\n\nWe are so excited to have you join our community. Apna Kaam is here to make task management simple and effective, helping you organize your daily activities with ease.\n\nHere’s how you can get started:\n1.Access your tasks and explore the intuitive dashboard.\n2.Create your first task – Add tasks, set priorities, and organize them with custom labels.\n3. Set reminders – Never miss a deadline with personalized emails.\n\nWe’re here to ensure your experience is seamless and productive.\n\nOnce again, welcome aboard!\n\nWarm regards,\nYour ApnaKaam Team\n\n`;

    const sendTime = new Date(Date.now() + 500);
    sendEmail(email, subject, body, sendTime);
    res.status(200).send("Email scheduled successfully!");
  } catch (error) {
    console.error("Error scheduling email:", error);
    res.status(500).send("Error scheduling email: " + error.message);
  }
};
