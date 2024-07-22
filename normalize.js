function normalizeURL(url) {
  try {
    const { hostname, pathname, search, hash } = new URL(url);
    return `${hostname}${pathname}${search}${hash}`.toLowerCase();
  } catch (error) {
    console.error(`Invalid URL: ${url}`);
    return "";
  }
}

export { normalizeURL };
