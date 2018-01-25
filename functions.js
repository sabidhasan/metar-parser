//PARSER FUNCTIONS
function parseAirportCode(icaoCode) {
  //Get full airport name from ICAO code
  let airportName = airportCodes.reduce((a, v) => {
    return v.code === icaoCode ? v.name : a
  }, icaoCode)
  return `${icaoCode} ${airportName !== icaoCode ? '(' + airportName + ')' : "(Unknown Airport Code)" }`
}




function parseCorrection(data) {
  //AAC ==> "AA third correction"
  data = data.trim().toUpperCase();

  let lastLetter = data.charCodeAt(data.length -1) - 64;
  return `Update ${data.slice(0, 2)} - ${ordinal(lastLetter)} correction (${data.slice(-1)})`
}




function parseVisibility(data) {
  //parse vertical visibility
  if (data === "///") return "Vertical visibility not measured";
  return (parseInt(data) * 100) + " feet";
}




function parseClouds(data) {
  var localData = data.trim().toUpperCase();

  if (localData === "CAVOK") return "Ceiling and Visibility OK";

  //Look for manual clouds
  const manualClouds = {"CB": "Cumulonimbus", "TCU": "Towering Cumulonimbus"}
  var cloudType = "";

  for (let cloud in manualClouds) {
    if (localData.slice(localData.length - cloud.length) == cloud) {
      localData = localData.replace(cloud, "");
      cloudType = `type ${manualClouds[cloud]}`;
    }
  }

  //parse cloud Data
  for (let cloud in cloudDict) {
    if (localData.includes(cloud)) return cloudDict[cloud] + " at " + parseInt(localData.slice(cloud.length)) * 100 + " feet " + cloudType;
  }
  return `<span class="error">${data}</span>`;
}




function addDistance(data) {
  //add NM distance units
  data = data.toUpperCase().trim()
  //check for "less than"
  if (data.charAt(0) == "M") data = data.replace("M", "Less than ");
  //Check for feet
  if (data.includes("FT")) return `${parseInt(data.replace("FT", ""))} feet`;
  //check for statuate miles
  if (data.includes("SM")) return `${data.replace("SM", "")} statuate miles`;
  //Assume its in meters
  if (data === "0000") return "Less than 50 meters"
  if (data === "9999") return "More than 10 km visibility"
  return data + " meters";
}




function parseRunway(data) {
  data = data.toUpperCase().replace("R", "Runway ")

  const dirs = {"R": "Right", "C": "Center", "L": "Left"}
  let direction = data.slice(data.length - 1)
  if (direction in dirs) {
    data = data.replace(direction, ` ${dirs[direction]}`)
  }
  return data
}




function addTrend(data) {
  const keys = {D: "Decreasing", U: "Increasing", N: "Not changing"}
  let rightChar = data.toUpperCase().slice(data.length - 1);
  if (rightChar in keys) return keys[rightChar]
  return `Unknown trend ${data}`
}




function parseAltimeter(data) {
  //parse QNH data
  const firstLetter = data.charAt(0);
  const altimeterUnits = {"Q": {"name": "QNH", "units": "hPa"}, "A": {"name": "Altimeter", "units": "mmHg"}}

  if (firstLetter in altimeterUnits) {
    let value = parseInt(data.slice(1)).toPrecision(4);
    if (firstLetter === "A") value /= 100;

    return `${altimeterUnits[firstLetter].name} ${value} ${altimeterUnits[firstLetter].units}`
  }
  return `<span class="error">${data}</span>`
}




function addDegrees(value) {
  //Add degree symbol and remove superfluous 0s
  if (value === "VRB") return "Variable"

  //Determine degrees for weather vs degrees for Direction
  let units = value.length === 3 && !(value.toString().includes("M")) ? "" : " C";
  return parseInt(value.toString().replace("M", "-")) + "°" + units
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




function parseNOSIG(data) {
  data = data.trim().toUpperCase()
  for (def in nosigDefs) {
    if (data.includes(def)) return data.replace(def, nosigDefs[def] + " ")
  }
  return `<span class="error">${data}</span>`
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




function parseWeatherDescriptions(data) {
  //remove whitespace and "recent weather"
  let localData = data.trim().toUpperCase().replace("RE", "")

  //Check for complex Phenomena
  const complexPhenomena = {"+FC": "Tornado or Waterspout", "+DS": "Duststorm with 5/16 SM Visibility", "+SS": "Sandstorm with 5/16 SM Visibility"}
  if (localData in complexPhenomena) return `${data.trim()} - ${complexPhenomena[localData]}`

  //defintions for phenomena
  const quantifiers = {"+": "Heavy", "-": "Light", "VC": "In the vicinity"}
  const dict = { MI: "Shallow", BC: "Patches", PR: "Partial", DR: "Drifting", BL: "Blowing", SH: "Showers", TS: "Thunderstorm", FZ: "Freezing",
    DZ: "Drizzle", RA: "Rain", SN: "Snow", SG: "Snow Grains", IC: "Ice Crystals", PL: "Ice Pellets", GR: "Hail", GS: "Snow Pellets",
    UP: "Unknown Precipitation", BR: "Mist", FG: "Fog", FU: "Smoke", VA: "Volcanic Ash", DU: "Dust", SA: "Sand", HZ: "Haze", PO: "Dust Devils",
    SQ: "Squalls", FC: "Funnel Cloud", SS: "Sandstorm", DS: "Duststorm"
  }
  //index keeps track of where in string we are
  let index = 0
  //description holds the entire array
  let description = []
  //check for +, -, or VC (quantifiers)
  if (localData.charAt(index) in quantifiers) {
    description.push(quantifiers[localData.charAt(index)]);
    index += 1;
  } else if (localData.slice(0, 2) in quantifiers) {
    description.push(quantifiers[localData.slice(0, 2)] + ":");
    index += 2;
  }
  //loop through text
  while (index < localData.length) {
    //Look at next two letters to see if they are in dict
    let currentSlice = localData.slice(index, index + 2)
    //look for description
    if (currentSlice in dict) {
      description.push(dict[currentSlice])
    } else {
      //invalid description
      description.push(`<span class="error">${currentSlice}</span>`);
    }
    index += 2;
  }
  return description.join(" ");
}




function parseRSGRunway(data) {
  //Parse Runway state group data
  let num = parseInt(data.trim())
  if (num === 88) return `All runways`;
  if (num === 99) return `no new information`;
  if (num <= 36) return `Runway ${data} or ${data}L`;
  return `Runway ${num - 50}R`
}




function parseRSGRunwayDeposits(data) {
    data = data.trim()
    //parse runway deposits
    if (data in RSGRunwayDepositDict) {
      return RSGRunwayDepositDict[data]
    }
    return `<span class="error>${data}</span>`
}




function parseRSGRunwayContamination(data) {
  data = data.trim()
  if (data in RSGRunwayContaminationDict) {
    return RSGRunwayContaminationDict[data]
  }
  return `<span class="error>${data}</span>`
}




function parseRSGRunwayDepth(data) {
    data = data.trim()

    if (data in runwayDepthDict) {
       return runwayDepthDict[data];
    } else if (parseInt(data) < 90) {
      return `${data} mm`;
    } else if (parseInt(data) > 91) {
      return `${(parseInt(data) - 90) * 5} cm`
    }
    return `<span class="error">${data}</span>`
}




function parseRSGRunwayBraking(data) {
  data = data.trim()

  if (data in brakingDict) {
    return brakingDict[data]
  } else {
    return `Friction coefficient ${parseInt(data)}%`
  }
}




function parseRemark(data) {
  //Parse remarks
  //Check to see if its in dictionary entirely
  if (data in remarksDict) return remarksDict[data]

  //make an array of the word
  let arr = data.split("")
  //create dict keys sorted by length (we want longer things to match first)
  const keys = Object.keys(remarksDict).sort((a, b) => b.length > a.length ? 1 : -1);
  //Search more thoroughly
  for (remark in keys) {
    //replace as needed
    let currIndex = data.indexOf(keys[remark])
    if (currIndex !== -1 && arr[currIndex] === data.charAt(currIndex)) {
      //update first position
      arr[currIndex] = remarksDict[keys[remark]]
      //update all other positions
      for (let i = currIndex + 1; i < currIndex + keys[remark].length; i++) {
        arr[i] = "";
      }
    }
  }
  return arr.join(" ")
}
