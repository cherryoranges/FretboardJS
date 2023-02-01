const express = require('express')
const path = require('path');

const app = express()
const port = process.env.PORT || 5000

// serve static files
app.use('/public', express.static(path.join(__dirname, '/public')))

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "/public", "index.html"))
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})