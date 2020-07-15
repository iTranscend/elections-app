exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("config")
    .truncate()
    .then(function () {
      // Inserts seed entries
      return knex("config").insert([
        { id: 1, property: "startElection", value: 0 },
        { id: 2, property: "publishResults", value: 0 },
        { id: 3, property: "candidateApplication", value: 1 },
      ]);
    });
};
