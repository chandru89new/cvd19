const fs = require("fs");
const d3 = require("d3-dsv");
const R = require("ramda");
const file: string =
  "../../data/csse_covid_19_data/csse_covid_19_time_series";
const casesFile: string = "time_series_covid19_confirmed_global.csv";
const recoveredFile: string =
  "time_series_covid19_recovered_global.csv";
const deadFile: string = "time_series_covid19_deaths_global.csv";
const outputDir: string = "../";

const filterByCountry = (country: string) => (data: any[]) => {
  const filtered = data.filter(
    (d) => d["Country/Region"] === country
  );
  if (filtered.length > 1) {
    return filtered.reduce((acc, curr) => {
      Object.keys(curr).forEach((key) => {
        if (
          ![
            "Province/State",
            "Country/Region",
            "Lat",
            "Long",
          ].includes(key)
        ) {
          acc[key] = acc[key]
            ? acc[key] + Number(curr[key])
            : Number(curr[key]);
        } else {
          acc[key] = curr[key];
        }
      });
      return acc;
    }, {});
  }
  return filtered[0];
};

const formatData = (data: any) => {
  return R.pipe(
    R.omit(["Country/Region"]),
    Object.entries,
    (a: any[]) =>
      a.map((d: string[], idx: number) => [
        new Date(d[0]),
        parseInt(d[1]),
        idx === 0
          ? parseInt(d[1])
          : parseInt(d[1]) - parseInt(a[idx - 1][1]),
      ]),
    (d: any[]) => ({ country: data["Country/Region"], data: d })
  )(data);
};

const res = (file: string) => (country: string) =>
  R.pipe(
    R.curry(fs.readFileSync)(R.__, "utf-8"),
    d3.csvParse,
    R.omit(["columns"]),
    Object.values,
    filterByCountry(country),
    R.omit(["Lat", "Long", "Province/State"]),
    formatData,
    JSON.stringify
  )(file);

// const countries = [
//   "India",
//   "Russia",
//   "Indonesia",
//   "Pakistan",
//   "Korea, South",
//   "US",
//   "China",
// ];

const getCountries = (data: any): string[] => {
  return Array.from(
    new Set(data.map((d: any) => d["Country/Region"]))
  );
};

const countries: string[] = R.pipe(
  R.curry(fs.readFileSync)(R.__, "utf-8"),
  d3.csvParse,
  R.omit(["columns"]),
  Object.values,
  getCountries
)(`${file}/${casesFile}`);

countries.forEach((country) => {
  fs.writeFileSync(
    `${outputDir}/${country}-confirmed.json`,
    res(`${file}/${casesFile}`)(country)
  );
  fs.writeFileSync(
    `${outputDir}/${country}-recovered.json`,
    res(`${file}/${recoveredFile}`)(country)
  );
  fs.writeFileSync(
    `${outputDir}/${country}-deaths.json`,
    res(`${file}/${deadFile}`)(country)
  );
});
