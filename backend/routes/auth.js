const express = require('express')
const router = express.Router()

// define the home page route
router.get('/', (req, res) => {
    obj = {
        myName:"Sanmeet",
        myAge:21
    }
  res.send(obj);
})

module.exports = router