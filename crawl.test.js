const { test, expect } = require("@jest/globals");
const { normalizeURL, getURLsFromHTML } = require("./crawl.js");

// Test normalizeURL
// Test HTTPS "/"
test("https://example.com/ -> example.com/", () => {
  const input = "https://example.com/";
  const actual = normalizeURL(input);
  const expected = "example.com/";

  expect(actual).toEqual(expected);
});
// Test HTTPS "/test"
test("https://example.com/test -> example.com/test", () => {
  const input = "https://example.com/test";
  const actual = normalizeURL(input);
  const expected = "example.com/test";

  expect(actual).toEqual(expected);
});
// Test HTTPS "/test/"
test("https://example.com/test/ -> example.com/test", () => {
  const input = "https://example.com/test/";
  const actual = normalizeURL(input);
  const expected = "example.com/test";

  expect(actual).toEqual(expected);
});
// Test HTTPS "/test/hello"
test("https://example.com/test/hello -> example.com/test/hello", () => {
  const input = "https://example.com/test/hello";
  const actual = normalizeURL(input);
  const expected = "example.com/test/hello";

  expect(actual).toEqual(expected);
});
// Test HTTPS "/test/hello/"
test("https://example.com/test/hello/ -> example.com/test/hello", () => {
  const input = "https://example.com/test/hello/";
  const actual = normalizeURL(input);
  const expected = "example.com/test/hello";

  expect(actual).toEqual(expected);
});
// Test HTTP "/"
test("http://EXAMPLE.com/ -> example.com/", () => {
  const input = "http://EXAMPLE.com/";
  const actual = normalizeURL(input);
  const expected = "example.com/";

  expect(actual).toEqual(expected);
});
// Test HTTP "/test" and Port 80
test("http://example.com:80/test -> example.com/test", () => {
  const input = "http://example.com:80/test";
  const actual = normalizeURL(input);
  const expected = "example.com/test";

  expect(actual).toEqual(expected);
});
// Test HTTP "/test/" and port 80 and Subdomain
test("http://www.example.com:80/test/ -> example.com/test", () => {
  const input = "http://www.example.com:80/test/";
  const actual = normalizeURL(input);
  const expected = "example.com/test";

  expect(actual).toEqual(expected);
});
// Test HTTP "/test/hello" and port 80 and Subdomain
test("http://www.example.com:80/test/hello -> example.com/test/hello", () => {
  const input = "http://www.example.com:80/test/hello";
  const actual = normalizeURL(input);
  const expected = "example.com/test/hello";

  expect(actual).toEqual(expected);
});
// Test HTTP "/test/hello/" and Port 80 and Subdomain
test("HTTP://WWW.example.COM/test/hello/ -> example.com/test/hello", () => {
  const input = "HTTP://WWW.example.COM/test/hello/";
  const actual = normalizeURL(input);
  const expected = "example.com/test/hello";

  expect(actual).toEqual(expected);
});

// Test getURLsFromHTML
// Absolute
test('<a href="https://example.com"></a> -> [ "https://example.com/" ]', () => {
  const inputUrl = "https://example.com";
  const inputBody =
    '<html><body><a href="https://example.com"><span>Example.com></span></a></body></html>';
  const actual = getURLsFromHTML(inputBody, inputUrl);
  const expected = ["https://example.com/"];

  expect(actual).toEqual(expected);
});

// Relative
test('<a href="/test/hello/"></a> -> [ "https://example.com/test/hello/" ]', () => {
  const inputUrl = "https://example.com";
  const inputBody =
    '<html><body><a href="/test/hello/"><span>Example.com></span></a></body></html>';
  const actual = getURLsFromHTML(inputBody, inputUrl);
  const expected = ["https://example.com/test/hello/"];

  expect(actual).toEqual(expected);
});

// Both
test('<a href="/test/hello/"></a><a href="https://www.example.com/path/two/"></a> -> [ "https://example.com/test/hello/", "https://www.example.com/path/two/" ]', () => {
  const inputUrl = "https://example.com";
  const inputBody =
    '<html><body><a href="/test/hello/"><span>Example.com></span></a><a href="https://www.example.com/path/two/"><span>Example.com></span></a></body></html>';
  const actual = getURLsFromHTML(inputBody, inputUrl);
  const expected = [
    "https://example.com/test/hello/",
    "https://www.example.com/path/two/",
  ];

  expect(actual).toEqual(expected);
});

// Error Handling
test('<a href="test/hello/"></a> -> [ ]', () => {
  const inputUrl = "https://example.com";
  const inputBody =
    '<html><body><a href="test/hello"><span>Example.com></span></a></body></html>';
  const actual = getURLsFromHTML(inputBody, inputUrl);
  const expected = [];

  expect(actual).toEqual(expected);
});
