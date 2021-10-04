const express = require("express");
const bodyParser = require('body-parser');
const https = require('https');

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {

  var firstName = req.body.fname;
  var lastName = req.body.lname;
  var email = req.body.email;

  var data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  }

  // converting the js object into flatpack json
  var jsonData = JSON.stringify(data);

  const url = "https://us1.api.mailchimp.com/3.0/lists/c8d250bfb9";
  const options = {
    method: "POST",
    auth: "ritya15:ca6d644265fe227d311b18518e220a54-us1"
  };

  const request = https.request(url, options, function(response) {
    response.on("data", function(data) {
      console.log(JSON.parse(data));
      if (response.statusCode == 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure",function(req,res){
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is runnung on port 3000.");
});

// apiKey = 5b3dd9b368622c5626d95c2e760553f6-us1

// uniqueId = c8d250bfb9
// list id or audience ids, helps, mailchimp
// identify the list you want to put ur subscribers into
