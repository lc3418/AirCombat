function $(id) {
	return document.getElementById(id);
}

var battle_ground = $("battleground");
var start = $("start");
var _pause = $("paused");
var start_page = $("start_page");
var game_init = $("consoleGame");
var score_view = $("score");
var game_over = $("game_over");
var over_score = $("over_score");
var over_title = $("over_title");
var max_score = $("max_score");
var restart = $("restart");
var current_hp = $("current_hp");
var damage = $("damage")
var pause_clicked = false;
var distance = 0;
var scores = 0;
var bullet_speed = 10;
var probability = 40;
var bullet_level = 0;
var plane_level = 0;
var bullet_rows = 1;
var dead = false; //if the plane has crashed
var player_health = 150;
var times;
var player_plane;

var e_plane = battle_ground.getElementsByClassName("_enemy");

start.onclick = function() {
	startGame();
};
game_init

game_init.onclick = function(){
   startGame();
   game_init.blur();
};
restart.onclick = startGame;
_pause.onclick = function() {
   pause_clicked = false;
   _pause.style.display="none";
}

var plane = [
	{
		width: 130,
		height: 106,
		x_coord: -137,
		y_coord: 0,
		background: "url(../img/img_plane_main.png)",
	}
];

var bullet = [
	{
		width: 14,
		height: 32,
		speed: 10,
		x_coord: -335,
		y_coord: -171,
		background: "url(../img/img_bullet.png)",
	}
];

var enemy_planes = [
	{
		width: 98,
		height: 76,
		HP: 1,
		speed: 5,
		score: 100,
		x_coord: -267,
		y_coord: -474,
		background: "url(../img/img_plane_enemy.png)",
	}, 
	{
		width: 104,
		height: 76,
		HP: 1,
		speed: 5,
		score: 100,
		x_coord: -162,
		y_coord: -474,
		background: "url(../img/img_plane_enemy.png)",
	}, 
	{
		width: 114,
		height: 82,
		speed: 20,
		HP: 2,
		score: 1000,
		x_coord: -367,
		y_coord: -440,
		background: "url(../img/img_plane_enemy.png)",
	}, 
	{
		width: 104,
		height: 76,
		HP: 2,
		speed: 5,
		score: 200,
		x_coord: -162,
		y_coord: -474,
		background: "url(../img/img_plane_enemy.png)",
	}, 
	{
		width: 175,
		height: 133,
		HP: 5,
		speed: 4,
		score: 500,
		x_coord: -190,
		y_coord: -340,
		background: "url(../img/img_plane_enemy.png)",
	}, 
	{
		width: 260,
		height: 196,
		HP: 20,
		speed: 3,
		score: 2000,
		x_coord: 0,
		y_coord: -2,
		background: "url(../img/img_plane_enemy.png)",
	}
];

var explode = ["wsparticle_07.png"];

var enemy_bullets = [
	[	
		{
			ATK: 20,
			width: 30,
			height: 30
		},
		["../img/h_bullet_10.png", "../img/h_bullet_11.png", "../img/h_bullet_12.png", "../img/h_bullet_13.png"]
	],
	[	
		{
			ATK: 10,
			width: 30,
			height: 30
		},
		["../img/h_bullet_20.png", "../img/h_bullet_21.png", "../img/h_bullet_22.png", "../img/h_bullet_23.png"]
	]
];

//reset game
function reset(){
	distance = 0;
	scores = 0;
	player_health = 150;
	pause_clicked = false;
	dead = false;
	bullet_rows = 1;
	bullet_level = 0;
	bullet_speed = bullet[bullet_level].speed;
	start_page.style.display = "none";
	game_over.style.display = "none";
	over_title.getElementsByTagName("img")[0].style.display = "none";
	//over_title.getElementsByTagName("img")[1].style.display = "none";
	current_hp.style.width = "150px";
	battle_ground.innerHTML = "";
}

function resetplayer_plane(){
	var startTop = 900;
	var startLeft = 375 - plane[plane_level].width / 2;
	create_plane(plane_level, plane, startTop, startLeft);
	document.onmousemove = function(e) {
		e = e || window.event;
		if(!pause_clicked) {
			move_plane(e);
		}
	}
}

function startGame() {
	reset();
	var max = cookieUtil.getCookie("scores") || 0;
	score_init(max, max_score);
	resetplayer_plane();
	clearInterval(times);
	times = setInterval(function() {
		if(!pause_clicked) {
			battle_ground.style.backgroundPosition = "0px " + distance + "px";
			distance++;
			scores++;
			score_init(scores, score_view);
			if(distance % bullet_speed == 0) {
				create_bullet_rows(bullet_rows, bullet_level) //create bullets
			}
			move_bullet(); //move bullets
			choose_enemy(); //generate hostile planes
			move_enemy(); //move hostile planes
			bullet_shot(e_plane); //determine if collide with hostile planes

			player_plane_collide(e_plane, enemy_collide_plane); //determine if my plane collide with hostile planes
			var enemy_bullets = battle_ground.getElementsByClassName("enemy_bullets");
			player_plane_collide(enemy_bullets,collide_player_plane) //determine if my plane was shot
			createdistance(distance); //generate flight distance
		}
	}, 20);
	document.onkeydown = function(e) {
		e = e || window.event;
		if(e.keyCode == 32) {
			pause_clicked = true;
			_pause.style.display = "block";
		}
	}
}

//choose to generate hostile plane
function choose_enemy() {
	var plane_left_margin = 0;
	var hp;
	if(distance % 700 == 0) {
		plane_left_margin = Math.floor(Math.random() * (751 - enemy_planes[5].width));
		hp = create_enemy(plane_left_margin, enemy_planes, 5);
		var rows = 0;
		clearInterval(hp.times);
		hp.times = setInterval(function(){
			if (!pause_clicked) {
				rows++;
				special_bullet(hp, 1);
				if (rows > 1 || dead || (hp.HP == 0) ){
					clearInterval(hp.times);
				}
			}
		},500);
	} 
	else if(distance % 300 == 0) {
		plane_left_margin = Math.floor(Math.random() * (751 - enemy_planes[4].width));
		create_enemy(plane_left_margin, enemy_planes, 4)
	} 
	else if(distance % 200 == 0) {
		plane_left_margin = Math.floor(Math.random() * (751 - enemy_planes[3].width));
		create_enemy(plane_left_margin, enemy_planes, 2)
	}
	else if(distance % 150 == 0) {
		plane_left_margin = Math.floor(Math.random() * (751 - enemy_planes[2].width));
		create_enemy(plane_left_margin, enemy_planes, 2)
	} 
	else if(distance % 75 == 0) {
		plane_left_margin = Math.floor(Math.random() * (751 - enemy_planes[1].width));
		create_enemy(plane_left_margin, enemy_planes, 1)
	} 
	else if(distance % 30 == 0) {
		plane_left_margin = Math.floor(Math.random() * (751 - enemy_planes[0].width));
		create_enemy(plane_left_margin, enemy_planes, 0);
	}
}

//create hostile plane
function create_enemy(plane_left_margin, enemy_planes, level) {
	var enemy = document.createElement("div");
	enemy.style.width = enemy_planes[level].width + "px";
	enemy.style.height = enemy_planes[level].height + "px";
	enemy.style.background = enemy_planes[level].background;
	enemy.style.backgroundPosition = enemy_planes[level].x_coord + "px " + enemy_planes[level].y_coord + "px";
	enemy.HP = enemy_planes[level].HP * Math.ceil(distance / 1000);
	enemy.score = enemy_planes[level].score;
	enemy.speed = enemy_planes[level].speed;
	enemy.className = "_enemy";
	enemy.style.position = "absolute";
	enemy.style.top = -enemy_planes[level].height + "px";
	enemy.style.left = plane_left_margin + "px";
	battle_ground.appendChild(enemy);
	return enemy;
}

//create one hostile bullet
function create_enemy_bullet(bullet_left, bullet_top, enemy_bullet) { //coordinates
	var enemy_bullets = document.createElement("img");
	enemy_bullets.className = "enemy_bullets";
	enemy_bullets.style.width = enemy_bullet[0].width + "px";
	enemy_bullets.style.height = enemy_bullet[0].height + "px";
	enemy_bullets.ATK = enemy_bullet[0].ATK;
	enemy_bullets.style.position = "absolute";
	enemy_bullets.style.top = bullet_top + "px";
	enemy_bullets.style.left = bullet_left + "px";
	enemy_bullets.index = 0;
	enemy_bullets.src = enemy_bullet[1][0];
	clearInterval(enemy_bullets.times);
	enemy_bullets.times = setInterval(function(){
		if (!pause_clicked) {
			enemy_bullets.index++;
			if (enemy_bullets.index > 3) {
				enemy_bullets.index = 0;
			}
			enemy_bullets.src = enemy_bullet[1][enemy_bullets.index];
			if (parseInt(enemy_bullets.style.top)>=950 || parseInt(enemy_bullets.style.left)<=-parseInt(enemy_bullets.style.width) || parseInt(enemy_bullets.style.left)>=750) {
				clearInterval(enemy_bullets.times);
			}
		}
	},200);
	battle_ground.appendChild(enemy_bullets);
	return enemy_bullets;
}

//generate one bullet
function create_bullet(bullet_top, bullet_left, level) {
	var myBullet = document.createElement("div");
	myBullet.className = "myBullet";
	myBullet.style.width = bullet[level].width + "px";
	myBullet.style.height = bullet[level].height + "px";
	myBullet.style.background = bullet[level].background;
	myBullet.style.backgroundPosition = bullet[level].x_coord + "px " + bullet[level].y_coord + "px";
	myBullet.style.position = "absolute";
	myBullet.style.top = bullet_top + "px";
	myBullet.style.left = bullet_left + "px";
	battle_ground.appendChild(myBullet);
}

//generate n rows of bullets
function create_bullet_rows(rows, level) {
	switch(rows) {
		case 1:
			{
				var create_top = parseInt(player_plane.style.top);
				var create_left = parseInt(player_plane.style.left) + plane[0].width / 2 - (bullet[level].width / 2);
				create_bullet(create_top, create_left, level);
				break;
			}
		case 2:
			{
				var create_top = parseInt(player_plane.style.top);
				var create_left = parseInt(player_plane.style.left) + plane[0].width / 2 - (bullet[level].width / 2) - 32;
				create_bullet(create_top, create_left, level);
				create_left = parseInt(player_plane.style.left) + plane[0].width / 2 - (bullet[level].width / 2) + 32;
				create_bullet(create_top, create_left, level);
				break;
			}
		case 3:
			{
				var create_top = parseInt(player_plane.style.top);
				var create_left = parseInt(player_plane.style.left) + plane[0].width / 2 - (bullet[level].width / 2);
				create_bullet(create_top, create_left, level);
				create_top = parseInt(player_plane.style.top) + 20;
				create_left = parseInt(player_plane.style.left) + plane[0].width / 2 - (bullet[level].width / 2) - 32;
				create_bullet(create_top, create_left, level);
				create_top = parseInt(player_plane.style.top) + 20;
				create_left = parseInt(player_plane.style.left) + plane[0].width / 2 - (bullet[level].width / 2) + 32;
				create_bullet(create_top, create_left, level);
				break;
			}
		case 4:
			{
				var create_top = parseInt(player_plane.style.top);
				var create_left = parseInt(player_plane.style.left) + plane[0].width / 2 - (bullet[level].width / 2) - 8;
				create_bullet(create_top, create_left, level);
				create_left = parseInt(player_plane.style.left) + plane[0].width / 2 - (bullet[level].width / 2) + 22;
				create_bullet(create_top, create_left, level);
				var create_top = parseInt(player_plane.style.top) + 20;
				var create_left = parseInt(player_plane.style.left) + plane[0].width / 2 - (bullet[level].width / 2) - 38;
				create_bullet(create_top, create_left, level);
				create_left = parseInt(player_plane.style.left) + plane[0].width / 2 - (bullet[level].width / 2) + 52;
				create_bullet(create_top, create_left, level);
				break;
			}
	}
}

//generate bullets in sector shape
function special_bullet(_enemy,bLevel) {
	var _left = _enemy.offsetLeft;
	var _top = _enemy.offsetTop;
	var _width = _enemy.offsetWidth;
	var _height = _enemy.offsetHeight;
	var _space = Math.floor(_width / 5);
	var hb = create_enemy_bullet(_left, _top+_height / 2, enemy_bullets[bLevel]);
	move_enemy_bullet(-2, 8, hb);
	hb = create_enemy_bullet(_left + _space, _top + _height / 2 + 30, enemy_bullets[bLevel]);
	move_enemy_bullet(-1, 8, hb);
	hb = create_enemy_bullet(_left + _space*2, _top + _height / 2 + 45, enemy_bullets[bLevel]);
	move_enemy_bullet(0, 8, hb);
	hb = create_enemy_bullet(_left + _space*3, _top + _height / 2 + 30, enemy_bullets[bLevel]);
	move_enemy_bullet(1, 8, hb);
	hb = create_enemy_bullet(_left + _space*4, _top + _height / 2, enemy_bullets[bLevel]);
	move_enemy_bullet(2, 8, hb);
}

//make plane
function create_plane(level, plane, oTop, oLeft) {
	player_plane = document.createElement("div");
	player_plane.style.width = plane[level].width + "px";
	player_plane.style.height = plane[level].height + "px";
	player_plane.style.background = plane[level].background;
	player_plane.style.backgroundPosition = plane[level].x_coord + "px " + plane[level].y_coord + "px";
	player_plane.style.position = "absolute";
	player_plane.style.zIndex = 99;
	player_plane.style.top = oTop + "px";
	player_plane.style.left = oLeft + "px";
	battle_ground.appendChild(player_plane);
}

//generate score
function score_init(scores, sElement) {
	scores = scores.toString();
	sElement.innerHTML = "";
	for(var i = 0; i < scores.length; i++) {
		var scoresImg = document.createElement("img");
		scoresImg.src = "../img/" + scores[i] + ".png";
		sElement.appendChild(scoresImg);
	}
}

//move planes
function move_plane(e) {
	var plane_x_c = e.clientX - battle_ground.offsetLeft - player_plane.offsetWidth / 2;
	var plane_y_c = e.clientY - battle_ground.offsetTop - player_plane.offsetHeight / 2;
	var battle_groundWidth = battle_ground.offsetWidth;
	var battle_groundHeight = battle_ground.offsetHeight;
	plane_x_c = Math.min(Math.max(plane_x_c, -player_plane.offsetWidth / 2), battle_groundWidth - player_plane.offsetWidth / 2);
	plane_y_c = Math.min(Math.max(plane_y_c, -player_plane.offsetHeight / 2), battle_groundHeight - player_plane.offsetHeight / 2);
	player_plane.style.top = plane_y_c + "px";
	player_plane.style.left = plane_x_c + "px";
}

//move bullet
function move_bullet() {
	var bullets = battle_ground.getElementsByClassName("myBullet");
	for(var i = 0; i < bullets.length; i++) {
		bullets[i].style.top = parseInt(bullets[i].style.top) - parseInt(bullets[0].style.height) + "px";
		//delete extra bullets
		if(parseInt(bullets[i].style.top) < -parseInt(bullets[0].style.height)) {
			battle_ground.removeChild(bullets[i]);
		}
	}
}

//move hostile planes
function move_enemy() {
	var enemy_planes = battle_ground.getElementsByClassName("_enemy");
	for(var i = 0; i < enemy_planes.length; i++) {
		enemy_planes[i].style.top = parseInt(enemy_planes[i].style.top) + enemy_planes[i].speed + "px";
		if(parseInt(enemy_planes[i].style.top) > 950) {
			battle_ground.removeChild(enemy_planes[i]);
		}
	}
}

//move enemy bullets
function move_enemy_bullet(x_c, y_c,enemy_element) { //velocity of bullets in x-axis and y-axis
	clearInterval(enemy_element.times2);
	enemy_element.times2 = setInterval(function(){
		if(!pause_clicked) {
			enemy_element.style.left = parseInt(enemy_element.style.left) + x_c + "px";
			enemy_element.style.top = parseInt(enemy_element.style.top) + y_c + "px";
			if(dead ||parseInt(enemy_element.style.top) >= 950 || 
			parseInt(enemy_element.style.left) <= -parseInt(enemy_element.style.width) || 
			parseInt(enemy_element.style.left) >= 750) {
				clearInterval(enemy_element.times2);
				battle_ground.removeChild(enemy_element);
			}
		}
	},30);
}

//my plane is injured
function damaged(){
	damage.style.display = "block";
	setTimeout(function(){
		damage.style.display = "none";
	},100);
}

//event of my plane was shot
function collide_player_plane(hBelement){
	current_hp.style.width = parseInt(current_hp.style.width) - hBelement.ATK + "px";
	player_health -= hBelement.ATK;
	damaged();
	if (player_health <= 0) {
		player_plane_explode();
	}
	if (bullet_speed < 10 ) {
		bullet_speed += 2;
	}
	if(bullet_rows > 1) {
		bullet_rows--;
		var oLeft = player_plane.offsetLeft;
		var oTop = player_plane.offsetTop;
		battle_ground.removeChild(player_plane);
		create_plane(bullet_rows - 1, plane, oTop, oLeft);
	}
	explosion(hBelement);
}

//determine if my plane collides
function player_plane_collide(_planes, func) {
	for(var j = 0; j < _planes.length; j++) {
		var _left = parseInt(_planes[j].style.left);
		var _top = parseInt(_planes[j].style.top);
		var _height = parseInt(_planes[j].offsetHeight);
		var _width = parseInt(_planes[j].offsetWidth);
		var move_left = parseInt(player_plane.style.left);
		var move_top = parseInt(player_plane.style.top);
		var height_displacement = parseInt(player_plane.offsetHeight);
		var width_displacement = parseInt(player_plane.offsetWidth);
		if(move_left + Math.floor(width_displacement / 3 * 2) > _left && ((move_left + width_displacement / 3 * 1) < _left + _width) && move_top < _top + _height / 2 && (move_top > _top - height_displacement / 2)) {
			func(_planes[j]);
		}
	}
}

//event of my plane colliding with hostile plane
function enemy_collide_plane(enemy_element){
	if (player_health > 50) {
		player_health -= 50;
		damaged();
		current_hp.style.width = player_health + "px";
		if (enemy_element.className == "_enemy") {
			explosion(enemy_element);
		}
	}else{
		damaged();
		current_hp.style.width = player_health + "px";
		explosion(enemy_element);
		player_plane_explode();
	}
}

//event of crash of my plane
function player_plane_explode() {
	player_health = 0;
	current_hp.style.width = player_health + "px";
	explosion(player_plane);
	var max = cookieUtil.getCookie("scores") || 0;
	if(scores > max) {
		cookieUtil.setCookie("scores", scores, 7);
		max = scores;
	} 
	over_title.getElementsByTagName("img")[0].style.display = "block";
	score_init(scores, over_score);
	game_over.style.display = "block";
	dead = true;
	clearInterval(times);
}

//determine if my bullets shot hostile planes
function bullet_shot(e_plane) {
	var bullets = battle_ground.getElementsByClassName("myBullet");
	for(var i = 0; i < bullets.length; i++) {
		for(var j = 0; j < e_plane.length; j++) {
			if(!bullets[i]) {
				continue;
			}
			var bullet_left = parseInt(bullets[i].style.left);
			var bullet_top = parseInt(bullets[i].style.top);
			var _left = parseInt(e_plane[j].style.left);
			var _top = parseInt(e_plane[j].style.top);
			var bHeight = parseInt(bullets[i].offsetHeight);
			var bWidth = parseInt(bullets[i].offsetWidth);
			var _height = parseInt(e_plane[j].offsetHeight);
			var _width = parseInt(e_plane[j].offsetWidth);
			if(e_plane[j].HP > 0 && bullet_left > _left - bWidth && bullet_left < _left + _width && bullet_top < _top + _height - bHeight && bullet_top > _top - bHeight) {
				battle_ground.removeChild(bullets[i]);
				e_plane[j].HP--;
				if(e_plane[j].HP <= 0) {
					scores = scores + e_plane[j].score;
					score_init(scores, score_view); 
					explosion(e_plane[j]);
				}
			}
		}
	}
}

//plane crashing
function explosion(plane_explode) {
	plane_explode.className = "plane_explode";
	plane_explode.style.backgroundImage = "url(../img/" + explode[0] + ")";
	plane_explode.style.backgroundPosition = "center";
	plane_explode.style.backgroundRepeat = "no-repeat";
	var index = 1;
	clearInterval(plane_explode.times);
	plane_explode.times = setInterval(function() {
		plane_explode.style.backgroundImage = "url(../img/" + explode[index] + ")";
		index++;
		if(index == 3) {
			clearInterval(plane_explode.times);
			battle_ground.removeChild(plane_explode);	
		}
	}, 50);
}



