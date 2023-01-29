import { useState, useEffect } from 'react'

import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import personService from './services/persons'


const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={message.type}>
      {message.text}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)

    useEffect(() => {
      personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
    }, [])

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)

  const addPerson = (event) => {
    event.preventDefault()
        
    if((persons.findIndex(person => person.name === newName) === -1)){
      const personObject = {
        name: newName,
        number: newNumber,
        id: persons.length + 1,
      }

      personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNotificationMessage({text: `Added ${newName}`,type: 'notification'})
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
        setNewName('')
        setNewNumber('')
      })

    } else {
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        const person = persons.find(person => person.name === newName)
        const changedPerson = { ...person, number: newNumber }
      
        personService
          .update(changedPerson.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== returnedPerson.id ? person : returnedPerson))
            setNewName('')
            setNewNumber('')
        }).catch(error => {
          setNotificationMessage({text: `Information of ${newName} has already been removed from server`,type: 'error'})
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
          setPersons(persons.filter(p => p.name !== newName))
        })
      }
    }
  }

  const removePerson = (id) => {
    const person = persons.find(person => person.id === id)
    if(window.confirm(`Delete ${person.name}`)){
    personService
      .remove(id)
      .then(returnedPerson => {
        setPersons(persons.filter(person => person.id !== id))
      })
    }
  }

  const handleFilterChange = (event) => setFilterName(event.target.value)

  const personsToShow = (filterName === '')
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(filterName.toLowerCase()))

  return (
    <div>
      <Notification message={notificationMessage} />
      <h2>Phonebook</h2>
      <Filter handleFilterChange={handleFilterChange} filterName={filterName} />
      <h2>add a new</h2>
      <PersonForm
        addPerson={addPerson}
        personsToShow={personsToShow}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
        />
      <h2>Numbers</h2>
      <Persons addPerson={addPerson} personsToShow={personsToShow} removePerson={removePerson} />
    </div>
  )
}

export default App