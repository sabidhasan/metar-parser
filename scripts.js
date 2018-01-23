function decode_metar(e) {
  console.clear()
  let parsedMetar = [
      { name: "Metar Type",
        repeatSearch: false,
        pattern: /(METAR)|(SPECI)|(TREND)/,
        meanings: {0: "METAR", 1: "SPECIAL", 2: "TREND"},
        parser: {0: null, 1: null, 2: null},
        match: []
      },
      { name: "Airport Code",
        repeatSearch: false,
        pattern: /\b([A-Z]{3,4})\b/,
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
        pattern: /(\d{3}|VRB)P?(\d{2}(?:G))?(\d{2}(?:KT|MPS))/,   //((\d{3})|(VRB))(\d{1,2})G?(\d{1,2})KT/g,
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
        pattern: /(M?\d{1,4}(?:[/]\d{1,4})?(?:SM)?) /,
        meanings: {0: "Prevailing Visibility"},
        parser: {0: addDistance},
        match: []
      },
      { name: "Runway Visibility",
        repeatSearch: true,
        pattern: /(R\d{1,2}[CLR]?)[/](?:P|M)?(\d{3,4}(?:FT)?)([/]?[DUN])?/,
        meanings: {0: "Runway", 1: "Visual Range", 2: "Trend"},
        parser: {0: parseRunway, 1: addDistance, 2: addTrend},
        match: []
      },
      { name: "Weather",
        repeatSearch: true,
        pattern: /( (?!CAVOK|NOSIG)(?:[-+]|VC)?(?!RE)(?:[A-Z]{2}|[A-Z]{4}|[A-Z]{6}|[A-Z]{8})\b)/,
        meanings: {0: "Descriptor"},
        parser: {0: parseWeatherDescriptions},
        match: []
      },
      { name: "Clouds",
        repeatSearch: true,
        pattern: /((?:CAVOK)|(?:[ ]?(?:SKC|NSC|FEW|SCT|BKN|OVC)\d{3}(?:CB|TCU)?))/,
        meanings: {0: "Clouds"},
        parser: {0: parseClouds},
        match: []
      },
      { name: "Vertical Visibility",
        repeatSearch: false,
        pattern: /(?:VV)([0-9/]{3})\b/,
        meanings: {0: "Vertical Visibility"},
        parser: {0: parseVisibility},
        match: []
      },
      { name: "Temperature",
        repeatSearch: false,
        pattern: /\b(M?\d{1,2})[/](M?\d{1,2})?\b/,
        meanings: {0: "Temperature", 1: "Dew Point"},
        parser: {0: addDegrees, 1: addDegrees},
        match: []
      },
      { name: "Altimeter Setting",
        repeatSearch: false,
        pattern: /([AQ]\d{4})\b/,
        meanings: {0: "Altimeter"},
        parser: {0: parseAltimeter},
        match: []
      },
      { name: "Recent Weather",
        repeatSearch: true,
        pattern: /(RE(?:[A-Z]{2,6}))\b/,
        meanings: {0: "Recent Weather Phenomenon"},
        parser: {0: parseWeatherDescriptions},
        match: []
      },
      { name: "Windshear",
      repeatSearch: false,
        pattern: /WS[ ]?(\d{3})[/](\d{3})(\d{2}KT)/,
        meanings: {0: "Altitude", 1: "Wind Shear Direction", 2: "Wind Shear Speed"},
        parser: {0: parseVisibility, 1: addDegrees, 2: addSpeed},
        match: []
      },
      { name: "Trend",
        repeatSearch: false,
        pattern: /(NOSIG|BECMG|TEMPO)([ ]FM\d{4})?([ ]TL\d{4})?([ ]AT\d{4})?\b/,
        meanings: {0: "Trend", 1: "Active From", 2: "Active Till", 3: "Issued At"},
        parser: {0: parseNOSIG, 1: parseNOSIG, 2: parseNOSIG, 3: parseNOSIG},
        match: []
      },
      { name: "Runway State Group",
        repeatSearch: false,
        pattern: /(\d{2})(?:([0-9/])([0-9/])([/]{2}|[0-9]{2})|(CLRD))(\d{2}|[/]{2})\b/,     //
        meanings: {0: "Runway Designator", 1: "Runway Deposits", 2: "Runway Contamination",
          3: "Runway Depth", 4: "Runway Condition", 5: "Runway Braking"
        },
        parser: {0: parseRSGRunway, 1: parseRSGRunwayDeposits,
          2: parseRSGRunwayContamination, 3: parseRSGRunwayDepth,
          4: parseRSGRunwayContamination, 5: parseRSGRunwayBraking
        },
        match: []
      }
  ]

  const results = document.querySelector(".results")
  const metar = this.value.split("=")[0].split("RMK")

  let mainMetarText = metar[0]
  const remarks = metar[1] || null

  //where in string to start looking from
  let prevIndex = 0
  //Loop through each metar item
  for (let metar in parsedMetar) {
    //Do loop runs again if "repeatSearch" is true, and it finds a match in current iteration
    do {
      let regex = parsedMetar[metar].pattern
      //Find first instance of regex - we only care for the first one, starting from string
      m = regex.exec(mainMetarText.slice(prevIndex))
console.log("\n\n")
console.log(m)
console.log(regex)
      //check for invalid match (there is no ""/undefined matches)
      if (!(m && m.some(val => val !== undefined && val !== ""))) break

      //update prevIndex for next search (this is the "current" position in string)
      prevIndex += m.index + m[0].length
      //Discard first item, which is *entire* match
      let fullMatch = m[0]
      m = m.splice(1)
      //update 'match' property in parsedMetar while using parser functions
      for (let item in m) {
        if (m[item] !== undefined && m[item] !== "") {
          let parserFunction = parsedMetar[metar]["parser"][item]
          let data = parserFunction === null ? m[item] : parserFunction(m[item])
          parsedMetar[metar]["match"].push({
            data: data,
            meaning: parsedMetar[metar]["meanings"][item],
            originalText: fullMatch
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
        ret += `<tr><td>${val["match"][item]["meaning"]}</td><td><div class="parsed">${val["match"][item]["data"]}</div><div class="original">${val["match"][item]["originalText"]}</div></td></tr>`
      }
      ret += `</table>`
      results.innerHTML = ret
    } else if (val.match.length === 1) {
      ret += `<table><tr><td><h1>${val.name}</h1></td><td><div class="parsed">${val["match"][0]["data"]}</div><div class="original">${val["match"][0]["originalText"]}</div></td></tr></table>`
      results.innerHTML = ret
    }
  })
}
