const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

const client = new OAuth2Client(process.env.OAUTH_CLIEN_ID);

exports.findOrCreateUser = async token => {
  const googleUser = await verifyAuthToken(token);
  const user = await checkIfUserExists(googleUser.email);
  return user ? user : createNewUser(googleUser);
};

// 使用 google-auth-library plugins 驗證 token
const verifyAuthToken = async token => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.OAUTH_CLIEN_ID
    });

    return ticket.getPayload();
  } catch (err) {
    console.error("Error verifying auth token", err);
  }
};

// 檢查 User 是否存在
const checkIfUserExists = async email => await User.findOne({ email }).exec();

// 新增 User
const createNewUser = googleUser => {
  const { name, email, picture } = googleUser;
  const user = { name, email, picture };
  return new User(user).save();
};
