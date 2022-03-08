var $ = document;

setInterval(() => {
	if (down("w")) {move("left", -1)} else
	if (down("s")) {move("left", 1)}
	if (down("ArrowUp")) {move("right", -1)} else
	if (down("ArrowDown")) {move("right", 1)}
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
		default:
			throw "Unknown paddle"
	}

	let bottom = main.getBoundingClientRect().height;
	bottom -= div.getBoundingClientRect().height;
	bottom -= parseInt(getComputedStyle(main).getPropertyValue("--padding")) * 2;

	newcord = paddles[paddle] + cord;
	if (newcord < 0) {return}
	if (newcord > bottom) {return}

	paddles[paddle] += cord;
	cord = paddles[paddle];
	div.style.transform = `translateY(${paddles[paddle]}px)`
}
