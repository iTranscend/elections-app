exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable("config", (table) => {
      table.increments();
      table.string("property", 255).notNullable();
      table.boolean("value").notNullable();
    }),
  ]);
};

exports.down = function (knex) {
  return Promise.all([knex.schema.dropTable("config")]);
};
