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




function parseClouds(data) {
  data = data.trim().toUpperCase();

  if (data === "CAVOK") return "Ceiling and Visibility OK";

  //parse cloud Data
  const dict = {"SKC": "Sky Clear (Human generated report)",
    "CLR": "No clouds below 12000 (US) 25000 (Can)", "FEW": "Few Clouds (1–2 oktas)",
    "SCT": "Scattered (3–4 oktas)", "BKN": "Broken (5-7 oktas)", "OVC": "Overcast (8 oktas)",
    "VV": "Clouds not visible"
  }

  for (let cloud in dict) {

    if (data.includes(cloud)) return dict[cloud] + " at " + parseInt(data.slice(cloud.length, 10)) * 100 + " feet";
  }
  return `<span class="error">${data}</span>`;
}




function addDistance(data) {
  //add NM distance units
  data = data.toUpperCase()
  //Check for feet
  if (data.includes("FT")) return `${parseInt(data.replace("FT", ""))} feet`;
  //check for statuate miles
  if (data.includes("SM")) return `${data.replace("SM", "")} statuate miles`;
  //Assume its in meters
  return data + " meter(s)";
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
  return data.replace("Q", "QNH ").replace("A", "A ")
}




function addDegrees(value) {
  //Add degree symbol and remove superfluous 0s
  if (value === "VRB") return "Variable"

  //Determine degrees for weather vs degrees for Direction
  let units = value.length === 3 ? "" : " C";
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
  //remove whitespace
  let localData = data.trim().toUpperCase()

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
  //loop through text
  while (index < localData.length) {
    //holds current description (value)
    let currentDescription = ""
    //check for +, -, or VC (quantifiers)
    if (localData.charAt(index) in quantifiers) {
      currentDescription += quantifiers[localData.charAt(index)] + " ";
      index += 1;
    }
    //Look at next two letters to see if they are in dict
    let currentSlice = localData.slice(index, index + 2)
    //look for description
    if (currentSlice in dict) {
      currentDescription += dict[currentSlice] + " "
    } else {
      //invalid description
      currentDescription += `<span class="error">${currentSlice}</span>`;
    }
    if (currentDescription) description.push(currentDescription.trim())
    index += 2;
  }
  return description.join(" / ");
}
