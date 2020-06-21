exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable("users", (table) => {
      table.increments();
      table.string("firstname", 255).notNullable();
      table.string("lastname", 255).notNullable();
      table.string("email", 255).notNullable();
      table.string("password", 255).notNullable();
      table.string("profile_pic");
      table.timestamps(true, true);
    }),
  ]);
};

exports.down = function (knex) {
  return Promise.all([knex.schema.dropTable("users")]);
};
