const _ = require("lodash");
const { getCategoriesList } = require("../../helpers");
const { Transaction } = require("../../models/transaction");

const getStatistics = async (req, res) => {
  const { _id: owner } = req.user;
  const { month, year } = req.body;
  const categories = await getCategoriesList();

  const expensesSum = await Transaction.aggregate([
    {
      $match: {
        owner: owner,
        type: false,
        month: month,
        year: year,
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$sum" },
      },
    },
  ]);
  const incomesSum = await Transaction.aggregate([
    {
      $match: {
        owner: owner,
        type: true,
        month: month,
        year: year,
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$sum" },
      },
    },
  ]);
  const categoriesSum = await Transaction.aggregate([
    {
      $match: {
        owner: owner,
        type: false,
        month: month,
        year: year,
      },
    },
    {
      $group: {
        _id: { category: "$category" },
        total: {
          $sum: "$sum",
        },
      },
    },
    {
      $project: { _id: 0, title: "$_id.category", total: "$total" },
    },
  ]);

  const mergedCategoriesByTitle = _.merge(
    _.keyBy(categoriesSum, "title"),
    _.keyBy(categories, "title")
  );
  const sortedCategoriesSum = _.sortBy(mergedCategoriesByTitle, ["id"]);

  const result = [
    {
      totalExpenses: expensesSum[0].total.toFixed(2),
      totalIncome: incomesSum[0].total.toFixed(2),
      totalCategories: sortedCategoriesSum,
    },
  ];

  res.status(200).json(result);
};

module.exports = getStatistics;
