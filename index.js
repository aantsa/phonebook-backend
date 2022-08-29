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

app.get("/api/info", (req, res, next) => {
  Person.find({})
    .then((people) => {
      res.send(
        `<p>Phonebook has info for ${people.length} people</p><p>${new Date()}</p>`
      );
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      person ? res.json(person) : res.status(404).end();
    })
    .catch((error) => next(error));
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((p) => {
    res.json(p);
  });
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id).then(() => {
    res.status(204).end();
  }).catch(error => next(error));
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;
  if (body.number === undefined || body.name === undefined) {
    return res.status(400).json({
      error: "number or name is missing",
    });
  }

  const person = new Person({
    id: Math.floor(Math.random() * 2000),
    name: req.body.name,
    number: req.body.number,
  });

  person.save().then((savedPerson) => {
    res.json(savedPerson);
  }).catch(error => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const { name, number } = req.body;

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
