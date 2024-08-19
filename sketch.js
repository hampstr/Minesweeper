
let canvas;
let cols = 8
let rows = 8
let grid;
let visited;
let revealedGrid;
let bomb = "💣"
let marker = "🚩"
let shovel = "⛏️"
let picker;
let bombIndicator;
let newGridSize;
let newBombCount;
let bombCount = 8
let maxGridSize = 30
let minGridSize = 4
let winSound;
let digSound;
let loseSound;
let zeroSpreading = true
let highLightColor = [100]

//TODO: 0 spreading



function create2DArray(rows, cols, fill) {
  let arr = new Array(rows);
  for (let i = 0; i < rows; i++) {
    arr[i] = new Array(cols).fill(fill);
  }
  return arr;
}

grid = create2DArray(rows, cols, 0)
revealedGrid = create2DArray(rows, cols, false)
markerGrid = create2DArray(rows, cols, false)
colorGrid = create2DArray(rows, cols, [30, 30, 30])
visitedGrid = create2DArray(rows, cols, false)

function preload() {
  winSound = loadSound("win.mp3")
  digSound = loadSound("dig.mp3")
  loseSound = loadSound("lose.mp3")
}


function setup() {
  canvas = createCanvas(600, 600);
  textAlign(CENTER, CENTER);
  textSize(rows * cols)

  picker = createRadio()
  picker.option(marker)
  picker.option(shovel)
  picker.style("font-size", "50px")
  picker.selected(shovel)
  picker.center('horizontal')
  picker.position(picker.x, picker.y + 100)
  bombIndicator = createDiv(`Bombs: ${bombCount}`)
  bombIndicator.center('horizontal')
  bombIndicator.position(bombIndicator.x, 0)

  newBombCount = createButton("New bomb count")
  newBombCount.center()
  newBombCount.position(newBombCount.x + 550, newBombCount.y)
  newBombCount.mouseReleased(newBombCountPrompt)
  newGridSize = createButton("New grid size")
  newGridSize.center()
  newGridSize.position(newGridSize.x + 550, newGridSize.y + 70)
  newGridSize.mouseReleased(newGridSizePrompt)

  generateNewLevel()

}


function draw() {
  let boxW = width/cols
  let boxH = height/rows

  let textSizeVal = min(boxW, boxH) * 0.6;
  textSize(textSizeVal);
  canvas.position(windowWidth/2 - width/2, (windowHeight/2 - width/2) - 2);
  background(0);
  
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * boxW
      let y = j * boxH
      stroke(200)
      strokeWeight(2.5)
      fill(colorGrid[j][i])
      rect(x, y, boxW, boxH)
      if (markerGrid[j][i]) {
        fill(255)
        text(marker, x + boxW/2, y + boxH/2)
        continue
      }
      if (revealedGrid[j][i]) {
        fill(255)
        text(grid[j][i], x + boxW/2, y + boxH/2)
      }
    }
  }
}


function highlightZero() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[j][i] == 0) {
        colorGrid[j][i] = (255, 255, 255) 
      }
    }
  }
}



function zeroSpread(row, col) {
  // i cant do this
}





function mouseReleased() {
  let colIndex = int(mouseX / (width / cols));
  let rowIndex = int(mouseY / (height / rows));

  if (mouseButton == "center" && (colIndex >= 0 && colIndex < cols && rowIndex >= 0 && rowIndex < rows)) {

    
    let fillColor = highLightColor

    if (colorGrid[rowIndex][colIndex] == highLightColor) {
      fillColor = [30]
    }
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        if (colorGrid[j][i] == highLightColor) {
          colorGrid[j][i] = [30, 30, 30]
        }
      }
    }
    try {
        colorGrid[rowIndex][colIndex] = fillColor;
    } catch (e) {}
    try {
        colorGrid[rowIndex+1][colIndex] = fillColor;
    } catch (e) {}
    try {
        colorGrid[rowIndex-1][colIndex] = fillColor;
    } catch (e) {}
    try {
        colorGrid[rowIndex][colIndex+1] = fillColor;
    } catch (e) {}
    try {
        colorGrid[rowIndex][colIndex-1] = fillColor;
    } catch (e) {}
    try {
        colorGrid[rowIndex-1][colIndex+1] = fillColor;
    } catch (e) {}
    try {
        colorGrid[rowIndex+1][colIndex-1] = fillColor;
    } catch (e) {}
    try {
        colorGrid[rowIndex+1][colIndex+1] = fillColor;
    } catch (e) {}
    try {
        colorGrid[rowIndex-1][colIndex-1] = fillColor;
    } catch (e) {}
    return
  }


  if (colIndex >= 0 && colIndex < cols && rowIndex >= 0 && rowIndex < rows) {
    
    if (picker.value() == shovel) {
      revealedGrid[rowIndex][colIndex] = true;
    }
    
    if (picker.value() == marker) {
      markerGrid[rowIndex][colIndex] = !markerGrid[rowIndex][colIndex];
    }

    if (grid[rowIndex][colIndex] == 0 && zeroSpreading) {
      zeroSpread(rowIndex, colIndex)
    }



    if (grid[rowIndex][colIndex] == bomb && picker.value() == shovel) {
      loseSound.play();
      
      setTimeout(() => {
        window.alert("You clicked on a bomb!");
        revealedGrid = create2DArray(cols, rows, true)
        setTimeout(() => {
          window.alert("Click when done viewing!")
          generateNewLevel()
        }, 500)
      }, 100);
    }

    winDetect();

    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
      digSound.play();
    }
  }
}

function win() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[j][i] == bomb) {
        continue
      }
      else {
        revealedGrid[j][i] = true
      }
    }
  }
  winDetect()

}

function winDetect() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[j][i] != bomb && revealedGrid[j][i]) {
        continue
      }
      if (grid[j][i] != bomb && !revealedGrid[j][i]) {
        return
      }
    }
  }
  winSound.play()
  
  setTimeout(() => {
    window.alert("You Win!")
    revealedGrid = create2DArray(cols, rows, true)
    setTimeout(() => {
      window.alert("Click when done viewing!")
      generateNewLevel()
    }, 500)
  }, 100)
}
function generateNewLevel() {
  // RESET ALL
  grid = create2DArray(rows, cols, 0)
  revealedGrid = create2DArray(rows, cols, false)
  markerGrid = create2DArray(rows, cols, false)
  colorGrid = create2DArray(rows, cols, [30, 30, 30])
  // PLACE BOMBS 
  for (let i = 0; i < bombCount; i++) {
    index0 = int(random(0, rows - 1))
    index1 = int(random(0, cols - 1))
    // MAKE SURE NO OVERLAP (i dont think it works but wtvr) 
    if (grid[index0][index1] == bomb) {
      i--
      continue
    }
    else {
      grid[index0][index1] = bomb
    }
  }

  // ADD ALL THE NUMBERS

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[j][i] == bomb) {
        continue
      }
      let currentSum = 0

      // this is peak hampstor coding

      try {
        if (grid[j+1][i] == bomb) {
            currentSum++;
        }
      } catch (e) {}
      
      try {
          if (grid[j-1][i] == bomb) {
              currentSum++;
          }
      } catch (e) {}
      
      try {
          if (grid[j+1][i+1] == bomb) {
              currentSum++;
          }
      } catch (e) {}
      
      try {
          if (grid[j-1][i-1] == bomb) {
              currentSum++;
          }
      } catch (e) {}
      
      try {
          if (grid[j][i+1] == bomb) {
              currentSum++;
          }
      } catch (e) {}
      
      try {
          if (grid[j][i-1] == bomb) {
              currentSum++;
          }
      } catch (e) {}
      
      try {
          if (grid[j-1][i+1] == bomb) {
              currentSum++;
          }
      } catch (e) {}
      
      try {
          if (grid[j+1][i-1] == bomb) {
              currentSum++;
          }
      } catch (e) {}
      grid[j][i] = currentSum
    } 
  }
}


function newGridSizePrompt() {
  let input = prompt("Enter a new board size", "8");
  let newSize = int(input);

  // Validate input
  if (!isNaN(newSize) && newSize >= minGridSize && newSize <= maxGridSize) {
    cols = newSize;
    rows = newSize;
    grid = create2DArray(rows, cols, 0)
    revealedGrid = create2DArray(rows, cols, false)
    markerGrid = create2DArray(rows, cols, false)
    colorGrid = create2DArray(rows, cols, [30, 30, 30])
    // dont ask
    for (let i = 0; i < 8; i++) {
      generateNewLevel()
    }
    
  }
  else {
    window.alert(`Please enter a new board size between ${minGridSize} and ${maxGridSize}`)
  }
}


function newBombCountPrompt () {
  let input = prompt("Enter a new bomb count", "8")
  let newCount = int(input)
  // validate input

  if (!isNaN(newCount) && newCount > 1 && newCount < sq(rows)) {
    bombCount = newCount
    bombIndicator.html(`Bombs: ${bombCount}`)
    grid = create2DArray(rows, cols, 0)
    revealedGrid = create2DArray(rows, cols, false)
    markerGrid = create2DArray(rows, cols, false)
    colorGrid = create2DArray(rows, cols, [30, 30, 30])
    // dont ask
    for (let i = 0; i < 8; i++) {
      generateNewLevel()
    }

  } 
  else {
    window.alert(`Please enter a count that is greater than 1 and under ${sq(rows)}, (gridSize*gridSize)`)
  }
}

function keyReleased() {
  if (keyCode == 13) { // ENTER
    highlightZero()
  }
  if (keyCode == 32) { // SPACE
    colorGrid = create2DArray(rows, cols, [30, 30, 30])
  }
}
