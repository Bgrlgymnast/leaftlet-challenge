//initialize leaflet.js library and display it from "openstreetmap.org"
var map = L.map('map', {
    center: [38.67, -100.07], // set coordinates for map
    zoom: 5 //set zoom level
});

// create tile layer with "addTo" to add objects to the map
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}',
    { foo: 'bar', attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);


let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Get GeoJSON Data
d3.json(url).then(function (data) {
    //console.log(data);
    //createFeatures(data.features);

    //get markersize base in earthquake
    function markerSize(magnitude) {
        return magnitude * 3;
    };

    //get marker color based on earthquake size
    function chooseColor(depth) {
        if (depth > 90)
            return "#e34a33";
        else if (depth > 70)
            return "#fdbb84";
        else if (depth > 50)
            return "#feb24c";
        else if (depth > 30)
            return "#fec44f";
        else if (depth > 10)
            return "#d4e34f";
        else return "#75d417";
    };
    //create styleFunction
    function styleFunction(feature) {
        return {
            radius: markerSize(feature.properties.mag),
            fillColor: chooseColor(feature.geometry.coordinates[2]),
            fillOpacity: 0.8,
            weight: 0.5,
            color: "black"
        }
    }

    L.geoJSON(data, {
        //crate pointToLayer
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: styleFunction,
        //create onEachFeature
        onEachFeature: function (feature, layer) {
            //create bindPopup layer
            layer.bindPopup(
                "Magnitude: " + feature.properties.mag + "<br>Depth: " + feature.geometry.coordinates[2] + "<br>Location: " + feature.properties.place
            );
        }
    }).addTo(map);

    //create and positon legend
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function () {

        var div = L.DomUtil.create('div', 'info legend');
        grades = [-10, 10, 30, 50, 70, 90];
        colors = ["#75d417", "#d4e34f", "#fec44f", "#feb24c", "#fdbb84", "#e34a33"];


        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + (colors[i]) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    //Add legend to map.
    legend.addTo(map)

});









