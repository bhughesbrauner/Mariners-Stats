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
    if (!fs.existsSync(csvPath)) {
      throw new Error(`CSV file not found at ${csvPath}`);
    }

    const csvData = fs.readFileSync(csvPath, "utf-8");
    const lines = csvData.trim().split("\n");

    if (lines.length < 2) {
      throw new Error("CSV file is empty or has only headers");
    }

    // Parse headers
    const headers = lines[0].split(",");
    const nameIndex = headers.indexOf("Name");
    const paIndex = headers.indexOf("PA");
    const avgIndex = headers.indexOf("AVG");
    const obpIndex = headers.indexOf("OBP");
    const slgIndex = headers.indexOf("SLG");
    const hrIndex = headers.indexOf("HR");
    const wrcIndex = headers.indexOf("wRC+");

    // Validate all required headers exist
    const requiredHeaders = {
      Name: nameIndex,
      PA: paIndex,
      AVG: avgIndex,
      OBP: obpIndex,
      SLG: slgIndex,
      HR: hrIndex,
      "wRC+": wrcIndex,
    };

    for (const [headerName, index] of Object.entries(requiredHeaders)) {
      if (index === -1) {
        throw new Error(`Missing required column: ${headerName}`);
      }
    }

    // Helper to safely parse float values
    const safeParseFloat = (value) => {
      const num = parseFloat(value);
      return isNaN(num) ? 0 : num;
    };

    // Parse players
    const players = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",");

      // Validate row has enough columns
      if (cols.length < Math.max(nameIndex, paIndex, avgIndex, obpIndex, slgIndex, hrIndex, wrcIndex) + 1) {
        console.warn(`Row ${i + 1} has insufficient columns, skipping`);
        continue;
      }

      const pa = parseInt(cols[paIndex], 10);
      const name = cols[nameIndex].trim();

      // Skip rows with no PA
      if (pa < 1) continue;

      players.push({
        name,
        pa,
        avg: cols[avgIndex].trim(),
        obp: cols[obpIndex].trim(),
        slg: cols[slgIndex].trim(),
        hr: parseInt(cols[hrIndex], 10),
        wrc: parseInt(cols[wrcIndex], 10),
      });
    }

    const exclude = ["Julio Rodriguez", "Randy Arozarena"];
    const rhitters = [];

    console.log("Filtering right-handed hitters...\n");

    for (const player of players) {
      const batSide = handednessMap[player.name];

      if (batSide) {
        console.log(`${player.name}: ${batSide}`);
      } else {
        console.log(`${player.name}: NOT FOUND in handedness map`);
      }

      // Only include right-handed hitters
      if (batSide === "R") {
        rhitters.push(player);
      }
    }

    // Sort by PA descending
    rhitters.sort((a, b) => b.pa - a.pa);

    console.log("\n=== MARINERS RIGHT-HANDED HITTERS ===");
    console.log(
      "Name".padEnd(25),
      "PA".padEnd(6),
      "Slash Line".padEnd(16),
      "HR".padEnd(5),
      "WRC"
    );
    console.log("-".repeat(70));

    rhitters.forEach((h) => {
      const slashLine = `${h.avg}/${h.obp}/${h.slg}`;
      console.log(
        h.name.padEnd(25),
        h.pa.toString().padEnd(6),
        slashLine.padEnd(16),
        h.hr.toString().padEnd(5),
        h.wrc
      );
    });

    // Get only the hitters we want to count (exclude J-Rod and Arozarena)
    const includedHitters = rhitters.filter(
      (h) => !exclude.some((excludedName) => h.name.trim() === excludedName.trim())
    );

    if (includedHitters.length === 0) {
      console.log("\nNo hitters to include in weighted calculation.");
      return;
    }

    // Calculate combined PA and weighted slash line stats in one pass
    let combinedPA = 0;
    let weightedAvgSum = 0;
    let weightedObpSum = 0;
    let weightedSlgSum = 0;

    for (const hitter of includedHitters) {
      const avg = safeParseFloat(hitter.avg);
      const obp = safeParseFloat(hitter.obp);
      const slg = safeParseFloat(hitter.slg);

      combinedPA += hitter.pa;
      weightedAvgSum += avg * hitter.pa;
      weightedObpSum += obp * hitter.pa;
      weightedSlgSum += slg * hitter.pa;
    }

    // Calculate weighted stats (consistent numeric output)
    const weightedAvg = combinedPA > 0 ? weightedAvgSum / combinedPA : 0;
    const weightedObp = combinedPA > 0 ? weightedObpSum / combinedPA : 0;
    const weightedSlg = combinedPA > 0 ? weightedSlgSum / combinedPA : 0;

    console.log("\nExcluded hitters:");
    rhitters
      .filter((h) => exclude.some((excludedName) => h.name.trim() === excludedName.trim()))
      .forEach((h) => {
        console.log(`  ${h.name} (${h.pa} PA)`);
      });

    console.log("-".repeat(70));
    console.log(`\nTotal RH hitters: ${rhitters.length}`);
    console.log(`Hitters counted: ${includedHitters.length}`);
    console.log(`\nWeighted Slash Line (excluding J-Rod & Arozarena):`);
    console.log(`  Combined PA: ${combinedPA}`);
    console.log(
      `  Weighted Line: ${weightedAvg.toFixed(3)}/${weightedObp.toFixed(3)}/${weightedSlg.toFixed(3)}\n`
    );
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

readAndProcessStats();