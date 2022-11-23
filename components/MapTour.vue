<template>
  <div>
    <div id="map-container" ref="mapContainer" class="w-two-thirds vh-100 fl"></div>
    <div id="map-info" ref="mapInfo" class="w-third vh-100 fl">
      <div class="pa3">
        <!-- <h2 class="f3 fw4 mt0 mb3">Map tour</h2> -->
        <!-- <p class="lh-copy measure mt0">
          This is a map tour. It's a map with a bunch of points on it. Click on a point to see more information about it.
        </p> -->
        <p v-if="activeCity">
          <CityReportCard :city-name="activeCity.name" :key="activeCity.name" />

          <!-- show the names of the next and previous cities, if clicked, set that city to the activeCity -->
          <span v-if="prevCity">
            <button class="w-50 dib" @click="setActiveCity(prevCity)">⬅️ {{prevCity.name}}</button>
          </span>
          <span v-if="nextCity">
            <button class="w-50 dib" @click="setActiveCity(nextCity)">{{nextCity.name}} ➡️</button>
          </span>
        </p>
      </div>
    </div>
  </div>
</template>
<script setup>
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { csvParse } from 'd3'
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
    zoom: 10
  })
}

// set up mapbox gl map
onMounted(() => {
  map.value = new mapboxgl.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/mapbox/streets-v11',
    // centered on a full view of the US
    center: [-98.5795, 39.8283],
    zoom: 3,
    accessToken:
          'pk.eyJ1IjoiZWpmb3giLCJhIjoiY2lyZjd0bXltMDA4b2dma3JzNnA0ajh1bSJ9.iCmlE7gmJubz2RtL4RFzIw',
  });
  
  // load cities from cities.csv file
  fetch('/cities.csv')
    .then((response) => response.text())
    .then((data) => {
      cities.value = csvParse(data);
      console.log(cities.value);

      // set active city to first city
      activeCity.value = cities.value[0]

      // draw a red circle for every city, and when it is clicked, make it the activeCity
      cities.value.forEach((city) => {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundColor = 'red'
        el.style.width = '20px';
        el.style.height = '20px';
        el.style.cursor = 'pointer';
        el.addEventListener('click', () => {
          activeCity.value = city;
        });
        new mapboxgl.Marker(el)
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