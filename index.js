const express = require('express')
const multer = require('multer')
const os = require('os');
const fs = require('fs')

const mimesAceptados = [
    'image/jpeg', 'image/bmp', 'image/gif', 'image/png', 'image/tiff'
]
const extImagenes = [
    'jpeg', 'jpg', 'bmp', 'gif', 'png', 'tiff'
]
const galStaticDir = '/galeria'

const nombresDirs = {
    'cam': __dirname + '/uploads/cam',
    'archivos': __dirname + '/uploads/archivos'
};
const dirIndefinido = __dirname + '/uploads/indef';

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var dir = dirIndefinido;
        if (nombresDirs[file.fieldname]) dir = nombresDirs[file.fieldname];

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir)
    },
    filename: function (req, file, cb) {

        cb(null, file.originalname)

    }
})

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        if (file.fieldname === 'cam' && !mimesAceptados.some((e) => e === file.mimetype)) {
            return callback(null, false, new Error('Only images are allowed'))
        }
        callback(null, true)
    }
})

const app = express()
app.use(express.static('cosas'))
app.use(galStaticDir, express.static('uploads/cam'))

app.post('/upload/cam', upload.array('cam'), (req, res, next) => {
    console.log("recibiendo ... file?" + req.file + " or files?" + req.files);
    if (!req.file && req.files && req.files[0]) req.file = req.files[0];
    if (!req.file) {
        const error = new Error('Please choose a file')
        res.status(400).send(error)
        return next(error)
    }
    res.send(galStaticDir+'/'+req.file.filename);
})
app.post('/upload/archivos', upload.array('archivos'), (req, res, next) => {
    console.log("recibiendo ... file?" + req.file + " or files?" + req.files);
    if (!req.files) {
        const error = new Error('Please choose some files')
        res.status(400).send(error)
        return next(error)
    }
    res.send(req.files);
})
app.get('/upload/cam', (req, res, next) => {
    res.send("usar post");
})
app.get('/upload/archivos', (req, res, next) => {
    res.send("usar post");
})

app.get('/galeria/lista', (req, res) => {
    var lista = []
    fs.readdirSync(nombresDirs['cam']).forEach(file => {
        let ext = file.slice((file.lastIndexOf('.') - 1 >>> 0) + 2)
        if (extImagenes.some((e) => e === ext)) lista.push(galStaticDir+'/'+file)
    });
    console.log('lista de la galeria compilada')
    console.log(lista)
    res.json(lista)
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