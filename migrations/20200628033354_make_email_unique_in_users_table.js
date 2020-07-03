exports.up = function (knex) {
  return Promise.all([
    knex.schema.alterTable("users", (table) => {
      table.string("email", 255).notNullable().unique().alter();
    }),
  ]);
};

exports.down = function (knex) {
  return Promise.all([
    knex.schema.alterTable("users", (table) => {
      table.string("email", 255).notNullable().alter();
    }),
  ]);
};
