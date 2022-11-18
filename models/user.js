const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleSaveErrors, RequestError } = require("../helpers");

const emailRegExp = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: emailRegExp,
      unique: true,
    },
    balance: {
      type: Number,
      required: [true, "User balance is required"],
      default: 0,
    },
    token: {
      type: String,
      default: null,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

userSchema.post("save", handleSaveErrors);

const User = model("user", userSchema);

const signupSchema = Joi.object({
  email: Joi.string().pattern(emailRegExp).required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().alphanum().min(3).max(30).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegExp).required(),
  password: Joi.string().min(6).required(),
});

const schemas = {
  signupSchema,
  loginSchema,
};

module.exports = {
  User,
  schemas,
};
