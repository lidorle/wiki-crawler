const axios = require("axios");

module.exports = {
  fetchUrlData: async function (URL) {
    const baseUrl = "https://en.wikipedia.org/";
    const linkUrl = URL.includes(baseUrl) ? URL : `${baseUrl}${URL}`;
    const response = await axios.get(linkUrl);
    return response.data;
  },
};
