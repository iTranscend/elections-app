exports.up = function (knex) {
  return Promise.all([
    knex.schema.table("users", (table) => {
      table.specificType("base64image", "LONGTEXT");
    }),
  ]);
};

exports.down = function (knex) {
  return Promise.all([
    knex.schema.table("users", (table) => {
      table.dropColumn("base64image");
    }),
  ]);
};
