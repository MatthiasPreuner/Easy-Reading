$.getScript( "https://www.googletagmanager.com/gtag/js?id=UA-124904516-2", function( data, textStatus, jqxhr ) {
    if(jqxhr.status === 200){
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'UA-124904516-2');


        console.log("texthelp-analytics loaded");

    }
});

