const fs = require("fs").promises;
const path = require("path");

const categoriesPath = path.join(__dirname, "categories.json");

const getCategoriesList = async () => {
  const categoriesList = await fs.readFile(categoriesPath, "utf8");
  return JSON.parse(categoriesList);
};

module.exports = getCategoriesList;
