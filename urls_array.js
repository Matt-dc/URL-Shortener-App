require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const validUrl = require("valid-url");
var schedule = require("node-schedule");

const PORT = 8888;

// global Urls array
var URLS_ARRAY = [];

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
  let filteredArr = URLS_ARRAY.filter(inDate => {
    return Date.now() - inDate.createdAt < 86400000;
  });
  URLS_ARRAY = filteredArr;
});

// Retrieves and returns the full URLS_ARRAY
app.get("/", (req, res) => {
  res.status(200).send(URLS_ARRAY);
});

// Takes the submitted short url and either redirects to an error page or the long url
app.get("/:urlParam", (req, res) => {
  const { urlParam } = req.params;

  const urlRedirect = URLS_ARRAY.find(
    url => url["shortUrl"].split("/").pop() === urlParam
  );

  if (!urlRedirect) {
    res.redirect(`http://localhost:3000/${urlParam}`);
  } else {
    res.redirect(urlRedirect);
  }
});

// Shortens the submitted long url providing it doesn't already exist
app.post("/shorten", (req, res) => {
  const url = req.body.url;
  const urlToShorten = url.trim().replace(/\/$/, "");

  if (
    validUrl.is_http_uri(urlToShorten) ||
    validUrl.is_https_uri(urlToShorten)
  ) {
    var rand = (Math.random() * Math.pow(36, 6)) | 0;
    rand = rand.toString(36);

    URLS_ARRAY.find(url => url["shortUrl"].split("/").pop() === rand);

    rand = ((Math.random() * Math.pow(36, 6)) | 0).toString(36);

    if (URLS_ARRAY.find(url => url["longUrl"] === urlToShorten)) {
      res.status(409).send(URLS_ARRAY);
      return;
    }

    const urlObject = {
      longUrl: urlToShorten,
      shortUrl: `${process.env.BASE_URL}/${rand}`,
      createdAt: Date.now()
    };

    URLS_ARRAY.unshift(urlObject);
    res.send(URLS_ARRAY);
  } else {
    res.status(400).send(URLS_ARRAY);
  }
});

// Updates the long url and returns the full array to the front end
app.put("/update/:shorturl", (req, res) => {
  const { shorturl } = req.params;
  let { urlToUpdate } = req.body;
  var checkArrayChanged;

  if (!urlToUpdate) {
    res.status(400).send("Invalid request parameters");
  } else if (
    URLS_ARRAY.filter(url => url["shortUrl"] === shorturl).map(
      url => url.longUrl === urlToUpdate
    )
  ) {
    res.status(304).send(URLS_ARRAY);
  } else if (URLS_ARRAY.find(url => urlToUpdate === url["longUrl"])) {
    res.status(409).send(URLS_ARRAY);
    return;
    // urlToUpdate = urlToUpdate.trim().replace(/\/$/, "");
  } else if (
    !validUrl.is_http_uri(urlToUpdate) &&
    !validUrl.is_https_uri(urlToUpdate)
  ) {
    res.status(400).send("Invalid url format");
  } else {
    let updatedArr = URLS_ARRAY.map(url => {
      if (url.shortUrl.split("/").pop() == shorturl) {
        checkArrayChanged = url;
        return { ...url, longUrl: urlToUpdate };
      } else {
        return url;
      }
    });

    URLS_ARRAY = updatedArr;
    res.status(200).send(updatedArr);
  }
});

// Deletes the url object from the array and returns it
app.delete("/delete/:urlToDelete", (req, res) => {
  const { urlToDelete } = req.params;

  let updatedArr = URLS_ARRAY.filter(url => {
    return url.shortUrl.split("/").pop() !== urlToDelete;
  });
  URLS_ARRAY = updatedArr;
  res.send(URLS_ARRAY);
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
});
