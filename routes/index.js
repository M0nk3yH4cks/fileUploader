var express = require('express');
var formidable = require('formidable');
var util = require("util");
const jsftp = require("jsftp");
var fs = require("fs");

const Ftp = new jsftp({
    host: "ftp.nope.altervista.org",
    port: 21, // defaults to 21
    user: "nope", // defaults to "anonymous"
    pass: "nope" // defaults to "@anonymous"
});

Ftp.auth("nope", "nope", function (err) {
    console.log(err);
});

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Upload' });
});

router.post('/', function(req, res, response){
    var form = new formidable.IncomingForm();
    form.parse(req);
    var local = null;

    form.on('fileBegin', function (name, file){
        if (file.name.substring(file.name.lastIndexOf(".")) !== ".c"){
            console.log("Nope");
            res.writeHead(400, {'content-type': 'text/plain'});
            res.write("Nope");
            res.end();
            process.exit(1);
        }
    });

    form.on('file', function (name, file){
        local = file.path;
        var remote = "/fileManager/files/Beginners/" + file.name;
        fs.readFile(local, function(err, buffer) {
            if(err) {
                console.error(err);
                res.send(err + " - upload failed");
            }
            else {
                Ftp.put(buffer, remote, function(err) {
                    if (err) {
                        console.error(err);

                    }
                    else {
                        return res.redirect("/");
                    }
                });
            }
        });
        console.log('Uploading ' + file.name);
    });

});

module.exports = router;
