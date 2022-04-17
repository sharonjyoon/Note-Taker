const express = require('express');
let notes = require('./db/db.json');
const { uid }= require('uid');
const app = express();
const path = require('path');
const fs = require('fs');

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json());


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'))
})

//for all notes in the db
app.get('/api/notes', (req, res) => {
  res.json(notes)
})

//allows to save and gives each one a unique id
app.post('/api/notes', (req, res) => {
  let newNote = {
    title: req.body.title,
    text: req.body.text,
    id: uid()
  }
  //saves to db
  notes.push(newNote)
  fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes), err => {
    if (err) { console.log(err) }
    res.json(newNote)
  })
})

//enables user to delete notes
app.delete('/api/notes/:id', (req, res) => {
  notes = notes.filter(note => note.id !== req.params.id)
  fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes), err => {
    if (err) { console.log(err) }
    res.sendStatus(200)
  })
})



app.listen(process.env.PORT || 3000)