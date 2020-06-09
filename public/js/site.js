$(function () {

    var toggleCardContainer = new funkanu.ariatoggle({
        container: ".jsToggleCardContainer",
        triggerSelector: ".jsToggleCardButton",
        target: function ($elem) {
            return $elem.parents(".jsToggleCardContainer").find('.jsToggleCardTarget').first()
        },
        toggleAction: function ($target) {
            console.log($target);
            $target.slideToggle("300", function () { });

        }
    });
    var toggleCardContainerInner = new funkanu.ariatoggle({
        container: ".jsToggleCardContainer2",
        triggerSelector: ".jsToggleCardButton2",
        target: function ($elem) {
            return $elem.parents(".jsToggleCardContainer2").find('.jsToggleCardTarget2')
        },
        toggleAction: function ($target) {
            $target.slideToggle("300", function () { });
        }
    });
});

