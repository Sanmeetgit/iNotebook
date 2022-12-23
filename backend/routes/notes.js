const express = require('express')
const router = express.Router()
const Note = require('../models/Note')
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middlewares/fetchuser');

//ROUTE 1 : Get All notes of user using GET /api/notes/fetchallnotes ; Requires Authentication
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

//ROUTE 2 : Add a note of user using POST /api/notes/addnote ; Requires Authentication
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

//ROUTE 3 : Update an existing note of user using PUT /api/notes/updatenote ; Requires Authentication
// :id is a parameter obtained from url, (ID of note)
router.put('/updatenote/:id', fetchuser, async (req, res) => {
  try {
    // Destructuring
    const {title, description, tag} = req.body;
    // Create a new note for updation, add only those fields which are to be updated
    let newNote = {};
    if(title) {newNote.title = title};
    if(description) {newNote.description = description};
    if(tag) {newNote.tag = tag};

    // First find a note using ID and then verify if the user who is updating the note is the one who created it (User can only update his own notes)
    const note = await Note.findById(req.params.id);

    // if note not found
    if(!note) {
      return res.status(404).send("Note Not Found!!")
    }

    // If not a correct user, Access denied
    if(note.user.toString() != req.user.userID){
      return res.status(401).send("Not Allowed");
    }

    // If everything's correct
    const updatedNote = await Note.findByIdAndUpdate(req.params.id, {$set:newNote}, {new:true});
    res.json(updatedNote);

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
})

//ROUTE 4 : Delete an existing note of user using DELETE /api/notes/deletenote ; Requires Authentication
// :id is a parameter obtained from url, (ID of note)
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
  try {

    // First find a note using ID and then verify if the user who is deleting the note is the one who created it (User can only delete his own notes)
    const note = await Note.findById(req.params.id);

    // if note not found
    if(!note) {
      return res.status(404).send("Note Not Found!!")
    }

    // If not a correct user, Access denied
    if(note.user.toString() != req.user.userID){
      return res.status(401).send("Not Allowed");
    }

    // If everything's correct
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    res.json({"status":"Note Deleted Successfully", "DeletedNote":deletedNote});

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
})


module.exports = router