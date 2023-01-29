import React from 'react'

const Person = ({person, removePerson}) => {
  return <li>{person.name} {person.number} <button onClick={removePerson}>remove</button></li>
}

const Persons = ({personsToShow, removePerson}) => {
  return (
    <ul>
    {personsToShow.map(person =>
        <Person key={person.name} person={person} removePerson={() => removePerson(person.id)} />
      )}
    </ul>
  )
}

export default Persons