exports.up = function (knex) {
  //console.log("Creating COMMENT table");

  return knex.schema.createTable("comments", (commentTable) => {
    commentTable.increments("comment_id").primary();
    commentTable.text("author").references("users.username");
    commentTable.integer("article_id").references("articles.article_id");
    commentTable.integer("votes").defaultTo(0);
    commentTable.timestamp("created_at");
    commentTable.text("body").notNullable();
  });
};

exports.down = function (knex) {
  //console.log("Removing COMMENTS table");
  return knex.schema.dropTable("comments");
};

//notNullable();

/*
- `comment_id` which is the primary key
- `author` field that references a user's primary key (username)
- `article_id` field that references an article's primary key
- `votes` defaults to 0
- `created_at` defaults to the current timestamp
- `body`
*/
