// import mapboxgl from "/mapbox-gl"; // or "const mapboxgl = require('mapbox-gl');"

mapboxgl.accessToken =
  'pk.eyJ1Ijoic3VyeWFuc2htIiwiYSI6ImNreTVwcDVzcjBvN28ycG80YWprNW8zdWYifQ.VMPxhWCpnNs9Gk-fGHt8hQ';
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: [-74.5, 40], // starting position [lng, lat]
  zoom: 9, // starting zoom
});
