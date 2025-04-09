if (!process.env.DB_URI) {
  throw new Error("Mongo URI not found!");
}

// const client;
