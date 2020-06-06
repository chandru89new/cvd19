import React, { useEffect, useState } from "react";
import ReactDom from "react-dom";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import axios from "axios";
import moment from "moment";

const API_URL: string =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080"
    : "https://covid-files.firebaseapp.com";

const hcOptions: Highcharts.Options = {
  series: [],
  xAxis: {
    type: "datetime",
    tickInterval: 24 * 3600 * 1000 * 15,
  },
  yAxis: {
    title: {
      text: "Total",
    },
  },
  tooltip: {
    shared: true,
  },
  title: {
    text: "",
  },
  credits: {
    enabled: false,
  },
  chart: {
    style: {
      fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    },
  },
};

function App() {
  let [totalOptions, setOptions] = useState({ ...hcOptions });
  let [newOptions, setNewOptions] = useState({ ...hcOptions });
  const countries = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Congo (Brazzaville)",
    "Congo (Kinshasa)",
    "Costa Rica",
    "Cote d'Ivoire",
    "Croatia",
    "Diamond Princess",
    "Cuba",
    "Cyprus",
    "Czechia",
    "Denmark",
    "Djibouti",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini",
    "Ethiopia",
    "Fiji",
    "Finland",
    "France",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Guatemala",
    "Guinea",
    "Guyana",
    "Haiti",
    "Holy See",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Korea, South",
    "Kuwait",
    "Kyrgyzstan",
    "Latvia",
    "Lebanon",
    "Liberia",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Madagascar",
    "Malaysia",
    "Maldives",
    "Malta",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Namibia",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "North Macedonia",
    "Norway",
    "Oman",
    "Pakistan",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Russia",
    "Rwanda",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "San Marino",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Somalia",
    "South Africa",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Sweden",
    "Switzerland",
    "Taiwan*",
    "Tanzania",
    "Thailand",
    "Togo",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "Uruguay",
    "US",
    "Uzbekistan",
    "Venezuela",
    "Vietnam",
    "Zambia",
    "Zimbabwe",
    "Dominica",
    "Grenada",
    "Mozambique",
    "Syria",
    "Timor-Leste",
    "Belize",
    "Laos",
    "Libya",
    "West Bank and Gaza",
    "Guinea-Bissau",
    "Mali",
    "Saint Kitts and Nevis",
    "Kosovo",
    "Burma",
    "MS Zaandam",
    "Botswana",
    "Burundi",
    "Sierra Leone",
    "Malawi",
    "South Sudan",
    "Western Sahara",
    "Sao Tome and Principe",
    "Yemen",
    "Comoros",
    "Tajikistan",
    "Lesotho",
  ];
  let [country, setCountry] = useState(countries[0]);
  let [isLog, setLogOption] = useState(false);
  let [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      const { data: cases } = await axios.get(
        `${API_URL}/${country}-confirmed.json`
      );
      const { data: recoveries } = await axios.get(
        `${API_URL}/${country}-recovered.json`
      );
      const { data: deaths } = await axios.get(
        `${API_URL}/${country}-deaths.json`
      );
      setOptions({
        ...totalOptions,
        yAxis: {
          ...totalOptions.yAxis,
          type: isLog ? "logarithmic" : "linear",
        },
        series: [
          {
            type: "line",
            name: "Confirmed",
            data: cases.data.map((d) => [
              moment.utc(d[0]).valueOf(),
              d[1],
            ]),
          },
          {
            type: "line",
            name: "Recovered",
            data: recoveries.data.map((d) => [
              moment.utc(d[0]).valueOf(),
              d[1],
            ]),
          },
          {
            type: "line",
            name: "Deaths",
            data: deaths.data.map((d) => [
              moment.utc(d[0]).valueOf(),
              d[1],
            ]),
          },
        ],
      });
      setNewOptions({
        ...newOptions,
        yAxis: {
          ...newOptions.yAxis,
          type: isLog ? "logarithmic" : "linear",
          title: { text: "New" },
        },
        series: [
          {
            type: "line",
            name: "Confirmed",
            data: cases.data.map((d) => [
              moment.utc(d[0]).valueOf(),
              d[2],
            ]),
          },
          {
            type: "line",
            name: "Recovered",
            data: recoveries.data.map((d) => [
              moment.utc(d[0]).valueOf(),
              d[2],
            ]),
          },
          {
            type: "line",
            name: "Deaths",
            data: deaths.data.map((d) => [
              moment.utc(d[0]).valueOf(),
              d[2],
            ]),
          },
        ],
      });
      setLoading(false);
    }
    getData();
  }, [country, isLog]);

  return (
    <div className="App">
      <div>
        <div>
          Country:
          <select onChange={(e) => setCountry(e.target.value)}>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginTop: "1rem" }}>
          <label htmlFor="log">Logarithmic</label>
          <input
            type="checkbox"
            id="log"
            onClick={() => setLogOption(!isLog)}
          />
        </div>
      </div>
      <div className="chart-container">
        {loading && <div className="loader">Loading...</div>}
        <HighchartsReact
          highcharts={Highcharts}
          options={totalOptions}
        />
      </div>
      <div className="chart-container">
        {loading && <div className="loader">Loading...</div>}
        <HighchartsReact
          highcharts={Highcharts}
          options={newOptions}
        />
      </div>
    </div>
  );
}

export default App;
