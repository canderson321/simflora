function Time() {

	this.timeRate = 1;
	this.setRate = function(rate){
		this.timeRate = rate;
		this.update();
		//console.log(this.timeRate);
	}
	
	this.systemTime = Date.now();
	this.lastSystemTime = this.systemTime;

	this.time = 0;
	this.delta = 0;

	var daysPerYear = 8;
	var dayLength = 3000;
	this.summerDate = Math.PI / 4;
	this.fallDate = Math.PI * 3 / 4;
	this.winterDate = Math.PI * 5 / 4;
	this.springDate = Math.PI * 7 / 4;

	this.currentSeason = "";
	this.lastSeason = ""

	this.dayRad = 0;
	this.seasonRad = 0;
	
	this.start = false;

	this.update = function() {

		this.lastSystemTime = this.systemTime;
		this.systemTime = Date.now();
		
		
		this.delta = (this.systemTime - this.lastSystemTime) * this.timeRate;
		this.time += this.delta;
		
		
		this.dayRad = ((this.time / dayLength) % 2) * Math.PI;
		this.seasonRad = ((this.time / (dayLength * daysPerYear)) % 2) * Math.PI;
		this.lastSeason = this.currentSeason;
		this.currentSeason = this.getSeason();
		
		//console.log(this.delta);
		
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
