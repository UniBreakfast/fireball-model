const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

const fireball = {
  x: 500,
  y: 500,
  vx: 0,
  vy: 0,
  radius: 30,
  color: 'yellow',
  particles: [],
}

body.append(canvas)

updateCanvasSize()
render()

onresize = updateCanvasSize

onmousemove = e => {
  if (e.shiftKey) updateFireballPosition(e)
}

onmousedown = e => {
  if (!e.shiftKey) {
    const {x, y} = e

    throwFireball(x, y)
  }
}

onkeydown = e => {
  if (e.key === 'Shift') canvas.style.cursor = 'none'
}

onkeyup = e => {
  if (e.key === 'Shift') canvas.style.cursor = 'auto'
}

function throwFireball(x, y) {
  const angle = Math.atan2(y - fireball.y, x - fireball.x)
  const vx = Math.cos(angle) * 10
  const vy = Math.sin(angle) * 10

  Object.assign(fireball, {vx, vy})

  fireball.particles.push(...Array.from({length: 100}, createParticle))
}

function updateFireballPosition({x, y}) {
  Object.assign(fireball, {x, y})
}

function updateCanvasSize() {
  canvas.width = innerWidth
  canvas.height = innerHeight
}

function render() {
  clear()

  const {x, y, radius, color} = fireball

  drawFireball(x, y, radius, color)
  updateFireball()

  requestAnimationFrame(render)
}

function updateFireball() {
  const {vx, vy} = fireball

  fireball.x += vx
  fireball.y += vy

  updateParticles()
}

function drawFireball(x, y, radius, color) {
  drawCircle(x, y, radius, color)
  drawFireParticles(x, y, radius, color)
}

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function drawCircle(x, y, radius, color) {
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.fill()
}

function updateParticles() {
  const {particles} = fireball
  
  particles.push(...Array.from({length: 3}, createParticle))

  particles.forEach((particle, i) => {
    const {x, y, radius, vx, vy, grow} = particle
    const {width, height} = canvas

    if (x < 0 || x > width || y < 0 || y > height || radius < 0) {
      particles.splice(i, 1)

      return
    }

    if (grow) {
      particle.grow = (particle.radius += 0.3) < 7
    } else {
      if ((particle.radius -= 0.6) < 0) return particles.splice(i, 1)
    }

    particle.x += vx
    particle.y += vy
  })
}

function drawFireParticles() {
  fireball.particles.forEach(({x, y, radius, color}) => drawCircle(x, y, radius, color))
}

function createParticle() {
  const {x, y, radius} = fireball

  return {
    x: x + rnd(-radius, radius),
    y: y + rnd(-radius, radius),
    radius: 0.1,
    color: 'red',
    vx: rnd(-3, 3),
    vy: rnd(-5, 1),
    grow: true,
  }
}

function rnd(...args) {
  if (args.length === 1) {
    const [probability] = args
    return Math.random() < probability
  }

  if (args.length === 2) {
    const [min, max] = args
    return Math.random() * (max - min) + min
  }
}
