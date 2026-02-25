const Filter = ({ searchTerm, handleSearchTermChange }) => {
  return (
    <div>
      filter shown with <input value={searchTerm} onChange={handleSearchTermChange} />
    </div>
  );
};

export default Filter;