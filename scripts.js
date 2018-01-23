function decode_metar(e) {

  console.clear()


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
// console.log("\n\n")
// console.log(m)
// console.log(regex)
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
