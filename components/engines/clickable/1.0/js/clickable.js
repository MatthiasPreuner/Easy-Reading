let easyReadingClickableEnabled = false;
function clickable(req, config, widget) {
  if (easyReadingClickableEnabled) {
    $("*").remove(".clickable-wrapers");
  } else {
    window.scrollTo(0, 0);
    var bodyRect = document.body.getBoundingClientRect();

    /**
     * Check if the current html element is currently visible per the browser computed styles
     * @param element {Element}
     * @return boolean
     */
    function isVisible(item) {
      var element = item.element;

      try {
        const computedStyles = getComputedStyle(element);

        if (
          computedStyles["display"] === "none" ||
          computedStyles["display"] === "invisible" ||
          computedStyles["visibility"] === "hidden"
        )
          return false;
        if (computedStyles["height"] == 0 && computedStyles["width"] == 0)
          return false;
        if (computedStyles["opacity"] == 0) return false;

        // check if bounding rectangle has any size
        const rect = element.getBoundingClientRect();
        if (rect.width == 0 || rect.height == 0) return false;

        return true;
      } catch (error) {
        console.log(error, element);
        throw error;
      }
    }

    function isSidebar(item) {
      const element = item.element;
      return (
        $(element).parents(".easy-reading-interface").length ||
        $(element).hasClass("easy-reading-interface")
      );
    }
    //https://gist.github.com/iiLaurens/81b1b47f6259485c93ce6f0cdd17490a
    var items = Array.prototype.slice
      .call(document.querySelectorAll("body *"))
      .map(function (element) {
        var rect = element.getBoundingClientRect();
        return {
          element: element,
          include:
            element.tagName === "BUTTON" ||
            element.tagName === "A" ||
            element.onclick != null ||
            getComputedStyle(element).cursor == "pointer",
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
      )
      .filter((element) => isVisible(element) && !isSidebar(element));

    // Only keep inner clickable items
    items = items.filter(
      (x) => !items.some((y) => x.element.contains(y.element) && !(x == y))
    );

    // Lets create a floating border on top of these elements that will always be visible
    items.forEach(function (item) {
      newElement = document.createElement("div");
      newElement.style.left = item.rect.left + "px";
      newElement.style.top = item.rect.top + "px";
      newElement.style.width = item.rect.right - item.rect.left + "px";
      newElement.style.height = item.rect.bottom - item.rect.top + "px";
      newElement.className = "clickable-wrapers";
      document.body.appendChild(newElement);
    });
  }

  easyReadingClickableEnabled = !easyReadingClickableEnabled;
}
