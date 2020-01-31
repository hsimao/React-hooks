const { AuthenticationError } = require("apollo-server");
const Pin = require("./models/Pin");

// 封裝高階函式 authenticated 每次使用 graphql 查詢用戶時, 先判斷是否有 currentUser (在 server.js 內 new ApolloServer 時調用 controllers 內的 findOrCreateUser 邏輯判斷)
const authenticated = next => (root, args, ctx, info) => {
  if (!ctx.currentUser) {
    throw new AuthenticationError("Yout must be logged in");
  }
  return next(root, args, ctx, info);
};

// 新增標籤, 儲存到資料庫後填充 author 資訊後回傳
const createPin = authenticated(async (root, args, ctx) => {
  const newPin = await new Pin({
    ...args.input,
    author: ctx.currentUser._id
  }).save();

  const pinAdded = await Pin.populate(newPin, "author");
  return pinAdded;
});

// 取得所有標籤
const getPins = async (root, args, ctx) => {
  const pins = await Pin.find({})
    .populate("author")
    .populate("comments.author");
  return pins;
};

module.exports = {
  Query: {
    me: authenticated((root, args, ctx) => ctx.currentUser),
    getPins: getPins
  },
  Mutation: {
    createPin: createPin
  }
};
