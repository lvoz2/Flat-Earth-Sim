$(document).ready(function() {
	$(".menu").height(window.innerHeight * 0.8).css("padding-top", window.innerHeight * 0.2);
	addEventListener("resize", function() {
		$(".menu").height(window.innerHeight * 0.8).css("padding-top", window.innerHeight * 0.2);
		if ($("#controlsMenu").hasClass("darkScreen")) {
			$("#controlsMenu").removeAttr("style");
		}
	}
	);
    window.game = new Game();
    if (localStorage.getItem("save")) {
        game.saves = JSON.parse(localStorage.getItem("save"));
    }
	if (localStorage.getItem("settings")) {
		game.settings = JSON.parse(localStorage.getItem("settings"));
	}
	$("#controlsBack")[0].addEventListener("click", () => {
		if ($("#controlsMenu").hasClass("darkScreen")) {
			game.changeView("#pauseMenu", {overlay: "#game", useDarkLayer: true});
		} else {
			game.changeView('#startMenu');
		}
	});
	$("#controlsUp").text(game.settings.keys.up);
	$("#controlsLeft").text(game.settings.keys.left);
	$("#controlsDown").text(game.settings.keys.down);
	$("#controlsRight").text(game.settings.keys.right);
    var assets = game.assets;
	assets.push(new game.Asset("img\\textures\\emptyTile.png",1,1)); // 0
	assets.push(new game.Asset("img\\textures\\grassBlock1.png",1,1)); // 1
	assets.push(new game.Asset("img\\textures\\grassBlock2.png",1,1)); // 2
	assets.push(new game.Asset("img\\textures\\grassBlock3.png",1,1)); // 3
	assets.push(new game.Asset("img\\textures\\grassBlock4.png",1,1)); // 4
	assets.push(new game.Asset("img\\textures\\dirtBlock1.png",1,1)); // 5
	assets.push(new game.Asset("img\\textures\\dirtBlock2.png",1,1)); // 6
	assets.push(new game.Asset("img\\textures\\dirtBlock3.png",1,1)); // 7
	assets.push(new game.Asset("img\\textures\\dirtBlock4.png",1,1)); // 8
	assets.push(new game.Asset("img\\textures\\playerLeft.png",1,2)); // 9
	assets.push(new game.Asset("img\\textures\\playerFront.png",1,2)); // 10
	assets.push(new game.Asset("img\\textures\\playerRight.png",1,2)); // 11
	assets.push(new game.Asset("img\\textures\\emptyTile.png",1,1)); // 12
	assets.push(new game.Asset("img\\backgrounds\\dayBackground_clouds.png",1920,1080)); // 13
	assets.push(new game.Asset("img\\backgrounds\\dayBackground_noclouds.png",1920,1080)); // 14
	assets.push(new game.Asset("img\\backgrounds\\nightBackground_clouds.png",1920,1080)); // 15
	assets.push(new game.Asset("img\\backgrounds\\nightBackground_noclouds.png",1920,1080)); // 16
	assets.push(new game.Asset("img\\textures\\enemyLeft.png",1,2)); // 17
	assets.push(new game.Asset("img\\textures\\enemyFront.png",1,2)); // 18
	assets.push(new game.Asset("img\\textures\\enemyRight.png",1,2)); // 19
	assets.push(new game.Asset("img\\textures\\emptyTile.png",1,1)); // 20
}
);
function Game() {
    var GameThis = this;
    this.assets = []; // holds backgrounds and textures, by index
	this.canvas = { // holds info about the canvas and its context
        canvas: $("#gameCanvas"),
        context: $("#gameCanvas")[0].getContext("2d"),
        parentDiv: $("#game")
    };
    this.curSlot; // holds reference to current save slot, so that it can be manipulated easily
	this.enemies = []; // holds all the enemies
	this.initSlot; // holds the current slot number, from the changeView function, so that it can be used to initalize that slot
    this.saves = {}; // holds all save information
	this.sizeFactor = 5; // holds information about how zoomed the tiles are
    this.timers = {}; // calls to setTimeout and setInterval return ints that are stored here
	this.settings = {"keys": {"up": "w", "right": "d", "down": "s", "left": "a", "pause": "Escape"}};
	this.defaults = {keys: {up: "w", right: "d", down: "s", left: "a", pause: "Escape"}};
	this.changeControls = function(e, control) {
		window.addEventListener("keydown", function(event) {
			GameThis.settings.keys[control] = event.key;
			$(e).text(GameThis.settings.keys[control]);
			localStorage.setItem("settings", JSON.stringify(GameThis.settings));
		}, {once: true});
	}
	this.pause = function() {
		clearInterval(GameThis.timers.tick);
		removeEventListener("visibilitychange", GameThis.handleVisibilityChanges);
		removeEventListener("keydown", GameThis.handleKeyPresses);
		addEventListener("keydown", GameThis.handlePause);
		GameThis.changeView("#pauseMenu", {overlay: "#game", useDarkLayer: true});
		GameThis.save();
	}
	this.handlePause = function(e) {
		if (e.key == GameThis.settings.keys.pause) {
			if ($("#pauseMenu").hasClass("visible")) {
				GameThis.resume();
			}
		}
	}
	this.resume = function() {
		GameThis.timers.tick = setInterval(GameThis.tick, 100);
		addEventListener("visibilitychange", GameThis.handleVisibilityChanges);
		removeEventListener("keydown", GameThis.handlePause);
		addEventListener("keydown", GameThis.handleKeyPresses);
		GameThis.changeView("#game");
	}
	this.loadSaveInfo = function() {
		$(".saveSlot").each(function(i, obj) {
			if (game.saves[i]) {
				$(obj).children(".saveTitle").text(game.saves[i].title);
				if (game.saves[i].ticks < 600) {
					$(obj).children("p").children(".saveTime").text(`${Math.floor(game.saves[i].ticks / 10)} seconds`);
				} else if (game.saves[i].ticks < 36000) {
					if (Math.floor(game.saves[i].ticks / 600) == 1) {
						$(obj).children("p").children(".saveTime").text(`${Math.floor(game.saves[i].ticks / 600)} minute and ${Math.floor((game.saves[i].ticks % 600) / 10)} seconds`);
					} else {
						$(obj).children("p").children(".saveTime").text(`${Math.floor(game.saves[i].ticks / 600)} minutes and ${Math.floor((game.saves[i].ticks % 600) / 10)} seconds`);
					}
				} else {
					if ((Math.floor((game.saves[i].ticks % 36000) / 600) != 1) && (Math.floor(game.saves[i].ticks / 36000) != 1)) {
						$(obj).children("p").children(".saveTime").text(`${Math.floor(game.saves[i].ticks / 36000)} hours, ${Math.floor((game.saves[i].ticks % 36000) / 600)} minutes and ${Math.floor(((game.saves[i].ticks % 36000) % 600) / 10)} seconds`);
					} else if ((Math.floor((game.saves[i].ticks % 36000) / 600) == 1) && (Math.floor(game.saves[i].ticks / 36000) != 1)) {
						$(obj).children("p").children(".saveTime").text(`${Math.floor(game.saves[i].ticks / 36000)} hours, ${Math.floor((game.saves[i].ticks % 36000) / 600)} minute and ${Math.floor(((game.saves[i].ticks % 36000) % 600) / 10)} seconds`);
					} else if ((Math.floor((game.saves[i].ticks % 36000) / 600) != 1) && (Math.floor(game.saves[i].ticks / 36000) == 1)) {
						$(obj).children("p").children(".saveTime").text(`${Math.floor(game.saves[i].ticks / 36000)} hour, ${Math.floor((game.saves[i].ticks % 36000) / 600)} minutes and ${Math.floor(((game.saves[i].ticks % 36000) % 600) / 10)} seconds`);
					} else if ((Math.floor((game.saves[i].ticks % 36000) / 600) == 1) && (Math.floor(game.saves[i].ticks / 36000) = 1)) {
						$(obj).children("p").children(".saveTime").text(`${Math.floor(game.saves[i].ticks / 36000)} hour, ${Math.floor((game.saves[i].ticks % 36000) / 600)} minute and ${Math.floor(((game.saves[i].ticks % 36000) % 600) / 10)} seconds`);
					}
				}
				$(obj).children(".savePlay").html("<span> Load Game </span>").attr("onclick", `game.play("${i}")`);
			} else {
				$(obj).children(".saveTitle").text("Empty Slot");
				$(obj).children("p").children(".saveTime").text("0 seconds");
				$(obj).children(".savePlay").html("<span> New Game </span>").attr("onclick", `game.changeView('#saveCreationSettingsMenu', {slot:${i}})`);
			}
		}
		);
	}
    this.save = function() {
        localStorage.setItem("save", JSON.stringify(GameThis.saves));
    }
	this.initEnemies = function() {
		GameThis.curSlot.enemylocs.forEach(function(e, i) {
			GameThis.enemies.push(new GameThis.Enemy([e, 1], i));
		}
		);
	}
	this.initSave = function() {
		GameThis.saves[GameThis.initSlot] = new GameThis.Save($('#saveCreationSettingsTitle').val());
		GameThis.play(GameThis.initSlot);
	}
    this.Save = function(title) {
        var SaveThis = this;
		if (title == '') {
			SaveThis.title = "New Game";
		} else {
			SaveThis.title = title;
		}
		this.stats = {health: 20, damage: 5};
        this.backgroundImageIndex = 13 + (function() {
            if ((GameThis.getRandomInt(10) % 10) == 0) {
                return 1
            } else {
                return 0
            }
        }
        )();
        this.ticks = 0;
        this.loc = {
            cur: {
                cam: [116, 0],
                pla: [125, 1]
            },
            bounds: {
                cam: {
                    lower: 0,
                    upper: 232
                },
                pla: {
                    lower: 8,
                    upper: 242
                }
            }
        };
        this.direction = 10;
        this.time = {
            start: Date.now(),
            cur: 0
        };
        this.map = (function() {
            var res = [];
            for (var a = 0; a < 8; a++) {
                res.push([]);
                for (var b = 0; b < 251; b++) {
                    if (a < 3) {
                        if (a == SaveThis.loc.cur.pla[1] && b == SaveThis.loc.cur.pla[0]) {
                            res[a].push(SaveThis.direction);
						} else if (a == (SaveThis.loc.cur.pla[1] + 1) && b == SaveThis.loc.cur.pla[0]) {
							res[a].push(12);
                        } else {
                            res[a].push(0);
                        }
                    } else if (a == 3) {
                        res[a].push(GameThis.getRandomInt(4) + 1);
                    } else {
                        res[a].push(GameThis.getRandomInt(4) + 5);
                    }
                }
            }
            return res;
        }
        )();
        this.jumping = false;
		this.enemylocs = [];
	}
	this.spawnEnemy = function(x) {
		var ind = GameThis.enemies.length;
		GameThis.enemies.push(new GameThis.Enemy([x, 1], ind));
		GameThis.curSlot.enemylocs.push(x);
	}
	this.attack = function(loc) {
		GameThis.curSlot.enemylocs.forEach(function (e, i) {
			if (e == loc[0]) {
				GameThis.enemies[i].stats.health -= GameThis.curSlot.stats.damage;
			}
		}
		);
	}
    this.tick = function() {
        GameThis.curSlot.ticks++;
		var ticks = GameThis.curSlot.ticks;
        if (ticks % 10 == 0) {
			GameThis.save();
        }
        if (ticks % 600 == 0) {
            GameThis.changeTime();
        }
		if (ticks % 10 == 0) {
            GameThis.enemies.forEach(function(e, i) {
				e.parsePlayerLoc();
			}
			);
		}
		if (ticks % 50 == 0) {
			if (GameThis.enemies.length < 500) {
				if ((Math.floor(ticks / 600) % 2) == 0) {
					var loc = GameThis.getRandomInt(250);
					if (loc >= GameThis.curSlot.loc.cur.pla[0]) {
						loc++;
					}
					GameThis.spawnEnemy(loc);
				}
				else {
					for (var i = 0; i < 5; i++) {
						var loc = GameThis.getRandomInt(250);
						if (loc >= GameThis.curSlot.loc.cur.pla[0]) {
							loc++;
						}
						GameThis.spawnEnemy(loc);
					}
				}
			}
        }
		if (GameThis.curSlot.stats.health <= 0) {
			GameThis.end();
		}
    }
	this.end = function() {
		clearInterval(GameThis.timers.tick);
		removeEventListener("visibilitychange", GameThis.handleVisibilityChanges);
		removeEventListener("keydown", GameThis.handleKeyPresses);
		$("#endScore").text(Math.floor(GameThis.curSlot.ticks / 10));
		GameThis.changeView("#endScreen", {overlay: "#game", useDarkLayer: true});
		for (var i = 0; i < 3; i++) {
			if (JSON.stringify(GameThis.curSlot) == JSON.stringify(GameThis.saves[i])) {
				delete GameThis.saves[i]
			}
		}
		GameThis.save();
		GameThis.enemies = [];
	}
    this.changeTime = function() {
		$("#game").removeClass("day night");
        var clouds = (function() {
            if ((GameThis.getRandomInt(10) % 10) == 0) {
                return 1;
            } else {
                return 0;
            }
        }
        )();
        if ((Math.floor(GameThis.curSlot.ticks / 600) % 2) == 1) {
			$("#game").addClass("night");
            GameThis.curSlot.backgroundImageIndex = 15 + clouds;
            GameThis.canvas.context.fillStyle = "#FFFFFF";
            GameThis.canvas.context.strokeStyle = "#FFFFFF";
        } else if ((Math.floor(GameThis.curSlot.ticks / 600) % 2) == 0) {
			$("#game").addClass("day");
            GameThis.curSlot.backgroundImageIndex = 13 + clouds;
            GameThis.canvas.context.fillStyle = "#000000";
            GameThis.canvas.context.strokeStyle = "#000000";
        }
    }
	this.click = function(e) {
		var rect = GameThis.canvas.canvas[0].getBoundingClientRect();
		var coords = {
			x: (Math.floor((e.clientX - rect.left) / GameThis.sizeFactor) + GameThis.curSlot.loc.cur.cam[0]),
			y: Math.floor(((e.clientY - rect.top) - (GameThis.canvas.canvas[0].height - (8 * GameThis.sizeFactor))) / GameThis.sizeFactor)
		};
		if (coords.y >= 0 && coords.y <= 7) {
			if ((GameThis.curSlot.map[coords.y][coords.x] >= 17) && (GameThis.curSlot.map[coords.y][coords.x] <= 20)) {
				GameThis.attack([coords.x, coords.y]);
			}
		}
	}
	this.handleKeyPresses = function(e) {
		if (e.key == GameThis.settings.keys.left) {
			GameThis.move([-1, 0]);
		} else if (e.key == GameThis.settings.keys.up) {
			GameThis.jump();
		} else if (e.key == GameThis.settings.keys.right) {
			GameThis.move([1, 0]);
		} else if (e.key == GameThis.settings.keys.down) {
			GameThis.curSlot.map[GameThis.curSlot.loc.cur.pla[1]][GameThis.curSlot.loc.cur.pla[0]] = 0;
			GameThis.curSlot.direction = 10;
			GameThis.curSlot.map[GameThis.curSlot.loc.cur.pla[1]][GameThis.curSlot.loc.cur.pla[0]] = GameThis.curSlot.direction;
		} else if (e.key == GameThis.settings.keys.pause) {
			if ($("#pauseMenu").hasClass("hidden")) {
				GameThis.pause();
			}
		}
	}
	this.handleVisibilityChanges = function() {
		if (document.visibilityState == "hidden") {
			GameThis.pause();
		}
	}
    this.play = function(slot) {
        GameThis.curSlot = GameThis.saves[slot];
        addEventListener("keydown", GameThis.handleKeyPresses);
		addEventListener("visibilitychange", GameThis.handleVisibilityChanges);
		if ((GameThis.curSlot.backgroundImageIndex == 15) || (GameThis.curSlot.backgroundImageIndex == 16)) {
			$("#game").removeClass("day").addClass("night");
            GameThis.canvas.context.fillStyle = "#FFFFFF";
            GameThis.canvas.context.strokeStyle = "#FFFFFF";
		} else if ((GameThis.curSlot.backgroundImageIndex == 13) || (GameThis.curSlot.backgroundImageIndex == 14)) {
			$("#game").removeClass("night").addClass("day");
            GameThis.canvas.context.fillStyle = "#000000";
            GameThis.canvas.context.strokeStyle = "#000000";
		}
		addEventListener("resize", GameThis.setCanvasSizeLoc);
		GameThis.setCanvasSizeLoc()
        GameThis.render();
        GameThis.changeView("#game");
        GameThis.timers.tick = setInterval(GameThis.tick, 100);
		GameThis.initEnemies();
		$("#controlsMenu").removeClass("menu").addClass("darkScreen").removeAttr("style");
		GameThis.save();
    }
    this.move = function(dir) {
        var curSlot = GameThis.curSlot;
        var loc = curSlot.loc;
        var bools = {
            cam: {
                current: {
                    lower: (loc.cur.cam[0] > loc.bounds.cam.lower),
                    upper: (loc.cur.cam[0] < loc.bounds.cam.upper)
                },
                future: {
                    lower: ((loc.cur.cam[0] + dir[0]) >= loc.bounds.cam.lower),
                    upper: ((loc.cur.cam[0] + dir[0]) <= loc.bounds.cam.upper)
                }
            },
            pla: {
                attached: {
                    lower: (loc.cur.pla[0] > loc.bounds.pla.lower),
                    upper: (loc.cur.pla[0] < loc.bounds.pla.upper)
                },
                detached: {
                    lower: ((loc.cur.pla[0] + dir[0]) >= 0),
                    upper: ((loc.cur.pla[0] + dir[0]) <= (curSlot.map[0].length - 1))
                }
            }
        };
        if ((bools.cam.current.lower == bools.cam.current.upper) || (bools.pla.attached.lower == bools.pla.attached.upper)) {
            if (bools.cam.future.lower && bools.cam.future.upper) {
                loc.cur.cam[0] += dir[0];
            }
        }
        if (bools.pla.detached.lower == bools.pla.detached.upper) {
            curSlot.map[loc.cur.pla[1]][loc.cur.pla[0]] = 0;
			curSlot.map[loc.cur.pla[1] + 1][loc.cur.pla[0]] = 0;
            if (dir[0] != 0) {
                curSlot.direction = 10 + dir[0];
            }
            loc.cur.pla[0] += dir[0];
            loc.cur.pla[1] += dir[1];
            curSlot.map[loc.cur.pla[1]][loc.cur.pla[0]] = curSlot.direction;
			curSlot.map[loc.cur.pla[1] + 1][loc.cur.pla[0]] = 12;
        }
    }
    this.jump = function() {
        if (GameThis.curSlot.jumping == true) {
            GameThis.curSlot.jumping = false;
            GameThis.move([0, 1]);
            clearTimeout(GameThis.timers.jump);
        } else {
            GameThis.curSlot.jumping = true;
            GameThis.move([0, -1]);
            GameThis.timers.jump = setTimeout(GameThis.jump, 500);
        }
    }
    this.setCanvasSizeLoc = function() {
		if ((window.innerWidth / 16) <= (window.innerHeight / 9)) {
			GameThis.canvas.canvas[0].width = window.innerWidth;
			GameThis.canvas.canvas[0].height = (window.innerWidth / 16) * 9;
		} else {
			GameThis.canvas.canvas[0].height = window.innerHeight;
			GameThis.canvas.canvas[0].width = (window.innerHeight / 9) * 16;
		}
		GameThis.sizeFactor = GameThis.canvas.canvas[0].width / 19;
		GameThis.canvas.canvas.css("margin-top", (window.innerHeight - GameThis.canvas.canvas[0].height) / 2);
		GameThis.canvas.canvas.css("margin-right", (window.innerWidth - GameThis.canvas.canvas[0].width) / 2);
		GameThis.canvas.canvas.css("margin-bottom", (window.innerHeight - GameThis.canvas.canvas[0].height) / 2);
		GameThis.canvas.canvas.css("margin-left", (window.innerWidth - GameThis.canvas.canvas[0].width) / 2);
		if ((GameThis.curSlot.backgroundImageIndex == 15) || (GameThis.curSlot.backgroundImageIndex == 16)) {
			GameThis.canvas.context.fillStyle = "#FFFFFF";
            GameThis.canvas.context.strokeStyle = "#FFFFFF";
		}
    }
    this.render = function() {
		GameThis.canvas.context.clearRect(0, 0, GameThis.canvas.canvas[0].width, GameThis.canvas.canvas[0].height);
        GameThis.canvas.context.drawImage(GameThis.assets[GameThis.curSlot.backgroundImageIndex].img, 0, 0, GameThis.canvas.canvas[0].width, (GameThis.canvas.canvas[0].width / 16) * 9);
        var cond = true;
        for (var y = 0; cond; y++) {
            cond = !(!((y + 1) < Math.floor(GameThis.canvas.canvas.height() / (GameThis.sizeFactor))) || !((y + 1) < 8));
            for (var x = 0; x < Math.floor(GameThis.canvas.canvas.width() / (GameThis.sizeFactor)); x++) {
                GameThis.canvas.context.drawImage(GameThis.assets[GameThis.curSlot.map[GameThis.curSlot.loc.cur.cam[1] + y][GameThis.curSlot.loc.cur.cam[0] + x]].img, (x * GameThis.sizeFactor), (y * GameThis.sizeFactor) + (GameThis.canvas.canvas[0].height - 8 * (GameThis.sizeFactor)), (GameThis.assets[GameThis.curSlot.map[GameThis.curSlot.loc.cur.cam[1] + y][GameThis.curSlot.loc.cur.cam[0] + x]].x) * GameThis.sizeFactor, (GameThis.assets[GameThis.curSlot.map[GameThis.curSlot.loc.cur.cam[1] + y][GameThis.curSlot.loc.cur.cam[0] + x]].y) * GameThis.sizeFactor);
            }
        }
		GameThis.canvas.context.font = "20px Joystix";
        GameThis.canvas.context.fillText(`Score: ${Math.floor(GameThis.curSlot.ticks / 10)}`, 50, 50);
		GameThis.canvas.context.fillText(`Health: ${Math.floor((GameThis.curSlot.stats.health / 20) * 100)}` + "%", 50, 75);
		requestAnimationFrame(GameThis.render);
    }
    this.changeView = function(id, args = {overlay: "#something", useDarkLayer: false, slot: -1}) {
		if (id == "#startMenu") {
			$("#controlsMenu").removeClass("darkScreen").addClass("menu");
			$(".menu").height(window.innerHeight * 0.8).css("padding-top", window.innerHeight * 0.2);
		}
		if (args.useDarkLayer == true) {
			$(`.menu, #game, .darkScreen, ${args.overlay}`).removeClass("visible hidden");
			$(args.overlay).addClass("visible");
			$(".darkLayer").removeClass("hidden").addClass("visible");
		} else {
			$(".menu, #game, .darkScreen").removeClass("visible hidden");
			$(".darkLayer").removeClass("visible").addClass("hidden");
		}
        $(id).addClass("visible");
        $(".menu, #game, .darkScreen").addClass(function() {
            if (!($(this).hasClass("visible"))) {
                return "hidden";
            }
        }
		);
		if (args.slot >= 0) {
			GameThis.initSlot = args.slot;
		}
    }
	this.updateNamingBox = function() {
		if ($('#saveCreationSettingsTitle').val() != "") {
			$('#saveCreationSettingsSaveTitle').text(($('#saveCreationSettingsTitle').val()) + "' ");
		} else {
			$('#saveCreationSettingsSaveTitle').text(($('#saveCreationSettingsTitle').attr("placeholder")) + "' ");
		}
	}
	this.Asset = function(url, x, y) {
		this.img = new Image();
		this.img.src = url;
		this.x = x;
		this.y = y;
	}
	this.getRandomInt = function(max) {
		return (Math.floor(Math.random() * max));
	}
	this.Enemy = function(pos, ind) {
		var EnemyThis = this;
		this.index = ind;
		this.loc = {cur: pos, prev: [parseInt(pos[0]), parseInt(pos[1])], bounds: {lower: 0, upper: 250}};
		this.direction = 19;
		this.stats = {health: 10, damage: 1};
		this.move = function(dir) {
			var bools;
			if ((EnemyThis.loc.cur[0] - GameThis.curSlot.loc.cur.pla[0]) > 0) {
				bools = {
					lower: (EnemyThis.loc.cur[0] > (GameThis.curSlot.loc.cur.pla[0] + 1)),
					upper: (EnemyThis.loc.cur[0] < EnemyThis.loc.bounds.upper),
				}
			} else if ((EnemyThis.loc.cur[0] - GameThis.curSlot.loc.cur.pla[0]) < 0) {
				bools = {
					lower: (EnemyThis.loc.cur[0] > EnemyThis.loc.bounds.lower),
					upper: (EnemyThis.loc.cur[0] < (GameThis.curSlot.loc.cur.pla[0] - 1)),
				}
			}
			if (bools.lower == bools.upper) {
				GameThis.curSlot.map[EnemyThis.loc.cur[1]][EnemyThis.loc.cur[0]] = 0;
				GameThis.curSlot.map[EnemyThis.loc.cur[1] + 1][EnemyThis.loc.cur[0]] = 0;
				if (dir[0] != 0) {
					EnemyThis.direction = 18 + dir;
				}
				EnemyThis.loc.cur[0] += dir;
				GameThis.curSlot.map[EnemyThis.loc.cur[1]][EnemyThis.loc.cur[0]] = EnemyThis.direction;
				GameThis.curSlot.map[EnemyThis.loc.cur[1] + 1][EnemyThis.loc.cur[0]] = 20;
			}
			GameThis.curSlot.enemylocs[EnemyThis.index] = EnemyThis.loc.cur[0];
		}
		this.parsePlayerLoc = function() {
			if (EnemyThis.stats.health > 0) {
				var plaLoc = GameThis.curSlot.loc.cur.pla;
				var plaDir = (function() {
					if (plaLoc[0] < EnemyThis.loc.cur[0]) {
						return -1;
					} else if (plaLoc[0] == EnemyThis.loc.cur[0]) {
						return 0;
					} else if (plaLoc[0] > EnemyThis.loc.cur[0]) {
						return 1;
					}
				})();
				EnemyThis.makeDecision(plaDir);
			} else {
				EnemyThis.die();
			}
		}
		this.makeDecision = function(plaDir) {
			if (Math.abs(GameThis.curSlot.loc.cur.pla[0] - EnemyThis.loc.cur[0]) < 21) {
				if (plaDir != 0) {
					EnemyThis.move(plaDir);
				}
				if ((EnemyThis.loc.prev[0] == EnemyThis.loc.cur[0]) && (EnemyThis.loc.prev[1] == EnemyThis.loc.cur[1])) {
					EnemyThis.attack(plaDir);
				}
			} else {
				if (GameThis.getRandomInt(2) == 1) {
					var choices = [-1, 1];
					EnemyThis.move(choices[GameThis.getRandomInt(2)]);
				}
			}
			EnemyThis.loc.prev = [parseInt(EnemyThis.loc.cur[0]), parseInt(EnemyThis.loc.cur[1])];
		}
		this.showThySelf = function() {
			GameThis.curSlot.map[EnemyThis.loc.cur[1]][EnemyThis.loc.cur[0]] = EnemyThis.direction;
			GameThis.curSlot.map[EnemyThis.loc.cur[1] + 1][EnemyThis.loc.cur[0]] = 20;
		}
		this.attack = function(dir) {
			if ((GameThis.curSlot.map[1][EnemyThis.loc.cur[0] + dir] >= 9) && (GameThis.curSlot.map[1][EnemyThis.loc.cur[0] + dir] <= 12)) {
				if (GameThis.curSlot.stats.health > 0) {
					GameThis.curSlot.stats.health -= EnemyThis.stats.damage;
				}
			}
		}
		this.die = function() {
			GameThis.curSlot.map[EnemyThis.loc.cur[1]][EnemyThis.loc.cur[0]] = 0;
			GameThis.curSlot.enemylocs.splice(EnemyThis.index, 1);
			GameThis.enemies.forEach(function(e, i) {
				if (e.index > EnemyThis.index) {
					e.index--;
				}
			}
			);
			GameThis.enemies.splice(EnemyThis.index, 1);
		}
		this.showThySelf();
	}
}
