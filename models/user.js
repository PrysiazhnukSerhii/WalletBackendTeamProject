const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleSaveErrors, RequestError } = require("../helpers");

const emailRegExp = /^[^\W][a-zA-Z0-9._-]{1,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const nameRegExp = /^[а-яА-ЯёЁa-zA-Z0-9]+$/;
const passwordRegExp = /^[\w~'`!@#№?$%^&*()=+<>|/\\.,:;\[\]{} \x22-]+$/;

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    name: {
      type: String,
      match: nameRegExp,
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
  email: Joi.string().pattern(emailRegExp).min(10).max(63).required(),
  password: Joi.string().pattern(passwordRegExp).min(6).max(12).required(),
  name: Joi.string().pattern(nameRegExp).min(1).max(12).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegExp).min(10).max(63).required(),
  password: Joi.string().pattern(passwordRegExp).min(6).max(12).required(),
});

const schemas = {
  signupSchema,
  loginSchema,
};

module.exports = {
  User,
  schemas,
};
