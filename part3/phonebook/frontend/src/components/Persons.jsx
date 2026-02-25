const Persons = ({ namesToShow, onDeletePerson }) => {
    return (
        <div>
            {namesToShow.map(person => <p key={person.name}>{person.name} {person.number} <button onClick={() => onDeletePerson(person.id)}>delete</button></p>)}
        </div>
    );
};

export default Persons;