exports.up = function (knex) {
  console.log("Creating ARTICLE table");

  return knex.schema.createTable("articles", (articleTable) => {
    articleTable.increments("article_id").primary();
    articleTable.text("title").notNullable();
    articleTable.text("body").notNullable();
    articleTable.integer("votes").defaultTo(0);
    articleTable.text("topic").references("topics.slug");
    articleTable.text("author").references("users.username");
    articleTable.timestamp("created_at");
  });
};

exports.down = function (knex) {
  console.log("Removing ARTICLE table");
  return knex.schema.dropTable("articles");
};

/*
- `article_id` which is the primary key
- `title`
- `body`
- `votes` defaults to 0
- `topic` field which references the slug in the topics table
- `author` field that references a user's primary key (username)
- `created_at` defaults to the current timestamp
*/
