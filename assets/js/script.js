/*
Developer: Justas Lauzinskas
Title: GifTastic
Description: Homework 6: JavaScript + jQuery + API
Date: 2019-01-02
*/
var healthyChoices = ["running", "fitness", "yoga", "weightlifting", "karate", "boxing", "football", "basketball", "Soccer"];
var gifApiKey = "4Z0UHPk0D2V4xiPLjrtUcMs6MoFpAb0J";
var gifLimit = 10;
// Page is loaded start function
$(document).ready(function() {
	// Function to convert first letter to uppercase
	function fixFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
	// Function to append button on screen
	function appendButton(buttonName) {
		var newButton = $("<button>");
		newButton.appendTo(".buttons");
		newButton.attr("value", buttonName);
		newButton.attr("class", "choices");
		newButton.text(fixFirstLetter(buttonName));
	}
	// Function to get gifs object from GIPHY by selected group
	function selectGif(groupName, offset) {
		var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + groupName + "&api_key=" + gifApiKey + "&limit=" + gifLimit + "&offset=" + offset;
		$.ajax({
			url: queryURL,
			method: "GET"
		}).then(function(response) {
			displayGif(response, groupName);
		});
	}
	// Function to append gifs after group is selected
	function displayGif(response, groupName) {
		for (var i = 0; i < gifLimit; i++) {
			var div = $("<div class='category-gif'>");
			var img = $("<img>");
			var button = $("<button>");
			div.appendTo(".results");
			img.appendTo(div);
			img.attr("class", "gif");
			img.attr("src", response.data[i].images.fixed_width_still.url);
			img.attr("data-animate", response.data[i].images.fixed_width.url);
			img.attr("data-still", response.data[i].images.fixed_width_still.url);
			img.attr("data-state", "still");
			$("<h4>").text("Rating: " + response.data[i].rating.toUpperCase()).appendTo(div);
			button.appendTo(div);
			button.attr("class", "add-fav");
			button.text("Add To Favorites");
		}
		var button = $("<button>");
		button.appendTo(".results");
		button.attr("class", "show-more");
		button.attr("value", groupName);
		button.attr("data-offset", response.pagination.offset);
		button.text("Show More");
	}
	// For loop to append categories on screen from Array
	for (i = 0; i < healthyChoices.length; i++) {
		var buttonName = healthyChoices[i];
		appendButton(buttonName);
	}
	// Event Listener to add new category. When submit button is clicked
	$("#add-button").click(function() {
		var buttonName = $("#add-input").val();
		// create function to check if unique 
		appendButton(buttonName);
		$("#add-input").val("");
	});
	// Event Listener when one of the buttons is clicked
	$(".buttons").on('click', '.choices', function() {
		var selectedGroup = $(this).val();
		$(".results").empty();
		$(".results").attr("id", selectedGroup);
		$("<h3>").text("Click on image to active it!").appendTo(".results");
		selectGif(selectedGroup, 0);
	});
	// Event Listener when Show More is clicked
	$(".results").on('click', '.show-more', function() {
		$(this).remove();
		var selectedGroup = $(this).val();
		var offset = parseInt($(this).attr("data-offset")) + gifLimit;
		selectGif(selectedGroup, offset);
	});
	// Event Listener when "Add To Favorites" is clicked
	$(".results").on('click', '.add-fav', function() {
		var parent = $(this).parent();
		parent.clone().appendTo(".favorites");
		$(".favorites .category-gif .add-fav").remove();
	});
	// Event Listiner when GIF is clicked change it to animate/still
	$("body").on('click', '.gif', function() {
		var gifState = $(this).attr("data-state");
		var gifStill = $(this).attr("data-still");
		var gifAnimate = $(this).attr("data-animate");
		if (gifState === "still") {
			$(this).attr("data-state", "animate");
			$(this).attr("src", gifAnimate);
		} else {
			$(this).attr("data-state", "still");
			$(this).attr("src", gifStill);
		}
	});
});