<img src="https://raw.githubusercontent.com/Matt-dc/URL-Shortener-App/master/client/public/favicon.ico?raw=true" width="60px" />

# URL-Shortener-App

URL shortener coding challenge.

## How to Run

Open a terminal for Node and another for React, then:

##### /URLShortenerApp --> npm install --> npm start

and

##### /URLShortenerApp/client --> npm install --> npm start

The server runs on localhost port 8888, and React on localhost port 8889.

## Functionality

Some notable functionality includes:

- In memory storage of data, which disappears when the server is shut down.
- The last 10 URL conversions are stored and served up in an array, however, the complete set of converted URLs is stored in an object for quicker access.
- URLs delete automatically after 24 hours using a cron which runs a function every hour. The time left is displayed in the UI.
- URLs can be updated and deleted from the UI. If a URL is changed to one that already exists in memory, the pre-existing short URL is served up and nothing is converted in order to avoid duplication.
- For the sake of the project, the random string for the short URL is generated with base 36 encoding, however, in production it would be more secure to use a package such as **unique-id** to generate this.
- URLs are validated using the third party package **valid-url**.

## Changes

The file [urls_array](https://github.com/Matt-dc/URL-Shortener-App/blob/master/urls_array.js) was an original attempt whereby objects were stored in an array in memory. However, after some research it seems more efficient to use an object for this, due to speed of access.
The updated version has implemented these changes, such that **server.js** is the file from which Node is run, and **urls_array.js** is in no way connected to the program.

## Tests

I have implemented a few simple tests on both the front and back using Jest/Enzyme and Supertest/Mocha respectively. Both are located in the test(s) folder and can be run using **npm test**.

## License

[MIT](https://choosealicense.com/licenses/mit/)
