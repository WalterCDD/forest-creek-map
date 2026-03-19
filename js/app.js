// Initialize map
var map = L.map('map').setView([27.55, -82.43], 15);

// Base layer
var base = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Layer holders
var parcelsLayer, irrigationLayer, amenitiesLayer, gatesLayer;

// =======================
// LOAD DATA
// =======================

function loadLayer(url, style, popupFunc, callback) {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      var layer = L.geoJSON(data, {
        style: style,
        onEachFeature: popupFunc
      });

      callback(layer);
    });
}

// Parcels
loadLayer('data/parcels.geojson',
  function () { return { color: "#3388ff", weight: 1 }; },
  function (feature, layer) {
    layer.bindPopup(
      "<b>Lot:</b> " + feature.properties.lot +
      "<br><b>Address:</b> " + feature.properties.address
    );
  },
  function (layer) {
    parcelsLayer = layer;
    parcelsLayer.addTo(map);
  }
);

// Irrigation
loadLayer('data/irrigation.geojson',
  function () { return { color: "green" }; },
  function (feature, layer) {
    layer.bindPopup("Zone: " + feature.properties.zone);
  },
  function (layer) {
    irrigationLayer = layer;
  }
);

// Amenities
loadLayer('data/amenities.geojson',
  null,
  function (feature, layer) {
    layer.bindPopup(feature.properties.name);
  },
  function (layer) {
    amenitiesLayer = layer;
    amenitiesLayer.addTo(map);
  }
);

// Gates
loadLayer('data/gates.geojson',
  null,
  function (feature, layer) {
    layer.bindPopup(feature.properties.name);
  },
  function (layer) {
    gatesLayer = layer;
  }
);

// =======================
// LAYER CONTROL
// =======================
setTimeout(function () {
  L.control.layers(null, {
    "Parcels": parcelsLayer,
    "Irrigation": irrigationLayer,
    "Amenities": amenitiesLayer,
    "Gates": gatesLayer
  }).addTo(map);
}, 1000);

// =======================
// SEARCH FUNCTION
// =======================
document.getElementById("searchBox").addEventListener("keyup", function (e) {
  var value = e.target.value.toLowerCase();

  parcelsLayer.eachLayer(function (layer) {
    var addr = layer.feature.properties.address.toLowerCase();
    var lot = layer.feature.properties.lot.toString();

    if (addr.includes(value) || lot.includes(value)) {
      layer.setStyle({ color: "red" });
      map.fitBounds(layer.getBounds());
    } else {
      layer.setStyle({ color: "#3388ff" });
    }
  });
});