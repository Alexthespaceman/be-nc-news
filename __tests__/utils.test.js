const {
  changeTimeStamp,
  createReferenceObject,
  switchKeyReference,
} = require("../db/utils/data-manipulation");

describe("changeTimeStamp", () => {
  test("returns empty array when passed an empty array", () => {
    let input = [];
    let actual = changeTimeStamp(input);
    expect(actual).toEqual([]);
  });
  test("returns a js time stamp instead of unix", () => {
    let input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100,
      },
    ];
    let outPut = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date(1542284514171),
        votes: 100,
      },
    ];
    let key = "created_at";
    let actual = changeTimeStamp(input, key);
    expect(actual).toEqual(outPut);
  });
  test("returns a js time stamp instead of unix for multiple objects", () => {
    let input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100,
      },
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171,
      },
      {
        title: "Student SUES Mitch!",
        topic: "mitch",
        author: "rogersop",
        body:
          "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
        created_at: 1163852514171,
      },
    ];
    let outPut = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date(1542284514171),
        votes: 100,
      },
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: new Date(1289996514171),
      },
      {
        title: "Student SUES Mitch!",
        topic: "mitch",
        author: "rogersop",
        body:
          "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
        created_at: new Date(1163852514171),
      },
    ];
    let key = "created_at";
    let actual = changeTimeStamp(input, key);
    expect(actual).toEqual(outPut);
  });
  test("returns an unmutated array", () => {
    let input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100,
      },
    ];
    let key = "created_at";
    let actual = changeTimeStamp(input, key);
    expect(actual).not.toBe([
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100,
      },
    ]);
    expect(input).toEqual([
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100,
      },
    ]);
  });
});

describe("createReferenceObject", () => {
  test("should return an empty object when called with an empty array", () => {
    expect(createReferenceObject([])).toEqual({});
  });
  test("should take an array with a single object and 2 keys, and return an object with the value of those keys as a key-value pair.  ", () => {
    const inputArticles = [
      {
        article_id: 0,
        title: "They're not exactly dogs, are they?",
        topic: "mitch",
        author: "butter_bridge",
        body: "Well? Think about it.",
        created_at: 533132514171,
      },
    ];

    const actual = createReferenceObject(inputArticles, "title", "article_id");
    const expected = { "They're not exactly dogs, are they?": 0 };

    expect(actual).toEqual(expected);
  });
  test("should work with multiple objects", () => {
    const inputArticles = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100,
      },
      {
        article_id: 2,
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171,
      },
    ];
    const actual = createReferenceObject(inputArticles, "title", "article_id");
    const expected = {
      "Living in the shadow of a great man": 1,
      "Eight pug gifs that remind me of mitch": 2,
    };
    expect(actual).toEqual(expected);
  });
  test("should not mutate the original array", () => {
    const input = [
      {
        article_id: 0,
        title: "They're not exactly dogs, are they?",
        topic: "mitch",
        author: "butter_bridge",
        body: "Well? Think about it.",
        created_at: 533132514171,
      },
    ];
    const actual = createReferenceObject(input, "title", "article_id");
    expect(input).not.toBe(actual);
    expect(input).toEqual([
      {
        article_id: 0,
        title: "They're not exactly dogs, are they?",
        topic: "mitch",
        author: "butter_bridge",
        body: "Well? Think about it.",
        created_at: 533132514171,
      },
    ]);
  });
});

describe("switchKeyReference", () => {
  const refObject = {
    "They're not exactly dogs, are they?": 0,
    "Living in the shadow of a great man": 1,
    "Eight pug gifs that remind me of mitch": 2,
  };
  test("should return an empty array when called with an empty array", () => {
    expect(switchKeyReference([])).toEqual([]);
  });
  test("should switchKeyReference works on single object", () => {
    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389,
      },
    ];
    const actual = switchKeyReference(
      input,
      refObject,
      "belongs_to",
      "article_id"
    );
    const output = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 0,
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389,
      },
    ];

    expect(actual).toEqual(output);
  });
  test("should switchKeyReference works on an array of several objects", () => {
    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389,
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389,
      },
    ];
    const actual = switchKeyReference(
      input,
      refObject,
      "belongs_to",
      "article_id"
    );
    const output = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 0,
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389,
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        article_id: 1,
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389,
      },
    ];

    expect(actual).toEqual(output);
  });
  test("input array should not equal output array", () => {
    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389,
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389,
      },
    ];
    const actual = switchKeyReference(
      input,
      refObject,
      "belongs_to",
      "article_id"
    );

    expect(actual).not.toBe(input);
    expect(input).toEqual([
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389,
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389,
      },
    ]);
  });
});
