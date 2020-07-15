exports.up = function (knex) {
  return Promise.all([
    knex.schema.alterTable("deadlines", (table) => {
      table.datetime("value").alter();
    }),
  ]);
};

exports.down = function (knex) {
  return Promise.all([
    knex.schema.alterTable("deadlines", (table) => {
      table.datetime("value").notNullable().alter();
    }),
  ]);
};
