function pullReddit() {
    console.log("pulling reddit!")
    $.ajax({
        url: "https://www.reddit.com",
        type: "GET",
        crossDomain: true,
        success: function(response) {
            console.log("response:", response)
            // var resp = JSON.parse(response)
        },
        error: function(xhr, status) {
            console.log("error", xhr, status);
        }
    });
}
// Shorthand for $( document ).ready()
$(function() {
    console.log("ready!");
    pullReddit();
});
