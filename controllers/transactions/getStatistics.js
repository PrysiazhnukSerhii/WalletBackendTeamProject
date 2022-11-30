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
        total: { $sum: "$sum" },
      },
    },
    {
      $project: {
        _id: 0,
        title: "$_id.category",
        total: { $round: ["$total", 2] },
      },
    },
  ]);

  const mergedCategoriesByTitle = _.merge(
    _.keyBy(categoriesSum, "title"),
    _.keyBy(categories, "title")
  );
  const sortedCategoriesSum = _.sortBy(mergedCategoriesByTitle, ["id"]);

  if (!expensesSum[0]) {
    return [{ totalExpenses: 0, totalIncome: 0, totalCategories: [] }];
  }

  const result = [
    {
      totalExpenses: expensesSum[0]
        ? Number(expensesSum[0].total.toFixed(2))
        : 0,
      totalIncome: incomesSum[0] ? Number(incomesSum[0].total.toFixed(2)) : 0,
      totalCategories: expensesSum[0] ? sortedCategoriesSum : [],
    },
  ];

  res.status(200).json(result);
};

module.exports = getStatistics;
