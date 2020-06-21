exports.up = function (knex) {
  return Promise.all([
    knex.schema.table("users", (table) => {
      table.integer("role_id").unsigned();
      table
        .foreign("role_id")
        .references("id")
        .inTable("roles")
        .onDelete("cascade");
    }),
  ]);
};

exports.down = function (knex) {
  return Promise.all([
    knex.schema.table("users", (table) => {
      table.dropColumn("role_id");
    }),
  ]);
};
