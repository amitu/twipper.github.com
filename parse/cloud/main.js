Parse.Cloud.define("follow", function(request, response){
    if (request.user && request.params.whom) 
    {
        var User = Parse.Object.extend("User");
        var FollowerShip = Parse.Object.extend("FollowerShip");
        new Parse.Query(User).equalTo("username", request.params.whom).first({
            success: function(whom) {
                new Parse.Query(FollowerShip).equalTo(
                    "who", request.user
                ).equalTo("whom", whom).first({
                    success: function(ship) {
                        if (ship) 
                            response.success("ok");
                        else
                        {
                            ship = new FollowerShip();
                            ship.save({who: request.user, whom: whom}, {
                                success: function(o) {
                                    response.success("ok");
                                    // TODO: create tweep feeds
                                }, 
                                error: function(o, error) {
                                    response.error(error.message);
                                }
                            });
                        }
                    },
                })
            }, 
            error: function(error) {
                response.error(error.message);
            }
        });
    } 
    else
    {
        response.error("Not logged in or not indicated who to follow");
    }
});

Parse.Cloud.define("unfollow", function(request, response){
    if (request.user && request.params.whom) 
    {
        var User = Parse.Object.extend("User");
        var FollowerShip = Parse.Object.extend("FollowerShip");
        new Parse.Query(User).equalTo("username", request.params.whom).first({
            success: function(whom) {
                new Parse.Query(FollowerShip).equalTo(
                    "who", request.user
                ).equalTo("whom", whom).first({
                    success: function(ship) {
                        if (ship) {
                            ship.destroy({
                                success: function(o) {
                                    response.success("ok");
                                    // TODO: destroy TweepFeeds
                                },
                                error: function(o, error) {
                                    response.error(error.message);
                                }
                            })
                            response.success("ok");
                        }
                        else
                            response.success("ok");
                    },
                })
            }, error: function(error) {
                response.error(error.message);
            }
        });
    } 
    else
    {
        response.error("Not logged in or not indicated who to unfollow");
    }
});

Parse.Cloud.define("tweepit", function(request, response) {
    if (request.user && request.params.text)
    {
        var Tweep = Parse.Object.extend("Tweep");
        new Tweep().save({text: request.params.text, user: request.user}, {
            success: function(o) {
                response.success("ok");
            }, 
            error: function(o, error) {
                response.error(error.message);
            }
        });
    } 
    else 
    {
        response.error("Not logged in or no tweep text passed");
    }
});

Parse.Cloud.afterSave("Tweep", function(request) {
    var tweep = request.object;
    var FollowerShip = Parse.Object.extend("FollowerShip");
    var TweepFeed = Parse.Object.extend("TweepFeed");

    // TODO: use saveAll instead of individual saves
    // Parse.Object.saveAll(list, {success: ..., error: ...});

    // everybody follows themselves!
    new TweepFeed().save({
        tweep: tweep, user: tweep.get("user"),
        whose: tweep.get("user"), // used to delete on unfollow
        order_by: tweep.get("createdAt")
    });

    new Parse.Query(FollowerShip).equalTo("whom", tweep.get("user")).find({
        success: function(ships) {
            // TODO: remember we only found first 100 followers so far.
            // to get all followers, do more queries with offset set to 100 etc
            for(i = 0; i < ships.length; i++)
            {
                new TweepFeed().save({
                    tweep: tweep, user: ships[i].get("who"), 
                    whose: tweep.get("user"), // used to delete on unfollow
                    order_by: tweep.get("createdAt")
                });
            }
        }, 
        error: function (error) {
            throw "Error on find: " + error.message;
        }
    });
});