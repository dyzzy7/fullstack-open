import { useEffect, useState } from 'react'
import Filter from './components/Filter';
import Notification from './components/Notification';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import phonebookService from './services/phonebook';
import './index.css';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationType, setNotificationType] = useState(null);

  useEffect(() => {
    phonebookService.getAll().then(initialPersons => {
      setPersons(initialPersons);
    });
  }, []);

  const namesToShow = searchTerm === ''
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleAdd = (event) => {
    event.preventDefault();

    const personObject = {
      name: newName,
      number: newNumber,
    };

    const existingPerson = persons.find(person => person.name === newName);
    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        phonebookService
          .update(existingPerson.id, personObject)
          .then(returnedPerson => {
            setNotificationMessage(`Updated ${returnedPerson.name}`);
            setNotificationType('success');
            setTimeout(() => {
              setNotificationMessage(null);
              setNotificationType(null);
            }, 5000);
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson));
            setNewName('');
            setNewNumber('');
          });
      }
    }
    else {
      phonebookService
        .create(personObject)
        .then(returnedPerson => {
          setNotificationMessage(`Added ${returnedPerson.name}`);
          setNotificationType('success');
          setTimeout(() => {
            setNotificationMessage(null);
            setNotificationType(null);
          }, 5000);
          setPersons(persons.concat(returnedPerson));
          setNewName('');
          setNewNumber('');
        });
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDeletePerson = (id) => {
    if (window.confirm('Are you sure you want to delete this person?')) {
      const { name } = persons.find(person => person.id === id);
      phonebookService
        .remove(id)
        .then(() => {
          setNotificationMessage(`Deleted ${name}`);
          setNotificationType('success');
          setTimeout(() => {
            setNotificationMessage(null);
            setNotificationType(null);
          }, 5000);
          setPersons(persons.filter(person => person.id !== id));
        })
        .catch(error => {
          setNotificationMessage(`Information of ${name} has already been removed from the server`);
          setNotificationType('error');
          setTimeout(() => {
            setNotificationMessage(null);
            setNotificationType(null);
          }, 5000);
          setPersons(persons.filter(person => person.id !== id));
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} type={notificationType} />
      <Filter searchTerm={searchTerm} handleSearchTermChange={handleSearchTermChange} />
      <h3>add a new</h3>
      <PersonForm
        handleAdd={handleAdd}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons namesToShow={namesToShow} onDeletePerson={handleDeletePerson} />
    </div>
  );
}

export default App