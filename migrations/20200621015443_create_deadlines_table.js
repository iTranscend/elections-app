exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable("deadlines", (table) => {
      table.increments();
      table.string("name", 255).notNullable();
      table.datetime("value").notNullable();
    }),
  ]);
};

exports.down = function (knex) {
  return Promise.all([knex.schema.dropTable("deadlines")]);
};
