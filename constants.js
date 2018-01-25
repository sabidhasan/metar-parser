const cloudDict = {"SKC": "Sky Clear (Human generated report)",
  "CLR": "No clouds below 12000 (US) 25000 (Can)", "FEW": "Few Clouds (1–2 oktas)",
  "SCT": "Scattered (3–4 oktas)", "BKN": "Broken (5-7 oktas)", "OVC": "Overcast (8 oktas)",
  "NSC": "No significant clouds"
}




const nosigDefs = {BECMG: "Becoming", TEMPO: "Temporary", FM: "From",
  TL: "Until", AT: "At", NSW: "No significant weather",
  TEMPO: "No significant change expected within the next two hours",
  NOSIG: "No significant change expected within the next two hours"
}




const remarksDict = {
    "APRX"      : "approximately",
    "N"         : "north",
    "S"         : "south",
    "E"         : "east",
    "W"         : "west",
    "NW"        : "northwest",
    "NE"        : "northeast",
    "SW"        : "southwest",
    "SE"        : "southeast",
    "AO1"       : "automated station without precipitation discriminator",
    "AO2"       : "automated station with precipitation discriminator",
    "AUTO"      : "automatic",
    "AMD"       : "amended forecast",
    "WSHFT"     : "wind shift",
    "WS"        : "wind shear",
    "PK WND"    : "peak wind",
    "NSW"       : "no significant weather",
    "FROPA"     : "frontal passage",
    "TWR"       : "tower",
    "VRB"       : "variable",
    "VIS"       : "visibility",
    "SFC"       : "surface",
    "RWY"       : "runway",
    "OCNL"      : "occasional",
    "LTG"       : "lightning",
    "TEMPO"     : "temporarily",
    "FRQ"       : "frequent",
    "CONS"      : "continuous",
    "IC"        : "in-cloud",
    "CG"        : "cloud-ground",
    "CC"        : "cloud-cloud",
    "CA"        : "cloud-air",
    "FM"        : "from",
    "TS"        : "thunderstorm",
    "MOV"       : "moving",
    "CIG"       : "ceiling height",
    " V "       : "variable",
    "CB"        : "cumulonimbus cloud",
    "BKN"       : "broken",
    "DSNT"      : "distant",
    "TCU"       : "towering cumulus cloud",
    "ACSL"      : "altocumulus standing lenticular cloud",
    "SCSL"      : "stratocumulus standing lenticular cloud",
    "CCSL"      : "cirrocumulus standing lenticular cloud",
    "CBMAM"     : "cumulonimbus mammatus cloud",
    "ACC"       : "altocumulus castellanus cloud",
    "APRNT"     : "apparent",
    "CLD"       : "cloud",
    "PRESFR"    : "pressure falling rapidly",
    "PRESRR"    : "pressure rising rapidly",
    "SLP"       : "sea level pressure",
    "SLPNO"     : "sea level pressure not available",
    "ACFT"      : "aircraft",
    "MSHP"      : "mishap",
    "SNINCR"    : "snow increasing rapidly",
    "CHI"       : "cloud-height indicator",
    "RVRNO"     : "RVR system not available",
    "PWINO"     : "precipitation identifier sensor not available",
    "PNO"       : "precipitation amount not available",
    "FZRANO"    : "freezing rain sensor not available",
    "TSNO"      : "thunderstorm information not available",
    "CHINO"     : "ceiling height indicator not available",
    "VISNO"     : "visibility sensor not operating",
    "LOC"       : "(secondary sensor)",
    "$"         : "maintenance needed",
    "WND"       : "wind",
    "UTC"       : "Coordinated Universal Time",
    "VV"        : "vertical visibility",
    "TS"        : "thunderstorm",
    "RVR"       : "Runway Visual Range",
    "SM"        : "statute miles",
    "FT"        : "feet",
    "KT"        : "knots",
    "MPS"       : "m/sec",
    "COR"       : "correction to a previously disseminated report",
    "MT"        : "mountains",
    "CAVU"      : "Ceiling and visibility unlimited",
    "SLP"       : "sea-level pressure",
    "PR"        : "partial",
    "CLR"       : "clear",
    "DR"        : "low drifting",
    "FC"        : "funnel cloud",
    "LWR"       : "lower",
    "MI"        : "shallow",
    "N/A"       : "not applicable",
    "OVC"       : "overcast",
    "BECMG"     : "becoming",
    "OHD"       : "overhead",
    "PY"        : "spray",
    "SCT"       : "scattered",
    "SKC"       : "sky clear",
    "FEW"       : "few clouds",
    "BC"        : "Patches",
    "BL"        : "Blowing",
    "BR"        : "Mist >=5/8",
    "DR"        : "Low Drifting",
    "DS"        : "Dust storm",
    "DU"        : "Dust",
    "DZ"        : "Drizzle",
    "FC"        : "Funnel Cloud",
    "+FC"       : "Tornado",
    "FG"        : "Fog",
    "FU"        : "Smoke",
    "FZ"        : "Freezing",
    "GR"        : "Hail (>5mm)",
    "GS"        : "Small Hail",
    "HZ"        : "Haze",
    "IC"        : "Ice Crystals",
    "MI"        : "Shallow",
    "PL"        : "Ice Pellets",
    "PO"        : "Well-Developed Dust/Sand Whirls",
    "PR"        : "Partial",
    "PY"        : "Spray",
    "RA"        : "Rain",
    "SA"        : "Sand",
    "SG"        : "Snow Grains",
    "SH"        : "Showers",
    "SN"        : "Snow",
    "SQ"        : "Squalls Moderate",
    "SS"        : "Sandstorm",
    "TS"        : "Thunderstorm",
    "UP"        : "Unknown Precipitation",
    "VA"        : "Volcanic Ash",
    "VC"        : "In the Vicinity",
    "PROB"      : "probability",
    "LDG"       : "landing",
    "ST"        : "Stratus clouds",
    "MI"        : "Shallow",
    "BC"        : "Patches",
    "PR"        : "Partial",
    "DR"        : "Drifting",
    "BL"        : "Blowing",
    "SH"        : "Showers",
    "TS"        : "Thunderstorm",
    "FZ"        : "Freezing",
    "DZ"        : "Drizzle",
    "RA"        : "Rain",
    "SN"        : "Snow",
    "SG"        : "Snow Grains",
    "IC"        : "Ice Crystals",
    "PL"        : "Ice Pellets",
    "GR"        : "Hail",
    "GS"        : "Snow Pellets",
    "UP"        : "Unknown Precipitation",
    "BR"        : "Mist",
    "FG"        : "Fog",
    "FU"        : "Smoke",
    "VA"        : "Volcanic Ash",
    "DU"        : "Dust",
    "SA"        : "Sand",
    "HZ"        : "Haze",
    "PO"        : "Dust Devils",
    "SQ"        : "Squalls",
    "FC"        : "Funnel Cloud",
    "SS"        : "Sandstorm",
    "DS"        : "Duststorm",
    "T"         : "Temperature",
    "P"         : "Precipitation",
    "CU"        : "Cumulus cloud",
    "SF"        : "Stratus Fractus cloud",
    "SC"        : "Stratocumulus cloud",
    "AC"        : "altocumulus cloud",
    "OVR"       : "Over",
    "RDG"       : "Ridge"
}

const RSGRunwayDepositDict = {
  "0": "Clear and dry", "1": "Damp", "2": "Wet or water patches",
  "3": "Rime or frost covered", "4": "Dry snow", "5": "Wet snow", "6": "Slush",
  "7": "Ice", "8": "compacted or rolled snow", "9": "frozen ruts or ridges",
  "/": "Deposit not reported"
}

const RSGRunwayContaminationDict = {
    "1": "10% or less",
    "2": "11% to 25%",
    "5": "26% to 50%",
    "9": "51% to 100%",
    "/": "not reported",
    "CLRD": "Cleared"
}

const brakingDict = {"91": "Braking Poor", "92": "Braking Medium/Poor", "93": "Braking Medium",
  "94": "Braking Medium/Good", "95": "Braking Good", "99": "Figures unreliable",
  "//": "Braking action not reported"
}

const runwayDepthDict = {"00": "Less than 1 mm", "98": "40 cm or more",
  "//": "Depth insignificant or immeasurable", "99": "Depth not reported"
}