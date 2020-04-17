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
        topic: "test topic 1",
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
        topic: "test topic 1",
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

describe("makeRefObj", () => {
  it("returns an empty object when given an empty array", () => {
    expect(makeRefObj([])).to.deep.equal({});
  });
  it("will return an object with one key value pair when given one object in an array", () => {
    const inputArr = [{ name: "Haz", FaveColour: "Orange" }];
    const output = { Haz: "Orange" };
    const actual = makeRefObj(inputArr, "name", "FaveColour");
    expect(actual).to.deep.equal(output);
  });
  it("it returns a refObj with multiple key: value pairs when passed an array of multiple objects", () => {
    const inputArr = [
      { name: "Haz", faveColour: "Tangerine" },
      { name: "Fran", faveColour: "Lime Green" },
      { name: "Brian", faveColour: "Vivid Blue" },
    ];
    const output = {
      Haz: "Tangerine",
      Fran: "Lime Green",
      Brian: "Vivid Blue",
    };
    const actual = makeRefObj(inputArr, "name", "faveColour");
    expect(actual).to.deep.equal(output);
  });
  it("does not mutate the original array", () => {
    const inputArr = [
      { name: "Haz", faveColour: "Tangerine" },
      { name: "Fran", faveColour: "Lime Green" },
      { name: "Brian", faveColour: "Vivid Blue" },
    ];
    const inputArrCheck = [
      { name: "Haz", faveColour: "Tangerine" },
      { name: "Fran", faveColour: "Lime Green" },
      { name: "Brian", faveColour: "Vivid Blue" },
    ];
    makeRefObj(inputArr, "name", "faveColour");
    expect(inputArr).to.deep.equal(inputArrCheck);
  });
});

describe("formatComments", () => {
  it("returns an empty array when passed an empty array", () => {
    expect(formatComments([], {})).to.deep.equal([]);
  });
  it("returns a new array", () => {
    const inputArr = [];
    const actual = formatComments(inputArr, {});
    expect(actual).to.deep.equal([]);
    expect(actual).to.not.equal(inputArr);
  });
  it("replaces the created_at value and replaces it with a JS date object", () => {
    const inputArr = [
      {
        body: "This is a bad article name",
        votes: 1,
        created_at: 1038314163389,
      },
    ];
    const actual = formatComments(inputArr, {});
    expect(actual[0]).to.contain.keys(["body", "votes", "created_at"]);
    expect(actual[0].created_at).to.deep.equal(new Date(1038314163389));
  });
  it("formats a single comment", () => {
    const ref = { A: 1, B: 2, C: 3 };
    const input = [
      {
        body: "test string",
        belongs_to: "A",
        created_by: "test author",
        votes: 1,
        created_at: 1038314163389,
      },
    ];
    const actual = formatComments(input, ref);
    const output = [
      {
        body: "test string",
        article_id: 1,
        author: "test author",
        votes: 1,
        created_at: new Date(1038314163389),
      },
    ];
    expect(actual).to.deep.equal(output);
  });
  it("formats multiple comments", () => {
    const ref = { A: 1, B: 2, C: 3, D: 4 };
    const input = [
      {
        body: "test string",
        belongs_to: "A",
        created_by: "test author",
        votes: 1,
        created_at: 1038314163389,
      },
      {
        body: "test string 2",
        belongs_to: "D",
        created_by: "test author 2",
        votes: 22,
        created_at: 1289996514171,
      },
    ];
    const actual = formatComments(input, ref);
    const output = [
      {
        body: "test string",
        article_id: 1,
        author: "test author",
        votes: 1,
        created_at: new Date(1038314163389),
      },
      {
        body: "test string 2",
        article_id: 4,
        author: "test author 2",
        votes: 22,
        created_at: new Date(1289996514171),
      },
    ];
    expect(actual).to.deep.equal(output);
  });
});
