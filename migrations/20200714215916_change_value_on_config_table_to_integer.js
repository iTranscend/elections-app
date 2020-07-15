exports.up = function (knex) {
  return Promise.all([knex.raw("ALTER TABLE config MODIFY value INTEGER;")]);
};

exports.down = function (knex) {
  return Promise.all([knex.raw("ALTER TABLE config MODIFY value BOOLEAN;")]);
};
