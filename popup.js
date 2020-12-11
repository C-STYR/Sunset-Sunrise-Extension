
'use strict';

function click(e) {
  chrome.tabs.executeScript(null,
    { code: "document.body.style.backgroundColor='" + e.target.id + "'" });
  window.close();
}

document.addEventListener('DOMContentLoaded', function () {
  var divs = document.querySelectorAll('div');
  for (var i = 0; i < divs.length; i++) {
    divs[i].addEventListener('click', click);
  }
});

let lat = 0, lon = 0;
const timesObj = {};
let today = new Date();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
let yyyy = today.getFullYear();
var date = new Date(); 
var offset = (date.getTimezoneOffset() / 60); //the offset in hours

today = yyyy + '-' + mm + '-' + dd;
let tomorrow = yyyy + '-' + mm + '-' + (+dd + 1)





const setLocation = (locationStr) => {
  document.getElementById('location').innerHTML = locationStr;
}

const updateSunrise = (time) => {
  document.getElementById('sunriseTime').innerHTML = time;
}

const updateSunset = (time) => {
  document.getElementById('sunsetTime').innerHTML = time;
}

const toggleContainer = () => {
  const loadingContainer = document.getElementById('loading-container');
  const scheduleContainer = document.getElementById('schedule');
  if(loadingContainer.className === 'loading-container') {
    loadingContainer.className = 'hidden';
    scheduleContainer.className = 'schedules';
  } else {
    loadingContainer.className = 'loading-container';
    scheduleContainer.className = 'hidden';
  }
}


if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((pos) => {

    const { latitude, longitude } = pos.coords;

    let sunsetUrl = `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}`

    fetch(sunsetUrl)
      .then(response => response.json())
      .then(data => {
        let { sunset } = data.results
        sunset = sunset.split(':');
        let hours = sunset[0] - offset;
        let minutes = sunset[1];
        sunset = hours + ':' + minutes + ' PM';
        timesObj.sunset = sunset;
      })

    let sunriseUrl = `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=${tomorrow}`

    fetch(sunriseUrl)
      .then(response => response.json())
      .then(data => {
        let { sunrise } = data.results
        sunrise = sunrise.split(':');
        let hours = sunrise[0] - offset + 12;
        let minutes = sunrise[1];
        sunrise = hours + ':' + minutes + ' AM';
        timesObj.sunrise = sunrise;
        updateSunset(timesObj.sunset)
        updateSunrise(timesObj.sunrise)
        toggleContainer();
      })

  })
} else {
  console.error('There was an error getting your location. Check Chrome privacy settings or your computer\'s privacy settings')
}








// MVP

// UI
// Sunrise Times [id]
// Sunset Times [id]
// If it's already sunset, show sunrise for the following day

// JS
// We need to get our geolocation through geolocation API or IP address API
// (lat, long) to get sunrise/sunset times

// Extensions
// Input to search for different location
// Sunrise/Sunset for a different day

// Notes
// Fix the our timezone and offset
// (opt:) Clean up our callbacks
// "Graceful" loading from the point of opening the extension popup and loading in data
// (opt:) In terms of loading time from our APIs, getting our geolocation takes the longest (1-2 seconds).
//     If we can save our location to local storage, we can cut down on loading time.