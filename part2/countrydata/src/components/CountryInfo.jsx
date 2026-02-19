
const CountryInfo = ({ country, weather }) => {
    // If no country is selected, don't show anything
    if (!country) {
        return null;
    }

    // If weather data is not available, show the country info without the weather info
    if (!weather) {
        return (
            <div>
                <h1>{country.name.common}</h1>
                <p>Capital {country.capital}</p>
                <p>Area {country.area}</p>
                <h2>Languages</h2>
                <ul>
                {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
                </ul>
                <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />
            </div>
        );
    }

    // Show country and weather info if both are available
    return (
      <div>
        <h1>{country.name.common}</h1>
        <p>Capital {country.capital}</p>
        <p>Area {country.area}</p>
        <h2>Languages</h2>
        <ul>
          {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
        </ul>
        <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />
        <h2>Weather in {country.capital}</h2>
        <p>Temperature {weather.main.temp.toFixed(2)} Celsius</p>
        <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={`Weather icon for ${country.name.common}`} />
        <p>Wind {weather.wind.speed} m/s</p>
      </div>
    );
};

export default CountryInfo;