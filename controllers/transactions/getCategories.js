const fs = require("fs").promises;
const path = require("path");

const { RequestError } = require("../../helpers");

const categoriesPath = path.resolve(__dirname, "../../helpers/categories.json");

const getCategories = async (req, res, next) => {
  const categoriesLIst = await fs.readFile(categoriesPath, "utf8");
  if (!categoriesLIst) {
    throw RequestError(400);
  }
  const list = JSON.parse(categoriesLIst);

  res.status(200).json(list);
};

module.exports = getCategories;
