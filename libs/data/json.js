/*var data = fetch('/project1/libs/data/countryBorders.geo.json')
            .then(function(data) { 

        // do what you want to do with `data` here...
        data.properties.forEach(function(feature) {
                console.log(feature);
                var symbol = feature.properties['name'];
                console.log(symbol);
            });

});*/

async function loadCountries() { const response = await fetch('countryBorders.geo.json');
const data = await response.json();
 createCountryList(data.features[properties.name]);
} 
loadCountries();
console.log(properties.name);

// var json = json['features'].forEach(feature=> console.log(feature))

// name_of_countries = []
// your_geojson['features'].forEach(feature => name_of_countries.push(feature['properties']['name']))

// console.log(name_of_countries)

// const fillCountriesSelect = (dataFeatures) => {
//     divCountries = document.getElementById('countries')
//     select = "<select>"
//     dataFeatures.forEach(feature => {
//         select += feature['properties']['name']
//     })
//     select += "</select>"
//     divCountries.innerHTML = select
//};