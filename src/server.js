const ApolloServer = require('apollo-server').ApolloServer
const ApolloServerLambda = require('apollo-server-lambda').ApolloServer
const { gql } = require('apollo-server-lambda');

const {authors, quotes} = require('./data.js');

const typeDefs = gql`
type Query {
  authors: [Author]
  quotes: [Quote]
  randomQuote: Quote
  quoteById(id: Int!): Quote
  quotesByAuthorId(authorId: Int!): [Quote]
  quotesByAuthorName(authorName: String!): [Quote]
  quotesByTagNames(tags: [String]!): [Quote]
}
type Author {
  id: Int!
  name: String!
  quotes: [Quote]!,
  description: String
}
type Quote {
  id: Int!
  authorId: Int!
  quote: String!
  author: Author!
  tags: [String]
}
`;

const resolvers = {
  Query: {
    authors: () => authors,
    quotes: () => quotes,
    randomQuote: () => {
      const index = Math.floor(Math.random() * Math.floor(quotes.length));
      return quotes[index];
    },
    quoteById(parent, args, context, info) {
      return quotes.find(quote => quote.id === args.id);
    },
    quotesByAuthorId(parent, args, context, info) {
      const author = authors.find(author => author.id === args.authorId);
      return quotes.filter(quote => quote.authorId === author.id);
    },
    quotesByAuthorName(parent, args, context, info) {
      const author = authors.find(author => author.name.includes(args.authorName));
      return quotes.filter(quote => quote.authorId === author.id);
    },
    quotesByTagNames(parent, args, context, info) {
      return quotes.filter(quote => {
        return quote.tags.some(tag => args.tags.includes(tag));
      });
    }
  },

  Author: {
    quotes: (author) => quotes.filter(quote => quote.authorId === author.id)
  },

  Quote: {
    author: (quote) => authors.find(author => author.id === quote.authorId)
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
