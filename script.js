let DATASET_URL = "https://raw.githubusercontent.com/pomber/covid19/master/docs/timeseries.json"

async function retreiveData(){
  console.log("Retrieving Data from " + DATASET_URL)
  try{
    response = await fetch(DATASET_URL)
  }
  catch(error){
    console.error("Error Occurred" +error)

    body = document.getElementsByTagName("body")[0]
    errorMessage = document.createElement("p")
    errorMessage.classList.add("pending")
    console.log("Couldn't Fetch Data. Make sure you have proper internet connection")
    errorMessage.innerText = "Couldn't Fetch Data. Make sure you have proper internet connection"
    body.appendChild(errorMessage)
  }
  jsonFormat = await response.json()

  return jsonFormat  
}

function clearCountries(){
  try{
    allCountriesInfoContainer = document.getElementById("allCountriesInfoContainer");
    while(allCountriesInfoContainer.hasChildNodes){
      allCountriesInfoContainer.removeChild(allCountriesInfoContainer.firstChild)
    }
  }catch(error){
    // console.error(error)
  }
}

function renderCountries(data){
  clearCountries()
  countriesPerRow = 2
  countriesRederedSoFar = 0
  allCountriesInfoContainer = document.getElementById("allCountriesInfoContainer");

  for(country in data){
    totalCases = totalConfirmedCases(country, data)
    deaths = totalDeaths(country, data)
    recoveredCases = totalRecoveredCases(country, data)

    countryElement = document.createElement("div")
    countryElement.classList.add("country")

    countryElementHTMLInfo = `
      <div class="info">
          <span class="name">${country}</span>
          <!-- <span class="code">(CN)</span> -->
          <!-- <img src="" alt="" class="flag"> -->
      </div>
      <div class="coronaInfo">
          <!-- <div class="date">
              <label>Date</label>
              <span class="value">01-03-2020</span>
          </div> -->
          <div class="confirmed">
              <span class="value">${totalCases}</span>
              <label>Total Confirmed Cases</label>
          </div>
          <div class="deaths">
              <span class="value">${deaths}</span>
              <label>Total Deaths</label>
          </div>
          <div class="recovered">
              <span class="value">${recoveredCases}</span>
              <label>Total Recovered Cases</label>
          </div>
          <div class="active">
              <span class="value">${totalCases - recoveredCases - deaths}</span>
              <label>Active Cases</label>
          </div>
      </div>
      `
      canvas = document.createElement('canvas')
      canvas.id = "graph"
      canvas.style.display = "none"
      canvas.setAttribute("width", 500)
      canvas.setAttribute("height", 250)

      drawGraph(canvas, country, data)

      button = document.createElement("button")
      button.classList.add("show-graph-btn")
      button.innerText = "Graphs"
      
      countryElement.innerHTML = countryElementHTMLInfo
      countryElement.appendChild(button)
      countryElement.appendChild(canvas)
      // rowElement.appendChild(countryElement)
      allCountriesInfoContainer.appendChild(countryElement)
      
      countriesRederedSoFar++
    }
    addButtonEventListeners()
}

function totalConfirmedCases(country, data){
  countryInfo = data[country]
  len = countryInfo.length
  total = parseInt(countryInfo[len-1].confirmed)

  return total
}

function totalDeaths(country, data){
  countryInfo = data[country]
  len = countryInfo.length
  total = parseInt(countryInfo[len-1].deaths)

  return total
}

function totalRecoveredCases(country, data){
  countryInfo = data[country]
  len = countryInfo.length
  total = parseInt(countryInfo[len-1].recovered)

  return total
}

function addButtonEventListeners(){
  toggleGraphButtons = document.getElementsByClassName("show-graph-btn")
  for(i = 0; i < toggleGraphButtons.length; i++){
    toggleGraphButtons[i].addEventListener("click", displayGraph)
  }
}

function fadeOut(element) {
  var op = 1;  // initial opacity
  var timer = setInterval(function () {
      if (op <= 0.1){
          clearInterval(timer);
          element.style.display = 'none';
      }
      element.style.opacity = op;
      element.style.filter = 'alpha(opacity=' + op + ")";
      op -= 0.1;
  }, 50);
}

function fadeIn(element) {
  var op = 0;  // initial opacity
  var timer = setInterval(function () {
      if (op >= 0.9){
          clearInterval(timer);
          element.style.display = 'block';
      }
      element.style.opacity = op;
      element.style.filter = 'alpha(opacity=' + op + ")";
      op += 0.1;
  }, 50);
}

function displayGraph(event){
  button = event.target
  country = button.parentElement
  // console.log(country.children)
  if(country.children.length == 4){
    canvas = country.children[3]
  }else{
    canvas = country.children[4]
  }
  if(canvas.style.display == "block"){
    canvas.style.display = 'none';
  }else{
    canvas.style.display = 'block';
  }
}

function drawGraph(canvas, country, data){
  var dates = []
  var confirmedCases = []
  var deaths = []
  var recoveredCases = []

  countryInfo = data[country]
  for(i = 0; i < countryInfo.length; i++){
    day = countryInfo[i]
    dates.push(day.date)
    confirmedCases.push(parseInt(day.confirmed))
    deaths.push(parseInt(day.deaths))
    recoveredCases.push(parseInt(day.recovered))
  }

  var ctx = canvas.getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: dates,
        datasets: [{
            label: '# of Confirmed Cases',
            data: confirmedCases,
            backgroundColor: [
              'rgba(54, 162, 235, 0.2)',
          ],
          borderColor: [
              'rgba(54, 162, 235, 1)',
          ],
          borderWidth: 1,
          fill: false
        },
        {
          label: "#of deaths",
          data: deaths,
          backgroundColor: [
            'rgba(255, 9, 12, 0.2)',
          ],
          borderColor: [
              'rgba(255, 9, 12, 1)',
          ],
          borderWidth: 1,
          fill: false
        },
        {
          label: "#of recovered Cases",
          data: recoveredCases,
          backgroundColor: [
              'rgba(0, 170, 0, 0.2)',
          ],
          borderColor: [
              'rgba(0, 175, 0, 1)',
          ],
          borderWidth: 1,
          fill: false
        }
      ]
    }
  })
}

function ready(){  
  retreiveData().catch((err) => {
    // console.log("Error Occured")
    // console.error(err)
  }).then((jsonFormat) => {
    // console.log(jsonFormat)
    renderCountries(jsonFormat)
    searchBarInput = document.getElementById('search_bar_input')
  
    searchBarInput.addEventListener('keyup', (event) => {
      keyword = event.target.value.toLowerCase()
      if(keyword == ""){
        renderCountries(jsonFormat)
      }
      matchedCountries = []
      for(country in jsonFormat){
        if(country.toLowerCase().includes(keyword)){
          matchedCountries.push(country)
        }
      }
      
      // console.log(matchedCountries)
      filteredData = {}
      for(index in matchedCountries){
        country = matchedCountries[index]
        filteredData[country] = jsonFormat[country]
      }
  
      // console.log(filteredData)
  
      renderCountries(filteredData)
  
      if(matchedCountries.length == 0){
        allCountriesInfoContainer = document.getElementById("allCountriesInfoContainer")
        errorMessage = document.createElement("p")
        errorMessage.classList.add("danger")
        errorMessage.classList.add("no-search-results")
        console.log("No search results found for the keyword " + keyword)
        errorMessage.innerText = "No search results found for the keyword " + keyword
        allCountriesInfoContainer.appendChild(errorMessage)
      }
    })
  
  
  }).catch((error) => {
    console.log("Error occured while retriving data")
    console.error(error)
  })
}

document.addEventListener("DOMContentLoaded", ready)