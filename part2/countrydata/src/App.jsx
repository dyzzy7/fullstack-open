import { useState, useEffect } from 'react';
import CountrySearchField from './components/CountrySearchField';
import CountryList from './components/CountryList';
import CountryInfo from './components/CountryInfo';

import countriesService from './services/countries';
import weatherService from './services/weather';

function App() {
  const [allCountries, setallCountries] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [countries, setCountries] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    countriesService.getAll().then(countries => {
      setallCountries(countries);
    });
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      weatherService.get(selectedCountry.capital[0]).then(weather => {
        setWeather(weather);
      });
    }
  }, [selectedCountry]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    if (event.target.value === '') {
      setCountries(null);
      return;
    }
    const filteredCountries = allCountries.filter(country => country.name.common.toLowerCase().includes(event.target.value.toLowerCase()));
    setCountries(filteredCountries);
    if (filteredCountries.length === 1) {
      setSelectedCountry(filteredCountries[0]);
    }
  };

  const handleSelectCountry = (name) => {
    const country = countries.find(country => country.name.common === name);
    setSelectedCountry(country);
  }

  return (
    <div>
      <CountrySearchField searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
      <CountryList countries={countries} onSelectCountry={handleSelectCountry}/>
      <CountryInfo country={selectedCountry} weather={weather}/>
    </div>
  );
}

export default App;
