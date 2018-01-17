function decode_metar(e) {

  console.clear()


  const results = document.querySelector(".results")
  const metar = this.value.split("=")[0].split("RMK")

  let mainMetarText = metar[0]
  const remarks = metar[1] || null

  let parsedMetar = [
      { name: "Metar Type",
        pattern: /(METAR)|(SPECI)/g,
        meanings: {0: "METAR", 1: "SPECIAL"},
        parser: {0: null, 1: null},
        match: []
      },
      { name: "Airport Code",
        pattern: /([A-Z]{3,4})/g,
        meanings: {0: ""},
        parser: {0: parseAirportCode},
        match: []
      },
      { name: "Date",
        pattern: /(\d{6}Z)( AUTO)?( [A-Z]{2}([A-Z]))?/,
        meanings: {0: "Update Time", 1: "Automatic Station Indicator", 2: "Correction Indicator"},
        parser: {0: humanizeTime, 1: null, 2: null},
        match: []
      },
      { name: "Wind",
        pattern: /(\d{3}|VRB)(\d{1,2})G?(\d{1,2})KT/g,   //((\d{3})|(VRB))(\d{1,2})G?(\d{1,2})KT/g,
        meanings: {0: "Wind Direction", 1: "Variable", 2: "Wind Speed", 3: "Gust"},
        parser: {0: addDegrees, 1: null, 2: addKnots, 3: addKnots},
        match: []
      },
      { name: "Wind Variability",
        pattern: /(\d{3})V(\d{3})/g,
        meanings: {1: "Wind Direction", 2: "Variable Wind Direction"},
        parser: {1: addDegrees, 2: addDegrees},
        match: []
      },
      { name: "Prevailing Visibility",
        pattern: /(\d{1,2})?\/?(\d{1,2})SM/g,
        meanings: {1: "Visibility", 2: "Visibility"},
        parser: {1: addDistance, 2: addDistance},
        match: []
      },
      { name: "Runway Visibility",
        pattern: /(R\d{1,2}[CLR]?)\/(\d{4})FT(\/([DUN]))?/g,
        meanings: {1: "Runway", 2: "Visual Range", 3: "Trending"},
        parser: {1: null, 2: addDistance, 3: addTrend},
        match: []
      },
      { name: "Weather Description",
        pattern: /(-|\+|VC)?(MI|BC|PR|DR|BL|SH|TS|FZ)?(DZ|RA|SN|SG|IC|PL|GR|GS|UP)?(BR|FG|FU|VA|DU|SA|HZ)?(PO|SQ|\+?FC|\+?SS|\+?DS)?/g,
        meanings: {1: "Intensity", 2: "Descriptor", 3: "Precipitation", 4: "Obscuration", 5: "Other"},
        parser: {1: null, 2: parseWeatherDescriptions, 3: parseWeatherDescriptions, 4: parseWeatherDescriptions, 5: parseWeatherDescriptions},
        match: []
      },
      { name: "Clouds",
        pattern: /(CAVOK)|(( ?(SKC|FEW|SCT|BKN|OVC|VV)(\d{3}))*)/g,
        meanings: {1: "Ceiling and Visibility OK", 2: "Clouds"},
        parser: {1: null, 2: parseClouds},
        match: []
      },
      { name: "Vertical Visibility",
        pattern: /VV(\d{3})/g,
        meanings: {1: "Vertical Visibility"},
        parser: {1: null},
        match: []
      },
      { name: "Temperature",
        pattern: /(M?\d{1,2})\/(M?\d{1,2})/g,
        meanings: {1: "Temperature", 2: "Dew Point"},
        parser: {1: addDegrees, 2: null},
        match: []
      },
      { name: "Altimeter Setting",
        pattern: /([AQ]\d{4})/g,
        meanings: {1: "Altimeter"},
        parser: {1: parseAltimeter},
        match: []
      },
      { name: "Recent Weather",
        pattern: /RE(MI|BC|PR|DR|BL|SH|TS|FZ)?(DZ|RA|SN|SG|IC|PL|GR|GS|UP|BR|FG|FU|VA|DU|SA|HZ)?/g,
        meanings: {1: "Descriptor", 2: "Weather Phenomenon"},
        parser: {1: parseWeatherDescriptions, 2: parseWeatherDescriptions},
        match: []
      },
      { name: "Windshear",
        pattern: /WS ((RWY\d{2})|(ALLRWY))/g,
        meanings: {1: "Runway Affected"},
        parser: {1: null},
        match: []
      }
  ]

  //where in string to start looking from
  let prevIndex = 0
  //Loop through each metar item
  for (let metar in parsedMetar) {
    let regex = parsedMetar[metar].pattern
    //Find first instance of regex - we only care for the first one, starting from string
    m = regex.exec(mainMetarText.slice(prevIndex))
    // console.log(m)
    //check for invalid match (there is no ""/undefined matches)
    if (!(m && m.some(val => val !== undefined && val !== ""))) continue
    //update prevIndex for next round
    prevIndex = m.index + m[0].length
    //get rid of first item, which is entire match
    m = m.splice(1)
    //update 'match' property in parsedMetar while using parser functions
    for (let item in m) {
      if (m[item] !== undefined && m[item] !== "") {
        let parserFunction = parsedMetar[metar]["parser"][item]
        let data = parserFunction === null ? m[item] : parserFunction(m[item])
        parsedMetar[metar]["match"].push({
          data: data,
          meaning: parsedMetar[metar]["meanings"][item]
        })
      }
    }
  }
  let ret = "";
  parsedMetar.forEach(val => {
    //if this needs to be written
    if (val.match.length) {
      ret += `<h1>${val.name}</h1>`
      ret += `<table>`
      for (let item in val.match) {
        console.log(val.match)
        ret += `<tr><td>${val["match"][item]["meaning"]}</td><td>${val["match"][item]["data"]}</td></tr>`
      }
      ret += `</table>`
      results.innerHTML = ret
    }
  })
}

//PARSER FUNCTIONS
function parseAirportCode(data) {
  //parse airport code
  data = data.trim()
  let iataCode = data.length === 3 ? data : data.slice(1, 4)
  //Fetch airport data
  const url = "http://iatacodes.org/api/v6/airports?api_key=2edabe9f-89a4-4fb5-862a-2a3a510cd5a8&code=" + iataCode
  fetch(url)
    .then(blob => blob.json())
    .then(data => console.log(data))
    .catch(err => console.log('fml'))
}
function humanizeTime(data) {
  return data
}
function addDegrees(data) {
  return data
}
function addKnots(data) {
  return data
}
function addDistance(data) {
  return data
}
function addTrend(data) {
  return data
}
function parseWeatherDescriptions(data) {
  return data
}
function parseClouds(data) {
  return data
}
function parseAltimeter(data) {
  return data
}

//REMARKS
//VSBY N 3    == Visibility north 3 miles
//TORNADO     == tornado
