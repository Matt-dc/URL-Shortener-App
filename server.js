require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const validUrl = require("valid-url");
var schedule = require("node-schedule");

const PORT = 8888;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// schedule a filter every hour to destroy old shortened links - links last 1 day
var deleteExpiredLinks = schedule.scheduleJob("00 * * * *", () => {
  fs.readFile("./urls.json", "utf8", (err, data) => {
    if (err) throw err;

    const fileData = JSON.parse(data);
    const urlArr = fileData.urls;

    let filteredArr = {
      urls: urlArr.filter(inDate => Date.now() - inDate.createdAt < 86400000)
    };
    filteredArr = JSON.stringify(filteredArr);

    fs.writeFile("urls.json", filteredArr, "utf8", () => {
      res.send(updatedData);
    });
  });
});

app.get("/", (req, res) => {
  fs.readFile("./urls.json", "utf8", (err, data) => {
    let fileData = JSON.parse(data);
    res.status(200).send(fileData);
  });
});

app.get("/:urlParam", (req, res) => {
  const { urlParam } = req.params;

  fs.readFile("./urls.json", "utf8", (err, data) => {
    if (err) throw err;

    let fileData = JSON.parse(data);
    let urlArr = fileData.urls;

    const urlRedirect = urlArr.find(
      url => url["shortUrl"].split("/").pop() === urlParam
    );

    if (!urlRedirect) {
      res.redirect(`http://localhost:3000/${urlParam}`);
    } else {
      res.redirect(urlRedirect);
    }
  });
});

app.post("/shorten", (req, res) => {
  const url = req.body.url;
  const urlToShorten = url.trim().replace(/\/$/, "");

  if (
    validUrl.is_http_uri(urlToShorten) ||
    validUrl.is_https_uri(urlToShorten)
  ) {
    var rand = (Math.random() * Math.pow(36, 6)) | 0;
    rand = rand.toString(36);

    fs.readFile("./urls.json", "utf8", (err, data) => {
      if (err) throw err;

      let fileData = JSON.parse(data);

      if (
        fileData.urls.find(url => url["shortUrl"].split("/").pop() === rand)
      ) {
        rand = ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
      }

      if (fileData.urls.find(url => url["longUrl"] === urlToShorten)) {
        res.status(409).send(data);
        return;
      }

      const urlObject = {
        longUrl: urlToShorten,
        shortUrl: `${process.env.BASE_URL}/${rand}`,
        createdAt: Date.now()
      };

      fileData.urls.unshift(urlObject);

      const updatedData = JSON.stringify(fileData);

      fs.writeFile("./urls.json", updatedData, "utf8", () => {
        res.send(updatedData);
      });
    });
  } else {
    fs.readFile("./urls.json", "utf8", (err, data) => {
      data = JSON.parse(data);
      res.status(400).send(data);
    });
  }
});

app.put("/update/:shorturl", (req, res) => {
  const { shorturl } = req.params;
  const { urlToUpdate } = req.body;

  fs.readFile("./urls.json", "utf8", (err, data) => {
    if (err) throw err;

    let fileData = JSON.parse(data);

    let updatedArr = fileData.urls.map(url => {
      if (url.shortUrl.split("/").pop() == shorturl) {
        return { ...url, longUrl: urlToUpdate };
      } else {
        return url;
      }
    });

    fileData.urls = updatedArr;
    fileData = JSON.stringify(fileData);

    fs.writeFile("./urls.json", fileData, "utf8", () => {
      res.send(fileData);
    });
  });

  // res.send(urlToUpdate)
});

app.delete("/delete/:urlToDelete", (req, res) => {
  const { urlToDelete } = req.params;

  fs.readFile("./urls.json", "utf8", (err, data) => {
    if (err) throw err;

    let fileData = JSON.parse(data);

    let updatedArr = fileData.urls.filter(url => {
      return url.shortUrl.split("/").pop() !== urlToDelete;
    });

    fileData.urls = updatedArr;
    fileData = JSON.stringify(fileData);

    fs.writeFile("./urls.json", fileData, "utf8", () => {
      res.send(fileData);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
