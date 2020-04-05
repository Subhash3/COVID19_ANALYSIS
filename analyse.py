#!/usr/bin/python3

import requests
from matplotlib import pyplot as plt
from random import randint

class Country() :
    def __init__(self, name) :
        self.confirmed = list()
        self.deaths = list()
        self.recovered = list()
        self.name = name
        r = hex(randint(0, 255))[2:]
        g = hex(randint(0, 255))[2:]
        b = hex(randint(0, 255))[2:]
        if len(r) == 1 :
            r = '0' + r
        if len(g) == 1 :
            g = '0' + g
        if len(b) == 1 :
            b = '0' + b
            
        self.color = '#' + r+g+b


URL = "https://raw.githubusercontent.com/pomber/covid19/master/docs/timeseries.json"
response = requests.get(URL)
data = response.json()

# countries_names = ["India", "China", "Italy", "Korea, South"]
countries_names = data.keys()

countries = list()
dates = list()

for name in countries_names :
    countries.append(Country(name))

for country in countries :
    countryData = data[country.name]
    for day in countryData :
        country.confirmed.append(int(day["confirmed"]))
        country.deaths.append(int(day["deaths"]))
        country.recovered.append(int(day["recovered"]))

for i in range(len(countries[0].confirmed)) :
    dates.append("Day"+str(i+1))

for i in range(len(countries)) :
    country = countries[i]
    label = country.name
    # plt.figure(i+1)
    plt.plot(dates, country.confirmed, c=country.color, label=label)
    # plt.legend()
plt.show()