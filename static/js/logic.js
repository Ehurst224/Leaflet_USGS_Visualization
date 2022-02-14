// Read in Data
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson"

d3.json(url).then(function(data) {
    createFeatures(data.features)
});
// A function to return circle radius by its magnitude
function circleRadius(feature) {
    // return mag 2x values
    return feature.properties.mag * 2;
  }
  
function circleColor(depth) {
    //color by depth
    return depth <= 10 ? "#DAF7A6 ":
            depth <= 30 ? "#FFC300":
            depth <= 50 ? "#FF5733":
            depth <= 70 ? "#C70039":
            depth <= 90 ? "#900C3F":
                            "#00FFFF";
  }

function createFeatures(earthquakes) {
    //circle size by magnitude
    function circle(feature, latlng){
        var markers = {
            radius: circleRadius(feature),
            fillColor: circleColor(feature.geometry.coordinates[2]),
            color: "#000",
            weight: 1,
            opacity: 0.5,
            fillOpacity: 0.8
    };
    return L.circleMarker(latlng, markers);
}

  function onEachFeature(feature, layer) {
    // Bind popups for all earthquakes
    layer.bindPopup(
        "<h3>Location: " + feature.properties.place + "<h3> Magnitude: " + 
        feature.properties.mag +"<h3>Depth: " + feature.geometry.coordinates[2] + 
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>")
}

  var earthquakes = L.geoJSON(earthquakes, {
    pointToLayer: circle,
    onEachFeature: onEachFeature
  });

  // Send earthquakes layer to the createMap function
  createMap(earthquakes);
  
}

function createMap(earthQuakes) {

    console.log("createMap has been called!")

    // Create the tile layer that will be the background of our map.
    var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
  
    // Create a baseMaps object to hold the streetmap layer.
    var baseMaps = {
      "Street Map": streetmap
    };
  
    // Create an overlayMaps object to hold the earthquakes layer.
    var overlayMaps = {
      "Earthquakes": earthQuakes
    };
  
    // Create the map object with options.
    var map = L.map("map", {
        //LA lat.long
      center: [40.052235, -110.243683],
      zoom: 4.5,
    //   layers: [streetmap, earthQuakes]
      layers: [streetmap, earthQuakes]
    });
  
    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);

    var legend = L.control({
        position: 'bottomright'
      });
      legend.onAdd = function() {
        var div = L.DomUtil.create('div', 'info legend'),
          categories = [-10, 10, 30, 50, 70, 90],
          labels = [],
          from, to;
        for (var i = 0; i < categories.length; i++) {
          from = categories[i];
          to = categories[i + 1];
          labels.push(
            '<i style="background:' + circleColor(from + 1) + '">  .  .  </i> ' +
            from + (to ? '&ndash;' + to : '+'));
        }
        div.innerHTML = labels.join('<br>');
        return div;
      };
      legend.addTo(map);
    
  }
  

