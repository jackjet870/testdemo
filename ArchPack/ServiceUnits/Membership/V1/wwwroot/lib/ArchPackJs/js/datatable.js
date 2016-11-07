/* global App jQuery */
/*!
 * jQuery fixed header and column plugin.
 * Copyright(c) 2013 Archway Inc. All rights reserved.
 */

/// <reference path="../core/base.js" />

(function (global, $) {
    "use strict";

    /*
     * Function.prototype.bind not support IE8.
     */
    if (!Function.prototype.bind) {
        Function.prototype.bind = function (oThis) { // eslint-disable-line no-extend-native
            if (typeof this !== "function") {
                // closest thing possible to the ECMAScript 5
                // internal IsCallable function
                throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
            }

            var aArgs = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                fNOP = function () { },
                fBound = function () {
                    return fToBind.apply((this instanceof fNOP && oThis) ? this : oThis,
                        aArgs.concat(Array.prototype.slice.call(arguments)));
                };

            fNOP.prototype = this.prototype;
            fBound.prototype = new fNOP(); // eslint-disable-line new-cap

            return fBound;
        };
    }

    /*
     * Utility functions for DOM API.
     */
    var DOMUtil = {
        domElementFromjQuery: function (element) {
            if (element instanceof jQuery) {
                if (element.length === 0) {
                    return null;
                }
                element = element[0];
            }

            return element;
        },

        query: function (element, selector) {
            element = DOMUtil.domElementFromjQuery(element);

            return element.querySelectorAll(selector);
        },

        query$: function (element, selector) {
            element = DOMUtil.domElementFromjQuery(element);

            if (!element) {
                return $();
            }

            return $(element.querySelectorAll(selector));
        },

        single: function (element, selector) {
            element = DOMUtil.domElementFromjQuery(element);

            return element.querySelector(selector);
        },

        single$: function (element, selector) {
            element = DOMUtil.domElementFromjQuery(element);

            if (!element) {
                return $();
            }

            return $(element.querySelector(selector));
        },

        cloneNode: function ($elem) {
            if ($elem.length === 0) {
                return $();
            }
            var nodes = [], i, l;
            for (i = 0, l = $elem.length; i < l; i++) {
                nodes.push($elem[i].cloneNode(true));
            }
            return $(nodes);
        },

        getHeight: function ($elem) {
            if ($elem.length === 0) {
                return 0;
            }
            var result = $elem[0].clientHeight;
            if (result) {
                return result;
            }
            return $elem[0].offsetHeight;
        },

        adjustHeight: function ($flow, $fix, margin) {

            var flowHeight = DOMUtil.getHeight($flow),
                fixHeight = DOMUtil.getHeight($fix),
                height, fixRows, flowRows;

            if (typeof margin === "undefined" || margin === null) {
                margin = 1;
            }

            height = (flowHeight >= fixHeight) ? flowHeight : fixHeight;

            fixRows = DOMUtil.query$($fix, "tr");
            fixRows.height((height / fixRows.length) + margin);

            flowRows = DOMUtil.query$($flow, "tr");
            flowRows.height((height / flowRows.length) + margin);

            return height;
        },

        focusable: function focusable(element) {
            var map, mapName, img,
                nodeName = element.nodeName.toLowerCase();
            if (nodeName === "area") {
                map = element.parentNode;
                mapName = map.name;
                if (!element.href || !mapName || map.nodeName.toLowerCase() !== "map") {
                    return false;
                }
                img = $("img[usemap=#" + mapName + "]")[0];
                return !!img && DOMUtil.visible(img);
            }

            if (nodeName === "span") {
                return false;
            }

            return (/input|select|textarea|button|object|a/.test(nodeName) ? !element.disabled : false) && DOMUtil.visible(element);
        },

        visible: function visible(element) {
            return $.expr.filters.visible(element) &&
                !$(element).parents().addBack().filter(function () {
                    return $.css(this, "visibility") === "hidden";
                }).length;
        }
    };

    if (!$.expr[":"].focusable) {
        $.extend($.expr[":"], {
            focusable: function (element) {
                return DOMUtil.focusable(element);
            }
        });
    }

    var BrowserSupport = {
        isLteIE8: function isLteIE8() {
            var ua = window.navigator.userAgent.toLowerCase();
            var ver = window.navigator.appVersion.toLowerCase();

            if (ua.indexOf("msie") !== -1) {
                if (ver.indexOf("msie 6.") !== -1) {
                    return true;
                } else if (ver.indexOf("msie 7.") !== -1) {
                    return true;
                } else if (ver.indexOf("msie 8.") !== -1) {
                    return true;
                }
            }
            return false;
        },
        scrollBar: { width: 18, height: 18 }
    };

    /*
     * Data row and cache definitions.
     */
    function DataRow(element) {
        this.element = element;
        this.rowid = App.uuid();
        this.height = 0; //cache actual height of row element
        this.visible = false;
    }

    function DataRowCache() {
        this.rows = {};
        this.rowids = [];
    }

    DataRowCache.prototype.id = function (id) {
        return this.rows[id];
    };

    DataRowCache.prototype.index = function (index) {
        var id = this.rowids[index];

        return this.rows[id];
    };

    DataRowCache.prototype.add = function (row) {
        this.rows[row.rowid] = row;
        this.rowids.push(row.rowid);

        return row;
    };

    DataRowCache.prototype.remove = function (id) {

        var i, len;
        for (i = 0, len = this.rowids.length; i < len; i++) {
            if (this.rowids[i] === id) {
                this.rowids.splice(i, 1);
            }
        }
        delete this.rows[id];
    };



    var SortIconClasses = {

        Acend: "glyphicon-sort-by-attributes",
        Descend: "glyphicon-sort-by-attributes-alt"
    };

    var onTheadClick = function (e, self) {
        var $target = e.target.tagName === "I" ? $(e.target).closest("th") : $(e.target),
            prop = $target.attr("data-prop"),
            modes = { none: 0, ascend: 1, descend: 2 },
            $container = $target.closest(".dt-container"),
            icon = DOMUtil.query$($target, ".glyphicon"),
            mode;

        if (!prop || prop === "") {
            return;
        }

        var otherIcons = DOMUtil.query$($container, "i.glyphicon").not(icon);
        otherIcons.removeClass(SortIconClasses.Acend);
        otherIcons.removeClass(SortIconClasses.Descend);

        if (DOMUtil.query$($target, "i." + SortIconClasses.Acend).length > 0) {
            mode = modes.descend;
            icon.removeClass(SortIconClasses.Acend);
            icon.addClass(SortIconClasses.Descend);
        }
        else if (DOMUtil.query$($target, "i." + SortIconClasses.Descend).length > 0) {

            if (App.isFunc(self.options.onreset)) {
                self.options.onreset();
                mode = modes.none;
            } else {
                mode = modes.ascend;
                icon.removeClass(SortIconClasses.Descend);
                icon.addClass(SortIconClasses.Acend);
            }
        }
        else {
            mode = modes.ascend;
            icon.removeClass(SortIconClasses.Descend);
            $(icon[0]).addClass(SortIconClasses.Acend);
        }

        self.modules.BodyView.sort(prop, mode);
        DOMUtil.single$(self.modules.BodyView.flowElement, ".dt-body").scrollTop(0);
    };

    var createFixedColumns = function ($target, cellSelector, containerClass, fixeColumnNumbers) {

        var $fixed = $target.clone(),
            $tr, $cell, tr, cell,
            $fixtr, $fixcell, fixtr, fixcell,
            i = 0, ilen = 0, j = 0, jlen = 0, logicalCellCounts;

        fixeColumnNumbers = fixeColumnNumbers + 1;

        var $fixedTableChildren = DOMUtil.single$($fixed, "table").children();
        var $targetTableChildren = DOMUtil.single$($target, "table").children();

        $fixedTableChildren.each(function (index, tchild) {

            // if (tchild.tagName.toLowerCase() === "tfoot") {
            //     return;
            // }

            $fixtr = DOMUtil.query$($(tchild), "tr");
            $tr = DOMUtil.query$($($targetTableChildren[index]), "tr");

            logicalCellCounts = new Array($fixtr.length);

            for (i = 0, ilen = $fixtr.length; i < ilen; i++) {
                logicalCellCounts[i] = 0;
            }

            var k = 0, klen = 0;

            for (i = 0, ilen = $fixtr.length; i < ilen; i++) {
                fixtr = $fixtr[i];
                tr = $tr[i];
                $fixcell = DOMUtil.query$($(fixtr), cellSelector);
                $cell = DOMUtil.query$($(tr), cellSelector);

                for (j = 0, jlen = $fixcell.length; j < jlen; j++) {
                    fixcell = $fixcell[j];
                    cell = $cell[j];

                    logicalCellCounts[i]++;

                    if ((fixcell.colSpan > 1 && logicalCellCounts[i] <= fixeColumnNumbers) &&
                        (logicalCellCounts[i] + (fixcell.colSpan - 1) > fixeColumnNumbers)) {

                        throw new Error("列の固定で指定されたインデックスでは固定位置を揃えることができません。");
                    }

                    logicalCellCounts[i] += (fixcell.colSpan > 1) ? (fixcell.colSpan - 1) : 0;

                    if (logicalCellCounts[i] <= fixeColumnNumbers) {
                        if (fixcell.rowSpan > 1) {
                            for (k = (i + 1), klen = (fixcell.rowSpan + i); k < klen; k++) {
                                logicalCellCounts[k]++;
                                logicalCellCounts[k] += (fixcell.colSpan > 1) ? (fixcell.colSpan - 1) : 0;
                            }
                        }
                    }

                    if (logicalCellCounts[i] > fixeColumnNumbers) {
                        $(fixcell).remove();
                    }
                    else {
                        $(cell).remove();
                    }
                }
            }
        });

        $fixed.css({
            overflow: "",
            overflowX: "",
            overflowY: "",
            width: ""
        });

        DOMUtil.single$($fixed, "table").css("width", "auto");
        DOMUtil.single$($fixed, "table").css("max-width", "");

        return $fixed.addClass(containerClass);
    };

    var hideSortIcons = function ($container) {
        var $divHead = DOMUtil.single$($container, ".flow-container .dt-head"),
            $fixHead = DOMUtil.single$($container, ".fix-columns .dt-head");
        DOMUtil.query$($divHead, ".glyphicon").replaceWith($("<i class='glyphicon'></i>"));
        if ($fixHead) {
            DOMUtil.query$($fixHead, ".glyphicon").replaceWith($("<i class='glyphicon'></i>"));
        }
    };

    function HeaderRow(containerElement) {
        this.containerElement = containerElement;
        this.initialize.call(this);
    }

    HeaderRow.prototype.initialize = function () {
        var self = this;
        if (self.containerElement.length > 1) {
            this.fixElement = self.containerElement[0];
            this.flowElement = self.containerElement[1];
        }
        else {
            this.flowElement = self.containerElement[0];
        }
    };

    HeaderRow.prototype.addCellClickEvent = function (handler) {
        this.flowElement.on("click", "th", handler);
        if (!App.isUndef(this.fixElement)) {
            this.fixElement.on("click", "th", handler);
        }
    };

    function validateHeaderRowLength($head) {
        if (DOMUtil.query$($head, "tr").length > 1) {
            throw new Error("多段行での列の表示・非表示はサポートされません。");
        }
    }

    HeaderRow.prototype.showColumn = function (index) {
        var colid;
        if (typeof index === "string") {
            colid = index;
        }
        var self = this,
            $container = self.flowElement.closest(".dt-container"),
            $head = DOMUtil.query$($container, ".flow-container .dt-head thead"),
            $fixcols = $(self.fixElement).find(".dt-head th").length,
            $flowcols = $(self.flowElement).find(".dt-head th").length,
            showThCol = function ($targetHead) {
                if (colid) {
                    return DOMUtil.query$($targetHead, "th[data-col='" + colid + "'])");
                } else {
                    var thead, th, i, ilen;
                    for (i = 0, ilen = $targetHead.length; i < ilen; i++) {
                        thead = $targetHead[i];
                        th = DOMUtil.query(thead, "th");
                        if (th[index]) {
                            th[index].style.display = "";
                        }
                    }
                }
            };
        validateHeaderRowLength($head);
        if (index <= ($fixcols - 1) && $flowcols) {
            var $fixHead = DOMUtil.query$($container, ".fix-columns .dt-head thead");
            showThCol($fixHead);
            var outerWidth = $fixHead.outerWidth();
            $head.closest("table").css("margin-left", outerWidth);
        }
        else {
            index -= $fixcols;
            showThCol($head);
        }
    };

    HeaderRow.prototype.hideColumn = function (index) {
        var colid;
        if (typeof index === "string") {
            colid = index;
        }
        var self = this,
            $container = self.flowElement.closest(".dt-container"),
            $head = DOMUtil.query$($container, ".flow-container .dt-head thead"),
            $fixcols = $(self.fixElement).find(".dt-head th").length,
            $flowcols = $(self.flowElement).find(".dt-head th").length,
            hideThCol = function ($targetHead) {

                if (colid) {
                    return DOMUtil.query$($targetHead, "th[data-col='" + colid + "'])");
                } else {
                    var thead, th, i, ilen;
                    for (i = 0, ilen = $targetHead.length; i < ilen; i++) {
                        thead = $targetHead[i];
                        th = DOMUtil.query(thead, "th");
                        if (th[index]) {
                            th[index].style.display = "none";
                        }
                    }
                }
            };
        validateHeaderRowLength($head);
        if (index <= ($fixcols - 1) && $flowcols) {

            var $fixHead = DOMUtil.query$($container, ".fix-columns .dt-head thead");
            hideThCol($fixHead);
            var outerWidth = $fixHead.outerWidth();
            $head.closest("table").css("margin-left", outerWidth);
        }
        else {
            index -= $fixcols;
            hideThCol($head);
        }
    };

    function HeaderContainer(containerElement, srcElement, options) {
        this.containerElement = containerElement;
        this.options = options;
        this.srcElement = srcElement;
        this.row = {};
        this.initialize(this);
    }

    HeaderContainer.prototype.initialize = function () {
        var self = this,
            $divHead, $fixHead,
            $head = DOMUtil.single$(self.srcElement, "thead").clone(),
            $flowTable = self.srcElement, $flowTheadCells;
        if (self.containerElement.length > 1) {
            this.fixElement = self.containerElement[0];
            this.flowElement = self.containerElement[1];
        }
        else {
            this.flowElement = self.containerElement[0];
        }

        $flowTheadCells = DOMUtil.query$(this.flowElement, "thead th,thead td");
        $flowTheadCells.text("");
        $flowTable.css("margin-top", "-2px");

        $divHead = $("<div class='dt-head'><table></table></div>").prependTo(self.flowElement);

        this.row = new HeaderRow(self.containerElement);
        DOMUtil.single$($divHead, "table").prop("class", $flowTable.prop("class")).append($head);
        $divHead.css("margin-right", BrowserSupport.scrollBar.width);

        if (self.options.fixedColumn === true) {

            DOMUtil.single$($divHead, "table").css("width", self.options.innerWidth);
            DOMUtil.single$($divHead, "table").css("max-width", self.options.innerWidth);

            $fixHead = createFixedColumns($divHead, "th", "dt-fix-head", self.options.fixedColumns);
            $fixHead.css("margin-right", "");
            this.fixElement.append($fixHead);

            var w = DOMUtil.single$($fixHead, "table").width();
            DOMUtil.single$($fixHead, "table").css("width", w);
            DOMUtil.single$($divHead, "table").css("margin-left", w - 1);
            $divHead.css("min-width", w + 200 - BrowserSupport.scrollBar.width);

            DOMUtil.adjustHeight($divHead, $fixHead, 1);

            if (self.options.responsive) {
                if (!BrowserSupport.isLteIE8()) {
                    DOMUtil.query$($divHead, "table").css("table-layout", "fixed");
                    DOMUtil.query$($fixHead, "table").css("table-layout", "fixed");
                }
            }
        }
        else {
            if (self.options.responsive) {
                var setMinWidth = function (cells, width) {
                    var i, ilen, cell;
                    for (i = 0, ilen = cells.length; i < ilen; i++) {
                        cell = cells[i];
                        if (!$(cell).css("width")) {
                            $(cell).css("min-width", width);
                        }
                    }
                };
                setMinWidth(DOMUtil.query$($divHead, "th,td"), 40);
                DOMUtil.single$(this.flowElement, ".dt-head table").css("table-layout", "fixed");
            }
        }

        if (self.options.sortable === true) {
            $.each($divHead, function (index) {
                DOMUtil.query$($divHead[index], "[data-prop]").css("cursor", "pointer").append($("<i class='glyphicon'></i>"));
            });

            self.row.addCellClickEvent(function (e) {
                var owner = self.srcElement.data("aw.dataTable");
                self.showWait({});
                onTheadClick(e, owner);
                self.hideWait({});
            });
        }
    };

    HeaderContainer.prototype.addScrollEvent = function (handler) {
        this.flowElement.on("scroll", ".dt-head", handler);
    };

    HeaderContainer.prototype.detachScrollEvent = function () {
        this.flowElement.off("scroll");
    };

    HeaderContainer.prototype.showWait = function (operation) {
        this.flowElement.closest(".dt-container").append("<div class='wait'></div>");
        if (App.isFunc(operation)) {
            operation();
        }
    };

    HeaderContainer.prototype.hideWait = function (operation) {
        DOMUtil.query$(this.flowElement.closest(".dt-container"), ".wait").remove();
        if (App.isFunc(operation)) {
            operation();
        }
    };

    var setNewSelectedRow = function (self, selectedRow, e) {
        if (self.selectedRowElement) {
            self.lastSelectedRowElement = self.selectedRowElement;
        }
        self.selectedRowElement = selectedRow;

        if (self.options.onselect && selectedRow) {
            self.options.onselect(e || {}, selectedRow);
        }
    };

    var setFocus = function (row, self) {
        setTimeout(function () {

            var item = row.element.find(":focusable:first");

            if (item.length > 0) {
                $(item[0]).focus();
            }

            setNewSelectedRow(self, row, {
                target: $(row.element[0]).closest("table")[0]
            });
        }, 0);
    };

    var onTbodyFocus = function (e, self) {
        self.options.onselecting();
        var target = $(e.target),
            tbody = target.closest("tbody"),
            rowid = tbody.attr("data-rowid"),
            row = self.modules.BodyView.cache.id(rowid);

        //var enableOperation = (self.options.onselect && row);

        setTimeout(function () {

            var $divBody = target.closest(".dt-body"),
                divBody = $divBody[0],
                $container = $divBody.closest(".dt-container"),
                container = $container[0],
                scrollTop = $divBody.scrollTop();

            if (!container) {
                return;
            }

            if ($divBody.hasClass("dt-fix-body")) {
                DOMUtil.single(container, ".flow-container>.dt-body").scrollTop = scrollTop;

            } else {
                DOMUtil.single(container, ".flow-container>.dt-body").scrollTop = scrollTop;
                var left = target.offset().left - DOMUtil.single$($divBody, "table").offset().left;
                if (left < divBody.scrollLeft) {
                    divBody.scrollLeft = left - 10;
                }
            }

            //self.options.onselected();

            //if (enableOperation) {
            //    self.options.onselect(e, row);
            //}

            setNewSelectedRow(self, row, e);

            //if (self.selectedRowElement) {
            //    self.lastSelectedRowElement = self.selectedRowElement;
            //}

            //self.selectedRowElement = row;

        }, 0);
    };

    var getForcusable = function (target, self) {
        var focusable = [],
            focusableFix = [];

        focusable = $(target.element[0]).find(":focusable").toArray();
        if (self.options.fixedColumn) {
            focusableFix = $(target.element[1]).find(":focusable").toArray();
            focusable = focusableFix.concat(focusable);
        }
        return focusable;
    };

    var KeyCodes = {
        Tab: 9,
        ArrowDown: 40,
        ArrowUp: 38
    };

    var onKeyDown = function (e, owner) {
        var target = $(e.target),
            $tbody = target.closest("tbody"),
            dataRowId = $tbody.attr("data-rowid"),
            targetRow = owner.modules.BodyView.cache.id(dataRowId),
            focusable = getForcusable(targetRow, owner),
            isFirst = function (aTarget, focusableTarget) {
                return $(focusableTarget[0]).is(aTarget);
            },
            isLast = function (aTarget, focusableTarget) {
                return $(focusableTarget[focusableTarget.length - 1]).is(aTarget);
            },
            currentTabIndex,
            currentRowIndex, nextRowIndex, nextRow, prevRowIndex, prevRow;

        if (focusable.length <= 0) {
            return false;
        }

        if (e.keyCode === KeyCodes.Tab && e.shiftKey === false) {
            // On press Tab key
            e.preventDefault();
            currentTabIndex = focusable.indexOf(target[0]);
            var nextTabIndex = currentTabIndex + 1,
                nextTarget = focusable[nextTabIndex];

            if (!isLast(target, focusable)) {
                owner.options.ontabing();
                nextTarget.focus();
                owner.options.ontabed();

            } else {
                currentRowIndex = owner.modules.BodyView.cache.rowids.indexOf(dataRowId);
                nextRowIndex = currentRowIndex + 1;

                if (nextRowIndex === owner.modules.BodyView.cache.rowids.length) {
                    return false;
                }
                nextRow = owner.modules.BodyView.cache.index(nextRowIndex);
                focusable = getForcusable(nextRow, owner);
                if (focusable.length > 0) {
                    focusable[0].focus();
                }
            }

        } else if (e.keyCode === KeyCodes.Tab && e.shiftKey === true) {
            // On press Shift + Tab key
            e.preventDefault();
            currentTabIndex = focusable.indexOf(target[0]);
            var prevTabIndex = currentTabIndex - 1,
                prevTarget = focusable[prevTabIndex];

            if (!isFirst(target, focusable)) {
                owner.options.ontabing();
                prevTarget.focus();
                owner.options.ontabed();

            } else {
                currentRowIndex = owner.modules.BodyView.cache.rowids.indexOf(dataRowId);
                prevRowIndex = currentRowIndex - 1;
                if (prevRowIndex < 0) {
                    return false;
                }

                prevRow = owner.modules.BodyView.cache.index(prevRowIndex);
                focusable = getForcusable(prevRow, owner);
                if (focusable.length > 0) {
                    owner.options.ontabing();
                    focusable[focusable.length - 1].focus();
                    owner.options.ontabed();
                }
            }

        } else if (e.keyCode === KeyCodes.ArrowDown) {
            // On press Arrow Down Key.
            currentRowIndex = owner.modules.BodyView.cache.rowids.indexOf(dataRowId);
            currentTabIndex = focusable.indexOf(target[0]);
            nextRowIndex = currentRowIndex + 1;

            if (nextRowIndex === owner.modules.BodyView.cache.rowids.length) {
                return false;
            }
            nextRow = owner.modules.BodyView.cache.index(nextRowIndex);
            focusable = getForcusable(nextRow, owner);
            if (focusable.length > 0) {
                focusable[currentTabIndex].focus();
            }

        } else if (e.keyCode === KeyCodes.ArrowUp) {
            // On press Arrow Up Key.
            currentRowIndex = owner.modules.BodyView.cache.rowids.indexOf(dataRowId);
            currentTabIndex = focusable.indexOf(target[0]);
            prevRowIndex = currentRowIndex - 1;

            if (prevRowIndex < 0) {
                return false;
            }

            prevRow = owner.modules.BodyView.cache.index(prevRowIndex);
            focusable = getForcusable(prevRow, owner);
            if (focusable.length > 0) {
                owner.options.ontabing();
                focusable[currentTabIndex].focus();
                owner.options.ontabed();
            }
        }
    };

    function BodyRow(containerElement, srcElement) {
        this.containerElement = containerElement;
        this.srcElement = srcElement;
        this.initialize.call(this);
    }

    BodyRow.prototype.initialize = function () {
        var self = this,
            owner;

        if (self.containerElement.length > 1) {
            self.fixElement = self.containerElement[0];
            self.flowElement = self.containerElement[1];
        }
        else {
            self.flowElement = self.containerElement[0];
        }

        owner = self.srcElement.data("aw.dataTable");

        self.addChangeEvent(function (e) {
            var target = $(e.target),
                tbody = target.closest("tbody"),
                rowid = tbody.attr("data-rowid"),
                row = owner.modules.BodyView.cache.id(rowid);

            if (owner.options.onchange && row) {
                owner.options.onchange(e, row);
            }
        });

        self.addCellFocusEvent(function (e) {
            onTbodyFocus(e, owner);
        });

        self.addCellClickEvent(function (e) {
            onTbodyFocus(e, owner);
        });

        self.addKeyDownEvent(function (e) {
            //e.preventDefault();
            onKeyDown(e, owner);
        });
    };

    BodyRow.prototype.addChangeEvent = function (handler) {
        this.containerElement.on("change", "td", handler);
    };

    BodyRow.prototype.detachChangeEvent = function () {
        this.containerElement.off("change");
    };

    BodyRow.prototype.addKeyDownEvent = function (handler) {
        this.containerElement.on("keydown", "td", handler);
    };

    BodyRow.prototype.addCellClickEvent = function (handler) {
        this.containerElement.on("click", "td", handler);
    };

    BodyRow.prototype.detachCellClickEvent = function () {
        this.containerElement.off("click");
    };

    BodyRow.prototype.addCellFocusEvent = function (handler) {
        this.containerElement.on("focus", ":input", handler);
    };

    BodyRow.prototype.detachCellFocusEvent = function () {
        this.containerElement.off("focus");
    };

    BodyRow.prototype.showColumn = function (index) {
        var self = this,
            $flowcontainer = self.flowElement.closest("tbody"),
            $flowrow = DOMUtil.query$($flowcontainer, "tr"),
            $fixcontainer = self.fixElement.closest("tbody"),
            $fixrow = DOMUtil.query$($fixcontainer, "tr"),
            $fixcols = $(self.fixElement).find("td").length,
            $flowcols = $(self.flowElement).find("td").length,
            showTdCol = function ($targetRow) {
                if (typeof index === "string") {
                    throw new Error("index must be a number");
                } else {
                    var tbody, td, i, ilen;
                    for (i = 0, ilen = $targetRow.length; i < ilen; i++) {
                        tbody = $targetRow[i];
                        td = DOMUtil.query(tbody, "td");
                        if (td[index]) {
                            td[index].style.display = "";
                        }
                    }
                }
            };
        if (index <= ($fixcols - 1) && $flowcols) {
            showTdCol($fixrow);
        }
        else {
            index -= $flowcols;
            if (index < 0) {
                index *= -1;
            }
            showTdCol($flowrow);
        }
    };

    BodyRow.prototype.hideColumn = function (index) {
        var self = this,
            $flowcontainer = self.flowElement.closest("tbody"),
            $flowrow = DOMUtil.query$($flowcontainer, "tr"),
            $fixcontainer = self.fixElement === typeof (undefined) ? self.fixElement.closest("tbody") : {},
            $fixrow = self.fixElement === typeof (undefined) ? DOMUtil.query$($fixcontainer, "tr") : {},
            $fixcols = self.fixElement === typeof (undefined) ? $(self.fixElement).find("td").length : 0,
            $flowcols = $(self.flowElement).find("td").length,
            hideTdCol = function ($targetRow) {
                if (typeof index === "string") {
                    throw new Error("index must be a number");
                } else {
                    var tbody, td, i, ilen;
                    for (i = 0, ilen = $targetRow.length; i < ilen; i++) {
                        tbody = $targetRow[i];
                        td = DOMUtil.query(tbody, "td");
                        if (td[index]) {
                            td[index].style.display = "none";
                        }
                    }
                }
            };
        if (index <= ($fixcols - 1) && $flowcols) {
            hideTdCol($fixrow);
        }
        else {
            index -= $flowcols;
            if (index < 0) {
                index *= -1;
            }
            hideTdCol($flowrow);
        }
    };

    function BodyContainer(containerElement, srcElement, options) {
        this._globalLock = 0;
        this.rows = []; //BodyRows
        this.containerElement = containerElement;
        this.srcElement = srcElement;
        this.options = $.extend({}, BodyContainer.DEFAULTS, options);
        this.pageHeight = 0;
        this.renderHeight = 0;
        this.templateHeight = 0;
        this.scrollTop = 0;
        this.offsetScrollbar = 0;
        this.scrollHeight = 0;
        this.isScrollDown = false;
        this.events = {
            render: {}
        };
        this.selectors = {
            flowElement: undefined,
            $flowTable: srcElement,
            $flowScroll: undefined,

            fixElement: undefined,
            $fixTable: undefined,
            $fixScroll: undefined
        };
        this.initialize.call(this);
    }

    BodyContainer.DEFAULTS = {
        isScroll: false
    };

    BodyContainer.prototype.initialize = function () {
        var self = this,
            $divBody, $fixBody,
            $divHead, $divHeadCells, $fixHead,
            $divFoot, $fixFoot,  // eslint-disable-line no-unused-vars
            $container;
        if (self.containerElement.length > 1) {
            self.selectors.fixElement = self.containerElement[0];
            self.selectors.flowElement = self.containerElement[1];
        }
        else {
            self.selectors.flowElement = self.containerElement[0];
        }

        $container = self.selectors.flowElement.closest(".dt-container");
        $divHead = DOMUtil.single$(self.selectors.flowElement, ".dt-head");
        $divBody = self.selectors.$flowTable.wrap("<div class='dt-body'></div>").parent();
        $divFoot = DOMUtil.single$(self.selectors.flowElement, ".dt-foot");

        self.selectors.$flowScroll = self.selectors.$flowTable.wrap("<div class='dt-vscroll'></div>").parent();

        BrowserSupport.scrollBar.width = $divBody[0].offsetWidth - self.selectors.$flowScroll[0].offsetWidth;

        $divBody.outerHeight(self.options.height);

        self.templateHeight = DOMUtil.single$($container, "tbody.item-tmpl").outerHeight();
        DOMUtil.single$($container, "tbody.item-tmpl").hide();
        DOMUtil.single$($divBody, "table tfoot").hide();

        $divHeadCells = DOMUtil.query$($divBody, "thead th,thead td");
        $divHeadCells.text("");

        self.selectors.$flowTable.css({ "table-layout": "fixed", "position": "absolute", "top": 0 });

        if (self.options.fixedColumn === true) {

            DOMUtil.single$($divBody, "table").css("width", self.options.innerWidth);
            DOMUtil.single$($divBody, "table").css("max-width", self.options.innerWidth);
            $divBody.css("overflow-x", "scroll");

            $fixBody = createFixedColumns($divBody, "td", "dt-fix-body", self.options.fixedColumns);
            createFixedColumns($divBody, "th", "dt-fix-body", self.options.fixedColumns);

            $fixHead = DOMUtil.single$(self.selectors.fixElement, ".dt-head.dt-fix-head");
            $fixFoot = DOMUtil.single$(self.selectors.fixElement, ".dt-foot.dt-fix-foot");

            DOMUtil.query$($fixBody, "table thead").remove();
            DOMUtil.query$($fixBody, "table tfoot").remove();

            var $cpHead = DOMUtil.query$($fixHead, "thead").clone();
            DOMUtil.query$($fixBody, "table tbody.item-tmpl").before($cpHead);
            $fixBody.height($divBody.height() + 1 - BrowserSupport.scrollBar.height);
            var fixBodyTheadCells = DOMUtil.query$($fixBody, "thead th, thead td");
            fixBodyTheadCells.text("");
            DOMUtil.query$($fixBody, "table tr").css("height", "0px");

            $fixHead.after($fixBody);

            // TODO: body offset (configure)
            var bodyOffset = 2;
            var w = DOMUtil.single$($fixHead, "table").width();
            DOMUtil.single$($fixBody, "table").width(w - bodyOffset);
            DOMUtil.single$($divBody, "table").css("margin-left", w - bodyOffset);
            $divBody.css("min-width", w + 200);

            self.selectors.$flowScroll.css("min-height", "3px").css("width", self.options.innerWidth + w - 1);

            self.selectors.$fixTable = DOMUtil.single$(self.selectors.fixElement, ".dt-fix-body table");
            self.selectors.$fixScroll = DOMUtil.single$(self.selectors.fixElement, ".dt-vscroll");

            self.addScrollEvent(function (e) {
                var $target = $(e.target),
                     top = $divBody.scrollTop();
                $fixBody.scrollTop(top);
                if (!self._globalLock++) {
                    setTimeout(function () {
                        //If scroll is happing but scrollTop has not change
                        //Set scrollLeft for $divHead
                        if (top !== self.scrollTop) {
                            self.isScrollDown = top > self.scrollTop;
                            self.offsetScrollbar = top - self.scrollTop;
                            self.scrollTop = top;
                            self.options.isScroll = true;
                            self.events.render(self.options);

                        } else {
                            $divHead.scrollLeft($target.scrollLeft());
                            $divFoot.scrollLeft($target.scrollLeft());
                        }

                        setTimeout(function () {
                            self._globalLock = 0;
                        }, 0);

                    }, 5);
                }
                e.preventDefault();
                e.stopImmediatePropagation();
            });

            $fixBody.on("mousewheel", function (e) {
                var $target = $(this),
                    delta = e.originalEvent.wheelDelta,
                    top = $target.scrollTop() - (delta);
                $divBody.scrollTop(top);

                if (top > 0) {
                    return false;
                }
            });

            if (self.options.responsive) {
                if (!BrowserSupport.isLteIE8()) {
                    DOMUtil.query$($fixBody, "table").css("table-layout", "fixed");
                    DOMUtil.query$($divBody, "table").css("table-layout", "fixed");
                }
            }
        }
        else {
            if (self.options.responsive) {
                var setMinWidth = function (cells, width) {
                    var i, ilen, cell;
                    for (i = 0, ilen = cells.length; i < ilen; i++) {
                        cell = cells[i];
                        if (!cell.style.width) {
                            cell.style.minWidth = width;
                        }
                    }
                };

                setMinWidth(DOMUtil.query$($divHead, "th,td"), 40);

                setMinWidth(DOMUtil.query$(self.selectors.$flowTable, "th,td"), 40);

                self.selectors.$flowTable.css({ "table-layout": "fixed", "position": "absolute", "top": 0 });

                self.addScrollEvent(function (e) {
                    if (!self._globalLock++) {
                        setTimeout(function () {
                            var $target = $(e.target),
                                top = $divBody.scrollTop();

                            $divHead.scrollLeft($target.scrollLeft());

                            self.isScrollDown = top > self.scrollTop;
                            self.offsetScrollbar = top - self.scrollTop;

                            self.scrollTop = top;

                            self.events.render({
                                isScroll: true
                            });

                            setTimeout(function () {
                                self._globalLock = 0;
                            }, 0);

                        }, 1);
                    }
                    e.preventDefault();
                    e.stopImmediatePropagation();
                });
            }
        }
    };

    BodyContainer.prototype.insertRow = function (index, dataRow, isPrepend) {
        var self = this,
            $table = self.selectors.$flowTable,
            $fixTable = self.selectors.$fixTable,
            rows = self.rows,
            bodyRow = new BodyRow(dataRow.element, $table),
            flowRow, fixRow, height = dataRow.height;

        if (!dataRow.visible) {
            dataRow.element.hide();
        }

        flowRow = bodyRow.containerElement[0];
        if (self.options.fixedColumn) {
            fixRow = bodyRow.containerElement[1];
            if (isPrepend && self.rows.length > 0) {
                $table[0].insertBefore(flowRow, self.rows[0].containerElement[0]);
                $fixTable[0].insertBefore(fixRow, self.rows[0].containerElement[1]);
                rows.unshift(bodyRow);
            } else {
                $table[0].appendChild(flowRow);
                $fixTable[0].appendChild(fixRow);
                rows.push(bodyRow);
            }

            //If the row has not render before, the actual height is 0
            if(dataRow.height === 0){
                height = DOMUtil.adjustHeight($(flowRow), $(fixRow), 0);
            }
        }
        else {
            if (isPrepend && self.rows.length > 0) {
                $table[0].insertBefore(flowRow, self.rows[0].containerElement[0]);
                rows.unshift(bodyRow);
            } else {
                $table[0].appendChild(flowRow);
                rows.push(bodyRow);
            }

            height = dataRow.height === 0 ? flowRow.clientHeight : dataRow.height;
        }
        return height;
    };

    BodyContainer.prototype.removeRow = function (index) {
        var self = this,
            targetRow = self.rows[index],
            owner = self.srcElement.data("aw.dataTable"),
            rowid = $(targetRow.containerElement[0]).attr("data-rowid"),
            rowRemove = owner.modules.BodyView.cache.id(rowid),
            heightRowRemove = 0;

        targetRow.detachCellFocusEvent();
        targetRow.detachCellClickEvent();
        targetRow.detachChangeEvent();

        heightRowRemove = rowRemove.height > 0 ? rowRemove.height : targetRow.containerElement[0].clientHeight;

        self.renderHeight -= heightRowRemove;
        $(targetRow.containerElement).remove();
        self.rows.splice(index, 1);

        return heightRowRemove;
    };

    //get index of DataRow in Body
    BodyContainer.prototype.getRowIndex = function (rowid) {
        var self = this,
            elements = self.selectors.$flowTable[0].tBodies,
            index,
            targetElement;

        for (index = 0; index < elements.length; index++) {
            targetElement = elements[index];
            if (targetElement.getAttribute("data-rowid") === rowid) {
                index--;
                break;
            }
        }

        return index;
    };

    BodyContainer.prototype.clear = function () {
        var self = this;

        self.pageHeight = 0;
        self.renderHeight = 0;
        self.scrollTop = 0;
        self.scrollHeight = 0;
        self.selectors.$flowTable.css("height", "");
        self.selectors.$flowTable.css("top", self.scrollTop);
        self.selectors.$flowScroll.parent().scrollTop(self.scrollTop);

        if (self.options.fixedColumn) {
            self.selectors.$fixTable.css({ "top": self.scrollTop });
            self.selectors.$fixScroll.css("height", "");
            self.selectors.$fixScroll.parent().scrollTop(self.scrollTop);
        }
    };

    BodyContainer.prototype.cloneTemplateItem = function () {
        var self = this,
            $cloneflow, $clonefix;

        $cloneflow = DOMUtil.cloneNode(DOMUtil.single$(self.selectors.flowElement, ".item-tmpl"));

        if (self.options.fixedColumn) {
            $clonefix = DOMUtil.cloneNode(DOMUtil.single$(self.selectors.fixElement, ".dt-fix-body table tbody.item-tmpl"));
        }
        return [$clonefix, $cloneflow];
    };

    BodyContainer.prototype.addScrollEvent = function (handler) {
        var $divBody = DOMUtil.single$(this.selectors.flowElement, ".dt-body");
        $divBody.on("scroll", handler);
    };

    BodyContainer.prototype.detachScrollEvent = function () {
        this.selectors.flowElement.off("scroll");
    };

    function FooterRow(containerElement) {
        this.containerElement = containerElement;
        this.initialize.call(this);
    }

    FooterRow.prototype.initialize = function () {
        var self = this;

        if (self.containerElement.length > 1) {
            this.fixElement = self.containerElement[0];
            this.flowElement = self.containerElement[1];
        }
        else {
            this.flowElement = self.containerElement[0];
        }
    };

    FooterRow.prototype.addCellClickEvent = function (handler) {
        this.containerElement.on("click", "td", handler);
    };

    FooterRow.prototype.detachCellClickEvent = function () {
        this.containerElement.off("click");
    };

    var validateFootRowLength = function ($foot) {
        if (DOMUtil.query$($foot, "tr").length > 1) {
            throw new Error("多段行での列の表示・非表示はサポートされません。");
        }
    };

    FooterRow.prototype.showColumn = function (index) {
        var colid;
        if (typeof index === "string") {
            colid = index;
        }

        var self = this,
            $container = $(self.flowElement).closest(".dt-container"),
            $foot = DOMUtil.query$($container, ".flow-container .dt-foot tfoot"),
            $fixcols = $(self.fixElement).find(".dt-foot td").length,
            $flowcols = $(self.flowElement).find(".dt-foot td").length,
            showTdCol = function ($targetFoot) {
                if (colid) {
                    return DOMUtil.query$($targetFoot, "td[data-col='" + colid + "'])");
                } else {
                    var tbody, td, i, ilen;
                    for (i = 0, ilen = $targetFoot.length; i < ilen; i++) {
                        tbody = $targetFoot[i];
                        td = DOMUtil.query$(tbody, "td");
                        if (td[index]) {
                            td[index].style.display = "";
                        }
                    }
                }
            };

        validateFootRowLength($foot);

        if (index <= ($fixcols - 1) && $flowcols) {
            var $fixFoot = DOMUtil.query$($container, ".fix-columns .dt-foot tfoot");
            showTdCol($fixFoot);
            var outerWidth = $fixFoot.outerWidth();
            $foot.closest("table").css("margin-left", outerWidth);
        }
        else {
            index -= $fixcols;
            showTdCol($foot);
        }
    };

    FooterRow.prototype.hideColumn = function (index) {
        var colid;
        if (typeof index === "string") {
            colid = index;
        }
        var self = this,
            $container = $(self.flowElement).closest(".dt-container"),
            $foot = DOMUtil.query$($container, ".flow-container .dt-foot tfoot"),
            $fixcols = $(self.fixElement).find(".dt-foot td").length,
            $flowcols = $(self.flowElement).find(".dt-foot td").length,
            hideTdCol = function ($targetFoot) {
                if (colid) {
                    return DOMUtil.query$($targetFoot, "td[data-col='" + colid + "'])");
                } else {
                    var tbody, td, i, ilen;
                    for (i = 0, ilen = $targetFoot.length; i < ilen; i++) {
                        tbody = $targetFoot[i];
                        td = DOMUtil.query$(tbody, "td");
                        if (td[index]) {
                            td[index].style.display = "none";
                        }
                    }
                }
            };

        validateFootRowLength($foot);

        if (index <= ($fixcols - 1) && $flowcols) {

            var $fixFoot = DOMUtil.query$($container, ".fix-columns .dt-foot tfoot");
            hideTdCol($fixFoot);
            var outerWidth = $fixFoot.outerWidth();
            $foot.closest("table").css("margin-left", outerWidth);
        }
        else {
            index -= $fixcols;
            hideTdCol($foot);
        }
    };

    function FooterContainer(containerElement, srcElement, options) {
        this.containerElement = containerElement;
        this.options = options;
        this.srcElement = srcElement;
        this.row = {};
        this.initialize.call(this);
    }

    FooterContainer.prototype.initialize = function () {
        var self = this,
            $divFoot, $fixFoot,
            $foot = DOMUtil.single$(self.srcElement, "tfoot").clone(),
            $flowTable = self.srcElement, $flowTfootCells;

        DOMUtil.single$(self.srcElement, "tfoot").remove();

        if (self.containerElement.length > 1) {
            this.fixElement = self.containerElement[0];
            this.flowElement = self.containerElement[1];
        }
        else {
            this.flowElement = self.containerElement[0];
        }

        $foot.show();
        $flowTfootCells = DOMUtil.query$(this.flowElement, "tfoot th,tfoot td");
        $flowTfootCells.css({ height: "0px", padding: "0px", borderTop: 0, borderBottom: 0 });
        $flowTfootCells.text("");

        $divFoot = $("<div class='dt-foot' style='overflow:hidden'><table></table></div>").appendTo(self.flowElement);

        this.row = new FooterRow(self.containerElement);
        DOMUtil.single$($divFoot, "table").prop("class", $flowTable.prop("class")).append($foot);
        $divFoot.css("margin-right", BrowserSupport.scrollBar.width);

        if (self.options.fixedColumn === true) {
            DOMUtil.single$($divFoot, "table").css("width", self.options.innerWidth);
            DOMUtil.single$($divFoot, "table").css("max-width", self.options.innerWidth);

            $fixFoot = createFixedColumns($divFoot, "td", "dt-fix-foot", self.options.fixedColumns);
            $fixFoot.css("margin-right", "");
            $fixFoot.css("margin-top", BrowserSupport.scrollBar.height - 1);
            this.fixElement.append($fixFoot);

            var w = DOMUtil.single$($fixFoot, "table").width();
            DOMUtil.single$($fixFoot, "table").css("width", w);
            DOMUtil.single$($divFoot, "table").css("margin-left", w - 1);
            $divFoot.css("min-width", w + 200 - BrowserSupport.scrollBar.width);

            DOMUtil.adjustHeight($divFoot, $fixFoot, 1);

            if (self.options.responsive) {
                if (!BrowserSupport.isLteIE8()) {
                    DOMUtil.query$($divFoot, "table").css("table-layout", "fixed");
                    DOMUtil.query$($fixFoot, "table").css("table-layout", "fixed");
                }
            }
        }
        else {
            if (self.options.responsive) {
                var setMinWidth = function (cells, width) {
                    var i, ilen, cell;
                    for (i = 0, ilen = cells.length; i < ilen; i++) {
                        cell = cells[i];
                        if (!$(cell).css("width")) {
                            $(cell).css("min-width", width);
                        }
                    }
                };
                setMinWidth(DOMUtil.query$($divFoot, "th,td"), 40);
                DOMUtil.single$(this.flowElement, ".dt-head table").css("table-layout", "fixed");
            }
        }
    };

    FooterContainer.prototype.addScrollEvent = function (handler) {
        this.flowElement.on("scroll", ".dt-foot", handler);
    };

    FooterContainer.prototype.detachScrollEvent = function () {
        this.flowElement.off("scroll");
    };

    function HeaderView(containerElement, srcElement, options) {
        this.containerElement = containerElement;
        this.srcElement = srcElement;
        this.options = options;
        this.HeaderContainer = HeaderContainer;
        this.initialize(this);
    }

    HeaderView.prototype.initialize = function () {
        var self = this;
        self.HeaderContainer = new HeaderContainer(self.containerElement, self.srcElement, self.options);
    };

    function BodyView(containerElement, srcElement, options) {
        this.containerElement = containerElement;
        this.srcElement = srcElement;
        this.options = options;
        this.cache = DataRowCache;
        this.lastTableOffset = 0;
        this.initialize.call(this);
        var self = this;
        // TODO: resize
        if (options.resize === true) {
            $(window).on("resize", function () {
                self.resize();
            });
            $(window).resize();
        }
    }

    BodyView.prototype.initialize = function () {
        var self = this;
        if (self.containerElement.length > 1) {
            this.fixElement = self.containerElement[0];
            this.flowElement = self.containerElement[1];
        }
        else {
            this.flowElement = self.containerElement[0];
        }
        self.cache = new DataRowCache();
        self.BodyContainer = new BodyContainer(self.containerElement, self.srcElement, self.options);
        self.BodyContainer.events.render = self.render.bind(self);
    };

    BodyView.prototype.clearAllRender = function () {

        var self = this,
            i, len = self.BodyContainer.rows.length;

        for (i = 0; i < len; i++) {
            $(self.BodyContainer.rows[i].containerElement).remove();
        }

        self.BodyContainer.rows = [];
        self.BodyContainer.renderHeight = 0;
    };

    var calculateIndexScrollBar = function (self) {
        var container = self.BodyContainer,
            dataRow, i, ilen,
            sumOfHeight = container.isScrollDown ? self.options.height : 0,
            indexScrollBar = 0;
        if (container.scrollTop > 0) {
            for (i = 0, ilen = self.cache.rowids.length; i < ilen; i++) {
                dataRow = self.cache.id(self.cache.rowids[i]);
                if (dataRow.height === 0) {
                    sumOfHeight += container.templateHeight;
                } else {
                    sumOfHeight += dataRow.height;
                }

                if (sumOfHeight >= container.scrollTop) {
                    break;
                }
                indexScrollBar++;
            }
        }
        return indexScrollBar;
    };

    var removeRowHasRender = function (self) {
        var container = self.BodyContainer,
            offSetMove = 0, rowHeightRemove = 0,
            indexRowRemove = 0;

        indexRowRemove = container.isScrollDown ? 0 : (container.rows.length - 1);

        container.scrollHeight += container.isScrollDown ? container.offsetScrollbar : (container.offsetScrollbar * -1);

        while (container.scrollHeight >= self.options.height) {

            rowHeightRemove = container.removeRow(indexRowRemove);

            container.scrollHeight -= rowHeightRemove;

            offSetMove += rowHeightRemove;

            if (container.rows.length > 0) {
                indexRowRemove = container.isScrollDown ? 0 : (container.rows.length - 1);
            }
            else {
                return offSetMove;
            }
        }
        return offSetMove;
    };

    var setHeightDivScroll = function(container){
        container.selectors.$flowScroll.height(container.pageHeight);

        if (container.selectors.$fixScroll) {
            container.selectors.$fixScroll.height(container.pageHeight);
        }
    };

    var addTopOrBottomRow = function (self, indexCurrentRow, currentOffset) {
        var container = self.BodyContainer,
            nextRow,
            heightWillRender = self.options.height * 2,
            offsetMove = 0;
        while (container.renderHeight <= heightWillRender + currentOffset) {
            if (container.isScrollDown) {
                indexCurrentRow++;
                if (indexCurrentRow >= self.cache.rowids.length) {
                    break;
                }
            } else {
                indexCurrentRow--;
                if (indexCurrentRow < 0) {
                    break;
                }
            }
            nextRow = self.cache.index(indexCurrentRow);

            var actualHeight = container.insertRow(indexCurrentRow, nextRow, !container.isScrollDown);

            if(nextRow.height === 0){
                //calculate again actual height of div scroll
                container.pageHeight += (actualHeight - container.templateHeight);
                //set height for div scroll both flowContainer and fixContainer after calculate again.
                setHeightDivScroll(container);

                nextRow.height = actualHeight;

                self.cache.rows[nextRow.rowid] = nextRow;
            }

            container.renderHeight += nextRow.height;

            offsetMove -= nextRow.height;
        }
        return offsetMove;
    };

    var renderAll = function(self){
        var container = self.BodyContainer,
            i = 0,
            nextRow, heightWillRender = self.options.height * 2;

        self.clearAllRender();

        while (container.renderHeight <= heightWillRender) {
            nextRow = self.cache.index(i);
            nextRow.height = container.insertRow(i, nextRow);
            container.renderHeight += nextRow.height;
            self.cache.rows[nextRow.rowid] = nextRow;
            i++;
            if (i === self.cache.rowids.length) {
                break;
            }
        }
        self.lastTableOffset = 0;
        container.selectors.$flowTable.css("top", self.lastTableOffset);
        if (self.options.fixedColumn) {
            container.selectors.$fixTable.css({ "top": self.lastTableOffset });
        }
    };

    var renderAllWhenScrollOverload = function (self) {
        var container = self.BodyContainer,
            offsetMove = 0,
            indexScrollbar = calculateIndexScrollBar(self),
            nextRow, heightWillRender = self.options.height * 2;

        self.clearAllRender();

        while (container.renderHeight <= heightWillRender) {
            nextRow = self.cache.index(indexScrollbar);
            nextRow.height = container.insertRow(indexScrollbar, nextRow, container.isScrollDown);
            container.renderHeight += nextRow.height;
            self.cache.rows[nextRow.rowid] = nextRow;
            if (container.isScrollDown) {
                indexScrollbar--;
                if (indexScrollbar < 0) {
                    break;
                }
            } else {
                indexScrollbar++;
                if (indexScrollbar === self.cache.rowids.length) {
                    break;
                }
            }
        }
        container.scrollHeight = (Math.ceil(container.renderHeight / 2));
        offsetMove = (container.scrollTop === 0) ? 0 : (container.scrollTop - (Math.ceil(container.renderHeight / 2)));
        return offsetMove;
    };



    BodyView.prototype.render = function (options) {
        var self = this,
            owner = self.srcElement.data("aw.dataTable"),
            container = self.BodyContainer,
            rowCache, offsetScrollbar,
            tableOffset = {
                current: 0,
                last: self.lastTableOffset,
                sumary: function () {
                    return this.current + this.last;
                }
            };

        if (options.isScroll) {
            container.options.isScroll = false;

            offsetScrollbar = container.isScrollDown ? container.offsetScrollbar : (container.offsetScrollbar * -1);

            if (offsetScrollbar > container.renderHeight) {

                tableOffset.last = renderAllWhenScrollOverload(self);

            }
            else {
                rowCache = container.isScrollDown ? container.rows[container.rows.length - 1] : container.rows[0];

                var offsetRowRemove = removeRowHasRender(self),
                    indexCurrentRow = self.cache.rowids.indexOf($(rowCache.containerElement[0]).attr("data-rowid")),
                    offsetRowAdd = addTopOrBottomRow(self, indexCurrentRow, offsetRowRemove);

                tableOffset.current = container.isScrollDown ? offsetRowRemove : offsetRowAdd;
                tableOffset.last = (container.scrollTop === 0) ? 0 : tableOffset.last;
            }
        }
        else {
            var row = self.cache.id(options.rowid),
                actualHeight = 0;
            row.visible = true;
            actualHeight = container.insertRow(container.rows.length, row, false);
            if(row.height === 0){
                row.height = actualHeight;
                container.pageHeight += (actualHeight - container.templateHeight);
            }
            self.cache.rows[row.rowid] = row;
            container.renderHeight += row.height;
            if (options.isFocus === true) {
                setFocus(row, owner);
            }
        }

        self.lastTableOffset = tableOffset.sumary();

        container.selectors.$flowTable.css("top", self.lastTableOffset);
        if (self.options.fixedColumn) {
            container.selectors.$fixTable.css({ "top": self.lastTableOffset });
        }
    };

    BodyView.prototype.renderRows = function (options) {
        var self = this,
            owner = self.srcElement.data("aw.dataTable"),
            container = self.BodyContainer,
            i, ilen;

        for (i = 0, ilen = self.cache.rowids.length; i < ilen; i++) {
            var row = self.cache.id(self.cache.rowids[i]);
            row.visible = true;
            if (container.renderHeight <= self.options.height * 2) {
                row.height = container.insertRow(container.rows.length, row);
                container.renderHeight += row.height;
                container.pageHeight += row.height;
            }else{
                container.pageHeight += container.templateHeight;
            }
            self.cache.rows[row.rowid] = row;
        }
        if (options.isFocus === true) {
            setFocus(self.cache.index(0), owner);
        }
        setHeightDivScroll(container);
    };

    BodyView.prototype.addRow = function (operation, isFocus) {
        var self = this,
            cloneitem = self.BodyContainer.cloneTemplateItem(),
            $fixItem = cloneitem[0],
            $item = cloneitem[1],
            $container = self.srcElement.closest(".dt-container"),
            row;

        hideSortIcons($container);

        if (operation) {
            $item = operation($item.add($fixItem));
        }
        $item.removeClass("item-tmpl");
        $item.addClass("new");
        $item.show();
        row = new DataRow($item);

        self.cache.add(row);
        $item.attr("data-rowid", row.rowid);
        this.render({
            rowid: row.rowid,
            isFocus: isFocus
        });
    };

    BodyView.prototype.addRows = function (data, operation, isFocus) {
        var self = this,
            container = self.BodyContainer,
            $container = container.selectors.$flowTable.closest(".dt-container"),
            $item, $fixItem, row, index, ilen, item;

        hideSortIcons($container);
        for (index = 0, ilen = data.length; index < ilen; index++) {
            var cloneitem = container.cloneTemplateItem();
            $fixItem = cloneitem[0];
            $item = cloneitem[1];

            item = data[index];
            $item.__index = index;
            if (operation) {
                $item = operation($item.add($fixItem), item);
            }

            $item.removeClass("item-tmpl");
            $item.addClass("new");
            $item.show();
            row = new DataRow($item);

            self.cache.add(row);
            $item.attr("data-rowid", row.rowid);
            if (index === ilen - 1) {
                this.renderRows({
                    isFocus: isFocus
                });
            }
        }
    };

    BodyView.prototype.getRow = function (target) {
        var self = this,
            $target = $(target),
            $selectItem = $target.closest("tbody"),
            rowid = $selectItem.attr("data-rowid"),
            row = self.cache.id(rowid);
        return row;
    };

    BodyView.prototype.enableRowCount = function () {
        var self = this;
        return self.cache.rowids.length;
    };

    BodyView.prototype.selectRow = function (target) {
        var self = this,
            $target = $(target),
            $selectItem = $target.closest("tbody");
        self.flowElement.find(".select-tab").removeClass("selected");
        $selectItem.find(".select-tab").addClass("selected");
    };

    BodyView.prototype.updateRow = function (data, target) {
        var self = this,
            $target = $(target),
            $selectItem = $target.closest("tbody"),
            rowid = $selectItem.attr("data-rowid");
        Object.keys(data).forEach(function (key) {
            self.cache.id(rowid)[key] = data[key];
        });
    };

    BodyView.prototype.deleteRow = function (target, operation) {
        var self = this,
            container = self.BodyContainer,
            $target = $(target),
            $selectedItem = $target.closest("tbody"),
            rowid, row;

        rowid = $selectedItem.attr("data-rowid");
        row = self.cache.id(rowid);

        if (App.isFunc(operation)) {
            operation(row.element);
        }

        //call removeRow from BodyContainer
        var targetIndex = container.getRowIndex(rowid);

        container.pageHeight -= container.removeRow(targetIndex);

        setHeightDivScroll(container);

        self.cache.remove(rowid);

        if (container.rows.length <= 0) {
            return;
        }

        var lastRow = container.rows[container.rows.length - 1],
            indexCurrentRow = self.cache.rowids.indexOf($(lastRow.containerElement[0]).attr("data-rowid")),
            nextIndex = indexCurrentRow + 1,
            nextRow = self.cache.index(nextIndex);

        if (!nextRow) {
            return;
        }

        self.render({
            isScroll: false,
            isFocus: false,
            rowid: nextRow.rowid
        });
    };

    BodyView.prototype.clear = function () {
        var self = this,
            $container = self.srcElement.closest(".dt-container"),
            container = self.BodyContainer,
            i, len = container.rows.length;

        hideSortIcons($container);
        for (i = 0; i < len; i++) {
            $(container.rows[i].containerElement).remove();
        }
        self.cache = new DataRowCache();
        self.BodyContainer.rows = [];
        self.BodyContainer.clear();
    };

    BodyView.prototype.showColumn = function (index) {
        var rows = this.BodyContainer.rows;
        $.each(rows, function (i) {
            rows[i].showColumn(index);
        });
    };

    BodyView.prototype.hideColumn = function (index) {
        var rows = this.BodyContainer.rows;
        this.BodyContainer.flowElement.find(".dt-body thead tr th")[index - 1].style.display = "none";
        $.each(rows, function (i) {
            rows[i].hideColumn(index);
        });
    };

    BodyView.prototype.sort = function (propertyName, desc) {
        var modes = {
            none: 0,
            ascend: 1,
            descend: 2
        },
            self = this,
            valOrText = function (datarow, prop) {
                var target, val, formatAttr;

                if (App.isUndefOrNull(prop)) {
                    return;
                }

                target = datarow.element[0].querySelector("[data-prop='" + prop + "']");
                if (!target && datarow.element.length > 1) {
                    target = datarow.element[1].querySelector("[data-prop='" + prop + "']");
                }

                val = target.value || target.innerText;
                formatAttr = target.getAttribute("data-format");

                if (self.options.parse && self.options.parse.converteByFormatDataAnnotation && formatAttr) {
                    val = self.options.parse.converteByFormatDataAnnotation(formatAttr, $(target), val);
                }

                if (val && val !== "") {
                    return val;
                }

                return target.innerText;
            },
            isNum = function (aTarget, bTarget) {
                return (Object.prototype.toString.call(aTarget) === "[object Number]") &&
                    (Object.prototype.toString.call(bTarget) === "[object Number]");
            },
            isDate = function (aTarget, bTarget) {
                return (Object.prototype.toString.call(aTarget) === "[object Date]") &&
                    (Object.prototype.toString.call(bTarget) === "[object Date]");
            },
            compareRow = function (a, b) {
                var values = {};
                values.a = valOrText(a, propertyName);
                values.b = valOrText(b, propertyName);

                if (desc === modes.ascend) {
                    if (isNum(values.a, values.b)) {
                        return values.a - values.b;
                    } else if (isDate(values.a, values.b)) {
                        return values.a.getTime() - values.b.getTime();
                    } else {
                        return (values.a < values.b) ? -1 : 1;
                    }
                }
                else {
                    if (isNum(values.a, values.b)) {
                        return values.b - values.a;
                    } else if (isDate(values.a, values.b)) {
                        return values.b.getTime() - values.a.getTime();
                    } else {
                        return (values.a > values.b) ? -1 : 1;
                    }
                }
            };

        self.cache.rowids.sort(function (x, y) {
            self.BodyContainer.clear();
            return compareRow(self.cache.id(x), self.cache.id(y));
        });

        self.BodyContainer.clear();

        if (self.cache.rowids.length > 0) {
            renderAll(self);
        }
    };

    BodyView.prototype.resize = function () {
        var self = this,
            $container = self.flowElement.closest(".dt-container"),
            $divBody = DOMUtil.single$(self.flowElement, ".dt-body"),
            $fixBody = DOMUtil.single$(self.fixElement, ".dt-body");

        if ($divBody.css("overflow-y") !== "scroll") {
            return;
        }

        if (!self._globalLock++) {
            setTimeout(function () {
                var offsetTop = $divBody.offset().top,
                    currentHeight = $(window).height(),
                    fooHeight = DOMUtil.query$($container, ".dt-foot").height(),
                    bodyHeight = currentHeight - offsetTop - fooHeight - (self.options.resizeOffset + self.options.addedOffset);

                if (bodyHeight < self.options.height) {

                    $divBody.height(bodyHeight);
                    if (self.options.fixedColumn === true) {
                        $fixBody.height(bodyHeight - 17);
                    }
                    $divBody.closest(".part").css("margin-bottom", "0px");
                } else {
                    $divBody.height(self.options.height);
                    if (self.options.fixedColumn === true) {
                        $fixBody.height(self.options.height - 17);
                    }
                    $divBody.closest(".part").css("margin-bottom", "32px");
                }
                setTimeout(function () { self._globalLock = 0; }, 0);
            }, 5);
        }
    };

    BodyView.prototype.each = function (operation) {
        var key, row, i = 0,
            self = this;
        for (key in self.cache.rows) {
            ++i;

            row = self.cache.rows[key];
            if (row.element.is(".item-tmpl")) {
                continue;
            }

            if (operation(row, i)) {
                break;
            }
        }
    };

    BodyView.prototype.filter = function (operation) {
        var self = this,
            key, i = 0, row;
        for (key in self.cache.rows) {
            ++i;
            row = self.cache.rows[key];

            if (row.element.is(".item-tmpl")) {
                continue;
            }

            if (operation(row, i)) {
                break;
            }
        }
    };

    BodyView.prototype.setFocus = function (target) {
        var self = this,
            container = self.BodyContainer,
            $tbody = $(target).closest("tbody"),
            id = $tbody.attr("data-rowid"),
            targetRowCache = self.cache.id(id),
            prop = $(target).attr("data-prop");

        if ($tbody.length === 0 || !targetRowCache) {
            return false;
        }

        var scrollTop = 0, i, len,
            cacheRows = $.map(self.cache.rows, function (value) {
                return [value];
            });

        for (i = 0, len = cacheRows.length; i < len; i++) {
            if (cacheRows[i].rowid === id) {
                break;
            }
            scrollTop += cacheRows[i].height;
        }
        container.selectors.$divBody.scrollTop(scrollTop);

        setTimeout(function () {
            targetRowCache.element.findP(prop).focus();
        }, 0);

        return true;
    };

    function FooterView(containerElement, srcElement, options) {
        this.containerElement = containerElement;
        this.srcElement = srcElement;
        this.options = options;
        this.FooterContainer = FooterContainer;
        this.initialize.call(this);
    }

    FooterView.prototype.initialize = function () {
        var self = this;
        self.FooterContainer = new FooterContainer(self.containerElement, self.srcElement, self.options);
    };

    function DataTable(element, options) {
        this._globalLock = 0;
        this.options = {};
        this.element = $(element);
        this.originalElement = this.element.clone();
        this.cache = new DataRowCache();
        this.pageTop = 0;
        this.pageBottom = 0;
        this.selectedRowElement = null;
        this.lastSelectedRowElement = {};
        this.modules = {
            HeaderView: HeaderView,
            BodyView: BodyView,
            FooterView: FooterView
        };
        this.selectors = {
            thead: ".dt-head",
            tbody: ".dt-body",
            tfoot: ".dt-foot",
            scrollContainer: ".scroll-container",
            flowContainer: ".flow-container",
            fixColumns: ".fix-columns",
            container: ".dt-container"
        };

        this.options = $.extend({}, DataTable.DEFAULTS, options);
        this.initialize.call(this, this.options);
    }

    DataTable.DEFAULTS = {
        height: "100%",
        innerWidth: 2000,
        fixedColumn: false,
        fixedColumns: 0,
        sortable: false,
        footer: false,
        resize: false,
        resizeOffset: 110,
        addedOffset: 0,
        responsive: true,
        onchange: function () { },
        onsorting: function () { },
        onsorted: function () { },
        onselecting: function () { },
        onselected: function () { },
        ontabing: function () { },
        ontabed: function () { },

        /**
            * DataTable's module settings.
            */
        modules: {
            HeaderView: HeaderView,
            BodyView: BodyView,
            FooterView: FooterView
        }
    };

    DataTable.prototype.initialize = function (options) {
        var self = this,
            $body = self.element,
            $container = $body.wrap("<div class='dt-container'></div>").parent(),  // eslint-disable-line no-unused-vars
            $flowElement = $body.wrap("<div class='flow-container'></div>").parent(),
            $fixElement, cotainerElements = [$flowElement];

        if (options.fixedColumn === true) {
            $fixElement = $("<div class='fix-columns'></div>");
            $fixElement.insertBefore($flowElement);
            cotainerElements.unshift($fixElement);
        }

        self.modules.HeaderView = new HeaderView(cotainerElements, $body, options);
        self.modules.FooterView = new FooterView(cotainerElements, $body, options);
        self.modules.BodyView = new BodyView(cotainerElements, $body, options);
    };

    DataTable.prototype.filter = function (operation) {
        this.data("aw.dataTable").modules.BodyView.filter(operation);
    };

    DataTable.prototype.enableRowCount = function (operation) {
        this.data("aw.dataTable").modules.BodyView.enableRowCount(operation);
    };

    DataTable.prototype.addRow = function (data, isFocus) {
        this.data("aw.dataTable").modules.BodyView.addRow(data, isFocus);
    };

    DataTable.prototype.addRows = function (data, operation, isFocus) {
        this.data("aw.dataTable").modules.BodyView.addRows(data, operation, isFocus);
    };

    DataTable.prototype.getRow = function (target, operation) {
        operation(this.data("aw.dataTable").modules.BodyView.getRow(target));
    };

    DataTable.prototype.clear = function () {
        this.data("aw.dataTable").modules.BodyView.clear();
        this.selectedRowElement = undefined;
        this.lastSelectedRowElement = undefined;
    };

    DataTable.prototype.showColumn = function (index) {
        this.data("aw.dataTable").modules.BodyView.showColumn(index);
        this.data("aw.dataTable").modules.HeaderView.HeaderContainer.row.showColumn(index);
    };

    DataTable.prototype.deleteRow = function (target, operation) {
        this.data("aw.dataTable").modules.BodyView.deleteRow(target, operation);
        this.lastSelectedRowElement = undefined;
    };

    DataTable.prototype.each = function (operation) {
        this.data("aw.dataTable").modules.BodyView.each(operation);
    };

    DataTable.prototype.selectedRow = function (operation) {
        operation(this.data("aw.dataTable").selectedRowElement);
    };

    DataTable.prototype.lastSelectedRow = function (operation) {
        operation(this.data("aw.dataTable").lastSelectedRowElement);
    };

    DataTable.prototype.showWait = function () {
        this.data("aw.dataTable").modules.HeaderView.HeaderContainer.showWait();
    };

    DataTable.prototype.hideWait = function () {
        this.data("aw.dataTable").modules.HeaderView.HeaderContainer.hideWait();
    };

    DataTable.prototype.setFocus = function (target) {
        this.data("aw.dataTable").modules.BodyView.setFocus(target);
    };

    $.fn.dataTable = function (options) {
        var args = arguments;
        return this.each(function () {

            var $self = $(this),
                data = $self.data("aw.dataTable");

            if (!data) {
                $self.data("aw.dataTable", (data = new DataTable($self, options)));
            }

            if (typeof options === "string") {
                data[options].apply($self, Array.prototype.slice.call(args, 1).concat(data));
            }
        });
    };

    $.fn.dataTable.Constructor = DataTable;

    global.DOMUtil = DOMUtil;
    global.BrowserSupport = BrowserSupport;
    global.HeaderView = HeaderView;
    global.HeaderContainer = HeaderContainer;
    global.HeaderRow = HeaderRow;
    global.BodyView = BodyView;
    global.BodyContainer = BodyContainer;
    global.BodyRow = BodyRow;
    global.FooterView = FooterView;
    global.FooterContainer = FooterContainer;
    global.FooterRow = FooterRow;

})(this, jQuery);
