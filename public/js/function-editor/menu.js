let erMenu = {
    init: function (engineFunctions) {
        this.engineFunctions = engineFunctions;

        this.defaultMenuEntries =
            [{
                name: "File",
                entries: [
                    {
                        name: "New",
                        id: "new",
                    },
                    {
                        name: "Save",
                        id: "save",
                    },
                    {
                        name: "Exit",
                        id: "exit",
                    }

                ]
            },
                {
                    name: "Edit",
                    entries: [
                        {
                            name: "Undo",
                            id: "undo",
                        },
                        {
                            name: "Redo",
                            id: "redo",
                        }

                    ]
                }];

        this.createMenuEntries();


        this.appsMenu = document.querySelector('#appmenu');
        this.appsMenuItems = document.querySelectorAll('#appmenu > li');
        this.subMenuItems = document.querySelectorAll('#appmenu > li li');
        this.keys = {
            tab: 9,
            enter: 13,
            esc: 27,
            space: 32,
            left: 37,
            up: 38,
            right: 39,
            down: 40
        };


        this.currentIndex = null;
        this.subIndex = null;


        this.initAppMenuItems();
        this.initSubmenuItems();
        this.initHackListeners();

    },

    initAppMenuItems: function () {

        this.appsMenuItems.forEach(function (el, i) {
            if (i === 0) {
                el.setAttribute('tabindex', '0');
                el.addEventListener("focus", function () {
                    erMenu.currentIndex = 0;
                });
            } else {
                el.setAttribute('tabindex', '-1');
            }
            el.addEventListener("focus", function () {
                erMenu.subIndex = 0;
                erMenu.appsMenuItems.forEach(function (element) {
                    element.setAttribute('aria-expanded', "false");
                });
            });
            el.addEventListener("click", function (event) {
                if (this.getAttribute('aria-expanded') === 'false' || this.getAttribute('aria-expanded') === null) {
                    this.setAttribute('aria-expanded', "true");
                } else {
                    this.setAttribute('aria-expanded', "false");
                }
                event.preventDefault();
                return false;
            });
            el.addEventListener("keydown", function (event) {
                switch (event.keyCode) {
                    case erMenu.keys.right:
                        erMenu.gotoIndex(erMenu.currentIndex + 1);
                        break;
                    case erMenu.keys.left:
                        erMenu.gotoIndex(erMenu.currentIndex - 1);
                        break;
                    case erMenu.keys.tab:
                        if (event.shiftKey) {
                            erMenu.gotoIndex(erMenu.currentIndex - 1);
                        } else {
                            erMenu.gotoIndex(erMenu.currentIndex + 1);
                        }
                        break;
                    case erMenu.keys.enter:
                    case erMenu.keys.down:
                        this.click();
                        erMenu.subindex = 0;
                        erMenu.gotoSubIndex(this.querySelector('ul'), 0);
                        break;
                    case erMenu.keys.up:
                        this.click();
                        let submenu = this.querySelector('ul');
                        erMenu.subindex = submenu.querySelectorAll('li').length - 1;
                        erMenu.gotoSubIndex(submenu, subindex);
                        break;
                    case erMenu.keys.esc:
                        document.querySelector('a[href="#related"]').focus();
                }
                event.preventDefault();
            });
        });
    },

    initSubmenuItems: function () {
        this.subMenuItems.forEach(function (el) {

            el.setAttribute('tabindex', '-1');
            el.addEventListener("keydown", function (event) {
                switch (event.keyCode) {
                    case erMenu.keys.tab:
                        if (event.shiftKey) {
                            erMenu.gotoIndex(erMenu.currentIndex - 1);
                        } else {
                            erMenu.gotoIndex(erMenu.currentIndex + 1);
                        }
                        break;
                    case erMenu.keys.right:
                        erMenu.gotoIndex(erMenu.currentIndex + 1);
                        break;
                    case erMenu.keys.left:
                        erMenu.gotoIndex(erMenu.currentIndex - 1);
                        break;
                    case erMenu.keys.esc:
                        erMenu.gotoIndex(erMenu.currentIndex);
                        break;
                    case erMenu.keys.down:
                        erMenu.gotoSubIndex(this.parentNode, erMenu.subIndex + 1);
                        break;
                    case erMenu.keys.up:
                        erMenu.gotoSubIndex(this.parentNode, erMenu.subIndex - 1);
                        break;
                    case erMenu.keys.enter:
                    case erMenu.keys.space:
                        alert(this.innerText);
                        break;
                }
                event.preventDefault();
                event.stopPropagation();
                return false;
            });
            el.addEventListener("click", function (event) {

                switch ($(event.target).data("type")) {
                    case "command" :
                        erfe.executeCommand($(event.target).data("id"));
                        break;
                    case "function" :
                        erfe.insertFunctionWithInformation({
                            engineID : String($(event.target).data("engineid")),
                            version:  String($(event.target).data("version")),
                            functionID: String($(event.target).data("functionid")),

                        });
                        break;

                }
                event.preventDefault();
                event.stopPropagation();
                erMenu.closeOpenSubmenus();


                return false;

            });

        });
    },

    initHackListeners: function () {
        window.addEventListener("click", function () {
            erMenu.closeOpenSubmenus();
        });
        this.appsMenu.addEventListener("click", function (event) {
            event.stopPropagation();
        });
    },
    closeOpenSubmenus: function () {
        erMenu.appsMenuItems.forEach(function (el) {
            el.setAttribute('aria-expanded', "false");
        });
    },

    gotoIndex: function (idx) {
        if (idx === this.appsMenuItems.length) {
            idx = 0;
        } else if (idx < 0) {
            idx = this.appsMenuItems.length - 1;
        }
        this.appsMenuItems[idx].focus();
        this.currentIndex = idx;
    },

    gotoSubIndex: function (menu, idx) {
        let items = menu.querySelectorAll('li');
        if (idx === items.length) {
            idx = 0;
        } else if (idx < 0) {
            idx = items.length - 1;
        }

        items[idx].focus();
        this.subIndex = idx;
    },

    createMenuEntries: function () {
        let categories = [];

        for (let i = 0; i < this.engineFunctions.length; i++) {
            let lastVersion = this.engineFunctions[i].versions[this.engineFunctions[i].versions.length - 1];

            for (let j = 0; j < lastVersion.functions.length; j++) {

                if(lastVersion.functions[j].type === "remote"){
                    let categoryFound = false;
                    let currentCategory = null;
                    for (let k = 0; k < categories.length; k++) {

                        if (categories[k].name === lastVersion.functions[j].category) {
                            categoryFound = true;
                            currentCategory = categories[k];
                        }
                    }
                    if (!categoryFound) {
                        currentCategory = {
                            name: lastVersion.functions[j].category,
                            entries: [],
                        };
                        categories.push(currentCategory);
                    }

                    currentCategory.entries.push({

                            engineID: this.engineFunctions[i].engine,
                            version: lastVersion.version,
                            functionID: lastVersion.functions[j].id,
                            function: lastVersion.functions[j],
                        }
                    );
                }

            }

        }
        for (let i = 0; i < this.defaultMenuEntries.length; i++) {
            this.createDefaultMenuCategory(this.defaultMenuEntries[i]);
        }

        for (let i = 0; i < categories.length; i++) {
            this.createFunctionMenuCategory(categories[i]);
        }


    },

    createDefaultMenuCategory: function (category) {

        let html = "<li role=\"menuitem\" aria-haspopup=\"true\">" + category.name + " <ul role=\"menu\">";

        for (let i = 0; i < category.entries.length; i++) {
            html += "<li role=\"menuitem\" data-type=\"command\" data-id=\"" + category.entries[i].id + "\" >" + category.entries[i].name + "</li>";
        }

        html += "</ul></li>";


        $("#appmenu").append(html);
    },

    createFunctionMenuCategory: function (category) {

        let html = "<li role=\"menuitem\" aria-haspopup=\"true\">" + category.name + " <ul role=\"menu\">";

        for (let i = 0; i < category.entries.length; i++) {
            html += "<li role=\"menuitem\" data-type=\"function\" data-engineid=\"" + category.entries[i].engineID + "\" data-version=\""+category.entries[i].version+"\" data-functionid=\""+category.entries[i].functionID+ "\" \">" + category.entries[i].function.name + "</li>";
        }

        html += "</ul></li>";


        $("#appmenu").append(html);
    }
};



