import AppError from "../utils/appError.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "cloudinary";
import fs from "fs/promises";
// import sendEmail from "../utils/sendEmail.js";
// import crypto from "crypto";

// const cookieOptions = {
//   secure: process.env.NODE_ENV === "production" ? true : false,
//   maxAge: 7 * 24 * 60 * 60 * 1000,
//   httpOnly: true,
// };

const register = async (req, res, next) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return next(new AppError("All fields are required", 400));
    }

    const userExist = await User.findOne({ email });

    if (userExist) return next(new AppError("Email already exists", 409));

    const user = await User.create({
      fullName,
      email,
      password,
      avatar: {
        public_id: email,
        secure_url:
          "https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg",
      },
    });

    if (!user)
      return next(
        new AppError("User registration failed, please try again later", 400)
      );

    if (req.file) {
      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "lms",
          width: 250,
          height: 250,
          gravity: "faces",
          crop: "fill",
        });
        if (result) {
          user.avatar.public_id = result.public_id;
          user.avatar.secure_url = result.secure_url;

          fs.rm(`uploads/${req.file.filename}`);
        }
      } catch (error) {
        return next(
          new AppError(
            error.message || "File not uploaded, please try again",
            400
          )
        );
      }
    }

    await user.save();
    user.password = undefined;
    const token = await user.generateJWTToken();
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
      token,
    });
  } catch (error) {
    return next(new AppError(error.message || "Somthin went wrong!", 500));
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password)
      return next(new AppError("Email and Password are required", 400));

    const user = await User.findOne({ email }).select("+password");
    if (!user) return next(new AppError("User not found", 400));
    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword)
      return next(new AppError("Email or password wrong", 400));
    const token = await user.generateJWTToken();
    // res.cookie("token", token, cookieOptions);
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user,
      token,
    });
  } catch (error) {
    return next(new AppError(error.message || "Somthin went wrong!", 500));
  }
};

const logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    return next(new AppError(error.message || "Somthin went wrong!", 500));
  }
};

const profile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (user) {
      return res.status(200).json({
        success: true,
        message: "User profile fetched successfully",
        user,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "User profile not found",
      });
    }
  } catch (error) {
    return next(new AppError(error.message || "Somthin went wrong!", 500));
  }
};

// const forgotPassword = async (req, res, next) => {
//   const { email } = req.body;
//   try {
//     if (!email) return next(new AppError("email is required", 400));
//     const user = await User.findOne({ email });

//     if (!user) return next(new AppError("email not register", 400));

//     const resetToken = await user.generatePasswordResetToken();
//     const resetPasswordUrl = `/reset-password/${resetToken}`;

//     // We here need to send an email to the user with the token

//     const message = resetPasswordUrl;

//     try {
//       await sendEmail(email, message);
//       res.status(200).json({
//         success: true,
//         message: `Password reset link sent to your email ${email}`,
//       });
//     } catch (error) {
//       user.forgotPasswordExpiry = undefined;
//       user.forgotPasswordToken = undefined;
//       user.save();
//       return next(new AppError(error.message || "Somthin went wrong!", 500));
//     }
//   } catch (error) {
//     return next(new AppError(error.message || "Somthin went wrong!", 500));
//   }
// };
// const resetPassword = async (req, res, next) => {
//   const { resetToken } = req.params;
//   const { password } = req.body;
//   try {
//     const forgotPasswordToken = crypto
//       .createHash("sha256")
//       .update(resetToken)
//       .digest("hex");
//     if (!password) return next(new AppError("Password is required", 400));
//     console.log(forgotPasswordToken);
//     const user = await User.findOne({
//       forgotPasswordToken,
//       forgotPasswordExpiry: { $gt: Date.now() },
//     });
//     if (!user)
//       return next(
//         new AppError("Token is invalid or expired, please try again", 400)
//       );
//     // Update the password if token is valid and not expired
//     user.password = password;

//     user.forgotPasswordExpiry = undefined;
//     user.forgotPasswordToken = undefined;

//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: "Password changed successfully",
//     });
//   } catch (error) {
//     return next(new AppError(error.message || "Somthin went wrong!", 500));
//   }
// };
// const changePassword = async (req, res, next) => {
//   const { oldPassword, newPassword } = req.body;
//   const { id } = req.user;
//   try {
//     if (!oldPassword || !newPassword)
//       return next(new AppError("all fields must be required!", 400));
//     const user = await User.findById(id).select("+password");

//     if (!user) return next(new AppError("User not found", 400));
//     console.log(user);
//     const comparePassword = await bcrypt.compare(oldPassword, user.password);

//     if (!comparePassword)
//       return next(new AppError("Old password is wrong", 400));

//     user.password = newPassword;
//     await user.save();
//     user.password = undefined;
//     res.status(200).json({
//       success: true,
//       message: "Password changed successfully",
//       user,
//     });
//   } catch (error) {
//     return next(new AppError("something went wrong", 500));
//   }
// };

const updateProfile = async (req, res, next) => {
  const { fullName } = req.body;
  const { id } = req.user;
  try {
    const user = await User.findById(id);

    if (!user) return next(new AppError("user dose not exist", 400));

    if (fullName) {
      user.fullName = fullName;
    }

    if (req.file) {
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);
      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "lms",
          width: 250,
          height: 250,
          gravity: "faces",
          crop: "fill",
        });
        if (result) {
          user.avatar.public_id = result.public_id;
          user.avatar.secure_url = result.secure_url;

          fs.rm(`uploads/${req.file.filename}`);
        }
      } catch (error) {
        return next(
          new AppError(error || "File not uploaded, please try again", 400)
        );
      }

      await user.save();

      res.status(200).json({
        success: true,
        message: "Profile Updated",
        user,
      });
    }
  } catch (error) {
    return next(new AppError("something went wrong", 500));
  }
};

const allUser = async (req, res, next) => {
  try {
    const allUser = await User.find({});
    if (!allUser) return next(new AppError("users not found", 404));
    res.status(200).json({
      users: allUser,
    });
  } catch (error) {
    return next(new AppError("something went wrong", 500));
  }
};

export {
  register,
  login,
  logout,
  profile,
  // resetPassword,
  // forgotPassword,
  // changePassword,
  updateProfile,
  allUser,
};
