require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const validUrl = require("valid-url");
var schedule = require("node-schedule");
var generateUniqueString = require("./utils").generateUniqueString;
var ShortenUrl = require("./utils").shortenUrl;
var checkBody = require("./utils").checkBody;
var getHistoryArray = require("./utils").getHistoryArray;

const PORT = 8888;
const BASE_URL = `http://localhost:${PORT}`;

// ####
//
// The main URLS object is used to store the URL objects created on each shortening operation, for faster look up.
//
// The shortenHistory array stores the last 10 shortening operations, with each consecutive operation
// unshifted to the front of the array, and slicing out the first 10.
//

// ####

var URLS = {};
var shortenHistory = [];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,UPDATE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );
  next();
});

app.use(cors());

// schedule a filter every hour to destroy old shortened links - links last 1 day
var deleteExpiredLinks = schedule.scheduleJob("00 * * * *", () => {
  Object.keys(URLS).forEach(key => {
    if (Date.now() - URLS[key][createdAt] > 86400000) {
      delete URLS[key];
    }
  });
});

// Retrieves and returns the full URLS_ARRAY
app.get("/", (req, res) => {
  res.status(200).json({ shortenHistory: shortenHistory });
});

// Shortens the submitted long url.
//
// upon shortening operations, the updated shortenHistory array and the new object are sent
//
app.post("/shorten", (req, res) => {
  checkBody(req.body, "url");

  const { url } = req.body;
  const trimmedLongUrl = url.trim().replace(/\/$/, "");

  if (
    validUrl.is_http_uri(trimmedLongUrl) ||
    validUrl.is_https_uri(trimmedLongUrl)
  ) {
    var rand = generateUniqueString(6);
    if (URLS[rand] !== null) {
      rand = generateUniqueString(6);
    }

    Object.keys(URLS).forEach(k => {
      if (URLS[k]["longUrl"] == trimmedLongUrl) {
        res.status(409).json({ shortenHistory: shortenHistory });
        throw new Error("URL submitted already exists in URLs object");
      }
    });

    let shortenedUrl = new ShortenUrl(rand, trimmedLongUrl);
    URLS[rand] = shortenedUrl;
    getHistoryArray(shortenedUrl, shortenHistory);

    res.status(200).json({
      shortenedUrl: shortenedUrl,
      shortenHistory: shortenHistory
    });
  } else {
    res.status(400).json({ shortenHistory: shortenHistory });
    throw new Error("URL submitted is not valid");
  }
});

// Takes the submitted short url and either redirects to an error page or the long url
app.get("/:urlParam", (req, res) => {
  const { urlParam } = req.params;

  if (!(urlParam in URLS)) {
    res.status(404).redirect(`http://localhost:3000/${urlParam}`);
    throw new Error("That unique code doesn't exist");
  }

  let urlRedirect = URLS[urlParam].longUrl;

  res.redirect(urlRedirect);
});

// Updates the long url and returns the full array to the front end
app.put("/update/:shorturl", (req, res) => {
  const { shorturl } = req.params;

  checkBody(req.body, "urlToUpdate");
  const { urlToUpdate } = req.body;

  if (!(shorturl in URLS) || !("longUrl" in URLS[shorturl])) {
    //if data doesn't exist
    res.status(404).json({ shortenHistory: shortenHistory });

    throw new Error("That url code doesn't correspond to a real URL");
  } else if (URLS[shorturl].longUrl === urlToUpdate) {
    // If nothing is changed
    res.status(200).json({ shortenHistory: shortenHistory });
    throw new Error("Duplicate URL was submitted. No changes were effected.");
  } else if (
    URLS[shorturl].shortUrl !== `${BASE_URL}/${shorturl}` &&
    shorturl in URLS
  ) {
    res.status(409).json({
      shortenedUrl: URLS[shorturl].shortUrl,
      shortenHistory: shortenHistory,
      URLS: URLS
    });
    throw new Error("That URL has already been assigned to another unique ID");
  } else if (
    !validUrl.is_http_uri(urlToUpdate) &&
    !validUrl.is_https_uri(urlToUpdate)
  ) {
    res.status(400).send("Invalid url format");
  } else {
    URLS[shorturl].longUrl = urlToUpdate;

    let updatedShortenHistory = shortenHistory.map(url => {
      if (url.shortUrl === shorturl) {
        return { ...url, longUrl: urlToUpdate };
      } else {
        return url;
      }
    });

    shortenHistory = updatedShortenHistory;
    res.status(200).json({ shortenHistory: shortenHistory });
  }
});

// Deletes the url object from the array and returns it
app.delete("/delete/:urlToDelete", (req, res) => {
  const { urlToDelete } = req.params;

  if (!(urlToDelete in URLS)) {
    throw new Error("That unique doesn't exist");
  }
  delete URLS[urlToDelete];

  let updatedShortenHistory = shortenHistory.filter(url => {
    return url.shortUrl !== `${BASE_URL}/${urlToDelete}`;
  });
  shortenHistory = updatedShortenHistory;
  res.status(200).json({ shortenHistory: shortenHistory, URLS: URLS });
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});

app.all("*", (req, res) => {
  res
    .status(400)
    .send(
      "Invalid query. This is probably a problem with the body or url parameters"
    );
  throw new Error(
    "Invalid query. This is probably a problem with the body or url parameters"
  );
});
