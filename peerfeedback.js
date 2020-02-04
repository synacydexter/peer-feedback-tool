var data = null;
var revieweeCodeData = null;

function initializeDataFromSheety() {
	var request = new XMLHttpRequest();
	
	request.open('GET', 'https://v2-api.sheety.co/d5f0c9b0dacd3d4a8ef4064ae95e1a44/peerFeedbackV2/formResponses1', true);
	request.onload = function () {
		if (request.status >= 200 && request.status < 400) {
			data = JSON.parse(this.response);
			generateQuarterSelection();
			enableGetResultButton();
		}
		else {
			showError("No connection. Please try again later.");
		}
	}
	request.setRequestHeader("Authorization","Bearer P4Mth'25rQyB")
	request.send();
}

function initializeRevieweeCodeFromSheety() {
	var request = new XMLHttpRequest();
	request.open('GET', 'https://v2-api.sheety.co/d5f0c9b0dacd3d4a8ef4064ae95e1a44/peerFeedbackV2/emailCodes', true);
	request.onload = function () {
		if (request.status >= 200 && request.status < 400) {
            revieweeCodeData = JSON.parse(this.response);
		}
		else {
			showError("No connection. Please try again later.");
		}
	}
	request.setRequestHeader("Authorization","Bearer P4Mth'25rQyB")
	request.send();
}

function showError(msg) {
	document.getElementById("error_message").innerHTML = msg;
}

function enableGetResultButton() {
	document.getElementById("get-result-button").enabled = true;
}

function getFeedbackResult(name, quarter, code) {
	showError("");
	clearFeedbackTable();
	if (data != null ) {
		var resultCount = 0;
		var table = document.getElementById("peer_feedback_result");
		console.log("Peer feedback for " + name);
		console.log(this.response);

		var codeToCheck = "";
		revieweeCodeData.emailCodes.forEach(function(revieweeCode) {
			if (revieweeCode["name"] == name) {
				codeToCheck = revieweeCode["randomCode"];
			}
			
		});

		if (codeToCheck != code) {
			showError("Invalid code. Please check your email for your unique code.");
		} 
		else {
			for (i = 0; data.formResponses1[i] != null; i++) {
				if (data.formResponses1[i]["youAreGivingFeedbackTo:"] === name && data.formResponses1[i]["quarter:"] == quarter) {
					generateResultColumn(data.formResponses1[i]);
					resultCount++;
				}
			}			
			
			if (resultCount == 0) {
				showError("No results found.");
			}
		}
		
	}
}

function clearFeedbackTable() {
	showError("");
	var tableObj = document.getElementById("peer_feedback_result");
	for(var rowIter = 0; rowIter < tableObj.rows.length; ) {
		var rowObj = tableObj.rows[rowIter];
		while ( rowObj.cells.length > 1 ) {
			rowObj.deleteCell(1);
		}
		rowIter++;
	}
}

function generateResultColumn(dataObj) {
	const NO_OF_FIELDS_TO_SKIP = 3, START_ROW = 2;
	
	// Set "feedback from"
	appendToRow( document.getElementById('row1'), dataObj["emailAddress"]);

	// Set other rows
	var fields = 0;
	var rowName;
	var row = START_ROW;
	for (var key in dataObj) {
		if (fields > NO_OF_FIELDS_TO_SKIP && dataObj.hasOwnProperty(key)) {
			rowName = "row" + (row++);
			appendToRow( document.getElementById(rowName), dataObj[key] );
		}
		fields++;
	}
	// var fromRow = document.getElementById('from-row');
	// var quarterRow = document.getElementById('quarter-row');
	// var goingWellRow = document.getElementById('going-well-row');
	// var weakOnRow = document.getElementById('weak-on-row');
	// var difficultyUnderstandingRow = document.getElementById('difficulty-understanding-row');
	// var constraintsRow = document.getElementById('constraints-row');
	// var learningRow =document.getElementById('learning-row');
	// var relationshipsRow = document.getElementById('relationships-row');
	// var messageRow = document.getElementById('message-row');
	
	// appendToRow(fromRow, dataObj["emailAddress"]);
	// appendToRow(quarterRow, dataObj["quarter"]);
	// appendToRow(goingWellRow, dataObj["whatDoYouThinkIsGoingWellWithThePerson’sWorkThisQuarter?CiteSomeOfHis/herAchievementsThatHaveMadeAPositiveImpressionOnYou"]);
	// appendToRow(weakOnRow, dataObj["whatAspectsDidYouNoticeHe/sheIsWeakOn?WhatDoYouThinkHe/sheShouldStopDoingAndWhatCanHe/sheDoBetter?"]);
	// appendToRow(difficultyUnderstandingRow, dataObj["whatWereSituationsWhereinYouHadDifficultyUnderstandingHis/herWorkOrWorkResultsAndHowMightHe/sheImproveUponIt?Conversely,WhatGoodPracticesDidYouNoticeInHowHe/sheMadeHis/herWorkEasyToUnderstandAndFollow?"]);
	// appendToRow(constraintsRow, dataObj["whatWereSituationsWhereinHe/sheHasConsideredTheConstraints (eGResourceConflictOrLackOfResources,TechnicalDependencies,TimeConstraints),AndHaveAdaptedHis/herWorkAndSolutionsToFitIt?WhatWereTheseConstraints?"]);
	// appendToRow(learningRow, dataObj["whenHe/sheHadLimitedKnowledgeAboutAnyArea,HowDidHe/sheMakeAnEffortToLearn?"]);
	// appendToRow(relationshipsRow, dataObj["howIsHe/sheDoingInTermsOfRelatingTo,BuildingGoodWorkingRelationshipsWith,AndBeingUsefulToTheTeam?InWhatWaysCouldHe/sheImproveInThisAspect?"]);
	// appendToRow(messageRow, dataObj["message"]);
}

function appendToRow(rowObj, textToAppend) {
	var tempCell = document.createElement('td');
	tempCell.className = "answer-column";
	
	if (textToAppend != null) {
		tempCell.innerHTML = textToAppend;
	}
	else {
		tempCell.innerHTML = "(No answer)";
	}
	rowObj.appendChild(tempCell);
}

function generateQuarterSelection() {
	var quarterSelectionArr = [];
	if (data != null) {
		data.formResponses1.forEach(function(responseObj) {
			var alreadyExists = false;
			var currentResponseQuarter = responseObj["quarter:"];
			quarterSelectionArr.forEach( function(quarter) {
				if (quarter == currentResponseQuarter) {
					alreadyExists = true;
				}
			});
			if (!alreadyExists) {
				quarterSelectionArr.push(currentResponseQuarter);
			}
		});
		var selectNode = document.getElementById("quarter");
		quarterSelectionArr.forEach(function(quarterSelection) {
			var choiceNode = document.createElement("option");
			choiceNode.innerHTML = quarterSelection;
			selectNode.appendChild(choiceNode);
		});
	}
}

initializeDataFromSheety();
initializeRevieweeCodeFromSheety();