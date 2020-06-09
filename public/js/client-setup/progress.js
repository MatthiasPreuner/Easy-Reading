$(document).ready(function () {

    $("#wizard-form").append('<input id="progressBar" type="hidden" name="progressBar">');

    $("#prevButton").click(function () {

       // let step = $("#wizard-form .is-current").data("step");
        gotoStep("previous");
    });

    $("#nextButton").click(function () {

       // let step = $("#wizard-form .is-current").data("step");
        gotoStep("next");
    });




    $(".progress-container ol>li").each(function () {

        let label = $(this).data("label");
        let step = $(this).data("step");
        $(this).attr("aria-role", "button").attr("aria-label",label);
        if($(this).hasClass("is-complete")){
            $(this).click(function () {
                gotoStep(step);
            }).keydown(function (e) {
                if (e.key === "Enter" || e.key === " ") {
                    gotoStep(step);
                }
            }).attr("tabindex","0")

        }else{

            $(this).attr("aria-disabled","true");
        }
    });


});

function gotoStep(step) {
    console.log("goto: "+step);
    $("#progressBar").val(step);
    document.getElementById("wizard-form").submit();

}