function generateInstructions() {
	var iterations = 6;
	var axiom = "[X]"
	
	var ruleSet = new RuleSet();
	
	// ITERATIVE RULES
	ruleSet.addRule(new Rule("F", ["F", "FF", "FFF"]), 0);
	ruleSet.addRule(new Rule("X", ["F[RX][RX]Fr[X]", "F[RX][RX][RX]Fr[X]", "F[RX][RX][RX][RX]Fr[X]"]), 0);

	ruleSet.addRule(new Rule("X", ["F[+F--F][-F++F]"]), iterations - 2);
	ruleSet.addRule(new Rule("F", ["FF"]), iterations - 1);
	
	// POST-PROCESSING RULES
	ruleSet.addRule(new Rule(";?:?;", ["?"]), 0); // pick random number
	ruleSet.addRule(new Rule("F*", ["F?"]), 0); // compress forward instructions
	
	var lsystem = new LSystem(axiom, ruleSet);
	
	for (var i = 0; i < iterations; i++)
		lsystem.iterate();
	return iterations + lsystem.string;
}

$(document).ready(function() {
	
	
	// $(".container").show();
	
	var graphics = new Graphics()
	graphics.animate();
	
	$("#copy").click(function() {
		

		var string = generateInstructions();
		$("#text").val(string);
		$("#text").focus().select();
		document.execCommand("copy");
		$("#msg").show();
		$("#msg").fadeOut(5000);
	});
	
	$("#clear").click(function() {
		$("#text").val("");
	});
	
	$("#startTHREE").click(function() {
		$(".container").hide();
		var graphics = new Graphics()
		graphics.animate();
	});
	
});
