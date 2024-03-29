const express = require('express');
const path = require('path');

// import ApolloServer
const { ApolloServer } = require('apollo-server-express');

// import our typeDefs and resolvers
const { resolvers, typeDefs} = require('./schemas');
const db = require('./config/connection');


const PORT = process.env.PORT || 3002;
const app = express();

console.log(PORT)

const { authMiddleware } = require('./utils/auth');


// create a new Apollo server and pass in our schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware

});

// integrate our Apollo server with the Express application as middleware
server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Serve up static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});


db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    // log where we can go to test our GQL API
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
