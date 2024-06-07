let font;
let gridSize = 20;
let cols, rows;
let margin = 20; // Margin around the grid
let paletteHex = [
    "#080102", // Dark Red
    "#1d0507", // Dark Green
    "#450a0b", // Dark Blue
    "#85110c", // Dark Yellow
    "#2896a7", // Cyan
    "#23424f"  // Dark Magenta
];
let palette = [];

function preload() {
    font = loadFont('myFont.otf');
}

function setup() {
    createCanvas(900, 900); // Increase canvas size to accommodate margin and border
    textFont(font);
    textSize(14);
    textAlign(CENTER, CENTER);

    // Calculate the number of columns and rows to fit within the canvas, minus the margin
    cols = floor((width - 2 * margin) / gridSize);
    rows = floor((height - 2 * margin) / gridSize);

    noiseDetail(3, 0.7);

    // Convert hex codes to p5.js color objects
    for (let i = 0; i < paletteHex.length; i++) {
        palette.push(color(paletteHex[i]));
    }

    // Set the background to the first color in the palette
    background(palette[0]);
}

function draw() {
    // Background is already set in setup, no need to clear it every frame
    let centerX = width / 2;
    let centerY = height / 2;
    let maxDist = dist(0, 0, centerX, centerY);
    let xoff = 0;

    // Calculate the starting points to center the grid
    let startX = (width - cols * gridSize) / 2;
    let startY = (height - rows * gridSize) / 2;

    for (let i = 0; i < cols; i++) {
        let yoff = 0;
        for (let j = 0; j < rows; j++) {
            let n = noise(xoff, yoff);
            let char = charFromNoise(n);
            let x = startX + i * gridSize + gridSize / 2;
            let y = startY + j * gridSize + gridSize / 2;
            let d = distanceFromCenter(x, y, centerX, centerY);
            let t = map(d, 0, maxDist, 0, 1);
            let c = colorFromPalette(n, t);

            fill(c);
            text(char, x, y);
            yoff += 0.1;
        }
        xoff += 0.1;
    }
}

function charFromNoise(n) {
    const chars = "abcdefgh";
    let index = floor(n * chars.length);
    return chars.charAt(index);
}

function colorFromPalette(n, t) {
    let paletteSize = palette.length;
    let colorIndex = floor(n * (paletteSize - 1));
    let nextColorIndex = (colorIndex + 1) % paletteSize;
    let color = interpolateColor(palette[colorIndex], palette[nextColorIndex], t);
    return color;
}

function interpolateColor(c1, c2, t) {
    return lerpColor(c1, c2, t);
}

function distanceFromCenter(x, y, centerX, centerY) {
    return dist(x, y, centerX, centerY);
}

// Debugging functions
function printDebugInfo(x, y, n, char, c) {
    console.log(`x: ${x}, y: ${y}, noise: ${n}, char: ${char}, color: rgb(${red(c)}, ${green(c)}, ${blue(c)})`);
}
