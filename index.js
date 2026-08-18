const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', (request) => {
  return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  {
    "id": "1",
    "name": "Arto Hellas",
    "phone": "040-123456"
  },
  {
    "id": "2",
    "name": "Ada Lovelace",
    "phone": "39-44-5323523"
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "phone": "12-43-234345"
  },
  {
    "id": "4",
    "name": "Mary Poppendieck",
    "phone": "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(p => p.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(p => p.id === id)
  if (!person) {
    response.status(404).end()
  }

  persons = persons.filter(p => p.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if(!body.name || !body.phone) {
    return response.status(400).json({
      error: 'name or phone is missing'
    })
  }

  const nameExists = persons.find(p => p.name === body.name)
  if (nameExists) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const newPerson = {
    id: Math.floor(Math.random() * 1000000).toString(),
    name: body.name,
    phone: body.phone
  }

  persons = persons.concat(newPerson)
  response.json(newPerson)
})

app.get('/info', (request, response) => {
  const numberOfPeople = persons.length
  response.send(`<p>Phonebook has info for ${numberOfPeople} people</p><p>${new Date()}</p>`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})