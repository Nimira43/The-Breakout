let canvas, ctx

window.onload = function () {
  canvas = document.getElementById('game-canvas')
  ctx = canvas.getContext('2d')

  let fps = 30
  setInterval(updateAll, 1000 / fps)

  ctx.fillStyle = '#ff4500'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = '#87ceeb'
  ctx.beginPath()
  ctx.arc(100, 100, 10, 0, math.PI * 2, true)
  ctx.fill()
}