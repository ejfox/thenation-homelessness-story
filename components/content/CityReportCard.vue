<template>
  <div v-if="city" class="ma0 pa0">
    <h1 class="ma0 pa0">Info about {{ city.name }}</h1>
    <h2>2021 Murders</h2>
    <!-- {{city}} -->
    <p>
      {{city['2021']}}
    </p>
    <p>
      {{city['Data Source']}}
    </p>
  </div>
</template>
<script setup>
import { csvParse } from 'd3'
const props = defineProps({
  cityName: String
})

const cities = ref(null)
const city = ref(null)

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
})


</script>