const axios = require("axios");
const HTMLParser = require("node-html-parser");

const baseUrl = "https://kilincarslan.dev/";

const getPage = async (url) => {
  const page = await axios.get(url);
  return page.data;
};

const getLinks = (html) => {
  const root = HTMLParser.parse(html);
  const links = root.querySelectorAll("a");
  return links.map((link) => link.getAttribute("href"));
};

const listLinks = async (url) => {
  const page = await getPage(url);
  return getLinks(page);
};

try {
  listLinks(baseUrl).then((links) => {
    console.log(links);
  });
} catch (error) {
  console.log("📌 ~ error ->", error.message);
}
