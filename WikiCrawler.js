const cheerio = require("cheerio");

class WikiCrawler {
  constructor(htmlPage) {
    this.$ = cheerio.load(htmlPage);
    this.internalWikiRouteRegExp = new RegExp("^/wiki/[a-zA-Z1-10#_()]*$");
    this.SubEntriesLinks = new Map();
  }

  getEntryNameByMainHeader() {
    const headerText = this.$(".firstHeading").text();
    return headerText;
  }
  setNewEntry(link) {
    this.SubEntriesLinks.set(link, true);
  }
  isSubLinkExist(link) {
    return this.SubEntriesLinks.has(link);
  }
  isSubLinkValidWikiEntry(link) {
    return this.internalWikiRouteRegExp.test(link) && !link.includes("Main_Page");
  }
  filterSubLinks(link) {
    if (this.isSubLinkExist(link)) {
      return false;
    }
    if (this.isSubLinkValidWikiEntry(link)) {
      this.setNewEntry(link);
      return true;
    }
  }
  crawlPageSubEntriesLink() {
    return this.$("a")
      .map((i, link) => link.attribs.href)
      .get()
      .filter((link) => this.filterSubLinks(link));
  }

  htmlPageCrawler() {
    const entryName = this.getEntryNameByMainHeader(this.$);
    const links = this.crawlPageSubEntriesLink();

    return {
      name: entryName,
      links,
    };
  }
}

module.exports = WikiCrawler;
