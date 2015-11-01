$(function() {
    var playSound = function(isCorrect, handler) {
	var sound;
	if(isCorrect) {
	    sound = $("#correct-sound");
	}
	else {
	    sound = $("#wrong-sound");
	}
	if(handler) {
	    sound.one("ended", handler);
	}
	sound[0].play();
    };

    var startStopBGM = function(flag) {
	var bgm = $("#bgm1")[0];
	if(flag) {
	    bgm.volume = 0.5;
	    bgm.play();
	}
	else {
	    bgm.pause();
	}
    };
    
    var showMenu = function() {
	var menuTemplate = _.template($("#menu-template").html());
	$("#main-container").html(menuTemplate());
	$("#answer-to-formula-check").bootstrapSwitch({
	    offText: "九九から答え",
	    onText: "答えから九九",
	    size: "large"
	});
	$(".menu-btn").click(function(e) {
	    var dan = Number($(this).data("dan"));
	    var answerToFormula = $("#answer-to-formula-check").prop("checked");
	    $("#menu").addClass("animated fadeOut");
	    $("#menu").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
		startProbrem(dan, answerToFormula);
	    });
	    startStopBGM(true);
	});
    };

    var startProbrem = function(dan, answerToFormula) {
	var showProbrem = function(probrems) {
	    var probrem = probrems.pop();
	    if(probrem) {
		var probremTemplate = _.template($("#probrem-template").html());
		var question;
		var answer;
		if(answerToFormula) {
		    question = probrem.answer;
		    answer = probrem.formula;
		}
		else {
		    question = probrem.formula;
		    answer = probrem.answer;
		}
		$("#main-container").html(probremTemplate({
		    question: question
		}));
		$("#cards-row").html(cards);
		$("#probrem").addClass("animated bounceInDown");
		$(".card-btn").click(function(e) {
		    var selectedAnswer = $(this).data("card");
		    if(answer == selectedAnswer) {
			// 正解
			var template = _.template($("#correct-answer-template").html());
			$("#main-container").html(template({
			    formula: probrem.formula,
			    answer: probrem.answer
			}));
			$("#next-probrem-btn").hide();
			$("#next-probrem-btn").click(function(e) {
			    showProbrem(probrems);
			});
			playSound(true, function() {
			    $("#next-probrem-btn").show();
			});
		    }
		    else {
			// 不正解
			disableCards();
			playSound(false, function() {
			    enableCards();
			});
		    }
		});
	    }
	    else {
		// 終了
		startStopBGM(false);
		showFinish(dan);
	    }
	};

	var disableCards = function() {
	    $(".card-btn").attr("disabled","disabled");
	};

	var enableCards = function() {
	    $(".card-btn").removeAttr("disabled");
	};

    	var probrems = _.shuffle(makeProbrems(dan));
	var cards = [];
	var cardTemplate = _.template($("#card-template").html());
	for(var i=0; i<probrems.length; ++i) {
	    var answer;
	    if(answerToFormula) {
		answer = probrems[i].formula;
	    }
	    else {
		answer = probrems[i].answer;
	    }
	    cards.push(cardTemplate({card: answer}));
	}
	cards = _.shuffle(cards);

	showProbrem(probrems);
    };

    var makeProbrems = function(dan) {
	var probrems = [];
	for(var i=1; i<=9; ++i) {
	    var probrem = {
		formula: String(dan) + "×" + String(i),
		answer: dan * i
	    };
	    probrems.push(probrem);
	}
	return probrems;
    };

    var showFinish = function(dan) {
	var sound = $("#finish-sound")[0];
	sound.play();
	var template = _.template($("#finish-template").html());
	$("#main-container").html(template({dan: dan}));
	$("#retry-btn").click(function(e) {
	    showMenu();
	});
    };
    
    showMenu();
});
