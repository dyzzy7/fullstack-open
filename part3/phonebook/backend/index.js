require('dotenv').config();
const express = require('express')
const app = express();
const Person = require('./models/persons');

app.use(express.static('dist'));
app.use(express.json());


const PORT = process.env.PORT;

app.get('/info', (request, response) => {
  const date = new Date();
  Person.find({})
    .then(result => {
      response.send(`
        <p>Phonebook has info for ${result.length} people</p>
        <p>${date}</p>
      `);
    });
});

app.get('/api/persons', (request, response) => {
  Person.find({})
    .then(result => {
      response.json(result);
    });
});

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;
  Person.findById(id)
    .then(result => {
      if (result) {
        response.json(result);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;
  Person.findByIdAndDelete(id)
    .then(result => {
      response.status(204).end();
    })
    .catch(error => next(error));
});

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body;
  if (!name || !number) {
    return response.status(400).json({ error: 'name or number is missing' });
  }
  Person.findOne({ name: name })
    .then(result => {
      if (result) {
        return response.status(400).json({ error: 'name must be unique' });
      }
    });
  const person = new Person({
    name,
    number,
  });
  person.save()
    .then(result => {
      response.json(result);
    })
    .catch(error => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;
  const { name, number } = request.body;
  Person.findById(id)
    .then(person => {
      if (!person) {
        return response.status(404).end();
      }
      person.name = name;
      person.number = number;
      return person.save().then(updatedPerson => {
        response.json(updatedPerson);
      });
    })
    .catch(error => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});