exports.formatDates = (list) => {
  return list.map(({ created_at, ...listItem }) => {
    const newItem = {
      created_at: new Date(created_at),
      ...listItem,
    };
    return newItem;
  });
};

/* 
This utility function should be able to take an array (`list`) of objects and return a new array. Each item in the new array must have its timestamp converted into a Javascript date object. Everything else in each item must be maintained.

_hint: Think carefully about how you can test that this has worked - it's not by copying and pasting a sql timestamp from the terminal into your test_
*/

exports.makeRefObj = (list) => {};

exports.formatComments = (comments, articleRef) => {};
