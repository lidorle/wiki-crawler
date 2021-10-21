const Graph = require("./Graph");
const WikiCrawler = require("./WikiCrawler");
const { fetchUrlData } = require("./utils");
const WikiHashMap = require("./WikiHashMap");

const crawlWikiLink = async (link) => {
  const htmlData = await fetchUrlData(link);
  const wikiCrawler = new WikiCrawler(htmlData);
  const wikiEntryData = wikiCrawler.htmlPageCrawler();
  return wikiEntryData;
};
const crawlerLinks = async (wikiLinks, wikiGraph, entryFather, level, c) => {
  c++;
  if (c > level) {
    return;
  }

  for (let i = 0; i < wikiLinks.length; i++) {
    const entryData = await crawlWikiLink(wikiLinks[i]);
    WikiHashMap.set(entryData.name, entryData);
    await crawlerLinks(entryData.links.slice(0, 3), wikiGraph, entryData, level, c);
    wikiGraph.addEdge(entryData.name, entryFather.name);
  }
};

const startWikiCrawling = async (link, level) => {
  const wikiGraph = new Graph();
  let c = 0;
  const entry = await crawlWikiLink(link);
  wikiGraph.addVertex(entry.name);
  await crawlerLinks(entry.links.slice(0, 3), wikiGraph, entry, level, c);
  console.log(WikiHashMap.size());
};

module.exports = startWikiCrawling;
