define(["dojo/query", "dojo/NodeList-manipulate"], function(query){
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
            console.log("show_index");
            query("#supuser").val("");
            query("#supemail").val("");
            query("#suppass").val("");
            query("#suppass2").val("");
            query("#sinuser").val("");
            query("#sinpass").val("");
        }
    };
    return ui;
});