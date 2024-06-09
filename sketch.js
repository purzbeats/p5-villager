let font;
let gridSize = 20;
let margin = 80; // Margin around the canvas
let palettes = [];
let currentPalette = [];
let paletteNameElement;

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
    background(currentPalette.length > 0 ? currentPalette[0] : 255); // Set background to the first color from the palette
}

function setupPaletteInfo() {
    paletteNameElement = select('#palette-name');
    displayPaletteInfo();
}

function draw() {
    fill(255); // Set fill color for the margin
    noStroke(); // Disable stroke to prevent border rendering issues
    
    // Draw top margin
    rect(0, 0, width, margin); 
    
    // Draw bottom margin
    rect(0, height - margin, width, margin); 
    
    // Draw left margin
    rect(0, margin, margin, height - 2 * margin); 
    
    // Draw right margin
    rect(width - margin, margin, margin, height - 2 * margin); 
    
    // Draw main grid area
    fill(currentPalette.length > 0 ? currentPalette[0] : 255); // Set fill color for the main grid area
    rect(margin, margin, width - 2 * margin, height - 2 * margin); // Draw main grid area
    
    textSize(18);
    drawGrid();
}

function drawGrid() {
    let x = margin;
    let y = margin;

    while (y + gridSize <= height - margin) {
        x = margin;
        while (x + gridSize <= width - margin) {
            drawCharacter(x, y);
            x += gridSize;
        }
        y += gridSize;
    }
}

function drawCharacter(x, y) {
    let n = noise(x / width, y / height);
    let char = charFromNoise(n);
    let t = map(dist(x, y, width / 2, height / 2), 0, dist(0, 0, width / 2, height / 2), 0, 1);
    let c = colorFromPalette(n, t);
    fill(c);
    text(char, x + gridSize / 2, y + gridSize / 2);
}

function charFromNoise(n) {
    const charOption = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-=";
    let index = floor(n * charOption.length);
    return charOption.charAt(index);
}

function colorFromPalette(n, t) {
    if (currentPalette.length === 0) return color(0); // Default to black if palette is empty
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
