define([], function(){
    return function(evt) {
        document.title = evt.params.user + " on Twipper";
    };
});