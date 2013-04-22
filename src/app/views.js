define(["app/ui"], function(ui){
    return {
        home: function(evt) {
            ui.set_title("Twipper");
        },
        user: function(evt) {
            ui.set_title(evt.params.user + " on Twipper");
        }
    }
});