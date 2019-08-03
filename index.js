const express = require('express')
const multer = require('multer')
const os = require('os');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })

const app = express()
app.use(express.static('cosas'))

app.post('/upload', upload.single('imagenes'), (req, res, next) => {
    console.log("recibiendo ...");
    if (!req.file) {
        const error = new Error('Please choose a file')
        error.httpStatusCode = 400
        return next(error)
    }
    console.log(req.file);
    res.send(req.file);
})

app.get('/', (req, res, cp) => {
    res.sendFile(__dirname + '/index.html')
})

var listener = app.listen(3005, function () {
    var interfaces = os.networkInterfaces();
    var addresses = [];
    for (var k in interfaces) {
        for (var k2 in interfaces[k]) {
            var address = interfaces[k][k2];
            if (address.family === 'IPv4' && !address.internal) {
                addresses.push(address.address);
                console.log('Listening on ' + address.address + ':' + listener.address().port);
            }
        }
    }
});