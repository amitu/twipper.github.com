define(
    [
        "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_TemplatedMixin",
        "dojo/text!./templates/UserProfile.html", "dojo/on", "dojo/_base/event"
    ],
    function(declare, _WidgetBase, _TemplatedMixin, template, on, event){
        return declare([_WidgetBase, _TemplatedMixin], {
            name: "No Name",
            avatar: "dojo/resources/blank.gif",
            following: false,
            templateString: template,
            baseClass: "UserProfile",
            postCreate: function() {
                // this.inherited();
                var widget = this;
                on(this.fbutton, "click", function(evt) {
                    event.stop(evt);
                    widget.fbutton.innerHTML = "Wait...";

                    var api = "follow";

                    if (widget.following) api = "un" + api;

                    console.log("running", api, widget.name);
                    Parse.Cloud.run(api, {whom: widget.name}, {
                        success: function(data) {
                            console.log("got data", api, data)
                            widget.set("following", !widget.following);
                        }, 
                        error: function(error) {
                            console.log(error);
                        }
                    })
                });
            },
            _setFollowingAttr: function(following) {
                this._set("following", following);
                if (following == "yourself")
                {
                    this.fbutton.style.display = "none";
                }
                else if (following)
                {
                    this.fbutton.style.display = "inline";
                    this.fbutton.innerHTML = "UnFollow";
                }
                else
                {
                    this.fbutton.style.display = "inline";
                    this.fbutton.innerHTML = "Follow";   
                }
            }
        });
    }
);