function decode_metar(e) {

  console.clear()


  const results = document.querySelector(".results")
  const metar = this.value.split("=")[0].split("RMK")

  let mainMetarText = metar[0]
  const remarks = metar[1] || null

  var parsedMetar = [
      { name: "Metar Type",
        repeatSearch: false,
        pattern: /(METAR)|(SPECI)/,
        meanings: {0: "METAR", 1: "SPECIAL"},
        parser: {0: null, 1: null},
        match: []
      },
      { name: "Airport Code",
        repeatSearch: false,
        pattern: /([A-Z]{3,4})/,
        meanings: {0: "ICAO Code"},
        parser: {0: parseAirportCode},
        match: []
      },
      { name: "Date",
        repeatSearch: false,
        pattern: /(\d{6}Z)( AUTO)?( [A-Z]{3}\b)?/,
        meanings: {0: "Update Time", 1: "Automatic Station Indicator", 2: "Correction Indicator"},
        parser: {0: humanizeTime, 1: null, 2: parseCorrection},
        match: []
      },
      { name: "Wind",
        repeatSearch: false,
        pattern: /(\d{3}|VRB)(\d{2}(?:G))?(\d{2}(?:KT|MPS))/,   //((\d{3})|(VRB))(\d{1,2})G?(\d{1,2})KT/g,
        meanings: {0: "Wind Direction", 1: "Wind Speed/Gust", 2: "Wind Speed/Gust"},
        parser: {0: addDegrees, 1: addSpeed, 2: addSpeed},
        match: []
      },
      { name: "Wind Variability",
        repeatSearch: false,
        pattern: /(\d{3})V(\d{3})\b/,
        meanings: {0: "Wind Direction", 1: "Variable Wind Direction"},
        parser: {0: addDegrees, 1: addDegrees},
        match: []
      },
      { name: "Prevailing Visibility",
        repeatSearch: false,
        pattern: /(\d{1,4}(?:[/]\d{1,4}SM)?)\b/,
        meanings: {0: "Prevailing Visibility"},
        parser: {0: addDistance},
        match: []
      },
      { name: "Runway Visibility",
        repeatSearch: true,
        pattern: /(R\d{1,2}[CLR]?)[/]P?(\d{3,4}(?:FT)?)([/]?[DUN])?/,
        meanings: {0: "Runway", 1: "Visual Range", 2: "Trending"},
        parser: {0: parseRunway, 1: addDistance, 2: addTrend},
        match: []
      },

      { name: "Weather",
        repeatSearch: true,
        pattern: /( (?:[-+]|VC)?[A-Z]{2,6}\b)/,
        meanings: {0: "Descriptor"},
        parser: {0: parseWeatherDescriptions},
        match: []
      },

      { name: "Clouds",
      repeatSearch: false,
        pattern: /(CAVOK)|(( ?(SKC|FEW|SCT|BKN|OVC|VV)(\d{3}))*)/,
        meanings: {1: "Ceiling and Visibility OK", 2: "Clouds"},
        parser: {1: null, 2: parseClouds},
        match: []
      },
      { name: "Vertical Visibility",
      repeatSearch: false,
        pattern: /VV(\d{3})/g,
        meanings: {1: "Vertical Visibility"},
        parser: {1: null},
        match: []
      },
      { name: "Temperature",
      repeatSearch: false,
        pattern: /\b(M?\d{1,2})\/(M?\d{1,2})\b/,
        meanings: {0: "Temperature", 1: "Dew Point"},
        parser: {0: addDegrees, 1: addDegrees},
        match: []
      },
      { name: "Altimeter Setting",
      repeatSearch: false,
        pattern: /([AQ]\d{4})/,
        meanings: {0: "Altimeter"},
        parser: {0: parseAltimeter},
        match: []
      },
      { name: "Recent Weather",
      repeatSearch: false,
        pattern: /RE([A-Z]{2,6}?)/,
        meanings: {1: "Descriptor", 2: "Weather Phenomenon"},
        parser: {1: parseWeatherDescriptions, 2: parseWeatherDescriptions},
        match: []
      },
      { name: "Windshear",
      repeatSearch: false,
        pattern: /WS ((RWY\d{2})|(ALLRWY))/,
        meanings: {1: "Runway Affected"},
        parser: {1: null},
        match: []
      }
  ]

  //where in string to start looking from
  let prevIndex = 0
  //Loop through each metar item
  for (let metar in parsedMetar) {
    //Do loop runs again if "repeatSearch" is true, and it finds a match in current iteration
    do {
      let regex = parsedMetar[metar].pattern
      //Find first instance of regex - we only care for the first one, starting from string
      m = regex.exec(mainMetarText.slice(prevIndex))

      //check for invalid match (there is no ""/undefined matches)
      if (!(m && m.some(val => val !== undefined && val !== ""))) break

      //update prevIndex for next search (this is the "current" position in string)
      prevIndex += m.index + m[0].length
      //Discard first item, which is *entire* match
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
    } while (parsedMetar[metar].repeatSearch === true)
  }


  let ret = "";
  parsedMetar.forEach(val => {
    //if this needs to be written
    if (val.match.length > 1) {
      ret += `<h1>${val.name}</h1>`
      ret += `<table>`
      for (let item in val.match) {
        ret += `<tr><td>${val["match"][item]["meaning"]}</td><td>${val["match"][item]["data"]}</td></tr>`
      }
      ret += `</table>`
      results.innerHTML = ret
    } else if (val.match.length === 1) {
      ret += `<table><tr><td><h1>${val.name}</h1></td><td>${val["match"][0]["data"]}</td></tr></table>`
      results.innerHTML = ret
    }
  })
}

//PARSER FUNCTIONS
function parseAirportCode(icaoCode) {
  //Get full airport name from ICAO code
  let airportName = airportCodes.reduce((a, v) => {
    return v.code === icaoCode ? v.name : a
  }, icaoCode)
  return `${icaoCode} ${airportName !== icaoCode ? '(' + airportName + ')' : "(Unknown Airport Code)" }`
}

function parseAltimeter(data) {
  //parse QNH data
  return data.replace("Q", "QNH ").replace("A", "A ")
}

function addDegrees(temperature) {
  //Add degree symbol and remove superfluous 0s
  if (temperature === "VRB") {
    //it's a string...
    return "Variable"
  }
  return parseInt(temperature.toString().replace("M", "-")) + "°"
}

function addSpeed(data) {
  // Add knots symbol
  data = data.replace("G", "")
  //Look for units
  if (data.includes("KT")) {
    return parseInt(data).toString() + " knots";
  } else if (data.includes("MPS")) {
    return parseInt(data).toString() + " m/sec";
  }
  return parseInt(data).toString()
}

function ordinal(i) {
    //add ordinal number endings - Modified from https://stackoverflow.com/questions/13627308
    var j = i % 10, k = i % 100
    if (j == 1 && k != 11) return parseInt(i).toString() + "st";
    if (j == 2 && k != 12) return parseInt(i).toString() + "nd";
    if (j == 3 && k != 13) return parseInt(i).toString() + "rd";
    return parseInt(i).toString() + "th";
}

function humanizeTime(data) {
  //Return humanized form of time data
  const now = new Date;
  const suppliedDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), parseInt(data.slice(0, 2)), parseInt(data.slice(2, 4)), parseInt(data.slice(4, 6))))

  //check if data is old or in the future, if it is then lets just return it without serious parsing
  let dateDiff = now.getUTCDate() - parseInt(data.slice(0, 2))
  //get time difference in milliseconds
  let rawDiff = now - suppliedDate

  if (dateDiff === 0) {
    date = "Today"
  } else if (dateDiff === 1) {
    date = "Yesterday"
  } else {
    //Check for valid date
    if (parseInt(data.slice(0,2)) > 31 || parseInt(data.slice(0,2)) < 1) {
      date = `<span class="error">${ordinal(data.slice(0,2))}</span>`
    } else {
      date = ordinal(data.slice(0,2))
    }
  }
  if ( parseInt(data.slice(2, 4)) > 24 || parseInt(data.slice(2, 4)) < 0 || parseInt(data.slice(4, 6)) > 60 || parseInt(data.slice(4, 6)) < 0 ) {
    var parsedTime = `<span class="error">${data.slice(2, 4)}:${data.slice(4, 6)}</span> ${data.slice(-1)}`
  } else {
    var parsedTime = `${data.slice(2, 4)}:${data.slice(4, 6)} ${data.slice(-1)}`
  }

  //Check for future Time or past/future dates (except today/yesterday)
  if (dateDiff > 1 || dateDiff < 0) {
    return `On the ${date} day at ${parsedTime}`
  } else if (rawDiff < 0) {
    return `${date} at ${parsedTime}`
  }
  //determine hours, min, sec
  var hh = Math.floor(rawDiff / 1000 / 60 / 60);
  rawDiff -= hh * 1000 * 60 * 60;
  var mm = Math.floor(rawDiff / 1000 / 60);
  rawDiff -= mm * 1000 * 60;
  var ss = Math.floor(rawDiff / 1000);
  const age = (hh > 0 ? `${hh}h ` : "") + (mm > 0 ? `${mm}m ` : "") + (ss > 0 ? `${ss}s ` : "") + "ago"

  return `${date} at ${parsedTime} (${age})`
}










function addDistance(data) {
  //add NM distance units
  if (data.includes("FT")) {
    return data.replace("FT", "") + " feet"
  }
  if (data.length === 4) {
      return data + " meters"
  }
  return data.replace("SM", " Statuate Miles")
}

function addTrend(data) {
  const keys = {D: "Decreasing", U: "Increasing", N: "Not changing"}
  let rightChar = data.slice(data.length - 1);
  if (rightChar in keys) return keys[rightChar]
  return `Unknown trend ${data}`
}

function parseRunway(data) {
  data = data.replace("R", "Runway ")

  const dirs = {"R": "Right", "C": "Center", "L": "Left"}
  let direction = data.slice(data.length - 1)
  if (direction in dirs) {
    data = data.replace(direction, ` ${dirs[direction]}`)
  }
  return data
}
function parseWeatherDescriptions(data) {
  //remove whitespace
  let localData = data.trim()

  //Check for complex Phenomena
  const complexPhenomena = {"+FC": "Tornado or Waterspout", "+DS": "Duststorm with 5/16 SM Visibility", "+SS": "Sandstorm with 5/16 SM Visibility"}
  if (localData in complexPhenomena) {
    return `${data.trim()} - ${complexPhenomena[localData]}`
  }

  // look for quantifier
  const quantifiers = {"+": "Heavy", "-": "Light", "VC": "In the vicinity"}
  let dataQuantifier = ""
  Object.keys(quantifiers).forEach(quant => {
    if (localData.slice(0, 1) == quant || localData.slice(0, 2) == quant) {
      dataQuantifier = quantifiers[quant]
      localData = localData.replace(quant, "")
    }
  })

  //now look for description
  const dict = { MI: "Shallow", BC: "Patches", PR: "Partial", DR: "Drifting", BL: "Blowing", SH: "Showers", TS: "Thunderstorm", FZ: "Freezing",
    DZ: "Drizzle", RA: "Rain", SN: "Snow", SG: "Snow Grains", IC: "Ice Crystals", PL: "Ice Pellets", GR: "Hail", GS: "Snow Pellets",
    UP: "Unknown Precipitation", BR: "Mist", FG: "Fog", FU: "Smoke", VA: "Volcanic Ash", DU: "Dust", SA: "Sand", HZ: "Haze", PO: "Dust Devils",
    SQ: "Squalls", FC: "Funnel Cloud", SS: "Sandstorm", DS: "Duststorm"
  }
  let index = 0
  let description = []
  while (index < localData.length) {
    let currentSlice = localData.slice(index, index + 2)
    if (currentSlice in dict) {
      description.push(dict[currentSlice])
    }
    index += 2
  }
  return "null";

  if (localData in dict) {
    return `${data.trim()} - ${dataQuantifier} ${dict[localData]}`
  }
  //Unknown so return error
  return `${data.trim()} - ${dataQuantifier} <span class="error">${localData}</span>`
}

function parseCorrection(data) {
  //AAC ==> "AA third correction"
  data = data.trim()

  let lastLetter = data.toUpperCase().charCodeAt(data.length -1) - 64;
  return `Update ${data.slice(0, 2)} - ${ordinal(lastLetter)} correction (${data.slice(-1)})`
}

function parseClouds(data) {
  return data
}

//REMARKS
//VSBY N 3    == Visibility north 3 miles
//TORNADO     == tornado
