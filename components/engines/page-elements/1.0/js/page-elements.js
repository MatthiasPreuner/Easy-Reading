function pageElements(req, config, widget) {

  // reset
  $('#er-structure').remove();

  // find all headers
  var headers = Array.prototype.slice
  .call(document.querySelectorAll("h1,h2,h3,h4,h5,h6"))
  .map(function (element) {

    lvl = Number(element.tagName.substring(1))

    return `<li><span class="page-elements-header-div header-${lvl}">${element.tagName}</span> ${element.innerHTML}</li>`
  }).join('')

  // find all links
  var links = Array.prototype.slice
  .call(document.querySelectorAll("a"))
  .map(function (element) {
    // https://stackoverflow.com/questions/2161634/how-to-check-if-element-has-any-children-in-javascript
    if(element.innerHTML.trim() == "")
      return ""
    if(element.hasChildNodes()){
      // if(element.querySelectorAll("img")){

      // }
      //if (element.firstElementChild())

      // if image, remove or make smaller TODO
      if(element.innerHTML.tagName == "img")
      return `<li><a href=${element.href}>${element.innerHTML.alt}</a></li>`
    }

    return `<li><a href=${element.href}>${element.innerHTML}</a></li>`
  }).join('')

  // find all clickable??


  var layoutHTML = 
  `<div class="tabbed">
    <input checked="checked" id="tab1" type="radio" name="tabs" />
    <input id="tab2" type="radio" name="tabs" />
    <input id="tab3" type="radio" name="tabs" />

    <nav>
        <label for="tab1">Headers</label>
        <label for="tab2">Links</label>
        <label for="tab3">Clickable Objects</label>
        <label for="close" data-micromodal-close="er-structure">x</label>
    </nav>
    
    <figure>
        <div class="tab1">
          <ul class="page-elements-list">${headers}</ul>
        </div>
        <div class="tab2">
          <ul class="page-elements-list">${links}</ul>
        </div>
        <div class="tab3">
          <ul class="page-elements-list">${links}</ul>
        </div>
    </figure>
  </div>`

var test = 

`<div class="micromodal-slide modal is-open" id="modal-2" aria-hidden="false">
  <div class="modal__overlay" tabindex="-1" data-custom-close="">
    <div class="modal__container w-40-ns w-90" role="dialog" aria-modal="true" aria-labelledby="modal-2-title">
    
    </div>
  </div>
</div>
`


  var formHTML = `<div class="modal micromodal-slide page-elements-modal" id="er-structure" aria-hidden="true">
    <div class="modal__overlay" tabindex="-1" data-micromodal-close>
      <div class="modal__container" role="dialog" aria-modal="true">
        <div id="page-elements-content">
          ${layoutHTML}
        </div>
      </div>
      </div>
  </div>`        
  
  $("body").append(formHTML);
  MicroModal.show('er-structure'); 
}