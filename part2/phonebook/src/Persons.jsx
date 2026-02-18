const Persons = ({ namesToShow }) => {
    return (
        <div>
            {namesToShow.map(person => <p key={person.name}>{person.name} {person.number}</p>)}
        </div>
    );
};

export default Persons;