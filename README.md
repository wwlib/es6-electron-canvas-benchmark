es6-electron-canvas-benchmark - a tool for benchmarking canvas performance (in Electron)

Currently
- draws an increasing number of sprites over 3-second intervals
- starts with 1,000 sprites (canvas draws) and increases to 10,000
- captures the FPS at then end of each interval
- generates a score by summing the FPS logged at each interval
- a perfect (60 FPS) score would be 600

To run
- electron index.js


To build
- gulp


Attribution
- inspired by JacksonDunstan.com's Test Harness (http://jacksondunstan.com/articles/365)