exports.up = function (knex) {
  //console.log("Creating TOPIC table");
  //
  return knex.schema.createTable("topics", (topicTable) => {
    topicTable.text("slug").notNullable().primary().unique();
    topicTable.text("description") /*.notNullable()*/;
  });
};

exports.down = function (knex) {
  //console.log("Removing TOPIC table");
  return knex.schema.dropTable("topics");
};

/*
- `slug` field which is a unique string that acts as the table's primary key
- `description` field which is a string giving a brief description of a given topic
*/
