exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable("votes", (table) => {
      table.increments();
      table.integer("voter_id").notNullable();
      table.integer("position_id").notNullable();
      table.integer("candidate_id").notNullable();
      table.timestamp("cast_at").defaultTo(knex.fn.now());
    }),
  ]);
};

exports.down = function (knex) {
  return Promise.all([knex.schema.dropTable("votes")]);
};
