define(
    ["require", "dojo/hash", "dojo/router", "app/views"], 
    function(require, hash, router, views) {

        router.register("/", views.home);
        router.register("/:user", views.user);
    
        require(["dojo/domReady!"], function(){    
            router.startup();
            
            if (hash() == "") 
                router.go("/");
        });
    }
);
