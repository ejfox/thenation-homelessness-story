<template>
  <div>
    <div id="map-container" ref="mapContainer" class="w-50 vh-100 fl"></div>
    <div id="map-info" ref="mapInfo" class="w-50 vh-100 fl">
      <div class="pa3">
        <!-- <h2 class="f3 fw4 mt0 mb3">Map tour</h2> -->
        <!-- <p class="lh-copy measure mt0">
          This is a map tour. It's a map with a bunch of points on it. Click on a point to see more information about it.
        </p> -->
        <p v-if="activeCity">
          <CityReportCard :city-name="activeCity.name" :key="activeCity.name" />

          <!-- <span v-if="prevCity" class="">
            <button class="w-50 dib f3 bg-white pa3 ba b--gray br3" @click="setActiveCity(prevCity)">Back: {{prevCity.name}}</button>
          </span>
          <span v-if="nextCity">
            <button class="w-50 dib f3 bg-white pa3 ba b--gray br3" @click="setActiveCity(nextCity)">Next: {{nextCity.name}}</button>
          </span> -->

          <!-- refactor so that buttons have an internal span for spacing between buttons -->
          <span v-if="prevCity" class="w-50 dib">
            <button class="w-100 dib f3 bg-white pa3 bn" @click="setActiveCity(prevCity)">
              <span class="pa1 ba b--gray db">Back: {{prevCity.name}}</span>
            </button>
          </span>

          <span v-if="nextCity" class="w-50 dib">
            <button class="w-100 dib f3 bg-white pa3 bn" @click="setActiveCity(nextCity)">
              <span class="pa1 ba b--gray db">Next: {{nextCity.name}}</span>
            </button>
          </span>

        </p>
      </div>
    </div>
  </div>
</template>
<script setup>
// import mapboxgl from 'mapbox-gl';
// import 'mapbox-gl/dist/mapbox-gl.css';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { csvParse, scaleLinear } from 'd3'
const mapContainer = ref(null);
const map = ref(null)
const cities = ref(null)

const activeCity = ref(null)

const activeCityIndex = computed(() => {
  if (activeCity.value) {
    return cities.value.findIndex((city) => city.name === activeCity.value.name)
  }
})

const prevCity = computed(() => {
  if (activeCityIndex.value > 0) {
    return cities.value[activeCityIndex.value - 1]
  }
})

const nextCity = computed(() => {
  if (activeCityIndex.value < cities.value.length - 1) {
    return cities.value[activeCityIndex.value + 1]
  }
})

function setActiveCity(city) {
  activeCity.value = city
  map.value.flyTo({
    center: [city.lon, city.lat],
    zoom: 7
  })
}

// set up mapbox gl map
onMounted(() => {
  map.value = new maplibregl.Map({
    container: mapContainer.value,
    style: `https://api.maptiler.com/maps/streets-v2/style.json?key=r7rxV4ywyVD4sm1dYKUl`,    // centered on a full view of the US
    center: [-98.5795, 39.8283],
    zoom: 3,
    // accessToken:
          // 'pk.eyJ1IjoiZWpmb3giLCJhIjoiY2lyZjd0bXltMDA4b2dma3JzNnA0ajh1bSJ9.iCmlE7gmJubz2RtL4RFzIw',
  });
  
  // load cities from cities.csv file
  fetch('/cities.csv')
    .then((response) => response.text())
    .then((data) => {
      cities.value = csvParse(data);
      console.log(cities.value);

      // set active city to first city
      activeCity.value = cities.value[0]

      // set up murders scale
      const murdersScale = scaleLinear()
        .domain([0,100])
        .range([10, 172])

      // draw a red circle for every city, and when it is clicked, make it the activeCity
      cities.value.forEach((city) => {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundColor = 'red'
        // el.style.width = '20px';
        // el.style.height = '20px';

        // use our murdersScale to set the area of the marker
        el.style.width = murdersScale(city["2021"]) + 'px';
        el.style.height = murdersScale(city["2021"]) + 'px';
        el.style.cursor = 'pointer';
        el.addEventListener('click', () => {
          activeCity.value = city;
        });
        new maplibregl.Marker(el)
          .setLngLat([city.lon, city.lat])
          .addTo(map.value);
      });
    });
});
</script>

<style>
#map-container {
}
</style>