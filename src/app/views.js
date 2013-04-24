define(
    [
        "app/ui", "dojo/router", "app/TweepView", "dojo/query", "dojo/dom",
        "dojox/encoding/digests/MD5", "dojox/encoding/digests/_base"
    ], 
    function(ui, router, TweepView, query, dom, md5, digests){
        var get_gravatar = function(email) {
            return (
                "http://www.gravatar.com/avatar/" + 
                md5(email, digests.outputTypes.Hex) + "?d=monsterid"
            );
        };

        return {
            home: function(evt) {
                if (!Parse.User.current()) return router.go("/logout");
                ui.show_main_body();
                ui.set_title("Twipper");
                ui.set_main_content("<h1>home</h1>");
                var TweepFeed = Parse.Object.extend("TweepFeed");
                new Parse.Query(TweepFeed).equalTo(
                    "user", Parse.User.current()
                ).include("tweep").include("whose").find({
                    success: function(feed) {
                        var main = ui.get_main();
                        for (i = 0; i < feed.length; i++ )
                        {
                            var tf = feed[i];
                            new TweepView({
                                "tweep": tf.get('tweep').get("text"),
                                "name": tf.get("whose").get("username"),
                                "avatar": get_gravatar(
                                    tf.get("whose").get("email")
                                )
                            }).placeAt(main).startup();
                        }
                    },
                    error: function(error) {
                        console.log("error:", error)
                    }
                });
            },
            connect: function(evt) {
                if (!Parse.User.current()) return router.go("/logout");            
                ui.show_main_body();
                ui.set_title("@Connect on Twipper");
                ui.set_main_content("<h1>@connect</h1>");
            },
            tweep: function(evt) {
                if (!Parse.User.current()) return router.go("/logout");
                ui.show_tweep_dialog();
            },
            user: function(evt) {
                if (
                    [
                        "/logout", "/me", "/", "/connect", "/tweep"
                    ].indexOf(evt.newPath) != -1
                )  return;
                console.log("user");
                ui.show_main_body();
                ui.set_title(evt.params.user + " on Twipper");
                var Tweep = Parse.Object.extend("Tweep");
                new Parse.Query(Tweep).matchesQuery(
                    "user", new Parse.Query(Parse.User).equalTo(
                        "username", evt.params.user
                    )
                ).include("user").find({
                    success: function(tweeps) {
                        var main = ui.get_main();
                        console.log("got tweeps", tweeps);
                        ui.set_main_content("<h1>@" + evt.params.user + "</h1>");
                        for (i = 0; i < tweeps.length; i++)
                        {
                            var tweep = tweeps[i];
                            new TweepView({
                                "tweep": tweep.get("text"),
                                "name": evt.params.user,
                                "avatar": get_gravatar(
                                    tweep.get("user").get("email")
                                )
                            }).placeAt(main).startup();
                        }
                    },
                    error: function(error) {
                        console.log("error:", error)
                    }
                });

            },
            logout: function(evt) {
                Parse.User.logOut();
                ui.show_index();
            }
        }
    }
);