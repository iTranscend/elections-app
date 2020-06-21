exports.up = function (knex) {
  return Promise.all([
    knex.schema.table("candidates", (table) => {
      table.dropColumn("position_id");
    }),
  ]);
};

exports.down = function (knex) {};
