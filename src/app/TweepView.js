define(
    [
        "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_TemplatedMixin",
        "dojo/text!./templates/TweepView.html"
    ],
    function(declare, _WidgetBase, _TemplatedMixin, template){
        return declare([_WidgetBase, _TemplatedMixin], {
            name: "No Name",
            avatar: "http://www.gravatar.com/avatar/00",
            tweep: "Nothing yet",
            templateString: template,
            created_on: "notyet",
            baseClass: "TweepView"
        });
    }
);