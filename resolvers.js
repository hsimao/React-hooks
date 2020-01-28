const { AuthenticationError } = require("apollo-server");

// 封裝高階函式 authenticated 每次使用 graphql 查詢用戶時, 先判斷是否有 currentUser (在 server.js 內 new ApolloServer 時調用 controllers 內的 findOrCreateUser 邏輯判斷)
const authenticated = next => (root, args, ctx, info) => {
  if (!ctx.currentUser) {
    throw new AuthenticationError("Yout must be logged in");
  }
  return next(root, args, ctx, info);
};

module.exports = {
  Query: {
    me: authenticated((root, args, ctx) => ctx.currentUser)
  }
};
