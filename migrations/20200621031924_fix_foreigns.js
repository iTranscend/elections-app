exports.up = function (knex) {
  return Promise.all([
    knex.schema.table("votes", (table) => {
      table.dropColumn("voter_id");
      table.dropColumn("candidate_id");
      table.dropColumn("position_id");
    }),
  ]);
};

exports.down = function (knex) {};
