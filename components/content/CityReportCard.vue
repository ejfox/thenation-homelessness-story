<template>
  <div v-if="city" class="ma0 pa0 sans-serif f3">
    <h1 class="ma0 pa0">{{ city.name }}</h1>
    
    <pre class="f6 bg-light-gray dark-gray overflow-hidden">{{city}}</pre>

    <div v-if="city['2021']">
    <h2       
    class="ma0 pa0">2021 Murders: {{city['2021']}}</h2>
    
    <p>
      
    </p>
    <p>
      {{city['Data Source']}}
    </p>

    <div ref="chart"></div>
    </div>
  </div>
</template>
<script setup>
import { csvParse } from 'd3'
import * as Plot from '@observablehq/plot'
const props = defineProps({
  cityName: String
})

const cities = ref(null)
const city = ref(null)
const chart = ref(null)

function makePlotLineGraph(city, targetContainerId) {
  const chartPlot = Plot.plot({
    width: 500,
    height: 500,
  style: {
    background: "black",
    color: "white"
  }
})

  // chart.value.appendChild(chartPlot); // This does not work
}

onMounted(() => {
  // load cities from cities.csv file
  fetch('/cities.csv')
    .then((response) => response.text())
    .then((data) => {
      cities.value = csvParse(data);
      console.log(cities.value);
      city.value = cities.value.find((city) => city.name === props.cityName);
      console.log(city.value);
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
  border: 2px solid red;
  height: 500px;
  width: auto;
}
</style>