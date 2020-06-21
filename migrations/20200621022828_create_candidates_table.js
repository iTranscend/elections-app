exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable("candidates", (table) => {
      table.increments();
      table.integer("user_id").notNullable();
      table.integer("position_id").notNullable();
      table.boolean("is_approved").defaultsTo(false);
      table.timestamps(true, true);
    }),
  ]);
};

exports.down = function (knex) {
  return Promise.all([knex.schema.dropTable("candidates")]);
};
