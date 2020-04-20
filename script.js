// Inicializa elementos, variáveis e flags
const canvas = document.querySelector("#canvas")
const context = canvas.getContext("2d")
const img_bg = new Image()
img_bg.src = "bg.png"
let ball_list = []
let is_left_click_down = false
let mouse_x = 0
let mouse_y = 0
let arrow_up = false
let arrow_down = false
let arrow_left = false
let arrow_right = false

// Opções
let g = 0.7 // Força da gravidade
let g_dir = { x: 0, y: 1 } // Direção da gravidade
let bounce = 0.7 // Taxa de restituição
let friction = 0.98 // Taxa de atrito
let line_wid = 2 // Espessura da linha dos círculos
let max_radius = 10 // Raio máximo do círculo
let min_radius = 10 // Raio mínimo do círculo
let fps = 1000 / 60 // Taxa de atualização do loop principal
let ball_qty = 1 // Quantidade de bolas criadas por update

// Objeto Ball
function Ball(x, y, radius) {
  // Variáveis do objeto
  this.x = x
  this.y = y
  this.vx = 0
  this.vy = 0
  this.prev_x = x + getRandomInt(-1, 1)
  this.prev_y = y - 10
  this.radius = radius + line_wid

  // Atualiza a posição da bola
  this.updatePosition = function() {
    this.vx = (this.x - this.prev_x) * friction
    this.vy = (this.y - this.prev_y) * friction
    this.prev_x = this.x
    this.prev_y = this.y
    this.x = this.x + this.vx + g_dir.x * g
    this.y = this.y + this.vy + g_dir.y * g
  }

  // Colisões entre as bolas
  this.ballCollisions = function(i) {
    let ball_1 = ball_list[i]
    for (j = i + 1; j < ball_list.length; j++) {
      let ball_2 = ball_list[j]
      let diff_x = ball_1.x - ball_2.x
      let diff_y = ball_1.y - ball_2.y
      let dists = diff_x * diff_x + diff_y * diff_y
      let dist = Math.sqrt(dists)
      let target = ball_1.radius + ball_2.radius
      if (dist < target) {
        let factor = (dist - target) / dist
        ball_1.x -= diff_x * 0.5 * factor
        ball_1.y -= diff_y * 0.5 * factor
        ball_2.x += diff_x * 0.5 * factor
        ball_2.y += diff_y * 0.5 * factor
      }
    }
  }

  // Colisões com as paredes do canvas
  this.wallCollisions = function() {
    let vx = (this.x - this.prev_x) * friction
    let vy = (this.y - this.prev_y) * friction
    if (this.x + this.radius >= canvas.width) {
      this.x = canvas.width - this.radius
      this.prev_x = this.x + vx * bounce
    } else if (this.x - this.radius <= 0) {
      this.x = 0 + this.radius
      this.prev_x = this.x + vx * bounce
    }
    if (this.y + this.radius >= canvas.height) {
      this.y = canvas.height - this.radius
      this.prev_y = this.y + vy * bounce
    } else if (this.y - this.radius <= 0) {
      this.y = 0 + this.radius
      this.prev_y = this.y + vy * bounce
    }
  }

  // Desenha o objeto
  this.draw = function() {
    context.beginPath()
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false)
    context.lineWidth = line_wid
    context.strokeStyle = "#ffffff"
    context.stroke()
  }
}

// Loop principal
function updateGame() {
  context.drawImage(img_bg, 0, 0) // Desenha a imagem de background
  for (i = 0; i < ball_list.length; i++) {
    ball_list[i].updatePosition()
    ball_list[i].ballCollisions(i)
    ball_list[i].wallCollisions()
    ball_list[i].draw()
  }
  updateG()
}

// Loop mais lento (para não criar bolas tão rápido)
function updateSlow() {
  createBall()
}

// Atualiza a direção da gravidade
function updateG() {
  if (arrow_up == true) {
    g_dir.y = -1
  } else if (arrow_down == true) {
    g_dir.y = 1
  } else {
    g_dir.y = 1
  }
  if (arrow_left == true) {
    g_dir.x = -1
  } else if (arrow_right == true) {
    g_dir.x = 1
  } else {
    g_dir.x = 0
  }

  // GAMBIARRA
  if (g_dir.x != 0 && g_dir.y != 0) {
    g_dir.x = g_dir.x / 2
    g_dir.y = g_dir.y / 2
  }
}

// Inicia o loop
setInterval(updateGame, fps)
setInterval(updateSlow, fps * 4)

// Helper: atualiza a posição do mouse dentro do canvas
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect()
  mouse_x = evt.clientX - rect.left
  mouse_y = evt.clientY - rect.top
}

// Helper: retorna um int aleatório dentro do intervalo especificado
function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Registra a ação do mouse
canvas.addEventListener("mousedown", mouseDown)
canvas.addEventListener("mouseup", mouseUp)
canvas.addEventListener("mousemove", mouseMove)
canvas.addEventListener("mousemove", mouseMove)

// Registra a ação do teclado
window.addEventListener("keydown", keyDown)
window.addEventListener("keyup", keyUp)

// Mouse movimentado: atualiza a posição do cursor
function mouseMove(evt) {
  getMousePos(canvas, evt)
}

// Clique encerrado: interrompe a criação de novas bolas
function mouseUp(evt) {
  if (evt.button == 0) {
    is_left_click_down = false
  }
}

// Mouse pressionado
function mouseDown(evt) {
  getMousePos(canvas, evt)

  // Click esquerdo: aciona a criação de novas bolas
  if (evt.button == 0) {
    is_left_click_down = true
  }

  // Click direito
  else if (evt.button == 2) {
  }
}

// Cria novas bolas
function createBall() {
  if (is_left_click_down) {
    for (i = 0; i < ball_qty; i++) {
      let radius = Math.floor(Math.random() * max_radius) + min_radius
      if (radius > max_radius) {
        radius = max_radius
      }
      new_ball = new Ball(mouse_x, mouse_y, radius)
      ball_list.push(new_ball)
    }
  }
}

// Click direito: direciona a gravidade para o cursor do mouse

// Setas do teclado: altera a gravidade para a direção pressionada
function keyDown(evt) {
  if (evt.key == "ArrowUp") {
    arrow_up = true
  } else if (evt.key == "ArrowDown") {
    arrow_down = true
  }
  if (evt.key == "ArrowLeft") {
    arrow_left = true
  } else if (evt.key == "ArrowRight") {
    arrow_right = true
  }
}

// Reseta a gravidade na direção não pressionada
function keyUp(evt) {
  if (evt.key == "ArrowUp") {
    arrow_up = false
  } else if (evt.key == "ArrowDown") {
    arrow_down = false
  }
  if (evt.key == "ArrowLeft") {
    arrow_left = false
  } else if (evt.key == "ArrowRight") {
    arrow_right = false
  }
}
