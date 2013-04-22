define(
    ["require", "dojo/hash", "dojo/router", "app/home_page", "app/user_page"], 
    function(require, hash, router, home_page, user_page) {
        require(["dojo/domReady!"], function(){
            router.register("/", home_page);
            router.register("/:user", user_page);
            
            router.startup();

            if (hash() == "") 
                router.go("/");
        });
    }
);
