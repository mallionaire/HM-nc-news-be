const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments,
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("returns an empty array when passed an empty array", () => {
    expect(formatDates([])).to.be.an("array");
  });
  it("returns a new array", () => {
    const inputArr = [];
    const actual = formatDates(inputArr);
    expect(actual).to.deep.equal([]);
    expect(actual).to.not.equal(inputArr);
  });
  // it("returns an array of objects", () => {
  //   const inputArr = [{}, {}, {}];
  //   const actual = formatDates(inputArr);
  //   expect(actual).to.deep.equal(inputArr);
  //   actual.forEach((item) => {
  //     expect(item).to.be.an("object");
  //   });
  // });
  it("converts the created_at key for one list object into a JS date object", () => {
    const inputArr = [
      {
        topic: "test topic",
        created_at: 1542284514171,
        votes: 100,
      },
    ];
    const actual = formatDates(inputArr);
    expect(actual).to.deep.equal([
      {
        topic: "test topic",
        created_at: new Date(1542284514171),
        votes: 100,
      },
    ]);
  });
  it("converts the created_at key for an array of many objects into a JS date object", () => {
    const inputArr = [
      {
        topic: "test topic",
        created_at: 1542284514171,
        votes: 100,
      },
      {
        topic: "test topic 2",
        created_at: 1289996514171,
        votes: 200,
      },
      {
        topic: "test topic 3",
        created_at: 1163852514171,
        votes: 300,
      },
    ];
    const expected = [
      {
        topic: "test topic",
        created_at: new Date(1542284514171),
        votes: 100,
      },
      {
        topic: "test topic 2",
        created_at: new Date(1289996514171),
        votes: 200,
      },
      {
        topic: "test topic 3",
        created_at: new Date(1163852514171),
        votes: 300,
      },
    ];
    const actual = formatDates(inputArr);
    expect(expected).to.deep.equal(actual);
  });
});

describe("makeRefObj", () => {});

describe("formatComments", () => {});
