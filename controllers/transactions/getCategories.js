const { RequestError, getCategoriesList } = require("../../helpers");

const getCategories = async (req, res, next) => {
  const categoriesList = await getCategoriesList();
  if (!categoriesList) {
    throw RequestError(400);
  }
  res.status(200).json(categoriesList);
};

module.exports = getCategories;
