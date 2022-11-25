let easyReadingClickableEnabled = false;
function clickable(req, config, widget) {
  if (easyReadingClickableEnabled) {
    $("*").removeClass("easyReaderClickable");
  } else {
    console.log("enabled"); //need to delete

    window.scrollTo(0, 0);
    var bodyRect = document.body.getBoundingClientRect();

    var items = Array.prototype.slice
      .call(document.querySelectorAll("*"))
      .map(function (element) {
        var rect = element.getBoundingClientRect();
        return {
          element: element,
          include:
            element.tagName === "BUTTON" ||
            element.tagName === "A" ||
            element.onclick != null ||
            window.getComputedStyle(element).cursor == "pointer",
          rect: {
            left: Math.max(rect.left - bodyRect.x, 0),
            top: Math.max(rect.top - bodyRect.y, 0),
            right: Math.min(rect.right - bodyRect.x, document.body.clientWidth),
            bottom: Math.min(
              rect.bottom - bodyRect.y,
              document.body.clientHeight
            ),
          },
          text: element.textContent.trim().replace(/\s{2,}/g, " "),
        };
      })
      .filter(
        (item) =>
          item.include &&
          (item.rect.right - item.rect.left) *
            (item.rect.bottom - item.rect.top) >=
            20
      );

    // Only keep inner clickable items
    items = items.filter(
      (x) => !items.some((y) => x.element.contains(y.element) && !(x == y))
    );

    // Lets create a floating border on top of these elements that will always be visible
    items.forEach(function (item) {
      newElement = document.createElement("div");
      newElement.style.outline = "2px dashed rgba(255,0,0,.75)";
      newElement.style.position = "absolute";
      newElement.style.left = item.rect.left + "px";
      newElement.style.top = item.rect.top + "px";
      newElement.style.width = item.rect.right - item.rect.left + "px";
      newElement.style.height = item.rect.bottom - item.rect.top + "px";
      newElement.style.pointerEvents = "none";
      newElement.style.boxSizering = "border-box";
      newElement.style.zIndex = 2147483647;
      document.body.appendChild(newElement);
    });
  }

  easyReadingClickableEnabled = !easyReadingClickableEnabled;
}
