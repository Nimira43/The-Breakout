const batWidth = 100
const batDepth = 10
const edgeDist = 60
const blockWidth = 80
const blockHeight = 20
const blockGap = 2
const blockCols = 10
const blockRows = 14

let blockGrid = new Array(blockCols * blockRows)
let blocksLeft = 0
let ballX = 75
let ballY = 75
let ballSpeedX = 5
let ballSpeedY = 7
let batX = 400
let mouseX = 0
let mouseY = 0
let canvas, ctx

function updateMousePos(e) {
  let rect = canvas.getBoundingClientRect()
  let root = document.documentElement
  mouseX = e.clientX - rect.left - root.scrollLeft
  mouseY = e.clientY - rect.top - root.scrollTop
  batX = mouseX - batWidth / 2
}

function blockReset() {
  blocksLeft = 0
  let i
  for (i = 0; i < 3 * blockCols; i++) {
    blockGrid[i] = false
  }
  for (; i < blockCols * blockRows; i++) {
    blockGrid[i] = true
    blocksLeft++
  }
}

window.onload = () => {
  canvas = document.getElementById('game-canvas')
  ctx = canvas.getContext('2d')
  let fps = 30
  setInterval(updateAll, 1000 / fps)
  canvas.addEventListener('mousemove', updateMousePos)
  blockReset()
  ballReset()
}

// function updateAll() {
//   moveAll()
//   drawAll()
// }

const updateAll = () => {
  moveAll()
  drawAll()
}

const ballReset = () => {
  ballX = canvas.width / 2
  ballY = canvas.height / 2
}

// function ballReset() {
//   ballX = canvas.width / 2
//   ballY = canvas.height / 2
// }

function ballMove() {
  ballX += ballSpeedX
  ballY += ballSpeedY
  if (ballX < 0 && ballSpeedX < 0.0) {
    ballSpeedX *= -1
  }
  if (ballX > canvas.width && ballSpeedX > 0.0) {
    ballSpeedX *= -1
  }
  if (ballY < 0 && ballSpeedY < 0.0) {
    ballSpeedY *= -1
  }
  if (ballY > canvas.height) {
    ballReset()
    blockReset()
  }
}

function detectBlock(col, row) {
  if (
    col >= 0 &&
    col < blockCols &&
    row >= 0 &&
    row < blockRows
  ) {
    let brickIndexUnderCoord = gridIndex(col, row)
    return blockGrid[brickIndexUnderCoord]
    } else {
    return false
  }
}

function handleBallBrick() {
  let ballBrickCol = Math.floor(ballX / blockWidth)
  let ballBrickRow = Math.floor(ballY / blockHeight)
  let brickIndexUnderBall = gridIndex(ballBrickCol, ballBrickRow)
  if (
    ballBrickCol >= 0 &&
    ballBrickCol < blockCols &&
    ballBrickRow >= 0 &&
    ballBrickRow < blockRows
  ) {
    if (detectBlock(ballBrickCol, ballBrickRow)) {
      blockGrid[brickIndexUnderBall] = false
      blocksLeft--
      let prevBallX = ballX - ballSpeedX
      let prevBallY = ballY - ballSpeedY
      let prevBrickCol = Math.floor(prevBallX / blockWidth)
      let prevBrickRow = Math.floor(prevBallY / blockHeight)
      let bothTestsFailed = true

      if (prevBrickCol != ballBrickCol) {
        if (detectBlock(prevBrickCol, ballBrickRow) == false) {
          ballSpeedX *= -1
          bothTestsFailed = false
        }
      }
      if (prevBrickRow != ballBrickRow) {
        if (detectBlock(ballBrickCol, prevBrickRow) == false) {
          ballSpeedY *= -1
          bothTestsFailed = false
        }
      }
      if (bothTestsFailed) {
        ballSpeedX *= -1
        ballSpeedY *= -1
      }
    }
  }
}

function handleBallBat() {
  let batTop = canvas.height - edgeDist
  let batBottom = batTop + batDepth
  let batLeft = batX
  let batRight = batLeft + batWidth
  if (
    ballY > batTop &&
    ballY < batBottom &&
    ballX > batLeft &&
    ballX < batRight
  ) {
    ballSpeedY *= -1
    let centerOfbatX = batX + batWidth / 2
    let ballHitX = ballX - centerOfbatX
    ballSpeedX = ballHitX * 0.35
    if (blocksLeft == 0) {
      blockReset()
    }
  }
}

const moveAll = () => {
  ballMove()
  handleBallBrick()
  handleBallBat()
}

// function moveAll() {
//   ballMove()
//   handleBallBrick()
//   handleBallBat()
// }

// function gridIndex(col, row) {
//   return col + blockCols * row
// }

const gridIndex = (col, row) => {
  return col + blockCols * row
}

function drawBricks() {
  for (let eachRow = 0; eachRow < blockRows; eachRow++) {
    for (let eachCol = 0; eachCol < blockCols; eachCol++) {
      let arrayIndex = gridIndex(eachCol, eachRow)
      if (blockGrid[arrayIndex]) {
        colorRect(
          blockWidth * eachCol,
          blockHeight * eachRow,
          blockWidth - blockGap,
          blockHeight - blockGap,
          'black'
        )
      }
    }
  }
}

function drawAll() {
  colorRect(0, 0, canvas.width, canvas.height, '#ff4500')
  colorCircle(ballX, ballY, 10, 'yellow')
  colorRect(
    batX,
    canvas.height - edgeDist,
    batWidth,
    batDepth,
    'black'
  )
  drawBricks()
}

function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
  ctx.fillStyle = fillColor
  ctx.fillRect(topLeftX, topLeftY, boxWidth, boxHeight)
}

function colorCircle(centerX, centerY, radius, fillColor) {
  ctx.fillStyle = fillColor
  ctx.beginPath()
  ctx.arc(centerX, centerY, 10, 0, Math.PI * 2, true)
  ctx.fill()
}

function colorText(showWords, textX, textY, fillColor) {
  ctx.fillStyle = fillColor
  ctx.fillText(showWords, textX, textY)

}

function colorText(showWords, textX, textY, fillColor) {
  ctx.fillStyle = fillColor
  ctx.fillText(showWords, textX, textY)

}