const request = require("request");
const express = require("express");
const app = express();
const bodyParser = require('body-parser')
const mainshield = require('./shieldstuff.js')

var urlencodedParser = bodyParser.urlencoded({
        extended: false
})



app.get('/', (req, res) => res.send("<script>window.location.replace('/khienfb');</script>"));


app.get('/khienfb', (req, res) => {
        res.sendFile(__dirname + "/shield/index.html", (err) => {
                    if (err) {
                                    console.log(err)
                                }

                })
});

app.post('/khienfb/', urlencodedParser, (req, res) => {
        var token = req.body.token;
        if (!token) {
                    res.send("<script>alert('Không Để Trống Token')\nwindow.location.replace('/khienfb');</script>");
                    return;

                } else if (token) {
                            mainshield.tokenchecker(token).then((result) => {
                                            var userid = result.id;
                                            if (!userid) {
                                                                res.send("<script>alert('Token không hợp lệ')\nwindow.location.replace('/khienfb');</script>");
                                                                return;
                                                            } else {
                                                                                mainshield.makeshield(token, userid).then((result) => {

                                                                                                        var checkshield = result.data.is_shielded_set.is_shielded;
                                                                                                        if (checkshield == true) {
                                                                                                                                    res.send("<script>alert('Đã Bật Khiên Vui Lòng Check Facebook Bạn')\nwindow.location.replace('/khienfb');</script>");
                                                                                                                                    return;

                                                                                                                                } else {
                                                                                                                                                            res.send("<script>alert('Lỗi Vui Lòng Báo Lại Cho Admin')\nwindow.location.replace('https://www.facebook.com/0x80f700');</script>");
                                                                                                                                                            return;
                                                                                                                                                        }

                                                                                                    })

                                                                            }

                                        })

                        }
});
app.listen(80, () => console.log("Connected!"))
