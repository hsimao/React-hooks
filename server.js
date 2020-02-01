require("dotenv").config();
const mongoose = require("mongoose");
const { ApolloServer } = require("apollo-server");
const { findOrCreateUser } = require("./controllers/userController");
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("DB connected!"))
  .catch(err => console.error(err));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // 可在線上訪問 graphQL 介面 http://react-geopins.herokuapp.com/playground
  // introspection: true,
  // playground: true,
  context: async ({ req }) => {
    let authToken = null;
    let currentUser = null;
    try {
      authToken = req.headers.authorization;
      if (authToken) {
        // 使用 token 跟資料庫搜尋是否已有同用戶存在
        currentUser = await findOrCreateUser(authToken);
      }
    } catch (err) {
      console.error(`Unable to authorization user with token ${authToken}`);
    }
    return { currentUser };
  }
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`Server listening on ${url}`);
});
