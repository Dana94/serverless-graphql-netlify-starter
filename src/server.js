
const ApolloServer = require('apollo-server').ApolloServer
const ApolloServerLambda = require('apollo-server-lambda').ApolloServer
const { gql } = require('apollo-server-lambda');


const authors = [
  {
    id: 1,
    author: 'Eleanor Roosevelt'
  },
  {
    id: 2,
    author: 'M.F.K. Fisher'
  },
]

const quotes = [
  {
    id: 1,
    authorId: 1,
    quote: 'A woman is like a Tea Bag. You never know how strong she is until she gets into hot water.',
  },
  {
    id: 2,
    authorId: 2,
    quote: 'First we eat, then we do everything else.',
  },
];

const typeDefs = gql`
  type Query {
    hello: String
    authors: [Author]
    quotes: [Quote]
  }
  type Author {
    id: Int
    author: String
  }
  type Quote {
    id: Int
    authorId: Int
    quote: String
  }
`;

const resolvers = {
  Query: {
    hello: () => "Hi! Love from @stemmlerjs 🤠.",
    author: (_, { id }) => find(authors, { id }),
    quotes: () => quotes
  },

  Author: {
    quotes: author => filter(quotes, {authorId: author.id}),
  },

  Quotes: {
    author: quote => find(authors, {id: quote.authorId}),
  }
};

function createLambdaServer() {
  return new ApolloServerLambda({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
  });
}

function createLocalServer() {
  return new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
  });
}

module.exports = { createLambdaServer, createLocalServer }
