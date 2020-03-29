
const ApolloServer = require('apollo-server').ApolloServer
const ApolloServerLambda = require('apollo-server-lambda').ApolloServer
const { gql } = require('apollo-server-lambda');


const authors = [
  {
    id: 1,
    name: 'Eleanor Roosevelt'
  },
  {
    id: 2,
    name: 'M.F.K. Fisher'
  },
]

const quotes = [
  {
    id: 1,
    authorId: 1,
    quote: 'A woman is like a tea bag. You never know how strong she is until she gets into hot water.',
  },
  {
    id: 2,
    authorId: 2,
    quote: 'First we eat, then we do everything else.',
  }
];



const typeDefs = gql`
type Query {
  authors: [Author]
  # quotes: [Quote]
  quote(id: Int!): Quote
  quotesByAuthor(authorId: Int!): [Quote]
}
type Author {
  id: Int
  name: String
  quotes: [Quote]
}
type Quote {
  id: Int
  authorId: Int
  quote: String
  author: Author
}
`;



const resolvers = {
  Query: {
    quote(parent, args, context, info) {
      return quotes.find(quote => quote.id === args.id);
    },
    quotesByAuthor(parent, args, context, info) {
      const author = authors.find(author => author.id === args.authorId);
      return quotes.filter(quote => quote.authorId === author.id);
    },
    authors: () => authors,
    // author(id) {
    //   quotes: () => quotes.find(quote => quotes.authorId === id);
    // },
    // quotes: () => quotes
  },

  // Author: {
  //   quotes: (author, quote) => quote.authorId === author.id,
  // },

  // Quote: {
  //   author: quote => find(authors, { id: quote.authorId }),
  // }
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
