exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("config")
    .truncate()
    .then(function () {
      // Inserts seed entries
      return knex("config").insert([
        { id: 1, name: "candidateDeadline", value: "" },
        { id: 2, name: "voterDeadline", value: "" },
      ]);
    });
};
