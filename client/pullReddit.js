function pullReddit() {
    console.log("pulling reddit!")
    $.get("frontpage", function(response) {
      console.log("got it back!", response)
    });
}
// Shorthand for $( document ).ready()
$(function() {
    console.log("ready!");
    pullReddit();
});
