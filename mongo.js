const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@phonebook.6uiqsbn.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  Person.find({}).then((persons) => {
    console.log("phonebook:");
    persons.forEach((person) => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
} else if (process.argv[3] !== undefined && process.argv[4] !== undefined) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });
  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}
