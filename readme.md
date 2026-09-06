# Title

Mariners right handers are bad, right? 

## Description

I was curious just how bad the Mariners right handed hitting was outside of Julio and Randy. So I wrote this script to answer that question. 

## Features

* Grabbed current Mariners batting stats (9/5/26 before the A's game) from fangraphs https://www.fangraphs.com/teams/mariners/stats, and converted to CSV
* Filter by hand, by batting handedness
* Calculate Slash line weighted by PA

## Prerequisites

I'm running on node v25.2.1


## Usage

```Mariners-Stats> node .\read_mariners_stats.js```

## Input Data

CSV Headers
Name,Age,Games,PA,HR,SB,BB%,K%,ISO,BABIP,AVG,OBP,SLG,wOBA,wRC+,BsR,Off,Def,WAR

from 
https://www.fangraphs.com/teams/mariners/stats

## Output

```
Filtering right-handed hitters...

Randy Arozarena: R
Dominic Canzone: L
Julio Rodriguez: R
Cal Raleigh: S
Cole Young: L
J.P. Crawford: L
Josh Naylor: L
Brendan Donovan: L
Jhonny Pereda: R
Victor Robles: R
Luke Raley: L
Mitch Garver: R
Will Wilson: R
Lazaro Montes: L
Buddy Kennedy: R
Colt Emerson: L
Ryan Bliss: R
Connor Joe: R
Brock Rodden: S
Miles Mastrobuoni: L
Leo Rivas: S
Weston Wilson: R
Patrick Wisdom: R
Taylor Ward: R
Rob Refsnyder: R

=== MARINERS RIGHT-HANDED HITTERS ===
Name                      PA     Slash Line       HR    WRC
----------------------------------------------------------------------
Randy Arozarena           581    .271/.370/.464   22    144
Julio Rodriguez           571    .242/.303/.398   20    102
Mitch Garver              149    .175/.302/.294   4     82
Victor Robles             147    .260/.319/.313   0     88
Rob Refsnyder             129    .140/.211/.254   4     33
Weston Wilson             96     .198/.281/.337   3     82
Jhonny Pereda             86     .291/.349/.367   2     113
Taylor Ward               83     .108/.205/.135   0     7
Patrick Wisdom            50     .106/.160/.191   1     -7
Connor Joe                45     .179/.289/.308   1     79
Buddy Kennedy             11     .100/.182/.200   0     12
Ryan Bliss                10     .125/.200/.125   0     -1
Will Wilson               6      .200/.333/.800   1     207
----------------------------------------------------------------------

Excluded hitters:
  Randy Arozarena (581 PA)
  Julio Rodriguez (571 PA)

Total RH hitters: 13
Hitters counted: 11

Weighted Slash Line (excluding J-Rod & Arozarena):
  Combined PA: 812
  Weighted Line: 0.188/0.271/0.282
```

## License

MIT