exports.up = function (knex) {
  return Promise.all([
    knex.schema.table("candidates", (table) => {
      table.dropColumn("user_id");
    }),
  ]);
};

exports.down = function (knex) {};
