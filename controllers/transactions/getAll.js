const { Transaction } = require("../../models/transaction");

const getAll = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 5 } = req.query;
  const skip = (page - 1) * limit;
  const length = (await Transaction.find({ owner })).length;
  const transactions = await Transaction.find(
    { owner },
    "-createdAt -updatedAt",
    {
      skip,
      limit,
    }
  )
    .sort({ createdAt: -1 })
    .populate("owner", "email name");
  res.status(200).json({
    length,
    transactions,
  });
};

module.exports = getAll;
