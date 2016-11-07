; (function () {

    "use strict";

    /**
    * ページのレイアウト構造に対応するオブジェクトを定義します。
    */
    var page = {
        //TODO: ページのレイアウト構造に対応するオブジェクト定義を記述します。
        options: {
            skip: 0,                           // TODO:先頭からスキップするデータ数を指定します。
            top: App.settings.base.dataTakeCount,   // TODO:取得するデータ数を指定します。
            urls: {
                search: "/Membership/V1/Users/api/Users",
                units: "/Membership/V1/Users/api/Units",
                download: "/Membership/V1/Users/api/Users/Download",
                editPage: "/Membership/V1/Users/Page/UserInput", //編集画面に遷移する場合はURLを指定します。
                encrypt: "/Membership/V1/Users/api/Crypto/Encrypt",
                ouputPdf: "/Membership/V1/Users/api/PdfService"
            },
            messages: App.str.text("Messages"),
            strings: App.str.text("StringContents")
        },
        values: {},
        events: {   //イベント
            defaults: { //パターン既定イベント
                initialize: {},
                getParameters: {},
                initializeControl: {},
                initializeControlEvent: {},
                loadMasterData: {},
                loadData: {},
                loadDialogs: {},
                createValidator: {},
                validateAll: {},
                transfer: {}
            }
        },
        operations: { //ユーザー操作イベント
            defaults: {} //既定ユーザー操作イベント
        },
        //検索条件部
        header: {
            options: {　//検索条件部で共有する設定
                urls: {},
                validations: {},
                bindOption: {}
            },
            values: {}, //検索条件部で共有する値
            events: {   //検索条件部のイベント
                defaults: { //検索条件部の既定イベント
                    initialize: {},
                    createFilter: {},
                    change: {}
                },
            },
            operations: { //検索条件部のユーザー操作イベント
                defaults: { //検索条件部の既定ユーザー操作イベント
                    search: {}
                }
            }
        },
        //一覧表示部
        detail: {
            options: {  //一覧表示部で共有する設定
                bindOption: {}
            },
            values: {}, //一覧表示部で共有する値
            events: {   //一覧表示部のイベント
                defaults: {  //一覧表示部の既定イベント
                    initialize: {},
                    bind: {}
                }
            },
            operations: { //一覧表示部のユーザー操作イベント
                defaults: { //一覧表示部の既定ユーザー操作イベント
                    select: {},
                    nextsearch: {}
                }
            }
        },
        dialogs: {
            
        }
    };

    /**
    * 画面の初期化処理を行います。
    */
    page.events.defaults.initialize = function () {

        var defer = $.Deferred();

        page.notify = App.ui.page.notify();
        App.ui.loading.show();

        page.events.defaults.getParameters();

        page.events.defaults.initializeControl();
        page.events.defaults.initializeControlEvent();

        page.header.events.defaults.initialize();
        page.detail.events.defaults.initialize();

        page.events.defaults.loadMasterData().then(function (result) {
            //マスターデータ以外の取得処理を実行します。
            return page.events.defaults.loadData();

        }).then(function () {

            return page.events.defaults.loadDialogs();

        }).then(function () {

            //TODO: 画面の初期化処理成功時の処理を記述します。

        }).fail(function (error) {
            App.ui.page.normalizeError(error).forEach(function (e) {
                page.notify.alert.message(e.message).show();
            });
        }).always(function (result) {
            $(":input:visible:not(:disabled):first").focus();
            App.ui.loading.close();
            defer.resolve();
        });

        return defer.promise();
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
    page.events.defaults.initializeControl = function () {

        //TODO: 画面全体で利用するコントロールの初期化処理をここに記述します。
        var title = page.options.strings.UserSearchList;
        $(".page-title").text(title);
        document.title = title;
    };

    /**
     * コントロールへのイベントの紐づけを行います。
     */
    page.events.defaults.initializeControlEvent = function () {

        //TODO: 画面全体で利用するコントロールのイベントの紐づけ処理をここに記述します。
        App.ui.page.applyCollapsePanel();

        //TODO: 画面全体で利用するコントロールのイベントの紐づけ処理をここに記述します。

        //TODO: 新規登録画面への遷移を有効にする場合は、page.options.urls.editPage プロパティの値を設定し
        //以下のコメントを解除します。

        var element = $(".commands");

        element.on("click", ".add", page.events.defaults.transfer);
        element.on("click", ".search", page.header.operations.defaults.search);
        element.on("click", ".download", page.header.operations.defaults.download);
        element.on("click", ".ouputPdf", page.header.operations.defaults.ouputPdf);
    };

    page.header.operations.defaults.download = function () {
        var options = App.data.toODataFormat({
            url: page.options.urls.download,
            filter: page.options.filter,
            skip: 0,
            top: page.options.top,
            count: true
        });
        
        var download = App.download.downloadfile({
            url: App.str.format(options)
        });
    }

    page.header.operations.defaults.ouputPdf = function () {
        
        App.download.downloadfile({
            url: App.uri.setQuery(page.options.urls.ouputPdf, {
                documentId: "",
                dataGroups: []
            })
        });
    };

    /**
     * マスターデータのロード処理を実行します。
     */
    page.events.defaults.loadMasterData = function () {

        //TODO: 画面内のドロップダウンなどで利用されるマスターデータを取得し、画面にバインドする処理を記述します。
        return App.async.all({
            units: $.ajax(App.ajax.webapi.get(page.options.urls.units))
        }).then(function (result) {
            //TODO:マスターデータ取得成功時のデータ設定処理を記述します
            var data = result.successes;
            App.ui.util.appendOptions({
                target: $.findP("UnitId"),
                data: data.units,
                useEmpty: true,
                reviver: function (item) {
                    return {
                        value: item.UnitId,
                        display: item.UnitName
                    };
                }
            });
            //var serviceData = data.service;
        });
    };

    /**
     * マスターデータ以外のロード処理を実行します。
     */
    page.events.defaults.loadData = function () {
        //TODO: マスターデータ以外のデータのロード処理を記述します。

        return App.async.success();
    };

    page.events.defaults.loadDialogs = function () {
        //TODO: ダイアログがある場合はダイアログのロード処理を記述します。
        return App.async.all({
            //    employee: $.get(/*TODO: ダイアログの画面URL*/),
        }).then(function (result) {
            //    var dialogs = result.successes,
            //        dialog;
            //    $("#dialog-container").append(dialogs.employee);
            //    
            //    TODO: ダイアログで宣言しているグローバル変数（ダイアログ定義オブジェクト）を代入します。
            //    dialog = employeeDialog;

            //    page.dialogs.employeeDialog.dialog = dialog;
            //    dialog.events.defaults.initialize();
            //    dialog.events.defaults.complete = page.detail.events.setEmployee;
        });
    };

    /**
  * 指定された定義をもとにバリデータを作成します。
  * @param target バリデーション定義
  * @param options オプションに設定する値。指定されていない場合は、
  *                画面の success/fail/always のハンドル処理が指定されたオプションが設定されます。
  */
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

    ///**
    // * すべてのバリデーションを実行します。
    // */
    //page.events.defaults.validateAll = function () {

    //    var validations = [];

    //    validations.push(page.header.validator.validate());

    //    return App.async.all(validations);
    //};

    /**
     * 編集画面に遷移します。
     */
    page.events.defaults.transfer = function (data) {
        var url,
            transferData = {};
        url = App.uri.setQuery(page.options.urls.editPage, transferData);
        App.ui.util.openNewWindow(url);
    };

    page.header.options.validations = {
        UserName: {
            rules: {
                maxlength: 50
            },
            options: {
                //TODO: メッセージの設定
                name: page.options.strings.UserName
            }
        }
    };

    page.header.options.bindOption = {
        appliers: {},
        converters: {}
    };


    /**
     * 検索条件部の初期化処理を行います。
     */
    page.header.events.defaults.initialize = function () {

        var element = $(".header");
        page.header.validator = element.validation(page.events.defaults.createValidator(page.header.options.validations), {
            immediate: true
        });
        page.header.element = element;
        App.ui.page.applyInput(element);

        //TODO: 検索条件部の初期化処理をここに記述します。

        //TODO: 検索条件部で利用するコントロールのイベントの紐づけ処理をここに記述します。
        page.on(element, "change", ":input", page.header.events.defaults.change);
        page.on(element, "click", ":checkbox", page.header.events.defaults.change);
    };

    /**
     * 検索条件部にある入力項目の変更イベントの処理を行います。
     */
    page.header.events.defaults.change = function () {
        if ($("#nextsearch").is(":visible")) {
            $("#nextsearch").hide();
            page.notify.info.message(page.options.messages.ChangeSearchCriteria).show();
        }
    };

    /**
     * 検索条件のフィルターを定義します。
     */
    page.header.events.defaults.createFilter = function () {
        var criteria = page.header.element.form(page.header.options.bindOption).data(),
            filter = [];

        //TODO: 検索条件を記述します。

        //filter.push("key eq " + criteria.key);
        //filter.push("date ge " + encodeURIComponent(App.date.format(start, "ISO8601Full")));

        if (!App.isUndefOrNull(criteria.UserName) && criteria.UserName.length > 0) {
            filter.push("contains(UserName, '" + encodeURIComponent(criteria.UserName) + "') eq true");
        }

        if (!App.isUndefOrNull(criteria.Mail) && criteria.Mail.length > 0) {
            filter.push("contains(Email, '" + encodeURIComponent(criteria.Mail) + "') eq true");
        }

        if (!App.isUndefOrNull(criteria.LastName) && criteria.LastName.length > 0) {
            filter.push("contains(LastName, '" + encodeURIComponent(criteria.LastName) + "') eq true");
        }

        if (!App.isUndefOrNull(criteria.FirstName) && criteria.FirstName.length > 0) {
            filter.push("contains(FirstName, '" + encodeURIComponent(criteria.FirstName) + "') eq true");
        }

        if (!App.isUndefOrNull(criteria.UnitId) && criteria.UnitId.length > 0) {
            filter.push("UnitId eq " + criteria.UnitId);
        }

        return filter.join(" and ");
    };

    /**
     * 検索処理を定義します。
     */
    page.header.operations.defaults.search = function () {

        return page.header.validator.validate().then(function () {
            var url;

            App.ui.loading.show();
            page.notify.alert.clear();

            page.options.skip = 0;
            page.options.filter = page.header.events.defaults.createFilter();

            //TODO: データ取得サービスのパラメータを記述します。
            url = App.data.toODataFormat({
                url: page.options.urls.search,
                filter: page.options.filter,
                skip: page.options.skip,
                top: page.options.top,
                count: true
            });

            //TODO: 検索の実行をpage.options.urls.searchにurlを設定後に以下のajaxの実行に置き換えます。
            return $.ajax(App.ajax.webapi.get(url)).then(function (result) {
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

    page.detail.options.bindOption = {
        // TODO: 一覧表示部の画面項目に値を設定する際に処理を追加します。
        appliers: {
            //service_ym: function (value, elem) {
            //    //明細のservice_ymの値(数値6桁)を和暦に変換する
            //    var val = "" + value;
            //    elem.text(App.date.format(App.date.parse(val, App.settings.base.formats.numberLikeYearMonth),
            //         App.settings.base.formats.displayJpMonth, App.date.japaneseCalendar()) || "");
            //    //e.g. H.24.09のような形式の場合
            //    //elem.text(App.date.format(App.date.parse(val, "yyyyMM"), "g.yy.MM", App.date.japaneseCalendar()) || "");
            //    return true;
            //}
        }
    };

    /**
     * 一覧表示部の初期化処理を行います。
     */
    page.detail.events.defaults.initialize = function () {

        var element = $(".detail"),
            datatable = element.find(".datatable").dataTable({
                height: 300,
                //TODO: データテーブルでソート機能を利用しない場合はfalseを指定します。
                sortable: true,
                //TODO: 列固定を行う場合は以下を有効にします。
                //// dataTable作成時に固定列の有効化を設定します。
                //fixedColumn: true,
                //// 先頭から固定する列数(1以上)を指定します。
                //fixedColumns: 2,
                //// スクロール列の横幅を指定します。
                innerWidth: 1000,
                resize: false,
                //onselect: page.detail.operations.defaults.select
            });

        page.detail.element = element;
        page.detail.dataTable = datatable;

        page.on(element, "click", "#nextsearch", page.detail.operations.defaults.nextsearch);
        element.find(".data-take-count").text(page.options.top);

        //TODO: 一覧表示部の初期化処理をここに記述します。
        //TODO: 一覧表示部で利用するコントロールのイベントの紐づけ処理をここに記述します。
    };

    /**
    * 一覧表示部へのデータバインド処理を行います。
    */
    page.detail.events.defaults.bind = function (data, isNewData) {
        var count, totalCount, dataSet;

        if (!data) {
            return;
        }
        //データの件数を取得します。
        totalCount = App.isNum(data.Count) ? data.Count : "-";
        data = data.Items || data;
        count = (data.length || 0) + page.options.skip;

        if (page.options.skip === 0) {
            dataSet = App.ui.page.dataSet();
            page.detail.dataTable.dataTable("clear");
        } else {
            dataSet = page.detail.data;
        }
        page.detail.data = dataSet;

        //TODO: 一覧表示部へのデータバインド処理をここに記述します。
        page.detail.dataTable.dataTable("addRows", data, function (row, item) {
            var param = {
                user_id: item.UserId
            };

            (isNewData ? dataSet.add : dataSet.attach).bind(dataSet)(item);
            row.form(page.detail.options.bindOption).bind(item);

            ////Encrypt parameters
            //var parameters = [param.user_id];
            //$.ajax(App.ajax.webapi.post(page.options.urls.encrypt, parameters)
            //).then(function (result) {                
            //    param.user_id = result[0];
            //    row.find(".edit").attr("href", App.uri.setQuery(page.options.urls.editPage, param));
            //});
            

            return row;
        });

        //取得件数および全件数を設定します。
        $(".data-count").text(count);
        $(".data-count-total").text(totalCount);

        //取得件数と全件数に応じて次のデータを取得するボタンを制御します。
        page.options.skip = count;
        $("#nextsearch").show();
        if (!App.isNum(totalCount) || totalCount <= count) {
            $("#nextsearch").hide();
        }
        if (page.options.skip >= App.settings.base.maxSearchDataCount) {
            page.notify.info.message(page.options.messages.TooManyData).show();
            $("#nextsearch").hide();
        }
    };

    /**
     * 次のレコードを検索する処理を定義します。
     */
    page.detail.operations.defaults.nextsearch = function () {
        var url;

        App.ui.loading.show();
        page.notify.alert.clear();

        //TODO: データ取得サービスのパラメータを記述します。
        url = App.data.toODataFormat({
            url: page.options.urls.search,
            filter: page.options.filter,
            skip: page.options.skip,
            top: page.options.top,
            count: true
        });

        //TODO: 検索の実行をpage.options.urls.searchにurlを設定後に以下のajaxの実行に置き換えます。
        return $.ajax(App.ajax.webapi.get(url)).then(function (result) {
            page.detail.events.defaults.bind(result);
            App.ui.loading.close();
        }, function (error) {
            App.ui.page.normalizeError(error).forEach(function (e) {
                page.notify.alert.message(e.message).show();
            });
            App.ui.loading.close();
        });
    };

    /**
     * 一覧表示部の一覧の行が選択された時の処理を行います。
     */
    //page.detail.operations.defaults.select = function (e, row) {

    //    page.detail.dataTable.dataTable("lastSelectedRow", function (item) {
    //        if (item && item.element) {
    //            item.element.removeClass("selected");
    //        }
    //    });
    //    if (row && row.element) {
    //        row.element.addClass("selected");
    //    }

    //    TODO: 編集画面への遷移を有効にする場合は以下のコメントを解除し
    //    引き渡すパラメーターの値を設定します。
    //    var id = row.element.attr("data-key"),
    //             entity = page.detail.data.entry(id);
    //    page.events.defaults.transfer(entity);
    //};

    /**
     * jQuery イベントで、ページの読み込み処理を定義します。
     */
    $(document).ready(function () {
        if (App.page.mode === "test") {
            App.page.test.run = function () {
                page.events.defaults.initialize().then(function () {
                    jasmine.getGlobal().page = page;
                    jasmine.getEnv().execute();
                });
            }
        } else {
            // ページの初期化処理を呼び出します。
            page.events.defaults.initialize();
        }
    });

    App.ui.page.extend(page);

})();