define(
    [
        "require", "dojo/parser", "dojo/hash", "dojo/router", "app/views",
        "app/ui", "dijit/form/Form", "dojo/on"
    ], 
    function(require, parser, hash, router, views, ui) {

        router.register("/", views.home);
        router.register("/logout", views.logout);
        router.register("/me", views.me);
        router.register("/connect", views.connect);
        router.register("/:user", views.user);
    
        require(["dojo/domReady!"], function(){    
            parser.parse();
            router.startup();
            
            if (Parse.User.current())
                ui.show_normal_header();
            else
                ui.show_anon_header();

            if (hash() == "") 
                router.go("/");
        });
    }
);
