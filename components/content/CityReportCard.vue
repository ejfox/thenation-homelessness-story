<template>
  <div>
    <Transition 
      name="city"
    >
  <div v-if="city" class="ma0 pa0 sans-serif f3">
    <h1 class="ma0 pa0">{{ city.name }}</h1>

    <!-- <pre class="f6 bg-light-gray dark-gray overflow-hidden">{{ city }}</pre> -->
    <div ref="chart" id="chart" v-html="chartHTML"></div>

    <div v-if="city['2021']">
      <h2 class="ma0 pa0">2021 Murders: {{ city['2021'] }}</h2>

      <p>

      </p>
      <p>
        <strong>Source:</strong> {{ city['Data Source'] }}
      </p>

      
    </div>
  </div>
  </Transition>
</div>
</template>
<script setup>
// import anime.js
import anime from 'animejs/lib/anime.es.js'

import { csvParse } from 'd3'
import * as Plot from '@observablehq/plot'
const props = defineProps({
  cityName: String
})

const cities = ref(null)
const city = ref(null)
const chart = ref(null)


function makePlotLineGraph(city, targetContainerId) {

  // make an array of availalbe years, 2010-2021
  const years = Array.from({ length: 12 }, (v, i) => i + 2010)

  // go through the years in the city obj and add them to an array
  const cityYears = []
  years.forEach((year) => {
    if (city[year]) {
      cityYears.push({
        year: year,
        murders: +city[year]
      })
    }
  })

  const chartPlot = Plot.plot({
    // width: 500,
    // height: 500,
    // 
    marks: [
      Plot.line(cityYears, {
        x: "year",
        y: "murders"
      }),
      Plot.dot(cityYears, {
        y: "murders",
        x: "year",
        // stroke: "murders",
        r: 12,
        fill: "white",
        stroke: "black"
      }),
      Plot.text(cityYears, {
        y: "murders",
        x: "year",
        // stroke: "murders",
        text: "murders"
      })
    ]

  })

  return chartPlot
}

const chartHTML = computed(() => {
  if (city.value) {
    // If we have a city, make a chart
    return makePlotLineGraph(city.value, 'chart').outerHTML

  } else {
    // Otherwise, return an empty div
    return '<div></div>'
  }

})

onMounted(() => {
  // load cities from cities.csv file
  fetch('/cities.csv')
    .then((response) => response.text())
    .then((data) => {
      cities.value = csvParse(data);
      city.value = cities.value.find((city) => city.name === props.cityName);
    });

  watch(city, () => {
    if (city.value) {
      makePlotLineGraph(city.value, 'chart')
    }
  }, { immediate: true })
})


</script>
<style>
#chart {
  width: 100%;
  /* height: 500px; */
  /* width: auto; */
}


/* set up city transition animations */
.city-enter-active, .city-leave-active {
  transition: all 10s;
}

.city-enter, .city-leave-to {
  opacity: 0;
  transform: translateX(-100vw);
}

.city-leave-active {
  position: absolute;
}

.city-enter-active {
  position: relative;
}


</style>