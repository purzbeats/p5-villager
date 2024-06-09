let font;
let gridSize = 24;
let margin = 15; // Increased margin around the canvas
let palettes = [];
let currentPalette = [];
let paletteNameElement;
let randomChars = [];
let backgroundDarkness = 6; // Adjust this value to control the darkness level of the background tiles

function preload() {
    font = loadFont('fonts/MEKMODE-Dings.otf');
    loadJSON('palettes.json', loadPalettes);
}

function loadPalettes(data) {
    palettes = data.palettes;
    if (palettes.length > 0) {
        const randomIndex = floor(random(palettes.length)); // Select a random palette
        currentPalette = palettes[randomIndex].colors.map(hex => color(hex));
    }
}

function setup() {
    // Calculate the canvas size to ensure it is evenly divisible by the grid size
    let canvasSize = gridSize * floor((800 - 2 * margin) / gridSize);
    createCanvas(canvasSize + 2 * margin, canvasSize + 2 * margin);
    
    textFont(font);
    textAlign(CENTER, CENTER);
    noLoop();
    setupPaletteInfo();

    // Generate random characters
    generateRandomChars();
}

function setupPaletteInfo() {
    paletteNameElement = select('#palette-name');
    displayPaletteInfo();
}

function generateRandomChars() {
    const charOption = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    // const charOption = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    for (let i = 0; i < 12; i++) {
        let index = floor(random(charOption.length));
        randomChars.push(charOption.charAt(index));
    }
}

function draw() {
    // Set background to black
    background(0);

    // Set margin color to the first color from the palette
    let marginColor = currentPalette.length > 0 ? currentPalette[0] : color(255);
    fill(marginColor);
    noStroke();

    // Draw outer margin rectangles
    rect(0, 0, width, margin); // Top margin
    rect(0, height - margin, width, margin); // Bottom margin
    rect(0, margin, margin, height - 2 * margin); // Left margin
    rect(width - margin, margin, margin, height - 2 * margin); // Right margin

    drawGrid();
}

function drawGrid() {
    let x = margin;
    let y = margin;

    while (y + gridSize <= height - margin) {
        x = margin;
        while (x + gridSize <= width - margin) {
            let n = noise(x / width, y / height);
            drawCharacter(x, y, n); // Pass noise value to drawCharacter function
            x += gridSize;
        }
        y += gridSize;
    }
}

function drawCharacter(x, y, n) {
    let char = randomChars[floor(n * randomChars.length)]; // Select a random character from the set
    let t = map(dist(x, y, width / 2, height / 2), 0, dist(0, 0, width / 2, height / 2), 0, 1);
    
    // Invert the darkness level based on the intensity of the Perlin noise texture and the backgroundDarkness variable
    let invertedIntensity = map(n, 0, 1, backgroundDarkness, 0); // Invert the mapping of noise to darkness level
    let darkColor = color(invertedIntensity); // Create a dark gray color
    
    // Set the text color based on noise intensity
    let textColor = colorFromPalette(n, t); // Determine text color based on noise intensity
    
    fill(darkColor);
    rect(x, y, gridSize, gridSize); // Draw background rectangle
    fill(textColor);
    textSize(20);
    text(char, x + gridSize / 2, y + gridSize / 2);
}

function colorFromPalette(n, t) {
    if (currentPalette.length === 0) return color(255); // Default to white if palette is empty
    let colorIndex = floor(n * (currentPalette.length - 1));
    let nextColorIndex = (colorIndex + 1) % currentPalette.length;
    return lerpColor(currentPalette[colorIndex], currentPalette[nextColorIndex], t);
}

function displayPaletteInfo() {
    let paletteInfo = 'None';
    if (currentPalette.length > 0) {
        const foundPalette = palettes.find(palette => JSON.stringify(palette.colors) === JSON.stringify(currentPalette));
        paletteInfo = foundPalette ? foundPalette.name : 'None';
    }
    if (paletteNameElement) {
        paletteNameElement.html(`Palette: ${paletteInfo}`);
    }
}
