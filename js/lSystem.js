function Rule(input, outputs) {
	this.input = input;
	this.outputs = outputs;
}

function RuleSet () {
	this.iteration = 0;
	this.rules = {};
	this.ruleBook = {}
	
	RuleSet.prototype.addRule = function(rule, iteration) {
		if (typeof(this.ruleBook[iteration]) === "undefined")
			this.ruleBook[iteration] = Array(0);
		this.ruleBook[iteration].push(rule);
	}
	RuleSet.prototype.updateRules = function() {
		console.log("Updating RuleSet for iteration #" + this.iteration);
		var i = this.iteration;
		this.iteration++;
		if (typeof(this.ruleBook[i]) === "undefined") {
			console.log("No New Rules Found");
			return;
		}
		var rules = this.rules;
		this.ruleBook[i].forEach(function(rule) {
			rules[rule.input] = rule.outputs;
			console.log("Rule Added: " + rule.input + " > " + rules[rule.input])
		});
	}
	RuleSet.prototype.getReplace = function(iStr) {
		var idx = Math.floor(Math.random() * this.rules[iStr].length);
		return this.rules[iStr][idx];
	}
}


function LSystem (string, ruleSet) {
	this.string = string;
	this.ruleSet = ruleSet;
	
	LSystem.prototype.iterate = function() {
		var newParts = [];
		var ruleSet = this.ruleSet;
		ruleSet.updateRules();
		var keys = Object.keys(ruleSet.rules);
		var string = this.string;
		keys.forEach(function(key) {

			while (true) {
				var idx = string.indexOf(key);
				if (idx < 0) {
					break;
				}
				var start = string.slice(0, idx);
				var end = string.slice(idx + 1);
				string = start + "#" + newParts.length + "#" + end;
				newParts.push(ruleSet.getReplace(key));
			}
		});
		
		var newstring = "";
		var i = 0;
		while (i < string.length) {
			
			if(string.charAt(i) === "#") {
				var idx = ""
				i = i + 1;
				while (string.charAt(i) !== "#") {
					idx = idx + string.charAt(i);
					i = i + 1;
				}
				newstring += newParts[parseInt(idx)];
			} else {
				newstring += string.charAt(i);
			}
			i = i + 1;
		}
		this.string = newstring;
	}
}