var { graphqlHTTP } = require("express-graphql");
var { buildSchema } = require("graphql");
var express = require("express");

// Define the restaurant data
var restaurants = [
  {
    id: 1,
    name: "WoodsHill",
    description: "American cuisine, farm to table, with fresh produce every day",
    dishes: [
      {
        name: "Swordfish grill",
        price: 27,
      },
      {
        name: "Roasted Broccily",
        price: 11,
      },
    ],
  },
  {
    id: 2,
    name: "Fiorellas",
    description: "Italian-American home cooked food with fresh pasta and sauces",
    dishes: [
      {
        name: "Flatbread",
        price: 14,
      },
      {
        name: "Carbonara",
        price: 18,
      },
      {
        name: "Spaghetti",
        price: 19,
      },
    ],
  },
  {
    id: 3,
    name: "Karma",
    description: "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
    dishes: [
      {
        name: "Dragon Roll",
        price: 12,
      },
      {
        name: "Pancake roll",
        price: 11,
      },
      {
        name: "Cod cakes",
        price: 13,
      },
    ],
  },
];

// Construct a schema using GraphQL schema language
var schema = buildSchema(`
  type Query {
    restaurant(id: Int): Restaurant
    restaurants: [Restaurant]
  }

  type Mutation {
    setRestaurant(input: RestaurantInput): Restaurant
    deleteRestaurant(id: Int!): DeleteResponse
    updateRestaurant(id: Int!, input: RestaurantInput): Restaurant
  }

  type Restaurant {
    id: Int
    name: String
    description: String
    dishes: [Dish]
  }

  type Dish {
    name: String
    price: Int
  }

  input RestaurantInput {
    name: String
    description: String
  }

  type DeleteResponse {
    ok: Boolean!
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  restaurant: ({ id }) => restaurants.find(restaurant => restaurant.id === id),
  restaurants: () => restaurants,
  setRestaurant: ({ input }) => {
    const newId = restaurants.length + 1;
    const newRestaurant = { id: newId, ...input };
    restaurants.push(newRestaurant);
    return newRestaurant;
  },
  deleteRestaurant: ({ id }) => {
    const index = restaurants.findIndex(restaurant => restaurant.id === id);
    if (index !== -1) {
      restaurants.splice(index, 1);
      return { ok: true };
    }
    return { ok: false };
  },
  updateRestaurant: ({ id, input }) => {
    const index = restaurants.findIndex(restaurant => restaurant.id === id);
    if (index !== -1) {
      restaurants[index] = { ...restaurants[index], ...input };
      return restaurants[index];
    }
    return null;
  }
};

var app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
var port = 5500;
app.listen(port, () => console.log("Running GraphQL on Port:" + port));
