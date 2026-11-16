const { v1: uuid } = require('uuid')
const { GraphQLError } = require('graphql')
const Author = require('./models/author')
const Book = require('./models/book')
const jwt = require('jsonwebtoken')
const User = require('./models/user')

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),

    authorCount: async () => Author.collection.countDocuments(),

    allBooks: async (root, args) => {
      const query = {}

      if (args.author) {
        const author = await Author.findOne({ name: args.author })

        if (!author) return []

        query.author = author._id
      }

      if (args.genre) {
        query.genres = args.genre
      }

      return Book.find(query).populate("author")
    },

    allAuthors: async () => {
      return Author.find({})
    },

    me: (root, args, context) => {
      return context.currentUser
    }

  },
  Author: {
    bookCount: async (author) => Book.countDocuments({ author: author._id })
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: "UNAUTHENTICATED",
          }
        })
      }

      const bookExists = await Book.exists({ title: args.title })

      if (bookExists) {
        throw new GraphQLError(`Title must be unique: ${args.title}`, {
          extensions: {
          code: "BAD_USER_INPUT",
          invalidArgs: args.title,
          },
        })
      }

      let author = await Author.findOne({ name: args.author })

      if (!author) {
        author = new Author({ name: args.author })
        
        try {
          await author.save()
        } catch (error) {
          throw new GraphQLError(`Saving author failed: ${error.message}`, {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.author,
              error
            }
          })
        }
      }

      const book = new Book({ ...args, author: author._id })
      try {
        await book.save()
      } catch (error) {
        throw new GraphQLError(`Saving book failed: ${error.message}`, {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.title,
              error
            }
          })
        }
        await book.populate('author')
        return book
      },

    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: "UNAUTHENTICATED",
          }
        })
      }

      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }

      author.born = args.setBornTo

      try {
        await author.save()
      } catch (error) {
        throw new GraphQLError(`Saving born year failed: ${error.message}`, {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.name,
              error
            }
          })
      }

      return author
    },

    createUser: async (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })

      return user.save()
        .catch(error => {
          throw new GraphQLError(`Creating the user failed: ${error.message}`, {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.username,
              error
            }
          })
        })
    },
    
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT"
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
    
    _resetDatabase: async () => {
      if (process.env.NODE_ENV !== 'test') {
        throw new GraphQLError('_resetDatabase is only available in test mode')
      }
      await Author.deleteMany({})
      await Book.deleteMany({})
      await User.deleteMany({})
      return true
    },
  }
}

module.exports = resolvers