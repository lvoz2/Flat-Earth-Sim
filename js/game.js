$(document).ready(function() {
	$(".menu").height(window.innerHeight * 0.8);
	$(".menu").css("padding-top", window.innerHeight * 0.2);
	addEventListener("resize", function() {
		$(".menu").height(window.innerHeight * 0.8);
		$(".menu").css("padding-top", window.innerHeight * 0.2);
	});
    window.game = new Game();
    if (localStorage.getItem("save")) {
        game.saves = JSON.parse(localStorage.getItem("save"));
    }
    var assets = game.assets;
	assets.push(new game.Asset("img\\textures\\emptyTile.png",20,20)); // 0
	assets.push(new game.Asset("img\\textures\\grassBlock.png",20,20)); // 1
	assets.push(new game.Asset("img\\textures\\dirtBlock.png",20,20)); // 2
	assets.push(new game.Asset("img\\textures\\playerLeft.png",20,40)); // 3
	assets.push(new game.Asset("img\\textures\\playerFront.png",20,40)); // 4
	assets.push(new game.Asset("img\\textures\\playerRight.png",20,40)); // 5
	assets.push(new game.Asset("img\\textures\\emptyTile.png",20,20)); // 6
	assets.push(new game.Asset("img\\backgrounds\\dayBackground_clouds.png",1920,1080)); // 7
	assets.push(new game.Asset("img\\backgrounds\\dayBackground_noclouds.png",1920,1080)); // 8
	assets.push(new game.Asset("img\\backgrounds\\nightBackground_clouds.png",1920,1080)); // 9
	assets.push(new game.Asset("img\\backgrounds\\nightBackground_noclouds.png",1920,1080)); // 10
	assets.push(new game.Asset("img\\textures\\playerLeft.png",20,40)); // 11
	assets.push(new game.Asset("img\\textures\\playerFront.png",20,40)); // 12
	assets.push(new game.Asset("img\\textures\\playerRight.png",20,40)); // 13
	assets.push(new game.Asset("img\\textures\\emptyTile.png",20,20)); // 14
});
function Game() {
    var GameThis = this;
	this.GameThis = GameThis;
	this.sizeFactor = 5;
    this.timers = {};
    this.saves = {};
	this.loadSaveInfo = function() {
		$(".saveSlot").each(function(i, obj) {
			if (game.saves[i]) {
				$(obj).children(".saveTitle").text(game.saves[i].title);
				if (game.saves[i].ticks < 600) {
					$(obj).children("p").children(".saveTime").text(Math.floor(game.saves[i].ticks / 10) + " seconds");
				} else if (game.saves[i].ticks < 36000) {
					if (Math.floor(game.saves[i].ticks / 600) == 1) {
						$(obj).children("p").children(".saveTime").text(Math.floor(game.saves[i].ticks / 600) + " minute and " + Math.floor((game.saves[i].ticks % 600) / 10) + " seconds");
					} else {
						$(obj).children("p").children(".saveTime").text(Math.floor(game.saves[i].ticks / 600) + " minutes and " + Math.floor((game.saves[i].ticks % 600) / 10) + " seconds");
					}
				} else {
					if ((Math.floor((game.saves[i].ticks % 36000) / 600) != 1) && (Math.floor(game.saves[i].ticks / 36000) != 1)) {
						$(obj).children("p").children(".saveTime").text(Math.floor(game.saves[i].ticks / 36000) + " hours, " + Math.floor((game.saves[i].ticks % 36000) / 600) + " minutes and " + Math.floor(((game.saves[i].ticks % 36000) % 600) / 10) + " seconds");
					} else if ((Math.floor((game.saves[i].ticks % 36000) / 600) == 1) && (Math.floor(game.saves[i].ticks / 36000) != 1)) {
						$(obj).children("p").children(".saveTime").text(Math.floor(game.saves[i].ticks / 36000) + " hours, " + Math.floor((game.saves[i].ticks % 36000) / 600) + " minute and " + Math.floor(((game.saves[i].ticks % 36000) % 600) / 10) + " seconds");
					} else if ((Math.floor((game.saves[i].ticks % 36000) / 600) != 1) && (Math.floor(game.saves[i].ticks / 36000) == 1)) {
						$(obj).children("p").children(".saveTime").text(Math.floor(game.saves[i].ticks / 36000) + " hour, " + Math.floor((game.saves[i].ticks % 36000) / 600) + " minutes and " + Math.floor(((game.saves[i].ticks % 36000) % 600) / 10) + " seconds");
					} else if ((Math.floor((game.saves[i].ticks % 36000) / 600) == 1) && (Math.floor(game.saves[i].ticks / 36000) = 1)) {
						$(obj).children("p").children(".saveTime").text(Math.floor(game.saves[i].ticks / 36000) + " hour, " + Math.floor((game.saves[i].ticks % 36000) / 600) + " minute and " + Math.floor(((game.saves[i].ticks % 36000) % 600) / 10) + " seconds");
					}
				}
				$(obj).children(".savePlay").html("<span> Load Game </span>");
				$(obj).children(".savePlay").attr("onclick", "game.play(" + i + ")");
			} else {
				$(obj).children(".saveTitle").text("Empty Slot");
				$(obj).children("p").children(".saveTime").text("0 seconds");
				$(obj).children(".savePlay").html("<span> New Game </span>");
			}
		}
		);
	}
    this.save = function() {
        localStorage.setItem("save", JSON.stringify(game.saves));
    }
	this.initSlot;
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
		this.stats = {health: 10, damage: 5};
        this.backgroundImageIndex = 7 + (function() {
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
        this.direction = 4;
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
							res[a].push(6);
                        } else {
                            res[a].push(0);
                        }
                    } else if (a == 3) {
                        res[a].push(1);
                    } else {
                        res[a].push(2);
                    }
                }
            }
            return res;
        }
        )();
        this.jumping = false;
		this.enemies = {};
		this.spawnEnemy = function(x) {
			SaveThis.enemies[x] = new Enemy([x, 1]);
		}
    }
	this.attack = function(loc) {
		if ((GameThis.curSlot.map[1][GameThis.loc.cur.pla[0] + dir] >= 11) && (GameThis.curSlot.map[1][GameThis.loc.cur.pla[0] + dir] <= 14)) {
			GameThis.curSlot.enemies[GameThis.loc.cur.pla[0] + dir].stats.health -= GameThis.curSlot.stats.damage;
		}
	}
	this.lastTick;
    this.tick = function() {
		var before = GameThis.curSlot.ticks;
        GameThis.curSlot.ticks += Math.floor((Date.now() - GameThis.lastTick) / 100);
        if (((before % 100) > (GameThis.curSlot.ticks % 100)) || ((GameThis.curSlot.ticks % 100) == 0)) {
			GameThis.save()
        }
        if (((before % 600) > (GameThis.curSlot.ticks % 600)) || ((GameThis.curSlot.ticks % 600) == 0)) {
            GameThis.changeTime()
        }
		GameThis.lastTick = Date.now();
    }
    this.changeTime = function() {
		$("#game").removeClass("day night");
        var clouds = (function() {
            if ((GameThis.getRandomInt(10) % 10) == 0) {
                return 1
            } else {
                return 0
            }
        }
        )();
        if ((GameThis.curSlot.backgroundImageIndex == 7) || (GameThis.curSlot.backgroundImageIndex == 8)) {
			$("#game").addClass("night");
            GameThis.curSlot.backgroundImageIndex = 9 + clouds;
            GameThis.canvas.context.fillStyle = "#FFFFFF";
            GameThis.canvas.context.strokeStyle = "#FFFFFF";
        } else if ((GameThis.curSlot.backgroundImageIndex == 9) || (GameThis.curSlot.backgroundImageIndex == 10)) {
			$("#game").addClass("day");
            GameThis.curSlot.backgroundImageIndex = 7 + clouds;
            GameThis.canvas.context.fillStyle = "#000000";
            GameThis.canvas.context.strokeStyle = "#000000";
        }
    }
    this.canvas = {
        canvas: $("#gameCanvas"),
        context: $("#gameCanvas")[0].getContext("2d"),
        parentDiv: $("#game")
    };
    this.assets = [];
    this.curSlot;
    this.play = function(slot) {
        GameThis.curSlot = GameThis.saves[slot];
        addEventListener("keydown", (e) => {
            if (e.key == "ArrowLeft" || e.key == "a") {
                GameThis.move([-1, 0]);
            } else if (e.key == "ArrowUp" || e.key == "w" || e.key == " ") {
                GameThis.jump();
            } else if (e.key == "ArrowRight" || e.key == "d") {
                GameThis.move([1, 0]);
            } else if (e.key == "ArrowDown" || e.key == "s") {
                GameThis.curSlot.map[GameThis.curSlot.loc.cur.pla[1]][GameThis.curSlot.loc.cur.pla[0]] = 0;
                GameThis.curSlot.direction = 4;
                GameThis.curSlot.map[GameThis.curSlot.loc.cur.pla[1]][GameThis.curSlot.loc.cur.pla[0]] = GameThis.curSlot.direction;
            }
        }
        );
		addEventListener("visibilitychange", (e) => {
			if (document.visibilityState == "hidden") {
				clearInterval(GameThis.timers.tick);
			} else if (document.visibilityState == "visible") {
				GameThis.lastTick = Date.now();
				GameThis.timers.tick = setInterval(GameThis.tick, 100);
			}
		}
		);
		if ((GameThis.curSlot.backgroundImageIndex == 9) || (GameThis.curSlot.backgroundImageIndex == 10)) {
			$("#game").removeClass("day");
			$("#game").addClass("night");
            GameThis.canvas.context.fillStyle = "#FFFFFF";
            GameThis.canvas.context.strokeStyle = "#FFFFFF";
		}
		addEventListener("resize", function() {
			GameThis.setCanvasSizeLoc();
		});
		GameThis.setCanvasSizeLoc()
		GameThis.lastTick = Date.now();
        GameThis.render();
        GameThis.changeView("#game");
        GameThis.timers.tick = setInterval(GameThis.tick, 100);
		GameThis.save()
		for (var enemy in GameThis.curSlot.enemies) {
			enemy.live()
		}
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
                curSlot.direction = 4 + dir[0];
            }
            loc.cur.pla[0] += dir[0];
            loc.cur.pla[1] += dir[1];
            curSlot.map[loc.cur.pla[1]][loc.cur.pla[0]] = curSlot.direction;
			curSlot.map[loc.cur.pla[1] + 1][loc.cur.pla[0]] = 6;
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
		GameThis.sizeFactor = (GameThis.canvas.canvas[0].width / 19) / 20;
		GameThis.canvas.canvas.css("margin-top", (window.innerHeight - GameThis.canvas.canvas[0].height) / 2);
		GameThis.canvas.canvas.css("margin-right", (window.innerWidth - GameThis.canvas.canvas[0].width) / 2);
		GameThis.canvas.canvas.css("margin-bottom", (window.innerHeight - GameThis.canvas.canvas[0].height) / 2);
		GameThis.canvas.canvas.css("margin-left", (window.innerWidth - GameThis.canvas.canvas[0].width) / 2);
		if ((GameThis.curSlot.backgroundImageIndex == 9) || (GameThis.curSlot.backgroundImageIndex == 10)) {
			GameThis.canvas.context.fillStyle = "#FFFFFF";
            GameThis.canvas.context.strokeStyle = "#FFFFFF";
		}
    }
    this.render = function() {
		GameThis.canvas.context.clearRect(0, 0, GameThis.canvas.canvas[0].width, GameThis.canvas.canvas[0].height);
        GameThis.canvas.context.drawImage(GameThis.assets[GameThis.curSlot.backgroundImageIndex].img, 0, 0, GameThis.canvas.canvas[0].width, (GameThis.canvas.canvas[0].width / 16) * 9);
        var cond = true;
        for (var y = 0; cond; y++) {
            cond = !(!((y + 1) < Math.floor(GameThis.canvas.canvas.height() / (20 * GameThis.sizeFactor))) || !((y + 1) < 8));
            for (var x = 0; x < Math.floor(GameThis.canvas.canvas.width() / (20 * GameThis.sizeFactor)); x++) {
                GameThis.canvas.context.drawImage(GameThis.assets[GameThis.curSlot.map[GameThis.curSlot.loc.cur.cam[1] + y][GameThis.curSlot.loc.cur.cam[0] + x]].img, (x * (20 * GameThis.sizeFactor)), ((y * (20 * GameThis.sizeFactor)) + (GameThis.canvas.canvas[0].height - 8 * (20 * GameThis.sizeFactor))), (GameThis.assets[GameThis.curSlot.map[GameThis.curSlot.loc.cur.cam[1] + y][GameThis.curSlot.loc.cur.cam[0] + x]].x) * GameThis.sizeFactor, (GameThis.assets[GameThis.curSlot.map[GameThis.curSlot.loc.cur.cam[1] + y][GameThis.curSlot.loc.cur.cam[0] + x]].y) * GameThis.sizeFactor);
            }
        }
		GameThis.canvas.context.font = "20px Joystix";
        GameThis.canvas.context.fillText("Score: " + Math.floor(GameThis.curSlot.ticks / 10), 50, 50);
        requestAnimationFrame(GameThis.render);
    }
    this.changeView = function(id, modifySaves = false, slot = 0) {
        $(".menu, #game").removeClass("visible hidden");
        $(id).addClass("visible");
        $(".menu, #game").addClass(function() {
            if (!($(this).hasClass("visible"))) {
                return "hidden";
            }
        });
		if (modifySaves) {
			GameThis.initSlot = slot;
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
}