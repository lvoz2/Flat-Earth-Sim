function Enemy(pos) {
	console.log(pos);
	var EnemyThis = this;
	this.loc = {bounds: {lower: 0, upper: 250}};
	EnemyThis.loc.cur = pos;
	EnemyThis.loc.prev = pos;
	console.log(EnemyThis.loc);
	this.direction = 12;
	this.stats = {health: 10, damage: 1};
	this.move = function(dir) {
		console.log(EnemyThis.loc);
		var bools = {
			lower: (EnemyThis.loc.cur[0] > EnemyThis.loc.bounds.lower),
			upper: (EnemyThis.loc.cur[0] < EnemyThis.loc.bounds.upper),
		}
		if (bools.lower == bools.upper) {
			game.curSlot.map[EnemyThis.loc.cur[1]][EnemyThis.loc.cur[0]] = 0;
			game.curSlot.map[EnemyThis.loc.cur[1] + 1][EnemyThis.loc.cur[0]] = 0;
            if (dir[0] != 0) {
                EnemyThis.direction = 11 + dir[0];
            }
            EnemyThis.loc.cur[0] += dir[0];
            EnemyThis.loc.cur[1] += dir[1];
            game.curSlot.map[EnemyThis.loc.cur[1]][EnemyThis.loc.cur[0]] = EnemyThis.direction;
			game.curSlot.map[EnemyThis.loc.cur[1] + 1][EnemyThis.loc.cur[0]] = 14;
		}
	}
	this.parsePlayerLoc = function() {
		var plaLoc = game.curSlot.loc.cur.pla;
		console.log(EnemyThis.loc);
		var plaDir = (function() {
			if (plaLoc[0] < EnemyThis.loc.cur[0]) {
				return -1;
			} else if (plaLoc[0] == EnemyThis.loc.cur[0]) {
				return 0;
			} else if (plaLoc[0] > EnemyThis.loc.cur[0]) {
				return 1;
			}
		})();
		EnemyThis.makeDecision(plaDir)
	}
	this.makeDecision = function(plaDir) {
		if (Math.abs(game.curSlot.loc.cur.pla[0] - EnemyThis.loc.cur[0]) < 21) {
			if (plaDir != 0) {
				EnemyThis.move(plaDir);
			}
			if (EnemyThis.loc.prev == EnemyThis.loc.cur) {
				EnemyThis.attack(plaDir);
			}
		} else {
			if (game.getRandomInt(2) == 1) {
				var choices = [-1, 1];
				EnemyThis.move(choices[game.getRandomInt(2)]);
			}
		}
		EnemyThis.loc.prev = EnemyThis.loc.cur;
	}
	this.timers = {decisionTimer: setInterval(EnemyThis.parsePlayerLoc, 100)};
	this.live = function() {
		EnemyThis.timers.decisionTimer = setInterval(EnemyThis.parsePlayerLoc, 100);
	}
	this.showThySelf = function() {
		game.curSlot.map[EnemyThis.loc.cur[1]][EnemyThis.loc.cur[0]] = EnemyThis.direction;
		game.curSlot.map[EnemyThis.loc.cur[1] + 1][EnemyThis.loc.cur[0]] = 14;
	}
	this.attack = function(dir) {
		if ((game.curSlot.map[1][EnemyThis.loc.cur[0] + dir] >= 3) && (game.curSlot.map[1][EnemyThis.loc.cur[0] + dir] <= 6)) {
			game.curSlot.stats.health -= EnemyThis.stats.damage;
		}
	}
	this.showThySelf();
}