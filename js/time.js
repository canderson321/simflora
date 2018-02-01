function Time() {

	this.time = 0;
	this.lastTime = 0;
	this.delta = 0;

	var daysPerYear = 8;
	this.summerDate = Math.PI / 4;
	this.fallDate = Math.PI * 3 / 4;
	this.winterDate = Math.PI * 5 / 4;
	this.springDate = Math.PI * 7 / 4;

	this.currentSeason = "";
	this.lastSeason = ""

	this.dayRad = 0;
	this.seasonRad = 0;

	this.update = function(rate) {

		var now = Date.now();
		this.dayRad = ((now * rate / 3000) % 2) * Math.PI;
		this.seasonRad = ((now * rate / (3000 * daysPerYear)) % 2) * Math.PI;
		this.lastSeason = this.currentSeason;
		this.currentSeason = this.getSeason();

		this.lastTime = this.time;
		this.time = now;
		this.delta = this.time - this.lastTime;
	}

	this.getSeason = function() {
		if (this.seasonRad > this.summerDate && this.seasonRad <= this.fallDate)
			return "SU";
		else if (this.seasonRad > this.fallDate && this.seasonRad <= this.winterDate)
			return "FA";
		else if (this.seasonRad > this.winterDate && this.seasonRad <= this.springDate)
			return "WI";
		else
			return "SP";
	}
	this.update();
}
var timeRate = 1;