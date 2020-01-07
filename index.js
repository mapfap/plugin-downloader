const fs = require('fs')  
const path = require('path')  
const axios = require('axios')
const regex = new RegExp('(.*/)*(.+\.(png|jpg|gif|bmp|jpeg|PNG|JPG|GIF|BMP|JPEG|mp4|ts|TS|MP4)).*')
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 8080

app.use(cors())

const downloadImage = async (url) => {
  const fileName = url.match(regex)[2]
  const file = path.resolve(__dirname, 'images', fileName)
  const writer = fs.createWriteStream(file)

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  })

  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

app.get('/', (req, res) => {
  const resource = Buffer.from(req.query.q, 'base64').toString('ascii')
  downloadImage(resource)
  .then(data => {
    console.log(`SUCCESS: ${resource}`)
  }).catch(err => {
    console.log(`ERROR: ${resource}`)
    console.error(err)
  })
  res.json({success: true})
})


app.listen(port, () => console.log(`[sys] Express started on ${port}!`))

