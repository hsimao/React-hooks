const { AuthenticationError, PubSub } = require("apollo-server");
const Pin = require("./models/Pin");

const pubsub = new PubSub();
const PIN_ADDED = "PIN_ADDED";
const PIN_DELETED = "PIN_DELETED";
const PIN_UPDATED = "PIN_UPDATED";

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

  pubsub.publish(PIN_ADDED, { pinAdded });
  return pinAdded;
});

// 取得所有標籤
const getPins = async (root, args, ctx) => {
  const pins = await Pin.find({})
    .populate("author")
    .populate("comments.author");
  return pins;
};

// 刪除標籤
const deletePin = authenticated(async (root, args, ctx) => {
  // .exec() 表示執行後回傳 Promise
  // https://stackoverflow.com/questions/31549857/mongoose-what-does-the-exec-function-do
  const pinDelete = await Pin.findOneAndDelete({ _id: args.pinId }).exec();

  pubsub.publish(PIN_DELETED, { pinDelete });
  return pinDelete;
});

// 新增留言
const createComment = authenticated(async (root, args, ctx) => {
  const newComment = { text: args.text, author: ctx.currentUser._id };
  const pinUpdated = await Pin.findOneAndUpdate(
    { _id: args.pinId },
    { $push: { comments: newComment } },
    { new: true }
  )
    .populate("author")
    .populate("comments.author");

  pubsub.publish(PIN_UPDATED, { pinUpdated });
  return pinUpdated;
});

module.exports = {
  Query: {
    me: authenticated((root, args, ctx) => ctx.currentUser),
    getPins: getPins
  },
  Mutation: {
    createPin: createPin,
    deletePin: deletePin,
    createComment: createComment
  },
  Subscription: {
    pinAdded: {
      subscribe: () => pubsub.asyncIterator(PIN_ADDED)
    },
    pinDeleted: {
      subscribe: () => pubsub.asyncIterator(PIN_DELETED)
    },
    pinUpdated: {
      subscribe: () => pubsub.asyncIterator(PIN_UPDATED)
    }
  }
};
