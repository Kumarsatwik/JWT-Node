const createError = require("http-errors");
const User = require("../Models/User.model");
const { authSchema } = require("../helpers/validation_schema");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../helpers/jwt_helper");

const client = require("../helpers/init_redis");

module.exports = {
  register: async (req, res, next) => {
    try {
      const result = await authSchema.validateAsync(req.body);
      const doesExist = await User.findOne({ email: result.email });
      if (doesExist) throw createError.Conflict(`${email} already exists`);

      const user = new User(result);
      const savedUser = await user.save();
      const accessToken = await signAccessToken(savedUser.id);
      const refreshToken = await signRefreshToken(savedUser.id);

      res.send({ accessToken, refreshToken });
    } catch (err) {
      if (err.isJoi === true) err.status = 422;
      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      const result = await authSchema.validateAsync(req.body);
      const user = await User.findOne({ email: result.email });
      if (!user) throw createError.NotFound("User not registered ");

      const isMatch = await user.isValidPassword(result.password);
      if (!isMatch)
        throw createError.Unauthorized("Username or password not valid");

      const accessToken = await signAccessToken(user.id);
      const refreshToken = await signRefreshToken(user.id);

      res.send({ accessToken, refreshToken });
    } catch (err) {
      if (err.isJoi)
        return next(createError.BadRequest("Invalid Username/Password"));
      next(err);
    }
  },

  logout: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) throw createError.BadRequest();
      const userId = await verifyRefreshToken(refreshToken);
      client.DEL(userId, (err, val) => {
        if (err) {
          console.log(err.message);
          throw createError.InternalServerError();
        }
        console.log(val);
        res.sendStatus(204);
      });
    } catch (err) {
      next(err);
    }
  },
 
  refreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) throw createError.BadRequest();
      const userId = await verifyRefreshToken(refreshToken);
      const accessToken = await signAccessToken(userId);
      const refreshtoken = await signRefreshToken(userId);
      res.send({ accessToken, refreshtoken });
    } catch (err) {
      next(err);
    }
  },
};
