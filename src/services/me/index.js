const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const User = require('../../models/user.js');

dotenv.config();

const getProfileRouteHandler = (req, res) => {
  const meUser = req.user;

  const stringId = req.user.id;
  const decId = stringId.substring(4, 8);
  const intId = parseInt(decId, 16);

  const sentData = {
    data: {
      type: 'users',
      id: intId === 1 ? intId : meUser.id,
      attributes: {
        name: meUser.name,
        email: meUser.email,
        profile_image: null,
        createdAt: meUser.created_at,
        updateAt: meUser.updated_at
      },
      links: {
        self: `${process.env.APP_URL_API}/users/${meUser.id}`
      }
    }
  };
  res.send(sentData);
};

const patchProfileRouteHandler = async (req, res) => {
  const currentDataOfUser = req.user;
  const { name, email, newPassword, confirmPassword } = req.body.data.attributes;

  const foundUser = await User.findOne({ where: { email: currentDataOfUser.email } });

  if (!foundUser) {
    res.status(400).json({ error: 'No user matches the credentials' });
  } else {
    if (newPassword && (newPassword.length < 8 || newPassword !== confirmPassword)) {
      res.status(400).json({ errors: { password: ["The password should have at least 8 characters and match the password confirmation."] } });
    } else if (newPassword && newPassword.length >= 8 && newPassword === confirmPassword) {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(newPassword, salt);
      try {
        await foundUser.update({ name, email, password: hashPassword });
      } catch (err) {
        console.error(err);
      }
      const sentData = {
        data: {
          type: 'users',
          id: foundUser.id,
          attributes: {
            name: name,
            email: email,
            profile_image: null,
          }
        }
      };
      res.send(sentData);
    } else if (!newPassword) {
      try {
        await foundUser.update({ name, email });
      } catch (err) {
        console.error(err);
      }
      const sentData = {
        data: {
          type: 'users',
          id: foundUser.id,
          attributes: {
            name: name,
            email: email,
            profile_image: null,
          }
        }
      };
      res.send(sentData);
    }
  }
};

module.exports = {
  getProfileRouteHandler,
  patchProfileRouteHandler
};
