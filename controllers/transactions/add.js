const { Transaction } = require("../../models/transaction");
const { User } = require("../../models/user");

const { RequestError } = require("../../helpers");

const add = async (req, res) => {
  const { _id: owner } = req.user;
  const { type, sum } = req.body;

  const lastTransaction = await Transaction.findOne({ owner }, "balance").sort({ createdAt: -1 });
  const currentBalance = lastTransaction?.balance || 0;
  const balance = type ? currentBalance + sum : currentBalance - sum;

  if (balance < 0) {
    throw RequestError(400, "You spend too much!");
  }

  await User.findByIdAndUpdate(owner, { balance });
  const result = await Transaction.create({ ...req.body, balance, owner });

  res.status(201).json(result);
};

module.exports = add;
