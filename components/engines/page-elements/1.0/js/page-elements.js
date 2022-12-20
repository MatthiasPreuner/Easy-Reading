// noinspection JSUnresolvedFunction,JSUnresolvedVariable

function pageElements(req, config, widget) {

    // reset
    $('#page-elements').remove();

    /**
     * Check if the current html element is currently visible per the browser computed styles
     * @param element {Element}
     * @return boolean
     */
    function isVisible(element) {
        const computedStyles = window.getComputedStyle(element);

        if (computedStyles['display'] === 'none' || computedStyles['display'] === 'invisible') return false;
        if (computedStyles['height'] == 0 && computedStyles["width"] == 0) return false;
        if (computedStyles['opacity'] == 0) return false;

        // check if bounding rectangle has any size
        const rect = element.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) return false;

        return true;
    }

    function isEmtpy(element) {
        return element.innerHTML.trim() === "";
    }

    function isSidebar(element) {
        return $(this).parents('.easy-reading-interface').length || $(element).hasClass('easy-reading-interface');
    }

    function isLandmark(element) {
        return element.href.includes(window.location.href.replace(window.location.hash,"").replace('#','') + '#');
    }

    const headers = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6").values()]
        .filter(element => isVisible(element) && !isEmtpy(element) && !isSidebar(element))
        .map(function (element) {
            const lvl = Number(element.tagName.substring(1))
            return `<li><span class="page-elements-header-div header-${lvl}">${element.tagName}</span> ${element.innerHTML}</li>`
        }).join('');

    // find all landmarks
    const landmarks = [...document.querySelectorAll("a").values()]
        .filter(element => isVisible(element) && !isEmtpy(element) && !isSidebar(element))
        .filter(element => isLandmark(element))
        .map(function (element) {
            // https://stackoverflow.com/questions/2161634/how-to-check-if-element-has-any-children-in-javascript
                if(element.querySelectorAll("img").length > 0){
                    var images = [...element.querySelectorAll("img").values()]
                    return `
                    <li>
                        <a href=${element.href}>
                            ${images[0].outerHTML} ${images[0].alt}
                        </a>
                    </li>`
                }
                // default
                return `
                    <li>
                        <a href=${element.href}>
                            ${element.innerHTML}
                        </a>
                    </li>`
        }).join('');

    
        const links = [...document.querySelectorAll("a").values()]
        .filter(element => isVisible(element) && !isEmtpy(element) && !isSidebar(element))
        .filter(element => !isLandmark(element))
        .map(function (element) {
            // https://stackoverflow.com/questions/2161634/how-to-check-if-element-has-any-children-in-javascript
                
                var newTab = ""
                if(element.target==="_blank"){
                    newTab = " - Opens in a new Tab"
                }

                if(element.querySelectorAll("picture").length > 0){
                    var images = [...element.querySelectorAll("picture").values()]
                    // console.log(   `<a href=${element.href}>
                    //     ${images[0].outerHTML} ${images[0].alt} - ${element.href}
                    // </a>`)
                    return `
                    <li>
                        <a href='${element.href}' target='${element.target}'>
                            ${images[0].outerHTML}${newTab}
                        </a>
                    </li>`
                }

                if(element.querySelectorAll("img").length > 0){
                    var images = [...element.querySelectorAll("img").values()]
                    return `
                    <li>
                        <a href=${element.href} target='${element.target}'>
                            ${images[0].outerHTML} ${images[0].alt}${newTab}
                        </a>
                    </li>`
                }
                // currently no better solution
                return `<li>
                            <a href='${element.href}' target='${element.target}'>
                                ${element.innerHTML}${newTab}
                            </a>
                        </li>`
        }).join('');

    // language=HTML
    const layoutHTML =
        `
            <div class="tabbed">
                <input checked="checked" id="tab1" type="radio" name="tabs"/>
                <input id="tab2" type="radio" name="tabs"/>
                <input id="tab3" type="radio" name="tabs"/>

                <nav>
                    <label for="tab1">Headers</label>
                    <label for="tab2">Landmarks</label>
                    <label for="tab3">Links</label>
                    <label for="close" data-micromodal-close="page-elements"
                           onclick="setTimeout(() => $('#page-elements').remove(), 300)">x</label>
                </nav>

                <figure>
                    <div class="tab1">
                        <ul class="page-elements-list">${headers}</ul>
                    </div>
                    <div class="tab2">
                        <ul class="page-elements-list">${landmarks}</ul>
                    </div>
                    <div class="tab3">
                        <ul class="page-elements-list">${links}</ul>
                    </div>
                </figure>
            </div>`

    // language=HTML
    const formHTML = `
        <div class="modal micromodal-slide page-elements-modal" id="page-elements" aria-hidden="true">
            <div class="modal__overlay" tabindex="-1">
                <div class="modal__container" role="dialog" aria-modal="true" style="overflow-y: auto">
                    <style>
                        /* http://meyerweb.com/eric/tools/css/reset/ 
                           v2.0 | 20110126
                           License: none (public domain)
                        */

                        html, body, div, span, applet, object, iframe,
                        h1, h2, h3, h4, h5, h6, p, blockquote, pre,
                        a, abbr, acronym, address, big, cite, code,
                        del, dfn, em, img, ins, kbd, q, s, samp,
                        small, strike, strong, sub, sup, tt, var,
                        b, u, i, center,
                        dl, dt, dd, ol, ul, li,
                        fieldset, form, label, legend,
                        table, caption, tbody, tfoot, thead, tr, th, td,
                        article, aside, canvas, details, embed,
                        figure, figcaption, footer, header, hgroup,
                        menu, nav, output, ruby, section, summary,
                        time, mark, audio, video {
                            margin: 0;
                            padding: 0;
                            border: 0;
                            font-size: 100%;
                            font: inherit;
                            vertical-align: baseline;
                        }

                        /* HTML5 display-role reset for older browsers */
                        article, aside, details, figcaption, figure,
                        footer, header, hgroup, menu, nav, section {
                            display: block;
                        }

                        body {
                            line-height: 1;
                        }

                        ol, ul {
                            list-style: none;
                        }

                        blockquote, q {
                            quotes: none;
                        }

                        blockquote:before, blockquote:after,
                        q:before, q:after {
                            content: '';
                            content: none;
                        }

                        table {
                            border-collapse: collapse;
                            border-spacing: 0;
                        }
                    </style>
                    <div id="page-elements-content">
                        ${layoutHTML}
                    </div>
                </div>
            </div>
        </div>`;

    $("body").append(formHTML);
    MicroModal.show('page-elements');
}