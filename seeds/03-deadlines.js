exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("deadlines")
    .truncate()
    .then(function () {
      // Inserts seed entries
      return knex("deadlines").insert([
        { id: 1, name: "candidateDeadline", value: "" },
        { id: 2, name: "voterDeadline", value: "" },
      ]);
    });
};
