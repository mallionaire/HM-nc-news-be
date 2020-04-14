exports.up = function (knex) {
  console.log("Creating USER table");

  return knex.schema.createTable("users", (usersTable) => {
    usersTable.text("username").primary().unique();
    usersTable.text("avatar_url");
    usersTable.text("name").notNullable();
  });
};

exports.down = function (knex) {
  console.log("Removing USER table");
  return knex.schema.dropTable("users");
};
/*
- `username` which is the primary key & unique
- `avatar_url`
- `name`
*/
