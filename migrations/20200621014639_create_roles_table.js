exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable("roles", (table) => {
      table.increments();
      table.string("name", 255).notNullable();
    }),
  ]);
};

exports.down = function (knex) {
  return Promise.all([knex.schema.dropTable("roles")]);
};
