define(
    [
        "dojo/query", "dojo/on", "dojo/_base/event", "dojo/router", 
        "dijit/registry", "dojo/NodeList-manipulate"
    ], 
    function(query, on, event, router, registry){
        var ui = {
            set_title: function(title) {
                document.title = title;
            },
            show_anon_header: function() {
                console.log("show_anon_header");
                query(".nonanon").style("display", "none");
            },
            show_normal_header: function() {
                console.log("show_normal_header");
                query(".nonanon").style("display", "block");
            },
            show_main_body: function() {
                ui.show_normal_header();
                query("#sidebar").style("display", "block");
                query("#main").style("display", "block");
                query("#index").style("display", "none");            
            },
            get_main: function() {
                return query("#main");
            },
            set_main_content: function(html) {
                query("#main").style("display", "block").empty().innerHTML(html);
            },
            show_index: function() {
                ui.set_title("Twipper");
                ui.show_anon_header();
                query("#sidebar").style("display", "none");
                query("#main").style("display", "none");
                query("#index").style("display", "block");
                query("#supuser").val("");
                query("#supemail").val("");
                query("#suppass").val("");
                query("#suppass2").val("");
                query("#sinuser").val("");
                query("#sinpass").val("");
            }, 
            show_tweep_dialog: function() {
                query("#tweep_text").val("");
                var clicker = on.once(
                    query("#tweep_button"), "click", function(evt) {
                        console.log("tweep_button clicked");
                        event.stop(evt);
                        Parse.Cloud.run(
                            "tweepit", {"text": query("#tweep_text").val()},
                            {
                                success: function(data) {
                                    console.log("cloud returned", data);
                                    registry.byId("tweep_dialog").hide();   
                                },
                                error: function(error) {
                                    console.log("error", error);
                                }
                            }
                        );
                    }
                );
                registry.byId("tweep_dialog").on("hide", function(evt) {
                    clicker.remove();
                    router.go("/");
                });
                registry.byId("tweep_dialog").show();
            },
            init: function() {
                query("#signin_form").on("submit", function(evt){
                    event.stop(evt);
                    query("#sinerror").text("");
                    var show_error = function(msg) {
                        query("#sinerror").text(msg);
                    }
                    var username = query("#sinuser").val();
                    var password = query("#sinpass").val();
                    if (username == "") {
                        return show_error("Username is required");
                    }
                    if (password == "") {
                        return show_error("Password is required");
                    }

                    show_error("loading...");
                    Parse.User.logIn(username, password, {
                        success: function(user) {
                            router.go("#/" + username);
                        },
                        error: function(user, error) {
                            show_error(error.message);
                        }
                    });
                });

                query("#signup_form").on("submit", function(evt){
                    event.stop(evt);
                    query("#superror").text("");
                    var show_error = function(msg) {
                        query("#superror").text(msg);
                    }
                    var username = query("#supuser").val();
                    var email = query("#supemail").val();
                    var password = query("#suppass").val();
                    var password2 = query("#suppass2").val();
                    if (username == "") {
                        return show_error("Username is required");
                    }
                    if (email == "") {
                        return show_error("Email is required");
                    }
                    if (password2 == "") {
                        return show_error("Password is required");
                    }
                    if (password2 != password) {
                        return show_error("Passwords do not match.");
                    }
                    var user = new Parse.User();
                    user.set("username", username);
                    user.set("password", password);
                    user.set("email", email);  
                    
                    show_error("loading...");
                    user.signUp(null, {
                        success: function(user) {
                            router.go("#/" + username);
                        },
                        error: function(user, error) {
                            show_error(error.message);
                        }
                    });

                    return false;
                });
            }
        };
        return ui;
    }
);