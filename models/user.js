import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const schema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Please Enter Name"],
  },
  email: {
    type: String,
    require: [true, "Please Enter Email"],
    unique: [true, "Email Already Exist"],
    validate: validator.isEmail,
  },
  password: {
    type: String,
    require: [true, "Please Enter Password"],
    minLength: [6, "Password must be at least 6 Character long"],
    select: false,
  },
  address: {
    type: String,
    require: [true, "Please Enter Address"],
  },
  city: {
    type: String,
    require: [true, "Please Enter City"],
  },
  country: {
    type: String,
    require: [true, "Please Enter Country"],
  },
  pinCode: {
    type: Number,
    require: [true, "Please Enter Pin Code"],
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  avatar: {
    public_id: String,
    url: String,
  },
  otp: Number,
  otp_expire: Date,
});

schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

schema.methods.comparePassword = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password);
};

schema.methods.generateToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};
export const User = mongoose.model("User", schema);
