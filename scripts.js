function decode_metar(e) {
  //To return
  let parsedMetar = [];

  //Grab the metar text - it's split by "=" sign
  const text = this.value.split("=")[0];

  //Split into tokens
  const tokens = text.split(" ");

  // #1 METAR TYPE
  let type;
  //Define known metars
  const metarTypes = {"SPECI": "Special Report", "METAR": "Regular Metar Report"};

  tokens.forEach(key => {
    if (key in metarTypes) type = metarTypes[key]
  });
  type = type || "Unknown Report Type"

          if (type) console.log(type)         //////////// DEVELOPMENTAL

  Object.keys(metarTypes).forEach((key) => {
      //check if key in metar

  })
//  tokens.find()


}

//     // Check if initial token is non-METAR date
//     var reDate = /^\d\d\d\d\/\d\d\/\d\d/;
//     if (reDate.test(arrayOfTokens[numToken]))
//         numToken++;
//
//     // Check if initial token is non-METAR time
//     var reTime = /^\d\d:\d\d/;
//     if (reTime.test(arrayOfTokens[numToken]))
//         numToken++;
//
//     // Check if initial token indicates type of report
//     if(arrayOfTokens[numToken] == "METAR")
//         numToken++;
//     else if(arrayOfTokens[numToken] == "SPECI")
//     {
//         add_output("Report is a SPECIAL report\n");
//         numToken++;
//     }
//
//     // Parse location token
//     if (arrayOfTokens[numToken].length == 4)
//     {
//         add_output("Location: " + arrayOfTokens[numToken] + "\n");
//         numToken++;
//     }
//     else
//     {
//         add_output("Invalid report: malformed location token '" + arrayOfTokens[numToken] + "' \n-- it should be 4 characters long!");
//         return;
//     }
//
//
//     // Parse date-time token -- we allow time specifications without final 'Z'
//     if ( (
//            ( (arrayOfTokens[numToken].length == 7) &&
//              (arrayOfTokens[numToken].charAt(6) == 'Z') ) ||
//            ( arrayOfTokens[numToken].length == 6 )
//          ) &&
//          is_num_digit(arrayOfTokens[numToken].charAt(0)) &&
//          is_num_digit(arrayOfTokens[numToken].charAt(1)) &&
//          is_num_digit(arrayOfTokens[numToken].charAt(2)) &&
//          is_num_digit(arrayOfTokens[numToken].charAt(3)) &&
//          is_num_digit(arrayOfTokens[numToken].charAt(4)) &&
//          is_num_digit(arrayOfTokens[numToken].charAt(5))    )
//     {
//         add_output("Day of month: " + arrayOfTokens[numToken].substr(0,2) + "\n");
//         add_output("Time: " + arrayOfTokens[numToken].substr(2,2) +":" +
//                               arrayOfTokens[numToken].substr(4,2) + " UTC");
//
//         if(arrayOfTokens[numToken].length == 6)
//             add_output(" (Time specification is non-compliant!)");
//
//         add_output("\n");
//         numToken++;
//     }
//     else
//     {
//         add_output("Time token not found or with wrong format!");
//         return;
//     }
//
//
//     // Check if "AUTO" or "COR" token comes next.
//     if (arrayOfTokens[numToken] == "AUTO")
//     {
//         add_output("Report is fully automated, with no human intervention or oversight\n");
//         numToken++;
//     }
//     else if (arrayOfTokens[numToken] == "COR")
//     {
//         add_output("Report is a correction over a METAR or SPECI report\n");
//         numToken++;
//     }
//
//     // Parse remaining tokens
//     for (var i=numToken; i<arrayOfTokens.length; i++)
//     {
//         if(arrayOfTokens[i].length > 0)
//         {
//             decode_token(arrayOfTokens[i].toUpperCase());
//         }
//         else
//         {
//             add_output("Next token has 0 length\n");
//         }
//     }
