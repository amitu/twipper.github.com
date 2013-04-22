define(["app/ui"], function(ui){
    return {
        home: function(evt) {
            ui.show_main_body();
            ui.set_title("Twipper");
            ui.set_main_content("<h1>home</h1>");
        },
        me: function(evt) {
            ui.show_main_body();
            ui.set_title("Me on Twipper");
            ui.set_main_content("<h1>ME</h1>");
        },
        connect: function(evt) {
            ui.show_main_body();
            ui.set_title("@Connect on Twipper");
            ui.set_main_content("<h1>@connect</h1>");
        },
        user: function(evt) {
            if (
                [
                    "/logout", "/me", "/", "/connect"
                ].indexOf(evt.newPath) != -1
            )  return;
            ui.show_main_body();
            ui.set_title(evt.params.user + " on Twipper");
            ui.set_main_content("<h1>" + evt.params.user + "</h1>");
        },
        logout: function(evt) {
            Parse.User.logOut();
            ui.show_index();
        }
    }
});