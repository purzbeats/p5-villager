let font;
let gridSize = 26;
let cols, rows;
let margin = 36; // Margin around the grid
let palettes = [];
let currentPalette = [];
let seed;
let selectedPaletteIndex; // New global variable
let charactersSets = [];
// const charOption = ["_"];    
// const charOption = ["fgp_!m6GvC"];    
const charOption = [" abcdefg", "hijklmn ", "fneia8", "ABCMWVSXjz", "slipstream", "turtlefarts", "87234", "HIJaghKL890", "fgp_!m6GvC"];    
const randomIndex = getRandomInt(0, charOption.length - 1);
let paletteNameElement; // Global variable to store the HTML element

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function preload() {
    font = loadFont('fonts/MEKMODE-Dings.otf');
    font2 = loadFont('fonts/MEKMODE-Text.otf'); // Load the second font
    loadJSON('palettes.json', loadPalettes);
}

function loadPalettes(data) {
    palettes = data.palettes;
    if (palettes.length > 0) {
        // Select a random palette
        const randomIndex = getRandomInt(0, palettes.length - 1);
        currentPalette = palettes[randomIndex].colors.map(hex => color(hex));
        selectedPaletteIndex = randomIndex; // Store the selected palette index
    } else {
        currentPalette = []; // Empty palette if no palettes loaded
        selectedPaletteIndex = -1; // Set to -1 to indicate no palette selected
    }
}

function setup() {
    pixelDensity(3);
    const textHeight = 0; // Estimate the height needed for the text
    createCanvas(800, 800 + textHeight); // Increase canvas height
    textFont(font);
    textSize(24);
    textAlign(CENTER, CENTER);
    let noiseDetailMult = random(0.1, 0.7);
    let randomBG = random(1);

    // Calculate the number of columns and rows to fit within the canvas, minus the margin
    cols = floor((width - 2 * margin) / gridSize);
    rows = floor((height - 2 * margin) / gridSize);

    // Generate a random seed
    seed = floor(random(1000000));
    noiseSeed(seed);
    noiseDetail(2, noiseDetailMult);

    // Set the background to the first color in the current palette
    if (currentPalette.length > 0) {
        if (randomBG > 0.5) {
            background(currentPalette[0]);
        } else {
            background(0);
        }
            
    } else {
        background(255); // Default to white if palette is not loaded
    }

}

function draw() {
    // Background is already set in setup, no need to clear it every frame
    textFont(font);
    let centerX = width / 2;
    let centerY = height / 2;
    let maxDist = dist(4, 4, centerX, centerY);
    let xoff = seed; // Start with the seed value

    // Calculate the starting points to center the grid
    let startX = (width - cols * gridSize) / 2;
    let startY = (height - rows * gridSize) / 2;

    for (let i = 0; i < cols; i++) {
        let yoff = seed; // Start with the seed value
        for (let j = 0; j < rows; j++) {
            let x = startX + i * gridSize;
            let y = startY + j * gridSize;
            let n = noise(xoff, yoff);
            let level = floor(map(n, 0, 1, 0, 3)); // Determine subdivision level based on noise
            subdivideGrid(x, y, gridSize, gridSize, level, 24); // Pass initial font size
            yoff += 0.1; // Increment yoff for the next row
        }
        xoff += 0.1; // Increment xoff for the next column
    }
    
    displayPaletteInfo(); // Call the new function to display palette info
}

function subdivideGrid(x, y, w, h, level, fontSize) {
    if (level <= 0) {
        drawCharacter(x + w / 2, y + h / 2, fontSize);
        return;
    }

    let halfW = w / 2;
    let halfH = h / 2;
    let newFontSize = fontSize / 2;

    subdivideGrid(x, y, halfW, halfH, level - 1, newFontSize); // Top-left
    subdivideGrid(x + halfW, y, halfW, halfH, level - 1, newFontSize); // Top-right
    subdivideGrid(x, y + halfH, halfW, halfH, level - 1, newFontSize); // Bottom-left
    subdivideGrid(x + halfW, y + halfH, halfW, halfH, level - 1, newFontSize); // Bottom-right
}

function drawCharacter(x, y, fontSize) {
    textSize(fontSize);
    let n = noise(x / width, y / height);
    let char = charFromNoise(n);
    let d = distanceFromCenter(x, y, width / 2, height / 2);
    let t = map(d, 0, dist(4, 4, width / 2, height / 2), 0, 1);
    let c = colorFromPalette(n, t);

    fill(c);
    text(char, x, y);
}

function displayPaletteInfo() {
    const paletteInfo = `Palette: ${selectedPaletteIndex >= 0 ? palettes[selectedPaletteIndex].name : 'None'}`;

    // Set the content of the HTML element to the palette name
    if (paletteNameElement) {
        paletteNameElement.html(paletteInfo);
    }
}

function charFromNoise(n) {
    const chars = charOption[randomIndex];
    let index = floor(n * chars.length);
    return chars.charAt(index);
}

function colorFromPalette(n, t) {
    let paletteSize = currentPalette.length;
    let colorIndex = floor(n * (paletteSize - 1));
    let nextColorIndex = (colorIndex + 1) % paletteSize;
    let color = interpolateColor(currentPalette[colorIndex], currentPalette[nextColorIndex], t);
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
