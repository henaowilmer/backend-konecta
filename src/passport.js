const { ExtractJwt } = require("passport-jwt");
const passportJWT = require("passport-jwt");
const dotenv = require("dotenv");
const passport = require("passport");

const User = require("./models/user.js");
const JWTStrategy = passportJWT.Strategy;
dotenv.config();

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async function (jwtPayload, done) {
      try {
        const user = await User.findOne({ where: { id: jwtPayload.id } });
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);
