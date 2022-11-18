const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../../models/user");

const { SECRET_KEY } = process.env;

const { RequestError } = require("../../helpers");

const signup = async (req, res) => {
  const { email, password, name } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw RequestError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const result = await User.create({
    email,
    password: hashPassword,
    name,
  });

  const payload = {
    id: result._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
  await User.findByIdAndUpdate(result._id, { token });

  res.status(201).json({
    token,
    user: {
      email: result.email,
      name: result.name,
    },
  });
};

module.exports = signup;
