exports.up = function (knex) {
  return Promise.all([
    knex.schema.table("candidates", (table) => {
      table.integer("user_id").unsigned();
      table
        .foreign("user_id")
        .references("id")
        .inTable("users")
        .onDelete("cascade");
      table.integer("position_id").unsigned();
      table
        .foreign("position_id")
        .references("id")
        .inTable("positions")
        .onDelete("cascade");
    }),
  ]);
};

exports.down = function (knex) {
  return Promise.all([
    knex.schema.table("candidates", (table) => {
      table.dropColumns("user_id");
      table.dropColumns("position_id");
    }),
  ]);
};
