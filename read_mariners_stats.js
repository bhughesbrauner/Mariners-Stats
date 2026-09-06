const fs = require("fs");
const path = require("path");

// Handedness mapping for all players
const handednessMap = {
  "Randy Arozarena": "R",
  "Dominic Canzone": "L",
  "Julio Rodriguez": "R",
  "Cal Raleigh": "S",
  "Cole Young": "L",
  "J.P. Crawford": "L",
  "Josh Naylor": "L",
  "Brendan Donovan": "L",
  "Jhonny Pereda": "R",
  "Victor Robles": "R",
  "Luke Raley": "L",
  "Mitch Garver": "R",
  "Will Wilson": "R",
  "Lazaro Montes": "L",
  "Buddy Kennedy": "R",
  "Colt Emerson": "L",
  "Ryan Bliss": "R",
  "Connor Joe": "R",
  "Brock Rodden": "S",
  "Miles Mastrobuoni": "L",
  "Leo Rivas": "S",
  "Weston Wilson": "R",
  "Patrick Wisdom": "R",
  "Taylor Ward": "R",
  "Rob Refsnyder": "R",
};

function readAndProcessStats() {
  try {
    // Read CSV
    const csvPath = path.join(__dirname, "data", "mariners_stats.csv");
    const csvData = fs.readFileSync(csvPath, "utf-8");
    const lines = csvData.trim().split("\n");

    // Parse headers
    const headers = lines[0].split(",");
    const nameIndex = headers.indexOf("Name");
    const paIndex = headers.indexOf("PA");
    const avgIndex = headers.indexOf("AVG");
    const hrIndex = headers.indexOf("HR");
    const wrcIndex = headers.indexOf("wRC+");

    // Parse players
    const players = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",");
      players.push({
        name: cols[nameIndex].trim(),
        pa: parseInt(cols[paIndex]),
        avg: cols[avgIndex].trim(),
        hr: parseInt(cols[hrIndex]),
        wrc: parseInt(cols[wrcIndex]),
      });
    }

    const exclude = ["Julio Rodriguez", "Randy Arozarena"];
    const rhitters = [];

    console.log("Looking up handedness from MLB API...\n");

    for (const player of players) {
      // Skip if no PA
      if (player.pa < 1) continue;

      const batSide = handednessMap[player.name];

      if (batSide) {
        console.log(`${player.name}: ${batSide}`);
      } else {
        console.log(`${player.name}: NOT FOUND in handedness map`);
      }

      // Only include right-handed hitters
      if (batSide === "R") {
        rhitters.push({
          name: player.name,
          pa: player.pa,
          avg: player.avg,
          hr: player.hr,
          wrc: player.wrc,
        });
      }
    }

    // Sort by PA descending
    rhitters.sort((a, b) => b.pa - a.pa);

    console.log("\n=== MARINERS RIGHT-HANDED HITTERS ===");
    console.log(
      "Name".padEnd(25),
      "PA".padEnd(6),
      "AVG".padEnd(7),
      "HR".padEnd(5),
      "WRC",
    );
    console.log("-".repeat(65));

    rhitters.forEach((h) => {
      console.log(
        h.name.padEnd(25),
        h.pa.toString().padEnd(6),
        h.avg.padEnd(7),
        h.hr.toString().padEnd(5),
        h.wrc,
      );
    });

    // Get only the hitters we want to count (exclude J-Rod and Arozarena)
    const includedHitters = rhitters.filter((h) => !exclude.includes(h.name));

    // Add up all plate appearances from these hitters
    let combinedPA = 0;
    for (const hitter of includedHitters) {
      combinedPA += hitter.pa;
    }

    // Calculate weighted batting average
    // (Each player's AVG is weighted by how many PA they had)
    let weightedSum = 0;
    for (const hitter of includedHitters) {
      const battingAverage = parseFloat(hitter.avg);
      const contribution = battingAverage * hitter.pa;
      weightedSum += contribution;
    }

    const weightedAvg =
      combinedPA > 0 ? (weightedSum / combinedPA).toFixed(3) : 0;

    console.log("-".repeat(65));
    console.log(`\nTotal RH hitters: ${rhitters.length}`);
    console.log(`\nWeighted BA (excluding J-Rod & Arozarena):`);
    console.log(`  Combined PA: ${combinedPA}`);
    console.log(`  PA-Weighted AVG: ${weightedAvg}\n`);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

readAndProcessStats();
