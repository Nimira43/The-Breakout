const PADDLE_WIDTH = 100
const PADDLE_THICKNESS = 10
const PADDLE_DIST_FROM_EDGE = 60
const BRICK_W = 80
const BRICK_H = 20
const BRICK_GAP = 2
const BRICK_COLS = 10
const BRICK_ROWS = 14

let brickGrid = new Array(BRICK_COLS * BRICK_ROWS)
let bricksLeft = 0
let ballX = 75
let ballY = 75
let ballSpeedX = 5
let ballSpeedY = 7
let paddleX = 400
let mouseX = 0
let mouseY = 0
let canvas, ctx

function updateMousePos(e) {
  let rect = canvas.getBoundingClientRect()
  let root = document.documentElement
  mouseX = e.clientX - rect.left - root.scrollLeft
  mouseY = e.clientY - rect.top - root.scrollTop
  paddleX = mouseX - PADDLE_WIDTH / 2
}

function brickReset() {
  bricksLeft = 0
  let i
  for (i = 0; i < 3 * BRICK_COLS; i++) {
    brickGrid[i] = false
  }
  for (; i < BRICK_COLS * BRICK_ROWS; i++) {
    brickGrid[i] = true
    bricksLeft++
  }
}

window.onload = function () {
  canvas = document.getElementById('game-canvas')
  ctx = canvas.getContext('2d')
  let fps = 30
  setInterval(updateAll, 1000 / fps)
  canvas.addEventListener('mousemove', updateMousePos)
  brickReset()
  ballReset()
}

function updateAll() {
  moveAll()
  drawAll()
}

function ballReset() {
  ballX = canvas.width / 2
  ballY = canvas.height / 2
}

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
    brickReset()
  }
}

function isBrickAtColRow(col, row) {
  if (
    col >= 0 &&
    col < BRICK_COLS &&
    row >= 0 &&
    row < BRICK_ROWS) {
    let brickIndexUnderCoord = rowColToArrayIndex(col, row)
    return brickGrid[brickIndexUnderCoord]
  } else {
    return false
    }
}

function ballBrickHandling() {
  let ballBrickCol = Math.floor(ballX / BRICK_W)
  let ballBrickRow = Math.floor(ballY / BRICK_H)
  let brickIndexUnderBall = rowColToArrayIndex(ballBrickCol, ballBrickRow)
  if (ballBrickCol >= 0 && ballBrickCol < BRICK_COLS && ballBrickRow >= 0 && ballBrickRow < BRICK_ROWS) {
    if (isBrickAtColRow(ballBrickCol, ballBrickRow)) {
      brickGrid[brickIndexUnderBall] = false
      bricksLeft--
      let prevBallX = ballX - ballSpeedX
      let prevBallY = ballY - ballSpeedY
      let prevBrickCol =Math.floor(prevBallX / BRICK_W)
      let prevBrickRow = Math.floor(prevBallY / BRICK_H)
      let bothTestsFailed = true
      if (prevBrickCol != ballBrickCol) {
        if (isBrickAtColRow(prevBrickCol, ballBrickRow) == false) {
          ballSpeedX *= -1
          bothTestsFailed = False
        }
      }
      if (prevBrickRow != ballBrickRow) {
        if (isBrickAtColRow(ballBrickRow, prevBrickCol) == false) {
          ballSpeedY *= -1
          bothTestsFailed = False
        }
      }
      if (bothTestsFailed) {
        ballSpeedX *= -1
        ballSpeedY *= -1
      }
    }
  }
}

function ballPaddleHandling() {
  let paddleTopEdgeY = canvas.height - PADDLE_DIST_FROM_EDGE
  let paddleBottomEdgeY = paddleTopEdgeY + PADDLE_THICKNESS
  let paddleLeftEdgeX = paddleX
  let paddleRightEdgeX = paddleLeftEdgeX + PADDLE_WIDTH
  if (
    ballY > paddleTopEdgeY &&
    ballY < paddleBottomEdgeY &&
    ballX > paddleLeftEdgeX &&
    ballX < paddleRightEdgeX
  ) {
    ballSpeedY *= -1
    let centerOfPaddleX = paddleX + PADDLE_WIDTH / 2
    let ballDistFromPaddleCenterX = ballX - centerOfPaddleX
    ballSpeedX = ballDistFromPaddleCenterX * 0.35
    if (bricksLeft == 0) {
      brickReset()
    }
  }
}

function moveAll() {
  ballMove()
  ballBrickHandling()
  ballPaddleHandling()
}

function rowColToArrayIndex(col, row) {
  return col + BRICK_COLS * row
}

function drawBricks() {
  for (let eachRow = 0; eachRow < BRICK_ROWS; eachRow++) {
    for (let eachCol = 0; eachCol < BRICK_COLS; eachCol++) {
      let arrayIndex = rowColToArrayIndex(eachCol, eachRow)
      if (brickGrid[arrayIndex]) {
        colorRect(
          BRICK_W * eachCol,
          BRICK_H * eachRow,
          BRICK_W - BRICK_GAP,
          BRICK_W - BRICK_GAP,
          'ff4500'
        )
      }
    }
  }
}

function drawAll() {
  colorRect(0, 0, canvas.width, canvas.height, '#87ceeb')
  colorCircle(ballX, ballY, 10, 'blue')
  colorRect(
    paddleX,
    canvas.height - PADDLE_DIST_FROM_EDGE,
    PADDLE_WIDTH,
    PADDLE_THICKNESS,
    '#000000'
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