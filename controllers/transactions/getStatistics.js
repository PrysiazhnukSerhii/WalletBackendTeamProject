const { Transaction } = require("../../models/transaction");

const getStatistics = async (req, res) => {
  const { _id: owner } = req.user;
  const { month, year } = req.body;
  //   const categories = [
  //     { id: "1", title: "Main" },
  //     { id: "2", title: "Food" },
  //     { id: "3", title: "Auto" },
  //     { id: "4", title: "Development" },
  //     { id: "5", title: "Children" },
  //     { id: "6", title: "House" },
  //     { id: "7", title: "Education" },
  //     { id: "8", title: "Reset" },
  //     { id: "9", title: "Other" },
  //   ];

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

  const result = [
    {
      totalExpenses: expensesSum[0].total,
      totalIncome: incomesSum[0].total,
      totalCategories: categoriesSum,
    },
  ];

  res.status(200).json(result);
};

module.exports = getStatistics;
