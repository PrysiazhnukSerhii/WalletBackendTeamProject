const { Schema, model } = require("mongoose");
const Joi = require("joi");
const {
  handleSaveErrors,
  RequestError,
  getCategoriesList,
} = require("../helpers");

const fs = require("fs");
const path = require("path");

const categoriesPath = path.resolve(__dirname, "../helpers/categories.json");

const categoriesList = fs.readFileSync(categoriesPath, "utf-8");
const categoriesTitle = JSON.parse(categoriesList).map(
  (category) => category.title
);

const transactionSchema = new Schema(
  {
    type: {
      type: Boolean,
      required: [true, "Type is required"],
    },
    sum: {
      type: Number,
      required: [true, "Sum is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    month: {
      type: Number,
      required: [true, "Month is required"],
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
    },
    category: {
      type: String,
      enum: categoriesTitle,
      default: "Other",
    },
    comment: {
      type: String,
      default: null,
    },
    balance: {
      type: Number,
      required: [true, "Transaction balance is required"],
      default: 0,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

transactionSchema.post("save", handleSaveErrors);

const Transaction = model("transaction", transactionSchema);

const addSchema = Joi.object({
  type: Joi.boolean().required(),
  sum: Joi.number().positive().required(),
  date: Joi.date().required(),
  month: Joi.number().required(),
  year: Joi.number().required(),
  comment: Joi.string(),
  // category: Joi.string(),
  category: Joi.string().valid(...categoriesTitle),
});

const getStatisticsSchema = Joi.object({
  month: Joi.number().required(),
  year: Joi.number().required(),
});
const schemas = {
  addSchema,
  getStatisticsSchema,
};

module.exports = {
  Transaction,
  schemas,
};
