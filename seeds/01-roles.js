exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("roles")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("roles").insert([
        { id: 1, name: "admin" },
        { id: 2, name: "voter" },
        { id: 3, name: "candidate" },
      ]);
    });
};
