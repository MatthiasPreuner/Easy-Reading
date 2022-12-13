function pageElements(req, config, widget) {

  // reset
  let easyReadingPageElementsEnabled = false;
  $('#er-structure').remove();

 // var container = '<div id="container"></div>'
 // $("body").append(container);

  if (easyReadingPageElementsEnabled) {
    
    //MicroModal.close('er-structure');
    //$("body").find("#er-structure").remove();
  
  } else {
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


    //https://www.w3schools.com/howto/howto_js_tabs.asp
    

    var layoutHTML = 
    `<div class="tabbed">
      <input checked="checked" id="tab1" type="radio" name="tabs" />
      <input id="tab2" type="radio" name="tabs" />
      <input id="tab3" type="radio" name="tabs" />

      <nav>
          <label for="tab1">Headers</label>
          <label for="tab2">Links</label>
          <label for="tab3">Clickable Objects</label>
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


    var formHTML = `<div class="modal micromodal-slide page-elements-modal" id="er-structure" aria-hidden="true">
      <div class="modal__overlay" tabindex="-1" data-micromodal-close>
        <div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="modal-1-title" >
          <header>
            <h2 id="modal-1-title">
              Page Elements
            </h2>
            <button aria-label="Close modal" data-micromodal-close></button>
          </header>
          <div id="page-elements-content">
             ${layoutHTML}
          </div>
        </div>
        </div>
    </div>`
    
    $("body").append(formHTML);
   
    MicroModal.show('er-structure'); 

  }
  easyReadingPageElementsEnabled = !easyReadingPageElementsEnabled;
}


// function openCity(evt, cityName) {
//   console.log("opencity called")
//   // Declare all variables
//   var i, tabcontent, tablinks;

//   // Get all elements with class="tabcontent" and hide them
//   tabcontent = document.getElementsByClassName("tabcontent");
//   for (i = 0; i < tabcontent.length; i++) {
//     tabcontent[i].style.display = "none";
//   }

//   // Get all elements with class="tablinks" and remove the class "active"
//   tablinks = document.getElementsByClassName("tablinks");
//   for (i = 0; i < tablinks.length; i++) {
//     tablinks[i].className = tablinks[i].className.replace(" active", "");
//   }

//   // Show the current tab, and add an "active" class to the button that opened the tab
//   document.getElementById(cityName).style.display = "block";
//   evt.currentTarget.className += " active";
// } 