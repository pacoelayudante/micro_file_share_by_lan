import express from 'express'
import multer from 'multer'

const upload = multer({'dest':'uploads/'})

const app = express()

app.post('/upload',upload.array('imagenes'),(req, res, cp)=>{

})

app.get('/',(req, res, cp)=>{
    res.sendFile(__dirname+'/index.html')
})

app.listen(3000)