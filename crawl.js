const { JSDOM } = require("jsdom");

async function crawlPage(baseUrl, currentUrl, pages) {
  const currentUrlObj = new URL(currentUrl);
  const baseUrlObj = new URL(baseUrl);

  if (currentUrlObj.hostname !== baseUrlObj.hostname) {
    return pages;
  }

  const normalizedURL = normalizeURL(currentUrl);

  if (pages[normalizedURL] > 0) {
    pages[normalizedURL]++;
    return pages;
  }

  if (currentUrl === baseUrl) {
    pages[normalizedURL] = 0;
  } else {
    pages[normalizedURL] = 1;
  }

  let htmlBody = "";
  try {
    const resp = await fetch(currentUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Crawly Bot 1.0.0",
      },
    });

    if (resp.status > 399) {
      console.error(`Got HTTP error, status code: ${resp.status}`);
      return pages;
    }

    const contentType = resp.headers.get("content-type");

    if (!contentType.includes("text/html")) {
      console.error(`Got non-html response: ${contentType}`);
      return pages;
    }

    htmlBody = await resp.text();
  } catch (err) {
    console.error(`Error calling ${baseUrl}...`);
    console.error(`Error: ${err.message}`);
  }

  const nextURLs = getURLsFromHTML(htmlBody, baseUrl);

  for (const nextURL of nextURLs) {
    pages = await crawlPage(baseUrl, nextURL, pages);
  }

  return pages;
}

function getURLsFromHTML(htmlBody, baseURL) {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const aElements = dom.window.document.querySelectorAll("a");

  for (const aElement of aElements) {
    try {
      if (aElement.href.slice(0, 1) === "/") {
        try {
          urls.push(new URL(aElement.href, baseURL).href);
        } catch (err) {
          console.log(`${err.message}: ${aElement.href}`);
        }
      } else {
        try {
          urls.push(new URL(aElement.href).href);
        } catch (err) {
          console.log(`${err.message}: ${aElement.href}`);
        }
      }
    } catch (err) {
      console.error(err.message);
    }
  }
  return urls;
}

function normalizeURL(url) {
  const urlObj = new URL(url);
  let normUrl = `${urlObj.host}${urlObj.pathname}`;

  if (normUrl[normUrl.length - 1] === "/") {
    normUrl = normUrl.slice(0, normUrl.length - 1);
  }
  if (!normUrl.includes("/")) {
    normUrl = `${normUrl}/`;
  }
  if (normUrl.includes("www.")) {
    normUrl = normUrl.slice(4, normUrl.length);
  }

  return normUrl;
}

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage,
};
