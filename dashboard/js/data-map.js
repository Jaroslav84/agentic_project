/* data-map.js — Shared interactive US state map for JobSiteLink data pages
 *
 * Usage:
 *   createDataMap({
 *     elementId: 'map',
 *     data: MY_DATA_ARRAY,
 *     stateField: 'state',           // CSV field containing state abbreviation
 *     statsFn: function(rows) { ... }, // compute per-state summary object
 *     infoFn: function(abbr, stats) { ... }, // return HTML for hover info box
 *     colorFn: function(stats) { ... },      // return hex color string
 *     onStateClick: function(abbr) { ... }   // optional: called on click
 *   });
 */

var ABBR_TO_FIPS = {AL:'01',AK:'02',AZ:'04',AR:'05',CA:'06',CO:'08',CT:'09',DE:'10',DC:'11',FL:'12',GA:'13',HI:'15',ID:'16',IL:'17',IN:'18',IA:'19',KS:'20',KY:'21',LA:'22',ME:'23',MD:'24',MA:'25',MI:'26',MN:'27',MS:'28',MO:'29',MT:'30',NE:'31',NV:'32',NH:'33',NJ:'34',NM:'35',NY:'36',NC:'37',ND:'38',OH:'39',OK:'40',OR:'41',PA:'42',RI:'44',SC:'45',SD:'46',TN:'47',TX:'48',UT:'49',VT:'50',VA:'51',WA:'53',WV:'54',WI:'55',WY:'56'};
var FIPS_TO_ABBR = {};
Object.keys(ABBR_TO_FIPS).forEach(function(k){ FIPS_TO_ABBR[ABBR_TO_FIPS[k]] = k; });

var ABBR_TO_NAME = {AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',CO:'Colorado',CT:'Connecticut',DE:'Delaware',DC:'District of Columbia',FL:'Florida',GA:'Georgia',HI:'Hawaii',ID:'Idaho',IL:'Illinois',IN:'Indiana',IA:'Iowa',KS:'Kansas',KY:'Kentucky',LA:'Louisiana',ME:'Maine',MD:'Maryland',MA:'Massachusetts',MI:'Michigan',MN:'Minnesota',MS:'Mississippi',MO:'Missouri',MT:'Montana',NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',NJ:'New Jersey',NM:'New Mexico',NY:'New York',NC:'North Carolina',ND:'North Dakota',OH:'Ohio',OK:'Oklahoma',OR:'Oregon',PA:'Pennsylvania',RI:'Rhode Island',SC:'South Carolina',SD:'South Dakota',TN:'Tennessee',TX:'Texas',UT:'Utah',VT:'Vermont',VA:'Virginia',WA:'Washington',WV:'West Virginia',WI:'Wisconsin',WY:'Wyoming'};

/* Minimal TopoJSON to GeoJSON converter (no external dependency) */
function topoToGeo(topology, objectName) {
  var obj = topology.objects[objectName];
  var arcs = topology.arcs;
  var transform = topology.transform;

  function decodeArc(arcIdx) {
    var arc = arcs[arcIdx < 0 ? ~arcIdx : arcIdx];
    var coords = [];
    var x = 0, y = 0;
    arc.forEach(function(p) {
      x += p[0]; y += p[1];
      coords.push([
        transform ? x * transform.scale[0] + transform.translate[0] : p[0],
        transform ? y * transform.scale[1] + transform.translate[1] : p[1]
      ]);
    });
    if (arcIdx < 0) coords.reverse();
    return coords;
  }

  function decodeRing(indices) {
    var coords = [];
    indices.forEach(function(idx) {
      var arc = decodeArc(idx);
      if (coords.length > 0) arc = arc.slice(1);
      coords = coords.concat(arc);
    });
    return coords;
  }

  var features = obj.geometries.map(function(geom) {
    var coordinates;
    if (geom.type === 'Polygon') {
      coordinates = geom.arcs.map(decodeRing);
    } else if (geom.type === 'MultiPolygon') {
      coordinates = geom.arcs.map(function(polygon) {
        return polygon.map(decodeRing);
      });
    } else {
      coordinates = [];
    }
    var fips = String(geom.id).padStart(2, '0');
    var abbr = FIPS_TO_ABBR[fips] || '';
    return {
      type: 'Feature',
      properties: Object.assign({}, geom.properties || {}, { _abbr: abbr, _fips: fips }),
      geometry: { type: geom.type, coordinates: coordinates }
    };
  });

  return { type: 'FeatureCollection', features: features };
}

function createDataMap(cfg) {
  var stateStats = {};

  /* Build per-state stats from data */
  cfg.data.forEach(function(row) {
    var abbr = (row[cfg.stateField] || '').trim();
    if (!abbr || !ABBR_TO_NAME[abbr]) return;
    if (!stateStats[abbr]) stateStats[abbr] = { rows: [] };
    stateStats[abbr].rows.push(row);
  });

  /* Let caller compute summary stats per state */
  Object.keys(stateStats).forEach(function(abbr) {
    var summary = cfg.statsFn ? cfg.statsFn(stateStats[abbr].rows, abbr) : {};
    stateStats[abbr] = Object.assign(summary, { count: stateStats[abbr].rows.length });
  });

  function getColor(abbr) {
    var s = stateStats[abbr];
    if (!s) return 'rgba(255,255,255,0.04)';
    if (cfg.colorFn) return cfg.colorFn(s);
    if (s.count >= 20) return '#72d648';
    if (s.count >= 10) return '#4a7ab5';
    if (s.count >= 5) return '#d98a1e';
    return '#ff6a1a';
  }

  function getColorAlpha(abbr, hover) {
    var s = stateStats[abbr];
    if (!s) return hover ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)';
    var base = getColor(abbr);
    if (base.charAt(0) !== '#') return base;
    var r = parseInt(base.slice(1,3),16);
    var g = parseInt(base.slice(3,5),16);
    var b = parseInt(base.slice(5,7),16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + (hover ? 0.55 : 0.30) + ')';
  }

  /* Create Leaflet map */
  var mapEl = L.map(cfg.elementId, {
    center: [39.5, -98.5],
    zoom: 4,
    minZoom: 3,
    maxZoom: 8,
    zoomControl: true,
    scrollWheelZoom: true
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(mapEl);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd',
    maxZoom: 19,
    pane: 'overlayPane'
  }).addTo(mapEl);

  /* Info box element */
  var infoEl = document.getElementById(cfg.elementId + 'Info');
  var selectedState = null;
  var geoLayer = null;

  function showInfo(abbr) {
    if (!infoEl || !cfg.infoFn) return;
    var s = stateStats[abbr];
    var name = ABBR_TO_NAME[abbr] || abbr;
    infoEl.innerHTML = cfg.infoFn(abbr, s, name);
    infoEl.classList.add('visible');
  }

  function hideInfo() {
    if (infoEl) infoEl.classList.remove('visible');
  }

  function updateStyles() {
    if (!geoLayer) return;
    geoLayer.eachLayer(function(layer) {
      var abbr = layer.feature.properties._abbr;
      var isSelected = abbr === selectedState;
      layer.setStyle({
        fillColor: isSelected ? getColor(abbr) : getColorAlpha(abbr, false),
        fillOpacity: isSelected ? 0.7 : (stateStats[abbr] ? 0.5 : 0.15),
        weight: isSelected ? 2.5 : 1,
        color: isSelected ? getColor(abbr) : 'rgba(255,255,255,0.15)'
      });
      if (isSelected) layer.bringToFront();
    });
  }

  function renderGeoLayer(geojson) {
    geoLayer = L.geoJSON(geojson, {
      style: function(feature) {
        var abbr = feature.properties._abbr;
        var hasData = !!stateStats[abbr];
        return {
          fillColor: getColorAlpha(abbr, false),
          fillOpacity: hasData ? 0.5 : 0.15,
          weight: 1,
          color: 'rgba(255,255,255,0.15)',
          dashArray: hasData ? '' : '3,3'
        };
      },
      onEachFeature: function(feature, layer) {
        var abbr = feature.properties._abbr;
        if (!abbr) return;

        layer.on('mouseover', function(e) {
          if (abbr !== selectedState) {
            e.target.setStyle({
              fillColor: getColorAlpha(abbr, true),
              fillOpacity: 0.65,
              weight: 2,
              color: getColor(abbr)
            });
            e.target.bringToFront();
          }
          showInfo(abbr);
        });

        layer.on('mouseout', function(e) {
          if (abbr !== selectedState) {
            geoLayer.resetStyle(e.target);
          }
          hideInfo();
        });

        layer.on('click', function(e) {
          if (selectedState === abbr) {
            selectedState = null;
            mapEl.flyTo([39.5, -98.5], 4, {duration: 0.6});
          } else {
            selectedState = abbr;
            mapEl.flyToBounds(e.target.getBounds().pad(0.1), {duration: 0.6, maxZoom: 6});
          }
          updateStyles();
          if (cfg.onStateClick) cfg.onStateClick(selectedState);
        });
      }
    }).addTo(mapEl);
  }

  /* Load TopoJSON and render */
  fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json')
    .then(function(r){ return r.json(); })
    .then(function(topo) {
      renderGeoLayer(topoToGeo(topo, 'states'));
    })
    .catch(function(err) {
      console.warn('TopoJSON load failed, trying GeoJSON fallback:', err);
      fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json')
        .then(function(r){ return r.json(); })
        .then(function(geo) {
          var nameToAbbr = {};
          Object.keys(ABBR_TO_NAME).forEach(function(a){ nameToAbbr[ABBR_TO_NAME[a]] = a; });
          geo.features.forEach(function(f) {
            f.properties._abbr = nameToAbbr[f.properties.name] || '';
          });
          renderGeoLayer(geo);
        })
        .catch(function(err2) {
          console.error('Failed to load US states geometry:', err2);
        });
    });

  return { map: mapEl, stateStats: stateStats };
}
