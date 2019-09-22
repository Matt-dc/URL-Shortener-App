module.exports.generateUniqueString = digits => {
  var rand = (Math.random() * Math.pow(36, digits)) | 0;
  string = rand.toString(36);
  return string;
};

module.exports.shortenUrl = function ShortenUrl(rand, longUrl) {
  this.shortUrl = `http://localhost:8888/${rand}`;
  this.longUrl = longUrl;
  this.createdAt = Date.now();
};

module.exports.checkBody = (reqBody, paramToCheck) => {
  let parsed = JSON.parse(JSON.stringify(reqBody));

  if (!parsed.hasOwnProperty(paramToCheck)) {
    throw new Error("Invalid body parameters");
  }
};

module.exports.getHistoryArray = (newItem, shortenHistory) => {
  shortenHistory.unshift(newItem);
  let sliced = shortenHistory.slice(0, 11);
  return sliced;
};
