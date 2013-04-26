function log() 
{
    var msg = "";
 
    for (var i = 0; i < arguments.length; i++) 
    {
       msg += arguments[i] + " ";
    }
  
  console.log(msg);
}

function queue_tweets(who, whom, response)
{
    var Tweep = Parse.Object.extend("Tweep");
    var TweepFeed = Parse.Object.extend("TweepFeed");
    new Parse.Query(Tweep).equalTo("user", whom).find({
        success: function(tweeps) {
            var tfs = [];
            for (i = 0; i < tweeps.length; i++)
            {
                var tf = new TweepFeed();
                tf.set("tweep", tweeps[i]);
                tf.set("user", who);
                tf.set("whose", whom);
                tf.set("order_by", tweeps[i].get("createdAt"));
                tfs.push(tf);
            }
            Parse.Object.saveAll(tfs, {
                success: function(){
                    log("saved", tweeps.length, "items");
                    response.success("ok");
                }, 
                error: function(error) {
                    response.error(error);
                }
            });
        }, 
        error: function(error) {
            response.error(error.message);
        }
    })
}

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
                                    queue_tweets(
                                        request.user, whom,
                                        response
                                    )
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

function destroy_tweets(who, whom, response)
{
    log("destroy_tweets", who.get("username"), whom);
    var TweepFeed = Parse.Object.extend("TweepFeed");
    new Parse.Query(TweepFeed).equalTo("user", who).equalTo(
        "whose", whom
    ).find().then(
        function(feed) {
            log("deleted item count", feed.length);
            for (i = 0; i < feed.length; i++ ) feed[i].destroy();
            response.success("ok");
        }, 
        function(error) {
            log("error on destroy_tweets", error.message);
            response.error(error.message);
        }
    );
}

Parse.Cloud.define("unfollow", function(request, response){
    log("unfollow request");
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
                            log("found ship, deleting it");
                            ship.destroy().then(
                                function(o) {
                                    destroy_tweets(
                                        request.user, whom, 
                                        response
                                    );
                                    log("something deleted");
                                }, function(o, error) {
                                    response.error(error.message);
                                }
                            );
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

    var tfs = [];

    // everybody follows themselves!
    var tf = new TweepFeed();
    tf.set("tweep", tweep);
    tf.set("user", tweep.get("user"));
    tf.set("whose", tweep.get("user"));
    tf.set("order_by", tweep.get("createdAt"));
    tfs.push(tf);

    new Parse.Query(FollowerShip).equalTo("whom", tweep.get("user")).find({
        success: function(ships) {
            // TODO: remember we only found first 100 followers so far.
            // to get all followers, do more queries with offset set to 100 etc
            for(i = 0; i < ships.length; i++)
            {
                tf = new TweepFeed();
                tf.set("tweep", tweep);
                tf.set("user", ships[i].get("who"));
                tf.set("whose", tweep.get("user"));
                tf.set("order_by", tweep.get("createdAt"));
                tfs.push(tf);
            }
            Parse.Object.saveAll(tfs, {
                error: function(error) {
                    throw "Error on saveAll: " + error.message;
                }
            });
        }, 
        error: function (error) {
            throw "Error on find: " + error.message;
        }
    });
});