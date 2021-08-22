const express = require('express');
const passport = require('passport');
const axios = require('axios');
const { Facebook } = require('./config.json')
const fs = require('fs');
const key = fs.readFileSync('./key.pem');
const cert = fs.readFileSync('./cert.pem');
const https = require('https');
const request = require('request');
const cors = require('cors');

const app = express();

app.use(cors({
    credentials: true, // enable set cookie
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'
}));

app.get("/", (req, res) => {
    return res.send("HI");
});


app.get("/facebook/url", (req, res) => {
    let facebook_oauth_url = "https://www.facebook.com/dialog/oauth?" +
        "redirect_uri=" + Facebook.facebook_redirect_uri +
        "&client_id=" + Facebook.facebook_client_id +
        "&scope=public_profile" +
        "&response_type=code";
    res.send(facebook_oauth_url);
});

app.get("/facebookcallback", async (req, res) => {
    let code = req.query.code;
    let token_option = {
        url: "https://graph.facebook.com/v2.3/oauth/access_token?" +
            "client_id=" + Facebook.facebook_client_id +
            "&client_secret=" + Facebook.facebook_secret_id +
            "&code=" + code +
            "&redirect_uri=" + Facebook.facebook_redirect_uri,
        method: "GET"
    };
    const token = await axios
        .get(
            `https://graph.facebook.com/oauth/access_token?client_id=${Facebook.facebook_client_id}&client_secret=${Facebook.facebook_secret_id}&grant_type=client_credentials`
        )
        .then((res) => res.data)
        .catch((error) => {
            console.error(`Failed to fetch user`);
            throw new Error(error.message);
        });
    let data = []
    request(token_option, function (err, resposne, body) {
        let access_token = JSON.parse(body).access_token;
        // console.log(access_token)
        let info_option = {
            url: "https://graph.facebook.com/debug_token?" +
                "input_token=" + access_token +
                "&access_token=" + token.access_token,
            method: "GET"
        };
        //Keep the user_id in DB as uni-key
        request(info_option, function (err, response, body) {
            if (err)
                res.send(err);
            //Get user info
            request({ url: "https://graph.facebook.com/v11.0/me?access_token=" + access_token + "&debug=all&fields=id,name,first_name,friends,photos,picture.height(258).width(258),email,age_range" }, function (err, response, body) {
                if (err)
                    res.send(err);
                // console.log(JSON.parse(body))
                data = JSON.parse(body)
                console.log(data)
                res.send(JSON.parse(body))
            });
        });
    });
});

const port = 4000;
https.createServer({ key: key, cert: cert }, app).listen(port);