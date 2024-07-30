const typeDefs = `
    type User {
        _id: ID!
        username: String!
        email: String!
        password: String!
        ratedMovieCount: Int
        ratedMovies: [Movie]
        favoriteMovieCount: Int
        favoriteMovies: [Movie]
    }

    type Movie {
        movieId: String!
        title: String!
        image: String!
        rating: Float!
    }

    input MovieInput {
        movieId: String!
        title: String!
        image: String!
        rating: Float!
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        me: User
    }

    type Mutation {
        addUser(username: String!, email: String!, password: String!): Auth
        login(email: String!, password: String!): Auth
        rateMovie(movieInput: MovieInput): User
        unRateMovie(movieId: String!): User
        addMovieToFavorite(movieInput: MovieInput): User
        unFavoriteMovie(movieId: String!): User
    }
`;

module.exports = typeDefs;
