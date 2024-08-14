const express = require('express')
const app = express()

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2022-01-10T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2022-01-10T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2022-01-10T19:20:14.298Z",
    important: true
  }
]

let phoneBook = JSON.parse(`[
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]`)

// allows json-parser use (request.body in post) 
app.use(express.json())

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})



// /API/NOTES SECTION

const generateId = () => {
  // the '...' is called a spread, and is used to take the array of notes id's and split it into multiple numbers as needed for the math.max
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)

  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})



//  /API/PERSONS SECTION

app.get('/api/persons', (req, res) =>{
  res.json(phoneBook);
});


//  /INFO SECTION

app.get('/info', (req, res) =>{
  let displayedHTML = `
  <p> Phone book has info for ${phoneBook.length} people</p>
  <br>
  <p> ${new Date()}</p>
  `;
  res.send(displayedHTML);
})

app.get('/api/persons/:id', (req, res) =>{
  const id = Number(req.params.id);
  const bookItem = phoneBook.find(bookItem => Number(bookItem.id) === id);
  
  if (bookItem) {
    res.json(bookItem);
  } else {
    res.status(404).end()
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  notes = phoneBook.filter(bookItem => Number(bookItem.id) !== id);

  response.status(204).end();
});

app.post('/api/persons', (req, res) =>{
  const body = req.body;
  if (!body.name || !body.number) {
    return res.status(400).json({ 
      error: 'content missing' 
    })
  }

  // sets newId to an id in the list to enter the while loop 
  let newId = phoneBook[0].id;
  // while newId is dupe change it
  while (phoneBook.map((bookItem)=>{
    return bookItem.id;
  }).includes(newId)){
    // multiplying makes this a number between 0 and 10,000
    newId = String(Math.floor(Math.random() * 10001));
  };

  const bookItem = {
    id: newId,
    name: body.name,
    number:  body.number
  };

  phoneBook = phoneBook.concat(bookItem);

  res.json(phoneBook);
});

// OPENS SERVER

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})