const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data);
  const url =
    "https://us21.api.mailchimp.com/3.0/lists/" + process.env.REACT_APP_LIST_ID;
  const options = {
    method: "POST",
    auth: "Arogya:" + process.env.REACT_APP_SECRET_KEY,
  };
  console.log("AROGYA:" + process.env.REACT_APP_SECRET_KEY);
  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    
    response.on("data", function (data) {
  try {
    const parsedData = JSON.parse(data);
    console.log(parsedData);
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }
});

  });
  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});
app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000");
});
