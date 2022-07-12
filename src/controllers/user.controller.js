const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const { generateJWT } = require("../helpers/generateJWT");

const register = async (req, res) => {
  try {
    const { password } = req.body;

    if (password.length < 6 || password.length > 10) {
      throw new Error(
        "The password must have a minimum of 6 characters and a maximum of 10 characters"
      );
    }
    const encryptPassword = await bcrypt.hash(password, 8);

    const user = await User.create({ ...req.body, password: encryptPassword });

    const token = await generateJWT(user._id);

    res.status(200).json({
      ok: true,
      message: "User created",
      token,
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      ok: false,
      message: "User could not be create",
      data: err,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ ok: false, message: "the email or password is not correct" });
    }

    const validatePassword = await bcrypt.compare(password, user.password);
    if (!validatePassword) {
      return res
        .status(400)
        .json({ ok: false, message: "the email or password is not correct" });
    }

    const token = await generateJWT(user._id);

    res.status(200).json({
      ok: true,
      message: "Login successful",
      user,
      token,
    });
  } catch (err) {
    res.status(401).json({
      ok: false,
      message:
        "There was a problem trying to login, please contact the administrator",
    });
  }
};

module.exports = {
  register,
  login,
};
