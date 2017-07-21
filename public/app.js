
// Grab the articles as a json
$.getJSON("/homes", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page
        $("#homes").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
});


// Whenever someone clicks a p tag
$(document).on("click", "p", function() {

    var data = $(this).data("id");

    $("#notes").append("<h2>" + this.title + "</h2>");

    $("#notes").append("<input id='titleInput' name='titleInput'>");

    $("#notes").append("<textarea id='bodyInput' name='bodyInput'></textarea>");

    $("#notes").append("<button data-id='" + data + "' id='savenote'>Save your Note! </button>");

});

// When you click the savenote button
$(document).on("click", "#savenote", function() {

    var dataID = $(this).data("id");


    $.ajax({
        method: "POST",
        url: "/homes/" + dataID,
        data: {
            // Value taken from title input
            title: $("#titleInput").val(),
            // Value taken from note textarea
            body: $("#bodyInput").val()
        }
    })
    // With that done
        .done(function(data) {
            // Log the response
            console.log("data", data);
            // Empty the notes section
            $("#notes").empty();
        });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");

});

