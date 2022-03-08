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
		return 0
	},
	right: (div) => {
		let right = main.getBoundingClientRect().width;
		right -= div.getBoundingClientRect().width;
		right -= parseInt(getComputedStyle(main).getPropertyValue("--padding")) * 2;
		return right
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
			div = $.querySelector(".player.left");
			break;
		case "right":
			div = $.querySelector(".player.right");
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
	y: 0,
	x: 0
}

let velocity = {
	y: 1,
	x: 1
}

function moveBall() {
	let newy = ballpos.y + velocity.y;
	let newx = ballpos.x + velocity.x;
	let increaseY = -0.1;
	let increaseX = -0.1;

	if (Math.sign(newy) == -1) {increaseY *= -1}
	if (Math.sign(newx) == -1) {increaseX *= -1}

	if (velocity.y >= 15 || velocity.y <= -15) {increaseY = 0}
	if (velocity.x >= 15 || velocity.x <= -15) {increaseX = 0}

	if (newy < bounds.top()) {
		velocity.y = (velocity.y * -1) + increaseY;
		return;
	}

	if (newy > bounds.bottom(ball)) {
		velocity.y = (velocity.y * -1) + increaseY;
		return;
	}


	if (newx < bounds.left()) {
		velocity.x = (velocity.x * -1) + increaseX;
		return;
	}

	if (newx > bounds.right(ball)) {
		velocity.x = (velocity.x * -1) + increaseX;
		return;
	}

	ballpos.y = newy;
	ballpos.x = newx;

	ball.style.transform = `translateY(${newy}px) translateX(${newx}px)`
}
