//small changes
$(document).ready( function() {
	$('.unanswered-getter').submit( function(event){
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='tags']").val();
		getUnanswered(tags);
	});
	$('.inspiration-getter').submit( function(event){
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var answers = $(this).find("input[name='answerers']").val();
		gettopanswers(answers);
	});
});

// this function takes the question object returned by StackOverflow 
// and creates new result to be appended to DOM
var showQuestion = function(question,num) {
    var peopleid,peoplename,peoplereputation;
	
	 // clone our result template code
	 var result = $('.templates .question').clone();
	 var questionElem = result.find('.question-text a');
	 var asked = result.find('.asked-date');
	 var viewed = result.find('.viewed');
	 // Set the question properties in result
	if(num==0){
	 $(".q1").show();
     $(".a1").show();
     $(".v1").show();
	 questionElem.attr('href', question.link);
	 questionElem.text(question.title);

	 // set the date asked property in result
	 
	 var date = new Date(1000*question.creation_date);
	 asked.text(date.toString());

	 // set the #views for question property in result
	 
	 viewed.text(question.view_count);
     peopleid=question.owner.user_id;
	 peoplename=question.owner.display_name;
	 peoplereputation=question.owner.reputation
	}		 
	else if(num==1){
         $(".q1").hide();
         $(".a1").hide();
         $(".v1").hide();
		 peopleid=question.user.user_id;
		 peoplename=question.user.display_name;
		 peoplereputation=question.user.reputation;
    }
	// set some properties related to asker
	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" href=http://stackoverflow.com/users/' + peopleid + ' >' +
													peoplename +
												'</a>' +
							'</p>' +
 							'<p>Reputation: ' + peoplereputation + '</p>'
	);

	return result;
};


// this function takes the results object from StackOverflow
// and creates info about search results to be appended to DOM
var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query;
	return results;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getUnanswered = function(tags) {
	
	// the parameters we need to pass in our request to StackOverflow's API
	var request = {tagged: tags,
								site: 'stackoverflow',
								order: 'desc',
								sort: 'creation'};
	
	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/questions/unanswered",
		data: request,
		dataType: "jsonp",
		type: "GET",
		})
	.done(function(result){
		var searchResults = showSearchResults(request.tagged, result.items.length);

		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item) {
			var question = showQuestion(item,0);
			$('.results').append(question);
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};
var gettopanswers = function(answers) {
	
	// the parameters we need to pass in our request to StackOverflow's API
	var request = {tagged: answers,
				   site: 'stackoverflow',
					};

	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/tags/"+request.tagged+"/top-answerers/all_time",
	    data: request,
		dataType: "jsonp",
		type: "GET",
		})

  .done(function(result){
  	    
		var searchResults = showSearchResults(request.tagged, result.items.length);

		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item) {
		 //	alert(JSON.stringify(item, null, 4));
			var question = showQuestion(item,1);
			$('.results').append(question);
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};



