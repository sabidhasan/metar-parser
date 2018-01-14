function decode_metar(e) {

  console.clear()



  const metar = this.value.split("=")[0].split("RMK")

  let mainMetarText = metar[0]
  const remarks = metar[1] || null

  let parsedMetar = [
      {
        name: "Metar Type",
        pattern: /(METAR)|(SPECI)/,
        meanings: {1: "METAR", 2: "SPECIAL"},
        match: null
      },
      {
        name: "Airport Code",
        pattern: /[A-Z]{3,4}/,
        meanings: {1: "Airport Code"},
        match: null
      },
      {
        name: "Date",
        pattern: /a/,   ///\(d{6}Z)( AUTO)?( [A-Z]{2}[A-Z])?/,
        meanings: {1: "Update Time", 2: "Automatic Station Indicator", 3: "Correction Indicator"},
        match: null
      },
      {
        name: "Wind",
        pattern: /(\d{3})|(VRB)(\d{1,2})G?(\d{1,2})KT/,
        meanings: {1: "Wind Direction", 2: "Variable", 3: "Wind Speed", 4: "Gust"},
        match: null
      },
      {
        name: "Wind Variability",
        pattern: /(\d{3})V(\d{3})/,
        meanings: {1: "Wind Direction", 2: "Variable Wind Direction"},
        match: null
      },

      {
        name: "Prevailing Visibility",
        pattern: /\d{1,2}?\/?\d{1,2}SM/,
        meanings: {1: "Visibility (SM)"},
        match: null
      },
      {
        name: "Runway Visibility",
        pattern: /(R\d{1,2}[CLR]?)\/(\d{4})FT(\/([DUN]))?/,
        meanings: {1: "Runway", 2: "Visual Range", 3: "Trending"},
        match: null
      },
      {
        name: "Weather Description",
        pattern: /(-|\+|VC)?(MI|BC|PR|DR|BL|SH|TS|FZ)?(DZ|RA|SN|SG|IC|PL|GR|GS|UP)?(BR|FG|FU|VA|DU|SA|HZ)?(PO|SQ|\+?FC|\+?SS|\+?DS)?/,
        meanings: {1: "Intensity", 2: "Descriptor", 3: "Precipitation", 4: "Obscuration", 5: "Other"},
        match: null
      },
      {
        name: "Clouds",
        pattern: /(CAVOK)|(( ?(SKC|FEW|SCT|BKN|OVC|VV)(\d{3}))*)/,
        meanings: {1: "Ceiling and Visibility OK", 2: "Clouds"},
        match: null
      },
      {
        name: "Vertical Visibility",
        pattern: /VV(\d{3})/,
        meanings: {1: "Vertical Visibility"},
        match: null
      },

      {
        name: "Temperature",
        pattern: /(M?\d{1,2})\/(M?\d{1,2})/,
        meanings: {1: "Temperature", 2: "Dew Point"},
        match: null
      },
      {
        name: "Altimeter Setting",
        pattern: /[AQ](\d{4})/,
        meanings: {1: "Altimeter"},
        match: null
      },
      {
        name: "Recent Weather",
        pattern: /RE(MI|BC|PR|DR|BL|SH|TS|FZ)?(DZ|RA|SN|SG|IC|PL|GR|GS|UP|BR|FG|FU|VA|DU|SA|HZ)?/,
        meanings: {1: "Descriptor", 2: "Weather Phenomenon"},
        match: null
      },
      {
        name: "Windshear",
        pattern: /WS ((RWY\d{2})|(ALLRWY))/,
        meanings: {1: "Runway Affected"},
        match: null
      }
  ]

  //Parse metar and try to match
  for (let metar in parsedMetar) {
    //Try to match
    let matchCandidate = mainMetarText.match(parsedMetar[metar].pattern)
    //If this pattern matches
    if (matchCandidate === null) continue

    console.log("\n")
    console.log(parsedMetar[metar].pattern)
    console.log(matchCandidate)
    //Loop through for meanings
    let x = matchCandidate.reduce((acc, val, idx) => {
      console.log("\t\t" + parsedMetar[metar].meanings[idx])
      return val ? `${val} ${parsedMetar[metar].meanings[idx]}` : ""
    }, "")

    console.log(`### - ${parsedMetar[metar].name}` + x)


    //remove match from Text
    mainMetarText = mainMetarText.replace(parsedMetar[metar].pattern, "")

    //
    // console.log(mainMetarText.match(parsedMetar[metar].pattern))
    // for (let i = 1; i < mainMetarText.match(parsedMetar[metar].pattern).length; i++) {
    //   console.log(mainMetarText.match(parsedMetar[metar].pattern)[i])
    // }

//    mainMetarText = mainMetarText.replace(, "")
    //console.log()
  }


}

//REMARKS
//VSBY N 3    == Visibility north 3 miles
//TORNADO     == tornado


//
//   //To return
//   let parsedMetar = [];
//
//   //Grab the metar text - it's split by "=" sign
//   const text = this.value.split("=")[0];
//   const tokens = text.split(" ");
//
//   //Build parser
//   const parser = [
//     {"Special Report": "SPECI", "Regular Metar Report": "METAR"},
//     {"Date": /^\d\d\d\d\d\d[Z]$/},
//     {}
//
//
//   ]
//
//   // #1 METAR TYPE
//   let type;
//   //Define known metars
//   const metarTypes = ;
//   const reDate = ;
//   const wxStation = /^[A-Z]{4}$/
//   //Find these items
//
//   text.split(" ").forEach((key, index) => {
//     //console.log("METAR" in Object.keys(metarTypes))
//     if (Object.keys(metarTypes).includes(key)) {
//       console.log('report matched  ' + key) //type = metarTypes[key]
//       return
//     }
//     if (reDate.test(key)) {
//       console.log('date matche  ' + key) //type = metarTypes[key]
//       return
//     }
//     if (wxStation.test(key)) {
//       console.log('weather station matched  ' + key) //type = metarTypes[key]
//       return
//     }
//
//
//   });
//
//   console.log(tokens)
// //  type = type || "Unknown Report Type"
//
//           if (type) console.log(type)         //////////// DEVELOPMENTAL
//
//   //Find date
//
//
// }
//
// //
// //     // Parse date-time token -- we allow time specifications without final 'Z'
// //     if ( (
// //            ( (arrayOfTokens[numToken].length == 7) &&
// //              (arrayOfTokens[numToken].charAt(6) == 'Z') ) ||
// //            ( arrayOfTokens[numToken].length == 6 )
// //          ) &&
// //          is_num_digit(arrayOfTokens[numToken].charAt(0)) &&
// //          is_num_digit(arrayOfTokens[numToken].charAt(1)) &&
// //          is_num_digit(arrayOfTokens[numToken].charAt(2)) &&
// //          is_num_digit(arrayOfTokens[numToken].charAt(3)) &&
// //          is_num_digit(arrayOfTokens[numToken].charAt(4)) &&
// //          is_num_digit(arrayOfTokens[numToken].charAt(5))    )
// //     {
// //         add_output("Day of month: " + arrayOfTokens[numToken].substr(0,2) + "\n");
// //         add_output("Time: " + arrayOfTokens[numToken].substr(2,2) +":" +
// //                               arrayOfTokens[numToken].substr(4,2) + " UTC");
// //
// //         if(arrayOfTokens[numToken].length == 6)
// //             add_output(" (Time specification is non-compliant!)");
// //
// //         add_output("\n");
// //         numToken++;
// //     }
// //     else
// //     {
// //         add_output("Time token not found or with wrong format!");
// //         return;
// //     }
// //
// //
// //     // Check if "AUTO" or "COR" token comes next.
// //     if (arrayOfTokens[numToken] == "AUTO")
// //     {
// //         add_output("Report is fully automated, with no human intervention or oversight\n");
// //         numToken++;
// //     }
// //     else if (arrayOfTokens[numToken] == "COR")
// //     {
// //         add_output("Report is a correction over a METAR or SPECI report\n");
// //         numToken++;
// //     }
// //
// //     // Parse remaining tokens
// //     for (var i=numToken; i<arrayOfTokens.length; i++)
// //     {
// //         if(arrayOfTokens[i].length > 0)
// //         {
// //             decode_token(arrayOfTokens[i].toUpperCase());
// //         }
// //         else
// //         {
// //             add_output("Next token has 0 length\n");
// //         }
// //     }
