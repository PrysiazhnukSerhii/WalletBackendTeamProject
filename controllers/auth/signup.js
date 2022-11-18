const bcrypt = require("bcrypt");

const { User } = require("../../models/user");

const { RequestError } = require("../../helpers");

const signup = async (req, res) => {
  const { email, password, name } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw RequestError(409, "Email in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const result = await User.create({ email, password: hashPassword, name });

  res.status(201).json({
    user: {
      email: result.email,
      name: result.name,
    },
  });
};

module.exports = signup;
