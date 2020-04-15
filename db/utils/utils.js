exports.formatDates = (list) => {
  return list.map(({ created_at, ...listItem }) => {
    const newItem = {
      created_at: new Date(created_at),
      ...listItem,
    };
    return newItem;
  });
};

exports.makeRefObj = (list, key, value) => {
  const refObj = {};
  list.map((listItem) => {
    refObj[listItem[key]] = listItem[value];
  });
  //console.log(refObj);
  return refObj;
};

exports.formatComments = (comments, articleRef) => {
  const formattedComments = this.formatDates(comments);
  const newformat = formattedComments.map((comment) => {
    const { created_by, belongs_to: key, ...restOfKeys } = comment;
    return {
      author: created_by,
      article_id: articleRef[key],
      ...restOfKeys,
    };
  });

  return newformat;
};

/*
This utility function should be able to take an array of comment objects (`comments`) and a reference object, and return a new array of formatted comments.

Each formatted comment must have:

- Its `created_by` property renamed to an `author` key
- Its `belongs_to` property renamed to an `article_id` key
- The value of the new `article_id` key must be the id corresponding to the original title value provided
- Its `created_at` value converted into a javascript date object
- The rest of the comment's properties must be maintained

*/
