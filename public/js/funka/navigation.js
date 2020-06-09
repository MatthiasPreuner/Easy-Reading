
$(document).ready(function () {
    var mobileToggle = new funkanu.ariatoggle({
        container: "#mobileNavigation",
        triggerSelector: "button.sub-nav",
        target: function ($elem) {
            return $elem.next('ul');
            //return $elem.parents('li').next('ul');
        },

        clickEvent: function ($target) {
            $target.find("span").first().toggleClass('minus').toggleClass('plus');
        },
        toggleAction: function ($target) {
            $target.slideToggle();
        }
    });
});


//$(document).ready(function () {

//    var mobileToggle = new funkanu.ariatoggle({
       
//        container: "#mobileNavigation",
//        triggerSelector: ".mobbn",
//        target: function ($elem) {
//            return $('#' + $elem.attr('aria-controls'));
//        },
//        toggleAction: function ($target) {
//            $target.slideToggle("300");
//            $('.mobileMenuArea ul').not($target).hide();

//            if ($target.is(':visible')) {
//                $target.find('input').first().focus();
//            }
//            //Override ariatoggle package, special case when toggling functionlinks
//            $target.siblings("div").each(function () {
//                if (!$(this).is(":visible")) {
//                    $(this).attr("aria-hidden", "true");
//                }
//            });
//        },

//        clickEvent: function ($currentTarget) {
//            $('.function-links-toogle-button').not($currentTarget).attr('aria-expanded', 'false');
//            var $closestLi = $currentTarget.closest('li');
//            $('.mobileMenuArea').find('li').not($closestLi).removeClass('active');
//            $closestLi.toggleClass('active');

//            if ($currentTarget.attr('aria-expanded') === "false") {
//                $currentTarget.focus();
//            }
//        },
//    });


//});
