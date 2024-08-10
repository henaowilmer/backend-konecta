const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/user.js');

dotenv.config();

const loginRouteHandler = async (req, res, email, password) => {
  try {
    let foundUser = await User.findOne({ where: { email: email } });
    if (!foundUser) {
      return res.status(400).json({
        errors: [{ detail: "Credentials don't match any existing users" }],
      });
    }

    const validPassword = await bcrypt.compare(password, foundUser.password);
    if (validPassword) {
      const token = jwt.sign(
        { id: foundUser.id, email: foundUser.email, role: foundUser.role },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );
      return res.json({
        token_type: "Bearer",
        expires_in: "24h",
        access_token: token,
        refresh_token: token,
        role: foundUser.role,
        name: foundUser.name
      });
    } else {
      return res.status(400).json({
        errors: [{ detail: "Invalid password" }],
      });
    }
  } catch (error) {
    return res.status(500).json({ errors: [{ detail: "Internal Server Error" }] });
  }
};

const registerRouteHandler = async (req, res, name, email, password) => {
  try {
    let foundUser = await User.findOne({ where: { email: email } });
    if (foundUser) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    if (!password || password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name: name,
      email: email,
      password: hashPassword,
    });

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    return res.status(200).json({
      token_type: "Bearer",
      expires_in: "24h",
      access_token: token,
      refresh_token: token,
    });
  } catch (error) {
    return res.status(500).json({ errors: [{ detail: "Internal Server Error" }] });
  }
};

const resetPasswordRouteHandler = async (req, res) => {
  const { email, password, password_confirmation } = req.body.data.attributes;

  try {
    const foundUser = await User.findOne({ where: { email: email } });

    if (!foundUser) {
      return res.status(400).json({
        errors: { email: ["The email or token does not match any existing user."] }
      });
    } else {
      if (password.length < 8) {
        return res.status(400).json({
          errors: { password: ["The password should have at least 8 characters."] }
        });
      }

      if (password !== password_confirmation) {
        return res.status(400).json({
          errors: { password: ["The password and password confirmation must match."] }
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      await User.update(
        { password: hashPassword },
        { where: { email: foundUser.email } }
      );

      return res.sendStatus(204);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "An unexpected error occurred." });
  }
};

const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      console.log(req.user)
      return res.status(403).json({ message: 'Access forbidden: insufficient privileges' });
    }
    next();
  };
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

module.exports = {
  loginRouteHandler,
  registerRouteHandler,
  resetPasswordRouteHandler,
  authorizeRole,
  authenticateToken
};
