var $ = document;

setInterval(() => {
	if (down("w")) {move("left", -1)} else
	if (down("s")) {move("left", 1)}
	if (down("ArrowUp")) {move("right", -1)} else
	if (down("ArrowDown")) {move("right", 1)}

	moveBall()
}, 1)


//
// Keyboard Input
//

var active = "";

function down(key) {
	return active.includes(`+${key}+`)
}

$.addEventListener("keydown", (e) => {
	if (!down(`+${e.key}+`)) {
		active += `+${e.key}+`;
	}
})

$.addEventListener("keyup", (e) => {
	switch(e.key) {
		case "Shift":
		case "AltGraph":
			active = "";
			break;
		default:
			active = active.replaceAll(`+${e.key}+`, "")
	}
})

//
// Bounds
//

var bounds = {
	top: () => {
		return 0
	},
	left: () => {
		return 0;
	},
	right: (div) => {
		let rightcord = main.getBoundingClientRect().width;
		rightcord -= div.getBoundingClientRect().width;
		rightcord -= parseInt(getComputedStyle(main).getPropertyValue("--padding")) * 2;
		return rightcord;
	},
	bottom: (div) => {
		let bottom = main.getBoundingClientRect().height;
		bottom -= div.getBoundingClientRect().height;
		bottom -= parseInt(getComputedStyle(main).getPropertyValue("--padding")) * 2;
		return bottom
	}
}

//
// Movement
//

let paddles = {
	left: 0,
	right: 0,
}

function move(paddle, cord) {
	let div;
	let pos = 0;

	switch(paddle) {
		case "left":
			div = left;
			break;
		case "right":
			div = right;
			break;
		case "ball":
			div = ball;
			break;
		default:
			throw "Unknown paddle"
	}

	newcord = paddles[paddle] + cord;
	if (newcord < bounds.top()) {return}
	if (newcord > bounds.bottom(div)) {return}

	paddles[paddle] += cord;
	cord = paddles[paddle];
	div.style.transform = `translateY(${paddles[paddle]}px)`
}

//
// Ball
//

let ballpos = {
	y: 35,
	x: 35
}

let velocity = {
	y: 1,
	x: 1
}

function moveBall() {
	let newy = ballpos.y + velocity.y;
	let newx = ballpos.x + velocity.x;
	let increaseY = 0;
	let increaseX = 0;

	if (Math.sign(newy) == -1) {increaseY *= -1}
	if (Math.sign(newx) == -1) {increaseX *= -1}

	if (velocity.y >= 5 || velocity.y <= -5) {increaseY = 0}
	if (velocity.x >= 5 || velocity.x <= -5) {increaseX = 0}

	if (newy < bounds.top() || 
		newy > bounds.bottom(ball)) {

		velocity.y = (velocity.y * -0.8) + increaseY;
		return;
	}

	if (newx < bounds.left() ||
		newx > bounds.right(ball)) {

		let point = ball.getBoundingClientRect();
		pointY = point.top - (point.height / 2);
		let side = point.right;
		if (newx < bounds.left()) {side = point.left}
		if (
			! $.elementFromPoint(side, pointY).classList.contains("player") ||
			! $.elementFromPoint(side, point.top).classList.contains("player") ||
			! $.elementFromPoint(side, point.bottom).classList.contains("player")) {

			if (newx < bounds.left()) {
				scores.left++;
			} else {scores.right++}
			reset();
		}

		velocity.x = (velocity.x * -1) + increaseX;
		return;
	}

	ballpos.y = newy;
	ballpos.x = newx;

	ball.style.transform = `translateY(${newy}px) translateX(${newx}px)`
}

function reset() {
	let rect = main.getBoundingClientRect();
	ballpos.x = rect.width / 2;
	ballpos.y = rect.height / 2;

	let num = () => {
		let res = Math.floor(Math.random() * (1 - -1 + 1) + -1)
		if (res == 0) {
			return num();
		} else {return res}
	}
	velocity.y = num();
	velocity.x = num();

	updateScores();
}

//
// Scoring System
//

let scores = {
	left: 0,
	right: 0
}

function updateScores() {
	leftscore.innerHTML = scores.left;
	rightscore.innerHTML = scores.right;
}



reset()
