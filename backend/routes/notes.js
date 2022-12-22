const express = require('express')
const router = express.Router()
const Note = require('../models/Note')
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middlewares/fetchuser');

//ROUTE 1 : Get All notes of user using GET /api/auth/fetchallnotes ; Requires Authentication
router.get('/fetchallnotes', fetchuser, async (req, res) => {
  try {
    // find all notes of a particular user using his ID.
    const notes = await Note.find({ user: req.user.userID });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
})

//ROUTE 2 : Add a note of user using POST /api/auth/addnote ; Requires Authentication
router.post('/addnote', [
  body('title', "Title is too short").isLength({ min: 3 }),
  body('description', "Description is too short").isLength({ min: 5 })
], fetchuser, async (req, res) => {
  try {
    // If there are errors then return a bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Create Note
    const note = await Note.create({
      title: req.body.title,
      description: req.body.description,
      tag: req.body.tag,
      user: req.user.userID
    })
    // send response
    res.json(note);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
})

module.exports = router