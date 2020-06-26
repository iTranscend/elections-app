// Update with your config settings.

module.exports = {
  development: {
    client: "mysql",
    connection: {
      host: "localhost",
      user: "root",
      password: "",
      database: "elections-app",
    },
    migrations: {
      directory: "./migrations",
      tableName: "knex_migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },

  staging: {
    client: "mysql",
    connection: {
      host: "localhost",
      user: "root",
      password: "",
      database: "elections-app",
    },
    migrations: {
      directory: "./migrations",
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "mysql",
    connection: {
      host: "localhost",
      user: "root",
      password: "",
      database: "elections-app",
    },
    migrations: {
      directory: "./migrations",
      tableName: "knex_migrations",
    },
  },
};
