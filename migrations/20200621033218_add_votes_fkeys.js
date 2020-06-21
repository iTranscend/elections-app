exports.up = function (knex) {
  return Promise.all([
    knex.schema.table("votes", (table) => {
      table.integer("voter_id").unsigned();
      table
        .foreign("voter_id")
        .references("id")
        .inTable("users")
        .onDelete("cascade");
      table.integer("candidate_id").unsigned();
      table
        .foreign("candidate_id")
        .references("id")
        .inTable("candidates")
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

exports.down = function (knex) {};
