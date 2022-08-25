require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const Person = require("./models/person");

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);

morgan.token("data", (req, res) => {
  return req.method === "POST" ? JSON.stringify(req.body) : " ";
});


app.get("/api/info", (req, res) => {
  const peopleCount = Person.length;
  res.send(
    `<p>Phonebook has info for ${peopleCount} people</p><p>${new Date()}</p>`
  );
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id).then((person) => {
    person ? res.send(person) : res.send("<p> 404 person not found </p>");
  });
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((p) => {
    response.json(p);
  });
});

app.delete("/api/persons/:id", (req, res) => {
  Person.remove((Number(req.params.id))).then(() => {
    res.status(204).end();
  })
});

app.post("/api/persons", (req, res) => {
  if (!req.body.number || !req.body.name) {
    return res.status(400).json({
      error: "number or name is missing",
    });
  }

  if (
    Person.find((p) => p.name.toLowerCase() === req.body.name.toLowerCase())
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

  Person.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
