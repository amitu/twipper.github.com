define(["app/ui"], function(ui){
    return {
        home: function(evt) {
            ui.show_main_body();
            ui.set_title("Twipper");
            ui.set_main_content("<h1>home</h1>");
            var TweepFeed = Parse.Object.extend("TweepFeed");
            new Parse.Query(TweepFeed).equalTo(
                "user", Parse.User.current()
            ).descending("order_by").include("tweep").find({
                success: function(feed) {
                    for (i = 0; i < feed.length; i++ )
                    {
                        console.log(feed[i], feed[i].get("tweep").get("text"));
                    }
                },
                error: function(error) {
                    console.log("error:", error)
                }
            });
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
        tweep: function(evt) {
            ui.show_tweep_dialog();
        },
        user: function(evt) {
            if (
                [
                    "/logout", "/me", "/", "/connect", "/tweep"
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