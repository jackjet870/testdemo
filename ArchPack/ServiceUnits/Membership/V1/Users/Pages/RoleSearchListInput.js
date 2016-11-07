; (function () {
    /**
    * ページのレイアウト構造に対応するオブジェクトを定義します。
    */
    var page = {
        //TODO: ページのレイアウト構造に対応するオブジェクト定義を記述します。
        options: {
            skip: 0,                                // TODO:先頭からスキップするデータ数を指定します。
            top: App.settings.base.dataTakeCount,   // TODO:取得するデータ数を指定します。
            urls: {
                data: "/Membership/V1/Users/api/Roles",
                editPage: "/Membership/V1/Users/Page/RoleHeaderDetail",
                encrypt: "/Membership/V1/Users/api/Crypto/Encrypt"
            },
            messages: App.str.text("Messages"),
            strings: App.str.text("StringContents")
        },
        values: {},
        events: {
            defaults: {
                initialize: {},
                getParameters: {},
                setErrorFocus: {},
                initializeControl: {},
                initializeControlEvent: {},
                loadMasterData: {},
                loadData: {},
                loadDialogs: {},
                createValidator: {},
                validateAll: {}
            },
        },
        //ユーザ操作イベント
        operations: {
            defaults: {
                save: {},
                remove: {}
            }
        },
        //単票形式のヘッダ
        header: {
            options: {
                urls: {},
                validations: {},
                bindOption: {}
            },
            values: {},
            events: {
                defaults: {
                    initialize: {},
                    createFilter: {},
                    change: {}
                },
            },
            operations: {
                defaults: {
                    search: {}
                }
            }
        },
        //テーブル形式の検索結果一覧
        detail: {
            options: {
                urls: {},
                validations: {},
                bindOption: {}
            },
            values: {},
            events: {
                defaults: {
                    initialize: {},
                    bindRow: {},
                    change: {},
                    bind: {},
                    validateList: {},
                    validateListCount: {},
                    validateDetails: {},                    
                }
            },
            operations: {
                select: {},
                addNewItem: {},
                deleteItem: {},
                transfer: {},
                nextsearch: {},
            }
        },
        footer: {
            options: {},
            events: {}
        },
        dialogs: {
        }
    };



    /**
     * Window を閉じる際のイベントを定義します。
     * @return 文字列を返却した場合に確認メッセージが表示されます。
     */
    //App.ui.page.onclose = function () {

    //    var detail,
    //        closeMessage = App.messages.base.exit;

    //    //if (page.header.data) {
    //    //    header = page.header.data.getChangeSet();
    //    //    if (header.created.length || header.updated.length || header.deleted.length) {
    //    //        return closeMessage;
    //    //    }
    //    //}
    //    if (page.detail.data) {
    //        detail = page.detail.data.getChangeSet();
    //        if (detail.created.length || detail.updated.length || detail.deleted.length) {
    //            return closeMessage;
    //        }
    //    }
    //};

    /**
     * TODO: 確認ダイアログを表示します
     * param options 
     *    title: タイトル,
     *    text: 確認メッセージ,
     *    ok: OKボタン表示名,
     *    cancel: Cancelボタン表示名
    

    /**
    * 画面の初期化処理を行います。
    */
    page.events.defaults.initialize = function () {

        page.notify = App.ui.page.notify(page.events.defaults.setErrorFocus);
        App.ui.loading.show();

        page.events.defaults.getParameters();

        page.events.defaults.initializeControl();
        page.events.defaults.initializeControlEvent();

        page.header.events.defaults.initialize();
        page.detail.events.defaults.initialize();

        //TODO: ヘッダー/明細以外の初期化の処理を記述します。
        page.events.defaults.loadMasterData().then(function (result) {
            //TODO: マスターデータ取得成功時の処理を記述します。

            //マスターデータ以外の取得処理を実行します。
            return page.events.defaults.loadData();

        }).then(function () {

            return page.events.defaults.loadDialogs();

        }).then(function (result) {
            //TODO: 画面の初期化処理成功時の処理を記述します。

        }).fail(function (error) {
            App.ui.page.normalizeError(error).forEach(function (e) {
                page.notify.alert.message(e.message).show();
            });
        }).always(function (result) {
            $(":input:visible:not(:disabled):first").focus();
            App.ui.loading.close();
        });
    };

    /**
     * 遷移元から渡されたパラメーターの取得を行います。
     */
    page.events.defaults.getParameters = function () {
        //TODO: 遷移元から渡された値を取得し、保持する処理を記述します。
        //var query = App.uri.splitQuery(location.search);
    };

    /**
     * 画面コントロールの初期化処理を行います。
     */
    

    /**
     * バリデーションエラー時にフォーカス移動先がヘッダか明細かによってフォーカス移動先を指定します。
     */
    page.events.defaults.setErrorFocus = function (target) {

        if ($(target).closest(".datatable").length) {
            page.detail.dataTable.dataTable("setFocus", target);
        } else {
            $(target).focus();
        }
    };

    /**
     * 画面コントロールの初期化処理を行います。
     */
    page.events.defaults.initializeControl = function () {

        //TODO: 画面全体で利用するコントロールの初期化処理をここに記述します。
        var title = page.options.strings.RoleSearhListInput;
        $(".page-title").text(title);
        document.title = title;
    };

    /**
     * コントロールへのイベントの紐づけを行います。
     */
    page.events.defaults.initializeControlEvent = function () {

        App.ui.page.applyCollapsePanel();
        //TODO: 画面全体で利用するコントロールのイベントの紐づけ処理をここに記述します。
        page.on($("#save"), "click", page.operations.defaults.save);
        page.on($("#search"), "click", { message: "検索処理を実行します" }, page.header.operations.defaults.search);

    };

    /**
    * マスターデータのロード処理を実行します。
    */
    page.events.defaults.loadMasterData = function () {

        //TODO: 画面内のドロップダウンなどで利用されるマスターデータを取得し、画面にバインドする処理を記述します。
        return App.async.all({
            //service: $.ajax(App.ajax.webapi.get(/*TODO: マスターデータ取得サービスの URL*/))
        }).then(function (result) {
            //TODO:マスターデータ取得成功時のデータ設定処理を記述します
            var data = result.successes;

            //var serviceData = data.service;
        });
    };

    /**
     * 画面で処理の対象とするデータのロード処理を実行します。
     */
    page.events.defaults.loadData = function () {

        //TODO: URLパラメーターで渡された値を確認します。

        //TODO: 画面内の処理の対象となるデータを取得し、画面にバインドする処理を記述します。
        page.header.events.defaults.bind({}, true);
        page.detail.events.defaults.bind([], true);
        return App.async.success();
    };

    /**
     * 画面で利用するダイアログのロード処理を実行します。
     */
    page.events.defaults.loadDialogs = function () {

        //return $.get(/* ダイアログの URL */)
        //    .then(function (result) {
        //        $("#dialog-container").append(result);
        //        //TODO: ページのレイアウト構造に対応するオブジェクトに紐づけます。
        //        //dialogs.searchModal = searchModal;
        //        //dialogs.searchModal.events.defaults.initialize();
        //    });

        return App.async.success();
    };

    page.events.defaults.createValidator = function (target, options) {
        page.events.defaults.validationSuccess =
           page.events.defaults.validationSuccess || App.ui.page.validationSuccess(page.notify);
        page.events.defaults.validationFail =
            page.events.defaults.validationFail || App.ui.page.validationFail(page.notify);
        page.events.defaults.validationAlways =
            page.events.defaults.validationAlways || App.ui.page.validationAlways(page.notify);

        return App.validation(target, options || {
            success: page.events.defaults.validationSuccess,
            fail: page.events.defaults.validationFail,
            always: page.events.defaults.validationAlways
        });
    };

    page.events.defaults.validateAll = function () {

        var validations = [];

        validations.push(page.header.validator.validate());
        validations.push(page.detail.events.defaults.validateList());

        //TODO: 画面内で定義されているバリデーションを実行する処理を記述します。

        return App.async.all(validations);
    };

    page.operations.defaults.save = function () {

        App.ui.loading.show();
        page.notify.alert.clear();
        page.notify.info.clear();

        return page.detail.events.defaults.validateDetails().then(function () {

            var entityId = page.header.element.attr("data-key"),
               entity = page.header.data.entry(entityId),
               changeSets;

            //changeSets = {
            //    Header: page.header.data.getChangeSet(),
            //    Detail: page.detail.data.getChangeSet()
            //};

            //TODO: データの保存処理をここに記述します。
            return $.ajax(App.ajax.webapi.post(page.options.urls.data, page.detail.data.getChangeSet()))
                    .then(function (result) {

                        //TODO: データの保存成功時の処理をここに記述します。

                        //if (result.Header.length) {
                        //    page.values.ryohi_id = result.Header[0].RyohiId;
                        //} else {
                        //    page.values.ryohi_id = page.header.data.find(function () { return true; }).RyohiId;
                        //}

                        page.notify.alert.clear();
                        page.notify.info.clear();

                        //最後に再度データを取得しなおします。
                        page.header.operations.defaults.search();

                        page.notify.info.message(page.options.messages.SaveCompleted).show();

                    }).fail(function (error) {
                        //データの保存失敗時の処理をここに記述します。
                        var normalizedErrors = App.ui.page.normalizeError(error);

                        var normalizedError = normalizedErrors[0];
                        if (normalizedError) {
                            //TODO: バリデーションエラーの処理を行います。
                            if (normalizedError.errorType === App.settings.base.errorTypes.inputError) {
                                return;
                            }
                            //同時実行エラー時の処理を行っています。
                            if (normalizedError.errorType === App.settings.base.errorTypes.conflictError) {
                                // 既定では、メッセージを表示します。
                                page.notify.alert.message(page.options.messages.UpdateConfilict + page.options.messages.RequestSearchAgain).show();
                                return;
                            }
                        }

                        page.notify.alert.message(page.options.messages.SaveFailed).show();

                        //normalizedErrors.forEach(function (e) {
                        //    page.notify.alert.message(e.message).show();
                        //});

                    });

        }).always(function () {
            setTimeout(function () {
                page.header.element.find(":input:first").focus();
            }, 100);
            App.ui.loading.close();
        });
    };

    //TODO: 以下の page.header の各宣言は画面仕様ごとにことなるため、
    //不要の場合は削除してください。

    /**
     * 画面ヘッダーのバリデーションを定義します。
     */
    page.header.options.validations = {
        //TODO: 画面ヘッダーのバリデーションの定義を記述します。
    };

    page.header.options.bindOption = {
        // TODO: 画面項目に値を設定する際に処理を追加します。
        appliers: {},
        // TODO: 画面項目から値を取得する際に処理を追加します。
        converters: {}
    };


    /**
    * 画面ヘッダーの初期化処理を行います。
    */
    page.header.events.defaults.initialize = function () {

        var element = $(".header");
        page.header.validator = element.validation(page.events.defaults.createValidator(page.header.options.validations), {
            immediate: true
        });

        page.on(element, "change", ":input", page.header.events.defaults.change);
        page.header.element = element;

        //TODO: 画面ヘッダーの初期化処理をここに記述します。
        //TODO: 画面ヘッダーで利用するコントロールのイベントの紐づけ処理をここに記述します。
        //page.on(element, "click", "#search", page.header.operations.defaults.search);
    };

    /**
     * 画面ヘッダーにある入力項目の変更イベントの処理を行います。
     */
    page.header.events.defaults.change = function (e) {
        var element = page.header.element,
            target = $(e.target),
            entityId = element.attr("data-key"),
            property = target.attr("data-prop"),
            entity = page.header.data.entry(entityId),
            data = element.form().data();

        element.validation().validate({
            targets: target
        }).then(function () {
            entity[property] = data[property];
            page.header.data.update(entity);
        });

        if ($("#nextsearch").is(":visible")) {
            $("#nextsearch").hide();
            page.notify.info.message(page.options.messages.HasChangeSearchCriteria).show();
        }
    };

    /**
    * 検索条件のフィルターを定義します。
    */
    page.header.events.defaults.createFilter = function () {
        var criteria = page.header.element.form().data(),
            filters = [];

        if (!App.isUndefOrNull(criteria.RoleName) && criteria.RoleName.length > 0) {
            filters.push("contains(RoleName, '" + encodeURIComponent(criteria.RoleName) + "') eq true");
        }

        return filters.join(" and ");
    };


    /**
     * 検索処理を定義します。
     */
    page.header.operations.defaults.search = function () {

        var query;

        return page.header.validator.validate().then(function () {

            var url;

            App.ui.loading.show();
            page.notify.alert.clear();

            page.options.skip = 0;
            page.options.filter = page.header.events.defaults.createFilter();

            query = {
                url: page.options.urls.data,
                filter: page.options.filter,
                skip: page.options.skip,
                top: page.options.top,
                count: true
            };

            return $.ajax(App.ajax.webapi.get(App.data.toODataFormat(query)))
            .then(function (result) {
                page.detail.events.defaults.bind(result);
                App.ui.loading.close();
            }, function (error) {
                App.ui.page.normalizeError(error).forEach(function (e) {
                    page.notify.alert.message(e.message).show();
                });
                App.ui.loading.close();
            });
        });
    };

    //TODO: 以下の page.detail の各宣言は画面仕様ごとにことなるため、
    //不要の場合は削除してください。


    /**
     * 画面明細のバリデーションを定義します。
     */
    page.detail.options.validations = {
        //TODO: 画面明細のバリデーションの定義を記述します。
        RoleName: {
            rules: {
                required: true,
                maxlength: 50
            },
            options: {
                name: "ロール名"
            },
            messages: {
                required: page.options.messages.Required,
                maxlength: page.options.messages.MaxLength
            }
        }
    };

    /**
     * 画面明細のデータを設定する際のオプションを定義します。
     */
    page.detail.options.bindOption = {
        appliers: {
        }
    };


    /**
     * 画面明細の初期化処理を行います。
     */
    page.detail.events.defaults.initialize = function () {

        var element = $(".detail"),
            table = element.find(".datatable"),
            datatable = table.dataTable({
                height: 300,
                //TODO: データテーブルでソート機能を利用しない場合はfalseを指定します。
                sortable: true,
                //TODO: 列固定を行う場合は以下を有効にします。
                //TODO: dataTable作成時に固定列の有効化を設定します。
                fixedColumn: false,
                //TODO: 先頭から固定する列数(1以上)を指定します。
                //fixedColumns: 1,
                //TODO: スクロール列の横幅を指定します。
                innerWidth: 1000,
                onselect: page.detail.operations.select,
                onchange: page.detail.events.defaults.change,
                resize: false
            });

        page.detail.validator = element.validation(page.events.defaults.createValidator(page.detail.options.validations));
        page.detail.element = element;
        page.detail.dataTable = datatable;

        var dataSet = App.ui.page.dataSet();
        page.detail.data = dataSet;

        element.find(".data-take-count").text(page.options.top);
        page.on(element, "click", "#nextsearch", page.detail.operations.nextsearch);
        page.on(element, "click", "#add-item", page.detail.operations.addNewItem);
        page.on(element, "click", "#del-item", page.detail.operations.deleteItem);

        //TODO: 検索結果一覧の初期化処理をここに記述します。
        //TODO: 検索結果一覧で利用するコントロールのイベントの紐づけ処理をここに記述します。
    };


    /**
     * 画面明細へのデータバインド処理を行います。
     */
    page.detail.events.defaults.bind = function (data, isNewData) {
        var element = page.detail.element,
            i, l, item,
            dataSet = App.ui.page.dataSet();

        totalCount = App.isNum(data.Count) ? data.Count : "-";

        data = (data.Items) ? data.Items : data

        count = (data.length || 0) + page.options.skip;

        if (page.options.skip === 0) {
            dataSet = App.ui.page.dataSet();
            $("#nextsearch").hide();
            page.detail.dataTable.dataTable("clear");
        } else {
            dataSet = page.detail.data;
        }
        page.detail.data = dataSet;

        page.detail.dataTable.dataTable("addRows", data, function (row, item) {
            (isNewData ? dataSet.add : dataSet.attach).bind(dataSet)(item);
            row.form(page.detail.options.bindOption).bind(item);
            App.ui.page.applyInput(row);
            //Encrypt parameters
            var parameters = [item.RoleId];
            $.ajax(App.ajax.webapi.post(page.options.urls.encrypt, parameters)
            ).then(function (result) {
                row.find(".transfer ").attr("href", App.uri.setQuery(page.options.urls.editPage, {
                    role_id: result[0]
                    //role_id: item.RoleId
                }));
            });          

            return row;
        });

        //取得件数および全件数を設定します。
        $(".data-count").text(count);
        $(".data-count-total").text(totalCount);

        page.options.skip = count;
        $("#nextsearch").show();
        if (!App.isNum(totalCount) || totalCount <= count) {
            $("#nextsearch").hide();
        }
        if (page.options.skip >= App.settings.base.maxSearchDataCount) {
            page.notify.info.message(page.options.messages.TooManyData).show();
            $("#nextsearch").hide();
        }

        //TODO: 画面明細へのデータバインド処理をここに記述します。

        //バリデーションを実行します。
        page.detail.events.defaults.validateList(true);
    };

    /**
     * 画面明細の一覧の入力項目の変更イベントの処理を行います。
     */
    page.detail.events.defaults.change = function (e, row) {
        var target = $(e.target),
            id = row.element.attr("data-key"),
            propertyName = target.attr("data-prop"),
            entity = page.detail.data.entry(id);

        page.detail.validator.validate({
            targets: target,
            state: {
                dataTable: page.detail.dataTable,
                isGridValidation: true
            }
        }).then(function () {
            entity[propertyName] = row.element.form(page.detail.options.bindOption).data()[propertyName];
            page.detail.data.update(entity);
        })
    };


    /**
    * 次のレコードを検索する処理を定義します。
    */
    page.detail.operations.nextsearch = function () {
        App.ui.loading.show();
        page.notify.alert.clear();

        var query = {
            url: page.options.urls.data,
            filter: page.options.filter,
            skip: page.options.skip,
            top: page.options.top,
            count: true
        };

        return $.ajax(App.ajax.webapi.get(App.data.toODataFormat(query)))
        .then(function (result) {
            page.detail.events.defaults.bind(result);
            App.ui.loading.close();
        }).fail( function (error) {
            App.ui.page.normalizeError(error).forEach(function (e) {
                page.notify.alert.message(e.message).show();
            });
            App.ui.loading.close();
        });
    };


    /**
     * 画面明細の一覧のバリデーションを実行します。
     */
    page.detail.events.defaults.validateList = function (suppressMessage) {

        var validations = [];

        page.detail.dataTable.dataTable("each", function (row, index) {
            if (row.element.hasClass("item-tmpl")) {
                return;
            }

            validations.push(page.detail.validator.validate({
                targets: row.element.find(":input"),
                state: {
                    suppressMessage: suppressMessage,
                    tbody: row.element,
                    isGridValidation: true
                }
            }));
        });

        return App.async.all(validations);
    };

    /**
     * 明細に1件以上追加されているかどうかを検証します。
     */
    page.detail.events.defaults.validateListCount = function () {
        var rowCount = 0;
        page.detail.dataTable.dataTable("each", function (row, index) {
            if (row.element.hasClass("item-tmpl")) {
                return;
            }
            rowCount++;
        });

        if (!page.detail.data.isChanged() && rowCount === 0) {
            page.notify.alert.message(page.options.messages.DetailRowNotFound).show();
            return App.async.fail();
        }

        return App.async.success();
    };

    /**
     * 明細の検証を実行します。
     */
    page.detail.events.defaults.validateDetails = function () {
        var validations = [];

        validations.push(page.detail.events.defaults.validateList());
        validations.push(page.detail.events.defaults.validateListCount());

        return App.async.all(validations);
    };

    /**
    * 画面明細の一覧で選択されている行とデータを削除します。
    */
    page.detail.operations.deleteItem = function (e) {

        var selectedRow;
        page.detail.dataTable.dataTable("lastSelectedRow", function (item) { selectedRow = item; });

        if (!selectedRow || !selectedRow.element) {
            page.notify.info.message(page.options.messages.RemoveNotSletcted).show();
            return;
        }

        App.ui.page.confirm({
            // TODO:明細行を削除する際のメッセージを設定します
            text: page.options.messages.ConfirmDeleteDetail,
        }).then(function () {
            selectedRow.element.find(":input").each(function (i, elem) {
                page.notify.alert.remove(elem);
            });
            var indexSelectedRow = $(selectedRow.element).index()                ,
                preIndexRow = 0,
                enableRowCount = 0,
                previousRow;
            page.detail.dataTable.dataTable("enableRowCount", function (count) {
                enableRowCount = count + 2;
            });
            if (indexSelectedRow < enableRowCount) {
                preIndexRow = indexSelectedRow - 1;
            } else{
                preIndexRow = indexSelectedRow - 3;
            }
            previousRow = $(".datatable tbody:eq(" + (preIndexRow) + ")");            
            page.detail.dataTable.dataTable("deleteRow", selectedRow.element, function (row) {
                var id = row.attr("data-key");
                if (!App.isUndefOrNull(id)) {
                    var entity = page.detail.data.entry(id);
                    page.detail.data.remove(entity);                   
                    previousRow.click();
                }
            });
        });
    };

    /**
    * 検索結果一覧に新規データを追加します。
    */
    page.detail.operations.addNewItem = function () {
        //TODO:新規データおよび初期値を設定する処理を記述します。
        var newData = {};
        page.detail.data.add(newData);

        page.detail.dataTable.dataTable("addRow", function (tbody) {
            tbody.form(page.detail.options.bindOption).bind(newData);
            if (!tbody.findP("RoleId").val()) {
                tbody.find(".transfer").hide();
            }
            App.ui.page.applyInput(tbody);            
            return tbody;
        }, true);

        page.detail.dataTable.dataTable("enableRowCount", function (count) {
            $(".datatable tbody:eq(" + count + ")").click();
        })
    };

    /**
     * 単項目要素をエラーのスタイルに設定します。
     * @param target 設定する要素
     */
    page.events.setColInvalidStyle = function (target) {
        var $target,
            nextColStyleChange = function (target) {
                var next;
                if (target.hasClass("with-next-col")) {
                    next = $target.next();
                    if (next.length) {
                        next.addClass("control-required");
                        next.removeClass("control-success");
                        nextColStyleChange(next);
                    }
                }
            };
        $target = $(target).closest("div");
        $target.addClass("control-required");
        $target.prev().addClass("control-required-label");
        $target.removeClass("control-success");
        $target.prev().removeClass("control-success-label");
        nextColStyleChange($target);
    };

    /**
     * 単項目要素をエラー無しのスタイルに設定します。
     * @param target 設定する要素
     */
    page.events.setColValidStyle = function (target) {
        var $target,
            nextColStyleChange = function (target) {
                var next;
                if (target.hasClass("with-next-col")) {
                    next = $target.next();
                    if (next.length) {
                        next.removeClass("control-required");
                        next.addClass("control-success");
                        nextColStyleChange(next);
                    }
                }
            };
        $target = $(target).closest("div");
        $target.removeClass("control-required");
        $target.prev().removeClass("control-required-label");
        $target.addClass("control-success");
        $target.prev().addClass("control-success-label");

        nextColStyleChange($target);
    };


    /**
     * 画面ヘッダーへのデータバインド処理を行います。
     */
    page.header.events.defaults.bind = function (data, isNewData) {

        var element = page.header.element,
            dataSet = App.ui.page.dataSet();

        page.header.data = dataSet;

        (isNewData ? dataSet.add : dataSet.attach).bind(dataSet)(data);

        page.header.element.form().bind(data);

        if (isNewData) {

            //TODO: 新規データの場合の処理を記述します。
            //ドロップダウンなど初期値がある場合は、
            //DataSetに値を反映させるために change 関数を呼び出します。
            //element.findP("ShikakuKbn").change();
        }

        //バリデーションを実行します。
        page.header.validator.validate({
            state: {
                suppressMessage: true
            }
        });
    };

    /**
     * 画面明細の一覧に新しい行を追加します。
     */
    page.detail.events.defaults.addRow = function (data, select) {
        page.detail.dataTable.dataTable("addRow", function (tbody) {
            tbody.form(page.detail.options.bindOption).bind(data);
            if (!tbody.findP("RoleId").val()) {
                tbody.find(".transfer").hide();
            }            
            return tbody;
        }, select);
    };

    /**
     * 画面明細の一覧の行が選択された時の処理を行います。
     */
    page.detail.operations.select = function (e, row) {
        //page.detail.dataTable.dataTable("lastSelectedRow", function (item) {
        //    if (item && item.element) {
        //        item.element.find(".select-tab").removeClass("selected");
        //    }
        //});
        //if (row && row.element) {
        //    row.element.find(".select-tab").addClass("selected");
        //}

        page.detail.dataTable.dataTable("lastSelectedRow", function (item) {
            if (item && item.element) {
                item.element.removeClass("selected");
            }
        });
        if (row && row.element) {
            row.element.addClass("selected");
        }
    };    


    /**
     * jQuery イベントで、ページの読み込み処理を定義します。
     */
    $(document).ready(function () {
        // ページの初期化処理を呼び出します。
        page.events.defaults.initialize();
    });

    App.ui.page.extend(page);

})();


