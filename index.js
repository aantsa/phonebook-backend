const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());

morgan.token("data", (req, res) => {
  return req.method === "POST" ? JSON.stringify(req.body) : " ";
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/info", (req, res) => {
  const peopleCount = persons.length;
  res.send(
    `<p>Phonebook has info for ${peopleCount} people</p><p>${new Date()}</p>`
  );
});

app.get("/api/persons/:id", (req, res) => {
  const person = persons.find((person) => person.id === Number(req.params.id));
  person ? res.send(person) : res.send("<p> 404 person not found </p>");
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.delete("/api/persons/:id", (req, res) => {
  persons = persons.filter((person) => person.id !== Number(req.params.id));
  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
    console.log(req.body);
  if (!req.body.number || !req.body.name) {
    return res.status(400).json({
      error: "number or name is missing",
    });
  }

  if (
    persons.find(
      (person) => person.name.toLowerCase() === req.body.name.toLowerCase()
    )
  ) {
    return res.status(400).json({
      error: `person ${req.body.name} already exists`,
    });
  }

  const person = {
    id: Math.floor(Math.random() * 2000),
    name: req.body.name,
    number: req.body.number,
  };

  persons = [...persons, person];
  res.json(person);
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
