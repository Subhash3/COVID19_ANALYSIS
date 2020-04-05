url = "https://api.covid19india.org/data.json"

async function getData(url){
    response = await fetch(url)
    data = await response.json()
    return data
}

generalise_data = (data) => {
    total_confirmed = []
    total_deaths = []
    total_recovered = []
    dates = []

    for(i = 0; i < data.length; i++){
        day = data[i]
        total_confirmed.push(parseInt(day["totalconfirmed"]))
        total_deaths.push(parseInt(day["totaldeceased"]))
        total_recovered.push(parseInt(day["totalrecovered"]))
        dates.push(day["date"])
    }

    generalised = {
        "totalConfirmedCases": total_confirmed,
        "totalDeaths": total_deaths,
        "totalRecoveredCases": total_recovered,
        "dates": dates
    }

    return generalised
}

prepareXlabels = (data) => {
    xlabels = []
    for(i = 0; i < data.length; i++){
        xlabels.push(i+1)
    }
    return xlabels
}

drawGraph = (data) => {
    canvas = document.getElementById("graph")
    var ctx = canvas.getContext('2d');

    confimredDataset = {
        label: '# of Confirmed Cases',
        data: data["totalConfirmedCases"],
        backgroundColor: 
          'rgba(54, 162, 235, 0.2)',
          borderColor:
              'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          fill: false
      }
    
      deathsDataset = {
        label: "#of deaths",
        data: data["totalDeaths"],
        backgroundColor:
          'rgba(255, 9, 12, 0.2)',
        borderColor:
            'rgba(255, 9, 12, 1)',
        borderWidth: 1,
        fill: false
      }
    
      recoveredDataset = {
        label: "#of recovered Cases",
        data: data["totalRecoveredCases"],
        backgroundColor:
            'rgba(0, 170, 0, 0.2)',
        borderColor:
            'rgba(0, 175, 0, 1)',
        borderWidth: 1,
        fill: false
      }

      graph = new Graph(ctx, 'bar')

      graph.setLabels(data["dates"])
      graph.addDataset(confimredDataset)
      graph.addDataset(deathsDataset)
      graph.addDataset(recoveredDataset)
      // graph.show()
      var myChart = graph.plot()
      myChart.canvas.parentNode.style.height = '680px';
      myChart.canvas.parentNode.style.width = '1240px';
}

dataPromise = getData(url)
dataPromise.then(data => {
    time_series = data['cases_time_series']

    time_series = generalise_data(time_series)
    // console.log(time_series, xlabels)
    drawGraph(time_series)
    // statewise_data = data['statewise']
    // tested_data = data['tested']
}).catch(err => {
    console.log(err)
})