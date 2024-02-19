const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
    var firstName = req.body.fName;
    var lastName = req.body.lName;
    var email = req.body.email;
    var phoneNumber = req.body.phone;
    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                    PHONE: phoneNumber,
                },
            },
        ],
    };
    const jsonData = JSON.stringify(data);

    const url = "https://us8.api.mailchimp.com/3.0/lists/ddf9113077";
    const options = {
        method: "POST",
        auth: "elviskemoi:77145506ffebe49671f823de2c8b9b2d-us8",
    };

    const request = https.request(url, options, function (response) {
        response.on("data", function (data) {
            const message = JSON.parse(data);
            const errorMessage = message.errors;
            const errorCount = message.error_count;
            if (errorCount === 0) {
                res.sendFile(__dirname + "/success.html");
                console.log("Signup Successful!");
            } else {
                res.sendFile(__dirname + "/failure.html");
                console.log(errorMessage);
                console.log(
                    "There was a problem in your sign up! Please try again."
                );
            }
        });
    });
    request.write(jsonData);
    request.end();
});

app.post("/failure", (req, res) => {
    res.redirect("/");
});

app.post("/success", (req, res) => {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is live on port 3000!");
});

// mailchimp api
// 77145506ffebe49671f823de2c8b9b2d-us8
// audience id
// ddf9113077
