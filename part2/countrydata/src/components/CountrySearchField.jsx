const CountrySearchField = ({ searchTerm, handleSearchChange }) => {
  return (
    <div>
      find countries <input value={searchTerm} onChange={handleSearchChange} />
    </div>
  );
};

export default CountrySearchField;