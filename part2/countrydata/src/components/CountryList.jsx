const CountryList = ({ countries, onSelectCountry }) => {
  // Don't show anything if there are no countries to show or list is less than 2 countries long
  if (!countries || countries.length < 2) {
    return null;
  };

  // If there are more than 10 countries, show a message asking the user to specify another filter
  if (countries.length > 10) {
    return (
      <p>Too many matches, specify another filter</p>
    );
  };

  // If there are between 2 and 10 countries, show a list of the countries' names
  return (
    <div>
      {countries.map(country => <p key={country.name.common}>{country.name.common} <button onClick={() => onSelectCountry(country.name.common)}>Show</button></p>)}
    </div>
  );
};

export default CountryList;