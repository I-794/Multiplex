// Single source of truth for the Interstate Index.
// Consumed by the static-site generator (generate.mjs, at build time) and by the
// in-browser database/decoder (assets/app.mjs, at runtime). Authored as an ES module
// so the same records drive generated detail pages and the live route browser.
//
// Mileage and year figures are organized from public FHWA route logs and the Wikipedia
// primary/auxiliary route lists. They are rounded reference values, not survey data, and
// should be verified against current FHWA, AASHTO, and state DOT records before any
// planning, engineering, or legal use. See /sources.

// ---------------------------------------------------------------------------
// Active primary (one- and two-digit) routes, with rich detail.
// ---------------------------------------------------------------------------

const activePrimarySeed = [
  primary("I-2", {
    states: "TX",
    corridor: "Lower Rio Grande Valley",
    summary: "Short east-west corridor serving the McAllen, Harlingen, and Brownsville region.",
    mileage: [{ state: "TX", miles: 46.8 }],
    year: 2013,
    from: "Palmview, TX", to: "Harlingen, TX (US 77/83)",
    cities: ["Palmview", "McAllen", "Pharr", "Harlingen"],
    junctions: ["I-69C", "I-69E"],
    notes: [
      "Lowest-numbered Interstate in the system and one of the newest two-digit designations.",
      "Built along US 83 as part of the developing south Texas corridor network.",
    ],
  }),
  primary("I-4", {
    states: "FL",
    corridor: "Central Florida route through Tampa, Lakeland, Orlando, and Daytona Beach.",
    summary: "Central Florida route through Tampa, Lakeland, Orlando, and Daytona Beach.",
    mileage: [{ state: "FL", miles: 132.3 }],
    year: 1957,
    from: "Tampa, FL (I-275)", to: "Daytona Beach, FL (I-95)",
    cities: ["Tampa", "Lakeland", "Orlando", "Daytona Beach"],
    junctions: ["I-275", "I-75", "I-95"],
    notes: [
      "Entirely within Florida, crossing the peninsula between two coasts.",
      "Among the busiest and most congestion-studied corridors in the Southeast.",
    ],
  }),
  primary("I-5", {
    states: "CA, OR, WA",
    corridor: "San Diego to the Canadian border",
    summary: "West Coast spine connecting Southern California, the Bay Area access corridor, Portland, Seattle, and Canada.",
    mileage: [
      { state: "CA", miles: 796.5 },
      { state: "OR", miles: 308.1 },
      { state: "WA", miles: 276.6 }
    ],
    year: 1957,
    from: "San Ysidro, CA (Mexico border)", to: "Blaine, WA (Canada border)",
    cities: ["San Diego", "Los Angeles", "Sacramento", "Portland", "Seattle"],
    junctions: ["I-8", "I-10", "I-80", "I-84", "I-90", "I-405"],
    notes: [
      "The only Interstate to touch both the Mexican and Canadian borders on the mainland.",
      "Primary north-south freight and passenger spine of the Pacific states.",
    ],
  }),
  primary("I-8", {
    states: "CA, AZ",
    corridor: "San Diego to Casa Grande",
    summary: "Southern east-west route across San Diego, Imperial Valley, Yuma, and south-central Arizona.",
    mileage: [
      { state: "CA", miles: 171.9 },
      { state: "AZ", miles: 178.3 }
    ],
    year: 1957,
    from: "San Diego, CA (I-5)", to: "Casa Grande, AZ (I-10)",
    cities: ["San Diego", "El Centro", "Yuma", "Casa Grande"],
    junctions: ["I-5", "I-10"],
    notes: ["Crosses the Imperial Sand Dunes and the lower Colorado River near Yuma."],
  }),
  primary("I-10", {
    states: "CA, AZ, NM, TX, LA, MS, AL, FL",
    corridor: "Santa Monica to Jacksonville",
    summary: "Major southern transcontinental corridor from the Pacific Coast to the Atlantic Coast.",
    mileage: [
      { state: "CA", miles: 242.5 },
      { state: "AZ", miles: 392.3 },
      { state: "NM", miles: 164.3 },
      { state: "TX", miles: 881.0 },
      { state: "LA", miles: 274.4 },
      { state: "MS", miles: 77.1 },
      { state: "AL", miles: 66.3 },
      { state: "FL", miles: 362.3 }
    ],
    year: 1957,
    from: "Santa Monica, CA (SR 1)", to: "Jacksonville, FL (I-95)",
    cities: ["Los Angeles", "Phoenix", "El Paso", "San Antonio", "Houston", "New Orleans", "Jacksonville"],
    junctions: ["I-5", "I-15", "I-25", "I-35", "I-45", "I-55", "I-65", "I-75", "I-95"],
    notes: [
      "Fourth-longest Interstate and the southernmost coast-to-coast route.",
      "Crosses the Atchafalaya Basin in Louisiana on one of the longest bridges in the U.S.",
    ],
  }),
  primary("I-11", {
    states: "NV, AZ",
    corridor: "Las Vegas region to northwestern Arizona",
    summary: "Emerging north-south corridor anchored by the Las Vegas and Phoenix connection.",
    mileage: [
      { state: "NV", miles: 22.8 },
      { state: "AZ", miles: 0 }
    ],
    year: 2017,
    from: "Boulder City, NV (US 93)", to: "Henderson, NV (I-515/US 93)",
    cities: ["Boulder City", "Henderson"],
    junctions: ["I-515"],
    notes: [
      "Opened with the Boulder City Bypass near the Hoover Dam crossing.",
      "Planned to grow into a Phoenix-to-Las Vegas and beyond corridor.",
    ],
  }),
  primary("I-12", {
    states: "LA",
    corridor: "Baton Rouge to Slidell",
    summary: "East-west Louisiana bypass of the New Orleans area between I-10 junctions.",
    mileage: [{ state: "LA", miles: 85.6 }],
    year: 1957,
    from: "Baton Rouge, LA (I-10)", to: "Slidell, LA (I-10/I-59)",
    cities: ["Baton Rouge", "Hammond", "Slidell"],
    junctions: ["I-10", "I-55", "I-59"],
    notes: ["Lets through traffic skirt New Orleans and Lake Pontchartrain to the north."],
  }),
  primary("I-14", {
    states: "TX",
    corridor: "Central Texas corridor",
    summary: "Signed segment of the planned Gulf Coast Strategic Highway corridor near Killeen and Temple.",
    mileage: [{ state: "TX", miles: 25.1 }],
    year: 2017,
    from: "Copperas Cove, TX (US 190)", to: "Belton, TX (I-35)",
    cities: ["Copperas Cove", "Killeen", "Belton"],
    junctions: ["I-35"],
    notes: ["First signed piece of a long-planned central Texas defense and freight corridor."],
  }),
  primary("I-15", {
    states: "CA, NV, AZ, UT, ID, MT",
    corridor: "San Diego to the Canadian border",
    summary: "Inland western route through Las Vegas, Salt Lake City, Idaho Falls, and Great Falls.",
    mileage: [
      { state: "CA", miles: 287.3 },
      { state: "NV", miles: 123.8 },
      { state: "AZ", miles: 29.4 },
      { state: "UT", miles: 400.6 },
      { state: "ID", miles: 196.0 },
      { state: "MT", miles: 396.0 }
    ],
    year: 1957,
    from: "San Diego, CA (I-8)", to: "Sweetgrass, MT (Canada border)",
    cities: ["San Diego", "Las Vegas", "Salt Lake City", "Idaho Falls", "Great Falls"],
    junctions: ["I-8", "I-10", "I-40", "I-70", "I-80", "I-84", "I-90"],
    notes: ["Crosses the Mojave Desert and the Wasatch Front on its way north."],
  }),
  primary("I-16", {
    states: "GA",
    corridor: "Macon to Savannah",
    summary: "Georgia east-west route connecting central Georgia with the Port of Savannah.",
    mileage: [{ state: "GA", miles: 166.8 }],
    year: 1962,
    from: "Macon, GA (I-75)", to: "Savannah, GA (I-95)",
    cities: ["Macon", "Dublin", "Savannah"],
    junctions: ["I-75", "I-95"],
    notes: ["Links the inland fall-line cities to one of the busiest container ports on the East Coast."],
  }),
  primary("I-17", {
    states: "AZ",
    corridor: "Phoenix to Flagstaff",
    summary: "Arizona north-south route climbing from the Valley of the Sun to the high country.",
    mileage: [{ state: "AZ", miles: 145.8 }],
    year: 1957,
    from: "Phoenix, AZ (I-10)", to: "Flagstaff, AZ (I-40)",
    cities: ["Phoenix", "Camp Verde", "Flagstaff"],
    junctions: ["I-10", "I-40"],
    notes: ["Climbs roughly 6,000 feet from the Sonoran Desert to the Colorado Plateau."],
  }),
  primary("I-19", {
    states: "AZ",
    corridor: "Nogales to Tucson",
    summary: "Border-to-Tucson route notable for metric distance signage.",
    mileage: [{ state: "AZ", miles: 63.4 }],
    year: 1961,
    from: "Nogales, AZ (Mexico border)", to: "Tucson, AZ (I-10)",
    cities: ["Nogales", "Green Valley", "Tucson"],
    junctions: ["I-10"],
    notes: ["The only Interstate signed primarily in kilometers rather than miles."],
  }),
  primary("I-20", {
    states: "TX, LA, MS, AL, GA, SC",
    corridor: "West Texas to South Carolina",
    summary: "Southern east-west freight corridor through Dallas-Fort Worth, Shreveport, Jackson, Birmingham, Atlanta, and Columbia.",
    mileage: [
      { state: "TX", miles: 636.1 },
      { state: "LA", miles: 189.8 },
      { state: "MS", miles: 154.6 },
      { state: "AL", miles: 214.9 },
      { state: "GA", miles: 202.6 },
      { state: "SC", miles: 141.5 }
    ],
    year: 1957,
    from: "Kent, TX (I-10)", to: "Florence, SC (I-95)",
    cities: ["Fort Worth", "Dallas", "Shreveport", "Jackson", "Birmingham", "Atlanta", "Columbia"],
    junctions: ["I-10", "I-35", "I-45", "I-55", "I-65", "I-75", "I-85", "I-95"],
    notes: ["A primary Deep South freight route linking the Southwest with the Carolinas."],
  }),
  primary("I-22", {
    states: "MS, AL",
    corridor: "Memphis region to Birmingham",
    summary: "Appalachian Development Highway corridor linking north Mississippi and Alabama.",
    mileage: [
      { state: "MS", miles: 115.6 },
      { state: "AL", miles: 95.9 }
    ],
    year: 2016,
    from: "Memphis, TN area (I-269)", to: "Birmingham, AL (I-65)",
    cities: ["Tupelo", "Jasper", "Birmingham"],
    junctions: ["I-65", "I-269"],
    notes: ["Upgraded from US 78 and fully signed as an Interstate in the 2010s."],
  }),
  primary("I-24", {
    states: "IL, KY, TN, GA",
    corridor: "Southern Illinois to Chattanooga",
    summary: "Diagonal route through Paducah, Nashville, and Chattanooga.",
    mileage: [
      { state: "IL", miles: 38.7 },
      { state: "KY", miles: 93.4 },
      { state: "TN", miles: 180.2 },
      { state: "GA", miles: 4.1 }
    ],
    year: 1958,
    from: "Pulleys Mill, IL (I-57)", to: "Chattanooga, TN (I-59/I-75)",
    cities: ["Paducah", "Clarksville", "Nashville", "Chattanooga"],
    junctions: ["I-57", "I-65", "I-40", "I-59", "I-75"],
    notes: ["Briefly clips the far southeastern corner of Georgia near Chattanooga."],
  }),
  primary("I-25", {
    states: "NM, CO, WY",
    corridor: "Las Cruces to Buffalo",
    summary: "Rocky Mountain Front Range route through Albuquerque, Denver, Colorado Springs, and Cheyenne.",
    mileage: [
      { state: "NM", miles: 462.1 },
      { state: "CO", miles: 298.9 },
      { state: "WY", miles: 300.9 }
    ],
    year: 1957,
    from: "Las Cruces, NM (I-10)", to: "Buffalo, WY (I-90)",
    cities: ["Las Cruces", "Albuquerque", "Pueblo", "Colorado Springs", "Denver", "Cheyenne"],
    junctions: ["I-10", "I-40", "I-70", "I-80", "I-90"],
    notes: ["Runs along the eastern foot of the Rocky Mountains for most of its length."],
  }),
  primary("I-26", {
    states: "TN, NC, SC",
    corridor: "Tri-Cities to Charleston",
    summary: "Appalachian-to-Atlantic route through Asheville, Spartanburg, Columbia, and Charleston.",
    mileage: [
      { state: "TN", miles: 54.5 },
      { state: "NC", miles: 53.6 },
      { state: "SC", miles: 220.8 }
    ],
    year: 1958,
    from: "Kingsport, TN (US 23)", to: "Charleston, SC (US 17)",
    cities: ["Johnson City", "Asheville", "Spartanburg", "Columbia", "Charleston"],
    junctions: ["I-81", "I-40", "I-85", "I-77", "I-95"],
    notes: ["Climbs the Blue Ridge Escarpment between Tennessee and North Carolina."],
  }),
  primary("I-27", {
    states: "TX",
    corridor: "Lubbock to Amarillo",
    summary: "Texas Panhandle route now central to broader Ports-to-Plains corridor planning.",
    mileage: [{ state: "TX", miles: 124.1 }],
    year: 1968,
    from: "Lubbock, TX (I-27 BL)", to: "Amarillo, TX (I-40)",
    cities: ["Lubbock", "Plainview", "Amarillo"],
    junctions: ["I-40"],
    notes: ["Proposed for extension both north and south under the Ports-to-Plains program."],
  }),
  primary("I-29", {
    states: "MO, IA, SD, ND",
    corridor: "Kansas City to the Canadian border",
    summary: "Missouri River corridor through Omaha-Council Bluffs, Sioux City, Sioux Falls, and Fargo access.",
    mileage: [
      { state: "MO", miles: 128.7 },
      { state: "IA", miles: 151.8 },
      { state: "SD", miles: 252.5 },
      { state: "ND", miles: 212.3 }
    ],
    year: 1957,
    from: "Kansas City, MO (I-35/I-70)", to: "Pembina, ND (Canada border)",
    cities: ["Kansas City", "Council Bluffs", "Sioux City", "Sioux Falls", "Fargo"],
    junctions: ["I-35", "I-70", "I-80", "I-90", "I-94"],
    notes: ["Follows the Missouri River valley up the western edge of the Corn Belt."],
  }),
  primary("I-30", {
    states: "TX, AR",
    corridor: "Fort Worth to North Little Rock",
    summary: "Short southern mainline linking the Dallas-Fort Worth metroplex with Arkansas.",
    mileage: [
      { state: "TX", miles: 223.7 },
      { state: "AR", miles: 143.0 }
    ],
    year: 1957,
    from: "Fort Worth, TX (I-20/I-35W)", to: "North Little Rock, AR (I-40)",
    cities: ["Fort Worth", "Dallas", "Texarkana", "Little Rock"],
    junctions: ["I-20", "I-35W", "I-35E", "I-40"],
    notes: ["One of the few mainline Interstates that connects two larger east-west routes."],
  }),
  primary("I-35", {
    states: "TX, OK, KS, MO, IA, MN",
    corridor: "Laredo to Duluth",
    summary: "Central U.S. trade corridor through San Antonio, Austin, Dallas-Fort Worth, Oklahoma City, Kansas City, Des Moines, and Minneapolis-St. Paul.",
    mileage: [
      { state: "TX", miles: 407.2 },
      { state: "OK", miles: 235.9 },
      { state: "KS", miles: 235.5 },
      { state: "MO", miles: 114.7 },
      { state: "IA", miles: 218.4 },
      { state: "MN", miles: 259.6 }
    ],
    year: 1957,
    from: "Laredo, TX (Mexico border)", to: "Duluth, MN (I-535)",
    cities: ["Laredo", "San Antonio", "Austin", "Dallas", "Oklahoma City", "Kansas City", "Des Moines", "Minneapolis"],
    junctions: ["I-10", "I-20", "I-40", "I-70", "I-80", "I-90", "I-94"],
    notes: [
      "Splits into I-35E and I-35W through both the Dallas-Fort Worth and Twin Cities metros.",
      "A core NAFTA trade route from the Mexican border to the Great Lakes.",
    ],
  }),
  primary("I-37", {
    states: "TX",
    corridor: "Corpus Christi to San Antonio",
    summary: "South Texas north-south route connecting the Gulf Coast with San Antonio.",
    mileage: [{ state: "TX", miles: 143.0 }],
    year: 1959,
    from: "Corpus Christi, TX (US 181)", to: "San Antonio, TX (I-35)",
    cities: ["Corpus Christi", "Pleasanton", "San Antonio"],
    junctions: ["I-35", "I-410"],
    notes: ["Links the Port of Corpus Christi with the San Antonio metro."],
  }),
  primary("I-39", {
    states: "IL, WI",
    corridor: "Bloomington-Normal to Wausau",
    summary: "Upper Midwest route pairing with parts of I-90 and I-94 in Wisconsin.",
    mileage: [
      { state: "IL", miles: 140.8 },
      { state: "WI", miles: 165.3 }
    ],
    year: 1986,
    from: "Normal, IL (I-55)", to: "Wausau, WI (US 51)",
    cities: ["Bloomington-Normal", "Rockford", "Madison", "Wausau"],
    junctions: ["I-55", "I-80", "I-88", "I-90", "I-94"],
    notes: ["Runs concurrently with I-90 and I-94 for a long stretch through Wisconsin."],
  }),
  primary("I-40", {
    states: "CA, AZ, NM, TX, OK, AR, TN, NC",
    corridor: "Barstow to Wilmington",
    summary: "Major east-west route paralleling much of historic Route 66 in the west and crossing the Mid-South to North Carolina.",
    mileage: [
      { state: "CA", miles: 154.6 },
      { state: "AZ", miles: 359.1 },
      { state: "NM", miles: 373.5 },
      { state: "TX", miles: 177.1 },
      { state: "OK", miles: 331.0 },
      { state: "AR", miles: 284.7 },
      { state: "TN", miles: 455.3 },
      { state: "NC", miles: 423.4 }
    ],
    year: 1957,
    from: "Barstow, CA (I-15)", to: "Wilmington, NC (US 117)",
    cities: ["Flagstaff", "Albuquerque", "Amarillo", "Oklahoma City", "Little Rock", "Memphis", "Nashville", "Knoxville"],
    junctions: ["I-15", "I-17", "I-25", "I-27", "I-35", "I-44", "I-55", "I-65", "I-75", "I-81", "I-85", "I-95"],
    notes: [
      "Third-longest Interstate, tracing much of old US Route 66 across the Southwest.",
      "Crosses the Mississippi River at Memphis on the Hernando de Soto Bridge.",
    ],
  }),
  primary("I-41", {
    states: "WI, IL",
    corridor: "Milwaukee region to Green Bay",
    summary: "Eastern Wisconsin corridor connecting Milwaukee, the Fox Cities, and Green Bay.",
    mileage: [
      { state: "IL", miles: 0.9 },
      { state: "WI", miles: 174.1 }
    ],
    year: 2015,
    from: "Illinois state line (I-94)", to: "Green Bay, WI (I-43)",
    cities: ["Milwaukee", "Oshkosh", "Appleton", "Green Bay"],
    junctions: ["I-43", "I-94"],
    notes: ["Co-signed with I-94 and US 41 through the Milwaukee area."],
  }),
  primary("I-42", {
    states: "NC",
    corridor: "Eastern North Carolina segments",
    summary: "Partially completed corridor along the US 70 route toward the Port of Morehead City.",
    mileage: [{ state: "NC", miles: 70.0 }],
    year: 2016,
    from: "Garner, NC (I-40)", to: "Havelock, NC (US 70)",
    cities: ["Garner", "Goldsboro", "Kinston", "New Bern"],
    junctions: ["I-40"],
    notes: ["A developing corridor being upgraded from US 70 toward the coast."],
  }),
  primary("I-43", {
    states: "WI",
    corridor: "Beloit to Green Bay",
    summary: "Wisconsin route through Milwaukee, Sheboygan, Manitowoc, and Green Bay.",
    mileage: [{ state: "WI", miles: 191.6 }],
    year: 1988,
    from: "Beloit, WI (I-39/I-90)", to: "Green Bay, WI (I-41)",
    cities: ["Beloit", "Milwaukee", "Sheboygan", "Green Bay"],
    junctions: ["I-39", "I-90", "I-94", "I-41"],
    notes: ["Entirely within Wisconsin, hugging the Lake Michigan shore north of Milwaukee."],
  }),
  primary("I-44", {
    states: "TX, OK, MO",
    corridor: "Wichita Falls to St. Louis",
    summary: "Southwest-to-Missouri corridor through Oklahoma City, Tulsa, and Springfield.",
    mileage: [
      { state: "TX", miles: 15.4 },
      { state: "OK", miles: 328.5 },
      { state: "MO", miles: 290.2 }
    ],
    year: 1958,
    from: "Wichita Falls, TX (US 277/281)", to: "St. Louis, MO (I-55/I-64/I-70)",
    cities: ["Wichita Falls", "Lawton", "Oklahoma City", "Tulsa", "Springfield", "St. Louis"],
    junctions: ["I-35", "I-40", "I-49", "I-55", "I-64", "I-70"],
    notes: ["Much of the Oklahoma section follows the tolled Turner and Will Rogers Turnpikes."],
  }),
  primary("I-45", {
    states: "TX",
    corridor: "Galveston to Dallas",
    summary: "Texas-only route connecting the Gulf Coast, Houston, and Dallas.",
    mileage: [{ state: "TX", miles: 284.9 }],
    year: 1957,
    from: "Galveston, TX (Broadway)", to: "Dallas, TX (I-30)",
    cities: ["Galveston", "Houston", "Huntsville", "Corsicana", "Dallas"],
    junctions: ["I-10", "I-610", "I-30", "I-20"],
    notes: ["Entirely within Texas, linking two of the state's largest metros."],
  }),
  primary("I-49", {
    states: "LA, AR, MO",
    corridor: "Gulf Coast corridor toward Kansas City",
    summary: "Multi-state corridor with completed and developing sections through Louisiana, Arkansas, and Missouri.",
    mileage: [
      { state: "LA", miles: 239.3 },
      { state: "AR", miles: 110.0 },
      { state: "MO", miles: 132.0 }
    ],
    year: 1984,
    from: "Lafayette, LA (I-10)", to: "Kansas City, MO (I-435/I-470 area)",
    cities: ["Lafayette", "Shreveport", "Fort Smith", "Joplin"],
    junctions: ["I-10", "I-20", "I-30", "I-40", "I-44"],
    notes: ["Being assembled in segments into a continuous Gulf-to-Midwest corridor."],
  }),
  primary("I-55", {
    states: "LA, MS, TN, AR, MO, IL",
    corridor: "New Orleans to Chicago",
    summary: "Mississippi River corridor through Jackson, Memphis, St. Louis, and Springfield.",
    mileage: [
      { state: "LA", miles: 65.8 },
      { state: "MS", miles: 290.4 },
      { state: "TN", miles: 12.3 },
      { state: "AR", miles: 15.3 },
      { state: "MO", miles: 210.5 },
      { state: "IL", miles: 313.8 }
    ],
    year: 1957,
    from: "LaPlace, LA (I-10)", to: "Chicago, IL (US 41)",
    cities: ["Jackson", "Memphis", "St. Louis", "Springfield", "Chicago"],
    junctions: ["I-10", "I-12", "I-20", "I-40", "I-44", "I-64", "I-70", "I-72", "I-80", "I-90", "I-94"],
    notes: ["Loosely traces the Mississippi River up the spine of the central states."],
  }),
  primary("I-57", {
    states: "MO, IL",
    corridor: "Sikeston to Chicago",
    summary: "Illinois north-south route and future extension corridor toward the lower Mississippi Valley.",
    mileage: [
      { state: "MO", miles: 21.7 },
      { state: "IL", miles: 364.2 }
    ],
    year: 1961,
    from: "Sikeston, MO (I-55)", to: "Chicago, IL (I-94)",
    cities: ["Sikeston", "Effingham", "Champaign", "Chicago"],
    junctions: ["I-55", "I-64", "I-70", "I-72", "I-74", "I-80", "I-90", "I-94"],
    notes: ["Provides a faster Memphis-to-Chicago path than following I-55 the whole way."],
  }),
  primary("I-59", {
    states: "LA, MS, AL, GA",
    corridor: "New Orleans area to Wildwood",
    summary: "Southeastern diagonal route through Hattiesburg, Meridian, Birmingham, and Gadsden.",
    mileage: [
      { state: "LA", miles: 11.5 },
      { state: "MS", miles: 171.7 },
      { state: "AL", miles: 241.2 },
      { state: "GA", miles: 20.7 }
    ],
    year: 1957,
    from: "Slidell, LA (I-10/I-12)", to: "Wildwood, GA (I-24/I-75)",
    cities: ["Hattiesburg", "Meridian", "Tuscaloosa", "Birmingham", "Gadsden"],
    junctions: ["I-10", "I-12", "I-20", "I-65", "I-24", "I-75"],
    notes: ["Shares a long concurrency with I-20 across central Alabama."],
  }),
  primary("I-64", {
    states: "MO, IL, IN, KY, WV, VA",
    corridor: "St. Louis to Hampton Roads",
    summary: "East-west route through Louisville, Lexington, Charleston, Richmond, and Norfolk.",
    mileage: [
      { state: "MO", miles: 40.8 },
      { state: "IL", miles: 128.1 },
      { state: "IN", miles: 123.3 },
      { state: "KY", miles: 191.1 },
      { state: "WV", miles: 188.8 },
      { state: "VA", miles: 298.8 }
    ],
    year: 1958,
    from: "Wentzville, MO (I-70)", to: "Chesapeake, VA (I-264/US 17)",
    cities: ["St. Louis", "Louisville", "Lexington", "Charleston", "Richmond", "Norfolk"],
    junctions: ["I-70", "I-55", "I-65", "I-75", "I-77", "I-81", "I-95"],
    notes: ["Connects the Midwest with the Hampton Roads port complex on the Atlantic."],
  }),
  primary("I-65", {
    states: "AL, TN, KY, IN",
    corridor: "Mobile to Gary",
    summary: "North-south corridor through Montgomery, Birmingham, Nashville, Louisville, and Indianapolis.",
    mileage: [
      { state: "AL", miles: 366.2 },
      { state: "TN", miles: 121.7 },
      { state: "KY", miles: 137.3 },
      { state: "IN", miles: 261.3 }
    ],
    year: 1957,
    from: "Mobile, AL (I-10)", to: "Gary, IN (I-90/I-94)",
    cities: ["Mobile", "Montgomery", "Birmingham", "Nashville", "Louisville", "Indianapolis"],
    junctions: ["I-10", "I-20", "I-40", "I-64", "I-70", "I-80", "I-90", "I-94"],
    notes: ["A major north-south spine linking the Gulf Coast with the southern Great Lakes."],
  }),
  primary("I-66", {
    states: "VA, DC",
    corridor: "Middletown to Washington",
    summary: "Northern Virginia commuter and regional route into the District of Columbia.",
    mileage: [
      { state: "VA", miles: 74.8 },
      { state: "DC", miles: 1.5 }
    ],
    year: 1959,
    from: "Middletown, VA (I-81)", to: "Washington, DC (US 29)",
    cities: ["Front Royal", "Manassas", "Arlington", "Washington"],
    junctions: ["I-81", "I-495", "I-395"],
    notes: ["Known for HOV and express-lane rules on its approach to the capital."],
  }),
  primary("I-68", {
    states: "WV, MD",
    corridor: "Morgantown to Hancock",
    summary: "Appalachian east-west route connecting I-79 and I-70.",
    mileage: [
      { state: "WV", miles: 31.5 },
      { state: "MD", miles: 81.1 }
    ],
    year: 1991,
    from: "Morgantown, WV (I-79)", to: "Hancock, MD (I-70)",
    cities: ["Morgantown", "Cumberland", "Hancock"],
    junctions: ["I-79", "I-70"],
    notes: ["Includes the dramatic Sideling Hill road cut through the Maryland ridges."],
  }),
  primary("I-69", {
    states: "TX, LA, MS, TN, KY, IN, MI",
    corridor: "Segmented Canada-to-Mexico corridor",
    summary: "Multi-state corridor with active and developing segments from Texas and the Mid-South to Michigan.",
    mileage: [
      { state: "IN", miles: 356.3 },
      { state: "MI", miles: 202.3 }
    ],
    year: 1957,
    from: "Texas border segments", to: "Port Huron, MI (Canada border)",
    cities: ["Memphis", "Evansville", "Indianapolis", "Fort Wayne", "Flint", "Port Huron"],
    junctions: ["I-40", "I-64", "I-70", "I-74", "I-94", "I-475", "I-275"],
    notes: ["A NAFTA-era corridor still being assembled in pieces across several states."],
  }),
  primary("I-70", {
    states: "UT, CO, KS, MO, IL, IN, OH, WV, PA, MD",
    corridor: "Cove Fort to Baltimore",
    summary: "Mountain-to-Mid-Atlantic route through Denver, Kansas City, St. Louis, Indianapolis, Columbus, and western Maryland.",
    mileage: [
      { state: "UT", miles: 231.7 },
      { state: "CO", miles: 449.2 },
      { state: "KS", miles: 424.2 },
      { state: "MO", miles: 251.7 },
      { state: "IL", miles: 155.9 },
      { state: "IN", miles: 156.6 },
      { state: "OH", miles: 225.6 },
      { state: "WV", miles: 14.5 },
      { state: "PA", miles: 167.9 },
      { state: "MD", miles: 93.6 }
    ],
    year: 1956,
    from: "Cove Fort, UT (I-15)", to: "Baltimore, MD (I-695)",
    cities: ["Denver", "Topeka", "Kansas City", "St. Louis", "Indianapolis", "Columbus", "Pittsburgh area"],
    junctions: ["I-15", "I-25", "I-35", "I-44", "I-55", "I-64", "I-65", "I-75", "I-79", "I-95"],
    notes: [
      "One of the first Interstates funded; an early segment in Kansas is often cited as the program's first.",
      "Crosses the Rockies through the Eisenhower-Johnson Memorial Tunnel, the highest point on the system.",
    ],
  }),
  primary("I-71", {
    states: "KY, OH",
    corridor: "Louisville to Cleveland",
    summary: "Ohio Valley route through Cincinnati and Columbus to Cleveland.",
    mileage: [
      { state: "KY", miles: 97.4 },
      { state: "OH", miles: 247.5 }
    ],
    year: 1959,
    from: "Louisville, KY (I-64/I-65)", to: "Cleveland, OH (I-90)",
    cities: ["Louisville", "Cincinnati", "Columbus", "Cleveland"],
    junctions: ["I-64", "I-65", "I-75", "I-70", "I-90"],
    notes: ["Connects three of Ohio's major metro areas in a single diagonal."],
  }),
  primary("I-72", {
    states: "MO, IL",
    corridor: "Hannibal to Champaign",
    summary: "Central Illinois east-west route paired with the Chicago-Kansas City Expressway concept.",
    mileage: [
      { state: "MO", miles: 2.1 },
      { state: "IL", miles: 177.4 }
    ],
    year: 1990,
    from: "Hannibal, MO (US 61)", to: "Champaign, IL (I-57)",
    cities: ["Hannibal", "Springfield", "Decatur", "Champaign"],
    junctions: ["I-55", "I-57"],
    notes: ["Crosses the Mississippi River at Hannibal, Missouri."],
  }),
  primary("I-73", {
    states: "NC",
    corridor: "North Carolina Piedmont corridor",
    summary: "Developing north-south corridor with signed segments in North Carolina.",
    mileage: [{ state: "NC", miles: 90.0 }],
    year: 2008,
    from: "Greensboro, NC area", to: "Rockingham, NC area",
    cities: ["Greensboro", "Asheboro", "Rockingham"],
    junctions: ["I-40", "I-85", "I-74"],
    notes: ["Long planned to run from Michigan to South Carolina; only NC segments are signed."],
  }),
  primary("I-74", {
    states: "IA, IL, IN, OH, WV, VA, NC, SC",
    corridor: "Midwest and Carolinas segments",
    summary: "Segmented corridor from the Quad Cities and Peoria through Indianapolis and toward the Carolinas.",
    mileage: [
      { state: "IA", miles: 5.4 },
      { state: "IL", miles: 220.3 },
      { state: "IN", miles: 171.5 },
      { state: "OH", miles: 15.3 }
    ],
    year: 1958,
    from: "Davenport, IA (I-80)", to: "Carolinas segments",
    cities: ["Davenport", "Peoria", "Indianapolis", "Cincinnati area"],
    junctions: ["I-80", "I-39", "I-55", "I-57", "I-74", "I-465", "I-75"],
    notes: ["Exists as two main disconnected pieces: the Midwest and the Carolinas."],
  }),
  primary("I-75", {
    states: "FL, GA, TN, KY, OH, MI",
    corridor: "Miami Lakes to Sault Ste. Marie",
    summary: "Major north-south route through Florida, Atlanta, Knoxville, Cincinnati, Detroit, and northern Michigan.",
    mileage: [
      { state: "FL", miles: 470.9 },
      { state: "GA", miles: 355.1 },
      { state: "TN", miles: 161.8 },
      { state: "KY", miles: 191.8 },
      { state: "OH", miles: 211.3 },
      { state: "MI", miles: 395.9 }
    ],
    year: 1957,
    from: "Hialeah, FL (SR 826)", to: "Sault Ste. Marie, MI (I-75 BL)",
    cities: ["Miami", "Tampa", "Atlanta", "Knoxville", "Cincinnati", "Detroit"],
    junctions: ["I-10", "I-4", "I-16", "I-20", "I-24", "I-40", "I-64", "I-70", "I-71", "I-80", "I-90", "I-94"],
    notes: [
      "Crosses the Mackinac Bridge area approach in northern Michigan.",
      "Includes Alligator Alley across the Everglades in south Florida.",
    ],
  }),
  primary("I-76", {
    states: "CO, NE",
    corridor: "Denver to western Nebraska",
    summary: "Western I-76 connector from Denver toward I-80 in Nebraska.",
    mileage: [
      { state: "CO", miles: 184.1 },
      { state: "NE", miles: 3.2 }
    ],
    year: 1964,
    from: "Denver, CO (I-70)", to: "Big Springs, NE (I-80)",
    cities: ["Denver", "Fort Morgan", "Big Springs"],
    junctions: ["I-70", "I-80"],
    notes: ["One of two separate I-76 routes; this western one connects Denver to I-80."],
  }),
  primary("I-76 (PA-NJ)", {
    states: "OH, PA, NJ",
    corridor: "Ohio Turnpike to Camden",
    summary: "Eastern I-76 route via the Pennsylvania Turnpike and Schuylkill Expressway.",
    mileage: [
      { state: "OH", miles: 82.1 },
      { state: "PA", miles: 350.8 },
      { state: "NJ", miles: 3.1 }
    ],
    year: 1957,
    from: "Ohio Turnpike (I-80/I-90)", to: "Camden, NJ (I-676/US 30)",
    cities: ["Akron area", "Pittsburgh", "Philadelphia", "Camden"],
    junctions: ["I-80", "I-90", "I-70", "I-95", "I-476", "I-676"],
    notes: ["Shares its number with a separate western I-76 in Colorado and Nebraska."],
  }),
  primary("I-77", {
    states: "SC, NC, VA, WV, OH",
    corridor: "Columbia to Cleveland",
    summary: "Appalachian north-south route through Charlotte, Bluefield, Charleston, and Akron.",
    mileage: [
      { state: "SC", miles: 90.2 },
      { state: "NC", miles: 105.7 },
      { state: "VA", miles: 66.3 },
      { state: "WV", miles: 187.2 },
      { state: "OH", miles: 163.0 }
    ],
    year: 1958,
    from: "Columbia, SC (I-26)", to: "Cleveland, OH (I-90)",
    cities: ["Columbia", "Charlotte", "Bluefield", "Charleston", "Akron"],
    junctions: ["I-26", "I-85", "I-40", "I-81", "I-64", "I-70", "I-71", "I-90"],
    notes: ["Includes the East River Mountain Tunnel on the Virginia-West Virginia line."],
  }),
  primary("I-78", {
    states: "PA, NJ, NY",
    corridor: "Lebanon County to New York City",
    summary: "Northeastern route serving the Lehigh Valley, northern New Jersey, and New York Harbor access.",
    mileage: [
      { state: "PA", miles: 75.2 },
      { state: "NJ", miles: 67.8 },
      { state: "NY", miles: 0.9 }
    ],
    year: 1958,
    from: "Union Township, PA (I-81)", to: "New York, NY (Holland Tunnel)",
    cities: ["Allentown", "Newark", "Jersey City", "New York"],
    junctions: ["I-81", "I-476", "I-287", "I-95"],
    notes: ["Feeds the Holland Tunnel crossing into Lower Manhattan."],
  }),
  primary("I-79", {
    states: "WV, PA",
    corridor: "Charleston to Erie",
    summary: "Western Appalachian route through Morgantown, Washington, and Pittsburgh access.",
    mileage: [
      { state: "WV", miles: 160.5 },
      { state: "PA", miles: 182.2 }
    ],
    year: 1958,
    from: "Charleston, WV (I-64/I-77)", to: "Erie, PA (I-90)",
    cities: ["Charleston", "Morgantown", "Pittsburgh", "Erie"],
    junctions: ["I-64", "I-77", "I-68", "I-70", "I-76", "I-80", "I-90"],
    notes: ["Connects the Kanawha Valley to Lake Erie through the Allegheny Plateau."],
  }),
  primary("I-80", {
    states: "CA, NV, UT, WY, NE, IA, IL, IN, OH, PA, NJ",
    corridor: "San Francisco to Teaneck",
    summary: "Second-longest Interstate, spanning the Sierra Nevada, Great Plains, Midwest, and Northeast.",
    mileage: [
      { state: "CA", miles: 199.2 },
      { state: "NV", miles: 410.7 },
      { state: "UT", miles: 196.3 },
      { state: "WY", miles: 402.8 },
      { state: "NE", miles: 455.3 },
      { state: "IA", miles: 306.0 },
      { state: "IL", miles: 163.5 },
      { state: "IN", miles: 151.6 },
      { state: "OH", miles: 237.5 },
      { state: "PA", miles: 311.1 },
      { state: "NJ", miles: 68.5 }
    ],
    year: 1956,
    from: "San Francisco, CA (US 101)", to: "Teaneck, NJ (I-95)",
    cities: ["San Francisco", "Sacramento", "Reno", "Salt Lake City", "Cheyenne", "Omaha", "Des Moines", "Chicago", "Cleveland"],
    junctions: ["I-5", "I-15", "I-25", "I-35", "I-29", "I-55", "I-65", "I-75", "I-76", "I-90", "I-95"],
    notes: [
      "Second-longest Interstate, roughly following the historic Lincoln Highway and California Trail.",
      "Crosses Donner Pass in the Sierra Nevada and the Bonneville Salt Flats in Utah.",
    ],
  }),
  primary("I-81", {
    states: "TN, VA, WV, MD, PA, NY",
    corridor: "Dandridge to the Canadian border",
    summary: "Appalachian valley freight corridor through Virginia, Pennsylvania, and upstate New York.",
    mileage: [
      { state: "TN", miles: 75.7 },
      { state: "VA", miles: 324.9 },
      { state: "WV", miles: 26.0 },
      { state: "MD", miles: 12.1 },
      { state: "PA", miles: 232.6 },
      { state: "NY", miles: 183.6 }
    ],
    year: 1957,
    from: "Dandridge, TN (I-40)", to: "Wellesley Island, NY (Canada border)",
    cities: ["Bristol", "Roanoke", "Harrisonburg", "Harrisburg", "Scranton", "Syracuse"],
    junctions: ["I-40", "I-26", "I-64", "I-66", "I-70", "I-76", "I-78", "I-80", "I-84", "I-88", "I-90"],
    notes: ["A heavily traveled truck route through the Great Appalachian Valley."],
  }),
  primary("I-82", {
    states: "WA, OR",
    corridor: "Ellensburg to Hermiston",
    summary: "Pacific Northwest route connecting central Washington to northeastern Oregon.",
    mileage: [
      { state: "WA", miles: 132.6 },
      { state: "OR", miles: 11.0 }
    ],
    year: 1957,
    from: "Ellensburg, WA (I-90)", to: "Hermiston, OR area (I-84)",
    cities: ["Yakima", "Tri-Cities", "Hermiston"],
    junctions: ["I-90", "I-84"],
    notes: ["Crosses the Columbia River near the Tri-Cities of Washington."],
  }),
  primary("I-83", {
    states: "MD, PA",
    corridor: "Baltimore to Harrisburg",
    summary: "Short Mid-Atlantic route connecting Baltimore and south-central Pennsylvania.",
    mileage: [
      { state: "MD", miles: 34.5 },
      { state: "PA", miles: 50.8 }
    ],
    year: 1959,
    from: "Baltimore, MD (I-695)", to: "Harrisburg, PA (I-81)",
    cities: ["Baltimore", "York", "Harrisburg"],
    junctions: ["I-695", "I-695", "I-81", "I-83"],
    notes: ["Links the Baltimore Beltway with the Pennsylvania capital region."],
  }),
  primary("I-84", {
    states: "OR, ID, UT",
    corridor: "Portland to Echo",
    summary: "Western I-84 route along the Columbia River, Snake River Plain, and northern Utah approach.",
    mileage: [
      { state: "OR", miles: 375.2 },
      { state: "ID", miles: 275.7 },
      { state: "UT", miles: 119.3 }
    ],
    year: 1957,
    from: "Portland, OR (I-5)", to: "Echo, UT (I-80)",
    cities: ["Portland", "The Dalles", "Boise", "Twin Falls"],
    junctions: ["I-5", "I-82", "I-86", "I-15", "I-80"],
    notes: ["Follows the Oregon Trail route along the Columbia and Snake Rivers."],
  }),
  primary("I-84 (PA-MA)", {
    states: "PA, NY, CT, MA",
    corridor: "Dunmore to Sturbridge",
    summary: "Eastern I-84 route through the Hudson Valley, Connecticut, and western Massachusetts.",
    mileage: [
      { state: "PA", miles: 54.5 },
      { state: "NY", miles: 71.8 },
      { state: "CT", miles: 97.9 },
      { state: "MA", miles: 8.2 }
    ],
    year: 1957,
    from: "Dunmore, PA (I-81)", to: "Sturbridge, MA (I-90)",
    cities: ["Scranton", "Newburgh", "Danbury", "Hartford"],
    junctions: ["I-81", "I-87", "I-91", "I-90"],
    notes: ["Shares its number with the western I-84 in Oregon, Idaho, and Utah."],
  }),
  primary("I-85", {
    states: "AL, GA, SC, NC, VA",
    corridor: "Montgomery to Petersburg",
    summary: "Southeastern Piedmont route through Atlanta, Greenville-Spartanburg, Charlotte, Greensboro, and Durham.",
    mileage: [
      { state: "AL", miles: 80.0 },
      { state: "GA", miles: 179.9 },
      { state: "SC", miles: 106.3 },
      { state: "NC", miles: 233.0 },
      { state: "VA", miles: 68.6 }
    ],
    year: 1957,
    from: "Montgomery, AL (I-65)", to: "Petersburg, VA (I-95)",
    cities: ["Montgomery", "Atlanta", "Greenville", "Charlotte", "Greensboro", "Durham"],
    junctions: ["I-65", "I-20", "I-75", "I-26", "I-77", "I-40", "I-95"],
    notes: ["The backbone of the fast-growing southern Piedmont urban crescent."],
  }),
  primary("I-86", {
    states: "ID",
    corridor: "Heyburn to Chubbuck",
    summary: "Western I-86 route in southern Idaho.",
    mileage: [{ state: "ID", miles: 62.9 }],
    year: 1990,
    from: "Heyburn, ID (I-84)", to: "Chubbuck, ID (I-15)",
    cities: ["Heyburn", "American Falls", "Chubbuck"],
    junctions: ["I-84", "I-15"],
    notes: ["Connects I-84 and I-15 across the Snake River Plain."],
  }),
  primary("I-86 (PA-NY)", {
    states: "PA, NY",
    corridor: "Erie region to the Southern Tier",
    summary: "Eastern I-86 route across western and southern New York with Pennsylvania access.",
    mileage: [
      { state: "PA", miles: 7.0 },
      { state: "NY", miles: 213.0 }
    ],
    year: 1999,
    from: "Western New York (I-90 area)", to: "Southern Tier, NY",
    cities: ["Jamestown", "Corning", "Elmira", "Binghamton"],
    junctions: ["I-90", "I-99", "I-81"],
    notes: ["Built largely by upgrading New York's Southern Tier Expressway (old NY 17)."],
  }),
  primary("I-87", {
    states: "NC",
    corridor: "Raleigh area",
    summary: "Signed North Carolina corridor on the Raleigh beltway and future route toward Norfolk.",
    mileage: [{ state: "NC", miles: 13.5 }],
    year: 2016,
    from: "Raleigh, NC (I-40/I-440)", to: "Wendell, NC area (US 64)",
    cities: ["Raleigh", "Wendell"],
    junctions: ["I-40", "I-440"],
    notes: ["A new designation meant to grow into a Raleigh-to-Norfolk corridor."],
  }),
  primary("I-87 (NY)", {
    states: "NY",
    corridor: "New York City to the Canadian border",
    summary: "New York Thruway and Northway route through Albany to the Quebec border.",
    mileage: [{ state: "NY", miles: 333.5 }],
    year: 1957,
    from: "New York, NY (I-278)", to: "Champlain, NY (Canada border)",
    cities: ["New York", "Yonkers", "Albany", "Plattsburgh"],
    junctions: ["I-278", "I-95", "I-84", "I-90"],
    notes: ["Combines the southern Thruway with the Adirondack Northway to Canada."],
  }),
  primary("I-88", {
    states: "IL",
    corridor: "Quad Cities to Chicago region",
    summary: "Illinois tollway route across northern Illinois.",
    mileage: [{ state: "IL", miles: 140.6 }],
    year: 1987,
    from: "Moline, IL (I-74)", to: "Aurora, IL (I-290/I-294 area)",
    cities: ["Moline", "DeKalb", "Aurora"],
    junctions: ["I-74", "I-39", "I-88", "I-290"],
    notes: ["Operated as the Ronald Reagan Memorial Tollway."],
  }),
  primary("I-88 (NY)", {
    states: "NY",
    corridor: "Binghamton to Schenectady",
    summary: "Upstate New York route through Oneonta and the Mohawk Valley approach.",
    mileage: [{ state: "NY", miles: 117.7 }],
    year: 1969,
    from: "Binghamton, NY (I-81)", to: "Schenectady, NY (I-90)",
    cities: ["Binghamton", "Oneonta", "Schenectady"],
    junctions: ["I-81", "I-90"],
    notes: ["Shares its number with the Illinois I-88 tollway."],
  }),
  primary("I-89", {
    states: "NH, VT",
    corridor: "Concord to the Canadian border",
    summary: "Northern New England route through Vermont to Quebec.",
    mileage: [
      { state: "NH", miles: 60.6 },
      { state: "VT", miles: 130.3 }
    ],
    year: 1957,
    from: "Concord, NH (I-93)", to: "Highgate, VT (Canada border)",
    cities: ["Concord", "Lebanon", "Montpelier", "Burlington"],
    junctions: ["I-93", "I-91", "I-189"],
    notes: ["Connects the New Hampshire and Vermont capital regions to Canada."],
  }),
  primary("I-90", {
    states: "WA, ID, MT, WY, SD, MN, WI, IL, IN, OH, PA, NY, MA",
    corridor: "Seattle to Boston",
    summary: "Longest Interstate, crossing the northern tier from Puget Sound to the Atlantic.",
    mileage: [
      { state: "WA", miles: 297.5 },
      { state: "ID", miles: 73.5 },
      { state: "MT", miles: 551.7 },
      { state: "WY", miles: 208.8 },
      { state: "SD", miles: 412.5 },
      { state: "MN", miles: 275.7 },
      { state: "WI", miles: 187.1 },
      { state: "IL", miles: 123.9 },
      { state: "IN", miles: 156.3 },
      { state: "OH", miles: 244.8 },
      { state: "PA", miles: 46.3 },
      { state: "NY", miles: 490.8 },
      { state: "MA", miles: 135.7 }
    ],
    year: 1957,
    from: "Seattle, WA (SR 519)", to: "Boston, MA (Route 1A)",
    cities: ["Seattle", "Spokane", "Billings", "Rapid City", "Sioux Falls", "Chicago", "Cleveland", "Buffalo", "Albany", "Boston"],
    junctions: ["I-5", "I-15", "I-25", "I-29", "I-35", "I-39", "I-65", "I-75", "I-80", "I-81", "I-87", "I-95"],
    notes: [
      "The longest Interstate Highway, crossing 13 states from Puget Sound to the Atlantic.",
      "Much of the eastern half follows tolled turnpikes and thruways.",
    ],
  }),
  primary("I-91", {
    states: "CT, MA, VT",
    corridor: "New Haven to the Canadian border",
    summary: "Connecticut River valley route through Hartford, Springfield, and Vermont.",
    mileage: [
      { state: "CT", miles: 58.0 },
      { state: "MA", miles: 54.9 },
      { state: "VT", miles: 177.4 }
    ],
    year: 1958,
    from: "New Haven, CT (I-95)", to: "Derby Line, VT (Canada border)",
    cities: ["New Haven", "Hartford", "Springfield", "White River Junction"],
    junctions: ["I-95", "I-84", "I-90", "I-89"],
    notes: ["Follows the Connecticut River valley nearly its entire length."],
  }),
  primary("I-93", {
    states: "MA, NH, VT",
    corridor: "Boston to St. Johnsbury",
    summary: "New England route through Boston, Manchester, Concord, and the White Mountains.",
    mileage: [
      { state: "MA", miles: 46.7 },
      { state: "NH", miles: 131.4 },
      { state: "VT", miles: 11.1 }
    ],
    year: 1957,
    from: "Canton, MA (I-95)", to: "St. Johnsbury, VT (I-91)",
    cities: ["Boston", "Manchester", "Concord", "Lincoln"],
    junctions: ["I-95", "I-90", "I-89", "I-91"],
    notes: ["Runs through Boston's Central Artery tunnel, the heart of the Big Dig."],
  }),
  primary("I-94", {
    states: "MT, ND, MN, WI, IL, IN, MI",
    corridor: "Billings to Port Huron",
    summary: "Northern Plains and Great Lakes route through Fargo, Minneapolis-St. Paul, Milwaukee, Chicago, and Detroit.",
    mileage: [
      { state: "MT", miles: 249.2 },
      { state: "ND", miles: 352.4 },
      { state: "MN", miles: 259.5 },
      { state: "WI", miles: 348.2 },
      { state: "IL", miles: 77.2 },
      { state: "IN", miles: 46.1 },
      { state: "MI", miles: 275.5 }
    ],
    year: 1957,
    from: "Billings, MT (I-90)", to: "Port Huron, MI (Canada border)",
    cities: ["Billings", "Bismarck", "Fargo", "Minneapolis", "Milwaukee", "Chicago", "Detroit"],
    junctions: ["I-90", "I-29", "I-35", "I-39", "I-43", "I-65", "I-69", "I-75", "I-80"],
    notes: ["Connects the northern Great Plains with the industrial Great Lakes."],
  }),
  primary("I-95", {
    states: "FL, GA, SC, NC, VA, DC, MD, DE, PA, NJ, NY, CT, RI, MA, NH, ME",
    corridor: "Miami to Houlton",
    summary: "Atlantic Seaboard spine serving major East Coast metropolitan regions.",
    mileage: [
      { state: "FL", miles: 382.2 },
      { state: "GA", miles: 112.0 },
      { state: "SC", miles: 198.8 },
      { state: "NC", miles: 181.7 },
      { state: "VA", miles: 178.7 },
      { state: "DC", miles: 0.1 },
      { state: "MD", miles: 110.0 },
      { state: "DE", miles: 23.4 },
      { state: "PA", miles: 51.1 },
      { state: "NJ", miles: 97.8 },
      { state: "NY", miles: 23.5 },
      { state: "CT", miles: 111.6 },
      { state: "RI", miles: 43.3 },
      { state: "MA", miles: 91.9 },
      { state: "NH", miles: 16.1 },
      { state: "ME", miles: 303.1 }
    ],
    year: 1957,
    from: "Miami, FL (US 1)", to: "Houlton, ME (Canada border)",
    cities: ["Miami", "Jacksonville", "Savannah", "Richmond", "Washington", "Baltimore", "Philadelphia", "New York", "Boston"],
    junctions: ["I-4", "I-10", "I-16", "I-20", "I-26", "I-40", "I-64", "I-66", "I-76", "I-78", "I-80", "I-87", "I-90", "I-93"],
    notes: [
      "Longest north-south Interstate and the busiest, serving the Eastern Seaboard megalopolis.",
      "Passes through 15 states plus the District of Columbia, more than any other Interstate.",
    ],
  }),
  primary("I-96", {
    states: "MI",
    corridor: "Muskegon to Detroit",
    summary: "Michigan east-west route connecting the Lake Michigan shore, Grand Rapids, Lansing, and Detroit.",
    mileage: [{ state: "MI", miles: 192.1 }],
    year: 1957,
    from: "Norton Shores, MI (US 31)", to: "Detroit, MI (I-75)",
    cities: ["Muskegon", "Grand Rapids", "Lansing", "Detroit"],
    junctions: ["I-196", "I-69", "I-96", "I-275", "I-75"],
    notes: ["Entirely within Michigan, linking the west shore to Detroit."],
  }),
  primary("I-97", {
    states: "MD",
    corridor: "Annapolis to Baltimore",
    summary: "Short Maryland route and the only two-digit Interstate entirely within one county.",
    mileage: [{ state: "MD", miles: 17.6 }],
    year: 1987,
    from: "Annapolis, MD (US 50/301)", to: "Baltimore, MD (I-695)",
    cities: ["Annapolis", "Glen Burnie", "Baltimore"],
    junctions: ["I-695"],
    notes: [
      "Long cited as the shortest two-digit Interstate and the only one contained entirely within a single county, Anne Arundel County.",
      "Despite the short length it carries a full two-digit primary designation.",
    ],
  }),
  primary("I-99", {
    states: "PA, NY",
    corridor: "Central Pennsylvania toward the Southern Tier",
    summary: "Appalachian corridor with completed segments in Pennsylvania and New York.",
    mileage: [
      { state: "PA", miles: 85.0 },
      { state: "NY", miles: 15.0 }
    ],
    year: 1995,
    from: "Bedford, PA (I-70/I-76)", to: "Painted Post, NY (I-86)",
    cities: ["Bedford", "Altoona", "State College", "Corning"],
    junctions: ["I-70", "I-76", "I-80", "I-86"],
    notes: [
      "Its number breaks the usual west-to-east grid; it sits far east of lower-numbered routes.",
      "The designation was written directly into federal law rather than assigned by the usual process.",
    ],
  }),
];

// ---------------------------------------------------------------------------
// Non-contiguous federal Interstate programs (Hawaii, Alaska, Puerto Rico).
// ---------------------------------------------------------------------------

const nonContiguousSeed = [
  nonContiguous("H-1", {
    states: "HI", status: "Active",
    corridor: "Kapolei to Honolulu",
    summary: "Primary Oahu freeway serving Honolulu, Pearl Harbor, and west Oahu.",
    mileage: [{ state: "HI", miles: 27.2 }],
    year: 1960,
    from: "Kapolei, HI", to: "Kahala, Honolulu, HI",
    cities: ["Kapolei", "Pearl City", "Honolulu"],
    junctions: ["H-2", "H-201"],
    notes: ["The busiest of Hawaii's Interstates, running through metropolitan Honolulu."],
  }),
  nonContiguous("H-2", {
    states: "HI", status: "Active",
    corridor: "Pearl City to Wahiawa",
    summary: "Oahu north-south freeway connecting H-1 with central Oahu.",
    mileage: [{ state: "HI", miles: 8.3 }],
    year: 1977,
    from: "Pearl City, HI (H-1)", to: "Wahiawa, HI",
    cities: ["Pearl City", "Mililani", "Wahiawa"],
    junctions: ["H-1"],
    notes: ["Carries traffic toward the central Oahu plateau and the North Shore."],
  }),
  nonContiguous("H-3", {
    states: "HI", status: "Active",
    corridor: "Halawa to Kaneohe",
    summary: "Windward Oahu route through the Ko'olau Range.",
    mileage: [{ state: "HI", miles: 15.3 }],
    year: 1997,
    from: "Halawa, HI (H-1)", to: "Kaneohe, HI (Marine Corps base)",
    cities: ["Halawa", "Kaneohe"],
    junctions: ["H-1"],
    notes: ["Crosses the Ko'olau mountains through twin tunnels; one of the most expensive Interstates per mile ever built."],
  }),
  nonContiguous("A-1", {
    states: "AK", status: "Federal program",
    corridor: "Alaska Interstate program",
    summary: "Unsigned Alaska Interstate corridor recognized for federal funding.",
    mileage: [{ state: "AK", miles: 408.2 }],
    year: 1976,
    from: "Anchorage area", to: "Tok area",
    cities: ["Anchorage", "Glennallen", "Tok"],
    junctions: [],
    notes: ["Alaska's Interstates are eligible for federal funds but are not signed with shields."],
  }),
  nonContiguous("A-2", {
    states: "AK", status: "Federal program",
    corridor: "Alaska Interstate program",
    summary: "Unsigned Alaska Interstate corridor recognized for federal funding.",
    mileage: [{ state: "AK", miles: 202.2 }],
    year: 1976,
    from: "Tok area", to: "Fairbanks area",
    cities: ["Tok", "Delta Junction", "Fairbanks"],
    junctions: [],
    notes: ["Follows the Alaska Highway and Richardson Highway corridors."],
  }),
  nonContiguous("A-3", {
    states: "AK", status: "Federal program",
    corridor: "Alaska Interstate program",
    summary: "Unsigned Alaska Interstate corridor recognized for federal funding.",
    mileage: [{ state: "AK", miles: 148.1 }],
    year: 1976,
    from: "Anchorage/Palmer area", to: "Fairbanks area",
    cities: ["Palmer", "Cantwell", "Fairbanks"],
    junctions: [],
    notes: ["Roughly follows the Parks Highway between Anchorage and Fairbanks."],
  }),
  nonContiguous("A-4", {
    states: "AK", status: "Federal program",
    corridor: "Alaska Interstate program",
    summary: "Unsigned Alaska Interstate corridor recognized for federal funding.",
    mileage: [{ state: "AK", miles: 156.3 }],
    year: 1976,
    from: "Anchorage area", to: "Seward/Soldotna area",
    cities: ["Anchorage", "Seward"],
    junctions: [],
    notes: ["Serves the Kenai Peninsula gateway south of Anchorage."],
  }),
  nonContiguous("PRI-1", {
    states: "PR", status: "Federal program",
    corridor: "San Juan to Ponce corridor",
    summary: "Puerto Rico Interstate program route recognized for federal funding.",
    mileage: [{ state: "PR", miles: 52.7 }],
    year: 1965,
    from: "San Juan, PR", to: "Ponce, PR",
    cities: ["San Juan", "Caguas", "Ponce"],
    junctions: ["PRI-2", "PRI-3"],
    notes: ["Largely follows the tolled PR-52 expressway across the island's mountainous interior."],
  }),
  nonContiguous("PRI-2", {
    states: "PR", status: "Federal program",
    corridor: "Western and southern Puerto Rico",
    summary: "Puerto Rico Interstate program route recognized for federal funding.",
    mileage: [{ state: "PR", miles: 70.0 }],
    year: 1965,
    from: "San Juan, PR", to: "Ponce, PR (via the west)",
    cities: ["San Juan", "Arecibo", "Mayaguez", "Ponce"],
    junctions: ["PRI-1"],
    notes: ["Wraps the western end of the island along the PR-22 and PR-2 corridors."],
  }),
  nonContiguous("PRI-3", {
    states: "PR", status: "Federal program",
    corridor: "Eastern Puerto Rico",
    summary: "Puerto Rico Interstate program route recognized for federal funding.",
    mileage: [{ state: "PR", miles: 26.6 }],
    year: 1965,
    from: "San Juan, PR", to: "Fajardo, PR",
    cities: ["San Juan", "Carolina", "Fajardo"],
    junctions: ["PRI-1"],
    notes: ["Serves the eastern San Juan metro and the Fajardo gateway."],
  }),
];

// ---------------------------------------------------------------------------
// Notable auxiliary (three-digit) routes. Moderate detail; these illustrate the
// loop/spur conventions and the heavy reuse of three-digit numbers nationwide.
// ---------------------------------------------------------------------------

const notableAuxSeed = [
  aux("I-105", "I-5", { states: "CA", corridor: "Los Angeles region", summary: "Century Freeway connector serving LAX-area travel.", mileage: [{state: "CA", miles: 18.8}], year: 1993, cities: ["Los Angeles", "Norwalk"], notes: ["One of the last major urban freeways built in Los Angeles."] }),
  aux("I-110", "I-10", { states: "CA, TX", corridor: "Los Angeles and El Paso", summary: "Two signed auxiliary examples sharing the same designation in different states.", cities: ["Los Angeles", "El Paso"], notes: ["The same number is signed in two unrelated cities."] }),
  aux("I-190", "I-90", { states: "IL, MA, NY", corridor: "Chicago, Worcester, Buffalo/Niagara", summary: "Repeated auxiliary number used for airport, city, and border access corridors.", cities: ["Chicago", "Worcester", "Buffalo"], notes: ["Chicago's I-190 is the access road to O'Hare International Airport."] }),
  aux("I-195", "I-95", { states: "FL, ME, MD, MA/RI, NJ, VA", corridor: "Multiple East Coast connectors", summary: "Common spur designation tied to the I-95 corridor family.", cities: ["Miami", "Providence", "Richmond"], notes: ["Miami's I-195 carries the Julia Tuttle Causeway to Miami Beach."] }),
  aux("I-205", "I-5", { states: "CA, OR/WA", corridor: "Tracy and Portland-Vancouver", summary: "Bypass-style routes around major I-5 corridors.", cities: ["Portland", "Vancouver"], notes: ["The Portland-area I-205 bypasses downtown to the east."] }),
  aux("I-215", "I-15", { states: "CA, NV, UT", corridor: "Inland Empire, Las Vegas, Salt Lake City", summary: "Urban loop and connector routes tied to I-15.", cities: ["San Bernardino", "Las Vegas", "Salt Lake City"], notes: ["Salt Lake City's I-215 forms a near-complete loop around the city."] }),
  aux("I-238", "I-880", { states: "CA", corridor: "Castro Valley to San Lorenzo", summary: "Rare active auxiliary route whose number does not match the usual parent-route convention.", mileage: [{state: "CA", miles: 2.2}], year: 1983, cities: ["Castro Valley", "San Lorenzo"], notes: ["The only Interstate whose number has no matching two-digit parent (there is no I-38)."] }),
  aux("I-235", "I-35", { states: "IA, KS, OK", corridor: "Des Moines, Wichita, Oklahoma City", summary: "Central city connectors in the I-35 family.", cities: ["Des Moines", "Wichita", "Oklahoma City"], notes: ["Each of these cities uses I-235 as an inner-city connector."] }),
  aux("I-240", "I-40", { states: "NC, OK, TN", corridor: "Asheville, Oklahoma City, Memphis", summary: "Even-prefix routes around or through I-40 metro areas.", cities: ["Asheville", "Oklahoma City", "Memphis"], notes: ["Memphis's I-240 forms a beltway around the city's south and east."] }),
  aux("I-270", "I-70", { states: "CO, IL/MO, MD, OH", corridor: "Denver, St. Louis, Washington, Columbus", summary: "Widely reused I-70 family designation for metropolitan bypasses and connectors.", cities: ["Denver", "St. Louis", "Washington", "Columbus"], notes: ["Columbus's I-270 is one of the longest beltways in the system."] }),
  aux("I-275", "I-75", { states: "FL, KY/IN/OH, MI", corridor: "Tampa Bay, Cincinnati, Detroit", summary: "Loop and bypass designation tied to I-75.", cities: ["Tampa", "Cincinnati", "Detroit"], notes: ["Cincinnati's I-275 loops through three states around the metro."] }),
  aux("I-280", "I-80", { states: "CA, IA/IL, NJ", corridor: "Bay Area, Quad Cities, New Jersey", summary: "I-80 family connector and bypass routes.", cities: ["San Francisco", "San Jose", "Newark"], notes: ["The Bay Area I-280 is known for its scenic peninsula routing."] }),
  aux("I-287", "I-87", { states: "NJ, NY", corridor: "Outer New York metropolitan belt", summary: "Major beltway-style auxiliary route around the New York City region.", cities: ["Edison", "White Plains"], notes: ["Forms a wide arc around the western and northern New York suburbs."] }),
  aux("I-290", "I-90", { states: "IL, MA, NY", corridor: "Chicago, Worcester, Buffalo", summary: "Urban auxiliary routes in the I-90 family.", cities: ["Chicago", "Worcester", "Buffalo"], notes: ["Chicago's I-290 is the Eisenhower Expressway into the Loop."] }),
  aux("I-295", "I-95", { states: "DC, DE/NJ, FL, ME, NC, NY, RI/MA, VA", corridor: "Multiple I-95 bypasses", summary: "One of the most reused auxiliary designations in the system.", cities: ["Washington", "Portland", "Richmond"], notes: ["Appears as a bypass or beltway segment in many separate East Coast metros."] }),
  aux("I-395", "I-95", { states: "CT, DC/VA, FL, MD, ME", corridor: "Urban I-95 connectors", summary: "Odd-prefix auxiliary routes connecting downtown or port districts.", cities: ["Washington", "Baltimore", "Miami"], notes: ["Washington's I-395 carries commuters into the heart of the capital."] }),
  aux("I-495", "I-95", { states: "DE, MA, NY, VA/DC/MD", corridor: "Capital Beltway and other loops", summary: "Famous I-95 family beltway designation, including Washington, D.C.'s Capital Beltway.", cities: ["Washington", "Boston", "New York"], notes: ["The Washington Capital Beltway is the best-known I-495 segment."] }),
  aux("I-610", "I-10", { states: "LA, TX", corridor: "New Orleans and Houston", summary: "Inner-loop routes tied to I-10.", cities: ["New Orleans", "Houston"], notes: ["Houston's I-610 is the inner Loop that defines the city's core."] }),
  aux("I-635", "I-35", { states: "KS/MO, TX", corridor: "Kansas City and Dallas", summary: "Even-prefix bypass loops in the I-35 family.", cities: ["Kansas City", "Dallas"], notes: ["Dallas's I-635 is the heavily traveled LBJ Freeway."] }),
  aux("I-695", "I-95", { states: "DC, MD, NY", corridor: "Baltimore Beltway and urban connectors", summary: "I-95 family auxiliary routes, including Baltimore's beltway.", cities: ["Baltimore"], notes: ["The Baltimore Beltway carried the Francis Scott Key Bridge until 2024."] }),
  aux("I-805", "I-5", { states: "CA", corridor: "San Diego", summary: "Bypass route through the San Diego region.", mileage: [{state: "CA", miles: 28.0}], cities: ["San Diego"], notes: ["An inland bypass of I-5 through eastern San Diego."] }),
  aux("I-880", "I-80", { states: "CA, IA/NE", corridor: "Bay Area and Council Bluffs", summary: "I-80 family auxiliary designation used in separate regions.", cities: ["Oakland", "San Jose"], notes: ["The Bay Area I-880 is the Nimitz Freeway along the East Bay."] }),
  aux("I-895", "I-95", { states: "MD, NY", corridor: "Baltimore and Bronx", summary: "Urban bypass and connector routes tied to I-95.", cities: ["Baltimore", "Bronx"], notes: ["Baltimore's I-895 carries the Harbor Tunnel Thruway."] }),
];

// ---------------------------------------------------------------------------
// Record builders.
// ---------------------------------------------------------------------------

function splitStates(states) {
  return states
    .split(/[,\/]/)
    .map((value) => value.trim())
    .filter(Boolean);
}

function calculateTotalLength(mileage) {
  if (!Array.isArray(mileage) || !mileage.length) return null;
  const total = mileage.reduce((sum, item) => sum + (item.miles || 0), 0);
  return Math.round(total * 10) / 10;
}

function primary(id, opts) {
  const numeric = numericFromId(id);
  const mileage = opts.mileage || [];
  return {
    id,
    slug: slugFromId(id),
    baseId: normalizeBaseId(id),
    number: numeric,
    category: "Primary",
    status: "Active",
    states: opts.states,
    statesList: splitStates(opts.states),
    mileage,
    corridor: opts.corridor,
    summary: opts.summary,
    axis: inferAxis(numeric),
    parent: "",
    generated: false,
    hasPage: true,
    lengthMi: opts.lengthMi ?? calculateTotalLength(mileage),
    year: opts.year ?? null,
    from: opts.from ?? "",
    to: opts.to ?? "",
    cities: opts.cities ?? [],
    junctions: opts.junctions ?? [],
    notes: opts.notes ?? [],
  };
}

function nonContiguous(id, opts) {
  const mileage = opts.mileage || [];
  return {
    id,
    slug: slugFromId(id),
    baseId: id,
    number: numericFromId(id),
    category: "Non-contiguous",
    status: opts.status,
    states: opts.states,
    statesList: splitStates(opts.states),
    mileage,
    corridor: opts.corridor,
    summary: opts.summary,
    axis: "Non-contiguous",
    parent: "",
    generated: false,
    hasPage: true,
    lengthMi: opts.lengthMi ?? calculateTotalLength(mileage),
    year: opts.year ?? null,
    from: opts.from ?? "",
    to: opts.to ?? "",
    cities: opts.cities ?? [],
    junctions: opts.junctions ?? [],
    notes: opts.notes ?? [],
  };
}

function aux(id, parent, opts) {
  const mileage = opts.mileage || [];
  return {
    id,
    slug: slugFromId(id),
    baseId: id,
    number: numericFromId(id),
    category: "Auxiliary",
    status: "Notable",
    states: opts.states,
    statesList: splitStates(opts.states),
    mileage,
    corridor: opts.corridor,
    summary: opts.summary,
    axis: "Auxiliary",
    parent,
    generated: false,
    hasPage: true,
    lengthMi: opts.lengthMi ?? calculateTotalLength(mileage),
    year: opts.year ?? null,
    from: opts.from ?? "",
    to: opts.to ?? "",
    cities: opts.cities ?? [],
    junctions: opts.junctions ?? [],
    notes: opts.notes ?? [],
  };
}

// ---------------------------------------------------------------------------
// Index maps and the full generated catalog (active seeds + theoretical slots).
// ---------------------------------------------------------------------------

const activePrimaryByBase = new Map();
for (const item of activePrimarySeed) {
  const base = normalizeBaseId(item.id);
  if (!activePrimaryByBase.has(base)) activePrimaryByBase.set(base, []);
  activePrimaryByBase.get(base).push(item);
}

const notableAuxById = new Map(notableAuxSeed.map((item) => [item.id, item]));

function buildAllRoutes() {
  const records = [];

  for (let number = 1; number <= 99; number += 1) {
    const id = `I-${number}`;
    const active = activePrimaryByBase.get(id);
    if (active) {
      records.push(...active);
    } else {
      records.push(generatedMainline(number));
    }
  }

  for (let number = 100; number <= 999; number += 1) {
    if (number % 100 === 0) continue;
    const id = `I-${number}`;
    const notable = notableAuxById.get(id);
    if (notable) {
      records.push(notable);
    } else {
      records.push(generatedAuxiliary(number));
    }
  }

  records.push(...nonContiguousSeed);
  return records;
}

function generatedMainline(number) {
  const id = `I-${number}`;
  const axis = inferAxis(number);
  const gridNote = number % 2 === 0
    ? "Even primary numbers usually identify east-west corridors."
    : "Odd primary numbers usually identify north-south corridors.";

  return {
    id,
    slug: slugFromId(id),
    baseId: id,
    number,
    category: "Primary",
    status: "Unassigned",
    states: "Unassigned",
    statesList: [],
    mileage: [],
    corridor: `${axis} mainline slot`,
    summary: `${id} is a valid one- or two-digit Interstate numbering slot, but it is not in this active-route seed list. ${gridNote}`,
    axis,
    parent: "",
    generated: true,
    hasPage: false,
    lengthMi: null,
    year: null,
    from: "",
    to: "",
    cities: [],
    junctions: [],
    notes: [],
  };
}

function generatedAuxiliary(number) {
  const parentNumber = number % 100;
  const parentId = `I-${parentNumber}`;
  const firstDigit = Math.floor(number / 100);
  const parentActive = activePrimaryByBase.has(parentId);
  const role = firstDigit % 2 === 0 ? "Loop or bypass convention" : "Spur or connector convention";
  const status = parentActive ? "Possible" : "Theoretical";
  const summary = parentActive
    ? `I-${number} follows the conventional auxiliary pattern for parent ${parentId}. ${role}: an even first digit usually suggests a loop or bypass, while odd first digits usually suggest a spur.`
    : `I-${number} has a valid three-digit shape, but its parent slot ${parentId} is not active in this seed list. That makes it theoretical unless a parent corridor is assigned.`;

  return {
    id: `I-${number}`,
    slug: slugFromId(`I-${number}`),
    baseId: `I-${number}`,
    number,
    category: "Auxiliary",
    status,
    states: parentActive ? "Possible" : "Unassigned parent",
    statesList: [],
    mileage: [],
    corridor: `${role} for ${parentId}`,
    summary,
    axis: "Auxiliary",
    parent: parentId,
    generated: true,
    hasPage: false,
    lengthMi: null,
    year: null,
    from: "",
    to: "",
    cities: [],
    junctions: [],
    notes: [],
  };
}

// ---------------------------------------------------------------------------
// Shared helpers (used by both the generator and the browser).
// ---------------------------------------------------------------------------

function normalizeRouteInput(value) {
  if (!value) return "";
  const cleaned = value.trim().toUpperCase().replace(/\s+/g, "");
  if (/^I-?\d{1,3}$/.test(cleaned)) {
    const number = cleaned.replace(/^I-?/, "");
    return `I-${Number(number)}`;
  }
  if (/^\d{1,3}$/.test(cleaned)) return `I-${Number(cleaned)}`;
  if (/^H-?\d$/.test(cleaned)) return `H-${cleaned.replace(/^H-?/, "")}`;
  if (/^A-?\d$/.test(cleaned)) return `A-${cleaned.replace(/^A-?/, "")}`;
  if (/^PRI-?\d$/.test(cleaned)) return `PRI-${cleaned.replace(/^PRI-?/, "")}`;
  return cleaned;
}

function normalizeSearch(value) {
  return value.toLowerCase().replace(/^i-?/, "").replace(/[^0-9a-z]/g, "");
}

function normalizeBaseId(id) {
  const match = id.match(/^I-(\d{1,3})/);
  return match ? `I-${Number(match[1])}` : id;
}

function numericFromId(id) {
  const match = id.match(/^[A-Z]*-?(\d{1,3})/i);
  return match ? Number(match[1]) : null;
}

function inferAxis(number) {
  if (!number || number >= 100) return "Auxiliary";
  return number % 2 === 0 ? "East-west" : "North-south";
}

function shieldText(id) {
  if (id.startsWith("PRI-")) return `P${id.split("-")[1]}`;
  if (id.startsWith("H-") || id.startsWith("A-")) return id;
  const match = id.match(/^I-(\d{1,3})/);
  return match ? match[1] : id;
}

// Stable URL slug for a route id. Distinguishes the duplicate-designation routes
// (for example "I-76 (PA-NJ)") so each gets a unique, clean file name.
function slugFromId(id) {
  return id
    .replace(/[()]/g, "")
    .replace(/\s+/g, "-")
    .replace(/\//g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function findRoute(routes, id) {
  if (!id) return null;
  const normalized = normalizeRouteInput(id);
  return routes.find((item) => item.id === normalized || item.baseId === normalized) || null;
}

// ---------------------------------------------------------------------------
// Exports.
// ---------------------------------------------------------------------------

const allRoutes = buildAllRoutes();
const routesWithPages = allRoutes.filter((item) => item.hasPage);

export {
  activePrimarySeed,
  nonContiguousSeed,
  notableAuxSeed,
  allRoutes,
  routesWithPages,
  buildAllRoutes,
  generatedMainline,
  generatedAuxiliary,
  normalizeRouteInput,
  normalizeSearch,
  normalizeBaseId,
  numericFromId,
  inferAxis,
  shieldText,
  slugFromId,
  findRoute,
};
