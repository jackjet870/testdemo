<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="SearchDialog.aspx.cs" Inherits="ArchPack.ServiceUnits.Membership.V1.Users.Pages.SearchDialog" %>

<%@ Import Namespace="ArchPack.ServiceUnits.Membership.V1.Resources" %>

<!-- ユーザー検索ダイアログ-->
<div class="modal fade wide" id="search-dialog">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title"><%= StringContents.UserList %></h4>
            </div>
            <div class="modal-body">
                <div class="panel panel-default">
                    <div class="panel-heading" data-toggle="collapse" data-target=".dialog-header.panel-collapse">
                        <p class="pull-right">
                            <i class="glyphicon glyphicon-chevron-up"></i>
                            <i class="glyphicon glyphicon-chevron-down" style="display: none;"></i>
                        </p>

                        <div class="panel-title"><%= StringContents.SearchCriteria %></div>
                    </div>
                    <div class="dialog-header panel-collapse collapse in">
                        <div class="panel-body criteria">
                            <div class="row">
                                <div class="control-label col-xs-2">
                                    <label class="item-name"><%= StringContents.UserName %></label>
                                </div>
                                <div class="control col-xs-4">
                                    <input type="text" class="" data-prop="UserName" />
                                </div>
                                <div class="control col-xs-6">
                                </div>
                            </div>
                        </div>
                        <div class="panel-footer">
                            <div class="commands">
                                <button type="button" class="search btn btn-sm btn-primary"><%= StringContents.Search %></button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <div class="panel-title panel-title-center">
                            <div class="pull-left"><%= StringContents.SearchResultList %></div>
                            <div>
                                <span class="data-count-total">-</span>
                                <span><%= StringContents.OfCount %></span>
                                <span class="data-count">0</span>
                                <span><%= StringContents.ToDisplayCount %></span>
                            </div>
                        </div>
                    </div>
                    <div class="dialog-detail">
                        <div class="panel-body">
                            <table class="datatable">
                                <thead>
                                    <tr>
                                        <th style="width: 50px;"></th>
                                        <th style="width: 120px;"><%= StringContents.UserName %></th>
                                        <th style="width: 150px;"><%= StringContents.Mail %></th>
                                        <th style="width: 100px;"><%= StringContents.LastName %></th>
                                        <th style="width: 100px;"><%= StringContents.FirstName %></th>
                                        <th><%= StringContents.BusinessUnit %></th>
                                    </tr>
                                </thead>
                                <tbody class="item-tmpl" style="display: none;">
                                    <tr>
                                        <td>
                                            <button class="btn btn-success btn-xs select"><%= StringContents.SelectItem %></button>
                                        </td>
                                        <td>
                                            <input type="hidden" data-prop="UserId" />
                                            <span data-prop="UserName" style="display: block; overflow: hidden; text-overflow: ellipsis;"></span>
                                        </td>
                                        <td>
                                            <span data-prop="Email" style="display: block; overflow: hidden; text-overflow: ellipsis;"></span>
                                        </td>
                                        <td>
                                            <span data-prop="LastName" style="display: block; overflow: hidden; text-overflow: ellipsis;"></span>
                                        </td>
                                        <td>
                                            <span data-prop="FirstName" style="display: block; overflow: hidden; text-overflow: ellipsis;"></span>
                                        </td>
                                        <td>
                                            <input type="hidden" data-prop="UnitId" />
                                            <span data-prop="UnitName" style="display: block; overflow: hidden; text-overflow: ellipsis;"></span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="text/javascript">


    (function () {

        "use strict";

        var dialog = {
            options: { //ダイアログ内で共有する設定
                skip: 0,
                top: App.settings.base.dataTakeCount,
                urls: {
                    //TODO: 検索を行うサービスのURLを指定します。
                    search: "/Membership/V1/Users/api/Users"
                }
            },
            values: {}, //ダイアログ内で共有する値
            events: { //イベント
                defaults: { //パターン規定イベント
                    initialize: {},
                    initializeControl: {},
                    initializeControlEvent: {},
                    loadMasterData: {},
                    loadData: {},
                    createValidator: {},
                    setParameters: {},
                    shown: {},
                    complete: {}
                }
            },
            operations: {  //ユーザー操作イベント
                defaults: {} //既定ユーザー操作イベント
            },
            header: {
                options: {
                    validations: {},
                    bindOption: {}
                },
                events: {
                    defaults: {
                        initialize: {},
                        createFilter: {}
                    }
                },
                operations: {
                    defaults: {
                        search: {}
                    }
                }
            },
            detail: {
                options: {
                    bindOption: {}
                },
                events: {
                    defaults: {
                        initialize: {},
                        bind: {}
                    }
                },
                operations: {
                    defaults: {
                        select: {}
                    }
                }
            }
        };

        /**
         * ダイアログの初期化処理を行います。
         */
        dialog.events.defaults.initialize = function (data) {

            var root = $("#search-dialog" /*TODO: ルート要素に指定したIDを指定します。*/);

            dialog.notify = App.ui.page.dialogNotify(root);
            dialog.element = root;

            dialog.events.defaults.initializeControl();
            dialog.events.defaults.initializeControlEvent();

            dialog.header.events.defaults.initialize();
            dialog.detail.events.defaults.initialize();

            dialog.events.defaults.loadMasterData().then(function () {
                return dialog.events.defaults.loadData()
            }).then(function () {

                //TODO: 画面の初期化処理成功時の処理を記述します。

            }).fail(function (error) {
                App.ui.page.normalizeError(error).forEach(function (e) {
                    dialog.notify.alert.message(e.message).show();
                });
            });
        };

        /**
         * 画面コントロールの初期化処理を行います。
         */
        dialog.events.defaults.initializeControl = function () {

            //TODO: 画面全体で利用するコントロールの初期化処理をここに記述します。

        };

        /**
        * コントロールへのイベントの紐づけを行います。
        */
        dialog.events.defaults.initializeControlEvent = function () {

            var root = dialog.element;
            App.ui.page.applyCollapsePanel(root.find(".modal-body .panel"));

            //TODO: 画面全体で利用するコントロールのイベントの紐づけ処理をここに記述します。
            root.on("show.bs.modal", dialog.events.defaults.shown);

        };

        /**
         * マスターデータのロード処理を実行します。
         */
        dialog.events.defaults.loadMasterData = function () {
            //TODO: 画面内のドロップダウンなどで利用されるマスターデータを取得し、画面にバインドする処理を記述します。
            return App.async.all({
                //service: $.ajax(App.ajax.webapi.get(/*TODO: マスターデータ取得サービスの URL*/))
            }).then(function (result) {
                //TODO:マスターデータ取得成功時のデータ設定処理を記述します
                var data = result.successes;

                //var serviceData = data.service;
            });
        };

        dialog.events.defaults.loadData = function () {
            //TODO: マスターデータ以外のデータのロード処理を記述します。

            return App.async.success();
        };

        /**
         * 指定された定義をもとにバリデータを作成します。
         * @param target バリデーション定義
         * @param options オプションに設定する値。指定されていない場合は、
         * 画面の success/fail/always のハンドル処理が指定されたオプションが設定されます。
         */
        dialog.events.defaults.createValidator = function (target, options) {
            dialog.events.defaults.validationSuccess =
                dialog.events.defaults.validationSuccess || App.ui.page.validationSuccess(dialog.notify);
            dialog.events.defaults.validationFail =
                dialog.events.defaults.validationFail || App.ui.page.validationFail(dialog.notify);
            dialog.events.defaults.validationAlways =
                dialog.events.defaults.validationAlways || App.ui.page.validationAlways(dialog.notify);

            return App.validation(target, options || {
                success: dialog.events.defaults.validationSuccess,
                fail: dialog.events.defaults.validationFail,
                always: dialog.events.defaults.validationAlways
            });
        };

        /**
         * 親画面から渡されるデータを受け取る処理を行います。
         */
        dialog.events.defaults.setParameters = function (data) {
            //TODO: 渡されたデータに応じて保存する処理を記述します。
            //dialog.values = $.extend({}, data, {/*default values*/ });
        };

        /**
         * ダイアログ表示時処理を実行します。
         */
        dialog.events.defaults.shown = function (e) {
            var root = dialog.element;

            dialog.header.element.find(":input").val("");
            dialog.detail.dataTable.dataTable("clear");

            root.find(".data-count").text(0);
            root.find(".data-count-total").text("-");

            dialog.notify.alert.clear();

            //TODO:ダイアログ表示時に、項目をクリアする処理をここに記述します。
        };

        dialog.header.options.validations = {
            //TODO: 検索条件部のバリデーションの定義を記述します。
        };

        dialog.header.options.bindOption = {
            // TODO: 検索条件部の画面項目に値を設定する際に処理を追加します。
            appliers: {},
            // TODO: 検索条件部の画面項目から値を取得する際に処理を追加します。
            converters: {}
        };

        /**
         * 検索条件部の初期化処理を行います。
         */
        dialog.header.events.defaults.initialize = function () {

            var root = dialog.element,
                element = root.find(".dialog-header")

            dialog.header.validator = element.validation(dialog.events.defaults.createValidator(dialog.header.options.validations), {
                immediate: true
            });

            dialog.header.element = element;
            App.ui.page.applyInput(element);

            //TODO: 検索条件部の初期化処理をここに記述します。

            //TODO: 検索条件部で利用するコントロールのイベントの紐づけ処理をここに記述します。

            element.on("click", ".search", dialog.header.operations.defaults.search);
        };


        /**
       * 検索条件のフィルターを定義します。
       */
        dialog.header.events.defaults.createFilter = function () {
            var element = dialog.header.element,
                criteria = element.form(dialog.header.options.bindOption).data(),
                filter = [];

            //TODO: 検索条件を記述します。

            //filter.push("key eq " + criteria.key);
            //filter.push("date ge " + encodeURIComponent(App.date.format(start, "ISO8601Full")));

            var nameCriteria = element.findP("UserName").val();
            filter.push(nameCriteria.length > 0 ? "contains(UserName, '" + encodeURIComponent(nameCriteria) + "') eq true" : "");
            return filter.join(" and ");
        };

        /**
         * 検索ダイアログの検索処理を実行します。
         */
        dialog.header.operations.defaults.search = function () {

            return dialog.header.validator.validate().then(function () {
                var element = dialog.header.element,
                    url,
                    loadingTaget = dialog.element.find(".modal-content");

                App.ui.loading.show("", loadingTaget);

                dialog.options.skip = 0;
                dialog.options.filter = dialog.header.events.defaults.createFilter();

                dialog.notify.alert.clear();

                //TODO: データ取得サービスのパラメータを記述します。
                url = App.data.toODataFormat({
                    url: dialog.options.urls.search,
                    filter: dialog.options.filter,
                    skip: dialog.options.skip,
                    top: dialog.options.top,
                    count: true
                });

                //TODO: 検索の実行をdialog.options.urls.searchにurlを設定後に以下のajaxの実行に置き換えます。
                return $.ajax(App.ajax.webapi.get(url)).then(function (result) {
                    //return App.async.success([]).then(function (result) {
                    dialog.detail.events.defaults.bind(result);
                    App.ui.loading.close(loadingTaget);
                }, function (error) {
                    App.ui.page.normalizeError(error).forEach(function (e) {
                        dialog.notify.alert.message(e.message).show();
                    });
                    App.ui.loading.close(loadingTaget);

                });
            });
        };

        dialog.detail.options.bindOption = {
            // TODO: 一覧部の画面項目に値を設定する際に処理を追加します。
            appliers: {},
            // TODO: 一覧部の画面項目から値を取得する際に処理を追加します。
            converters: {}
        };

        /**
         * 一覧表示部の初期化処理を行います。
         */
        dialog.detail.events.defaults.initialize = function () {

            var root = dialog.element,
                element = root.find(".dialog-detail"),
                table = element.find(".datatable"),
                datatable = table.dataTable({
                    width: 700,
                    height: 300,
                    onselect: dialog.detail.operations.defaults.select
                });

            dialog.detail.element = element;
            dialog.detail.dataTable = datatable;

            //TODO: 一覧表示部の初期化処理をここに記述します。
            //TODO: 一覧表示部で利用するコントロールのイベントの紐づけ処理をここに記述します。
        };


        /**
         * ダイアログの一覧にデータをバインドします。
         */
        dialog.detail.events.defaults.bind = function (data, isNewData) {

            var root = dialog.element,
                totalCount, dataSet,
                targetData;

            if (!data) {
                return;
            }

            totalCount = data.Count || "-";

            dataSet = App.ui.page.dataSet();
            dialog.detail.data = dataSet;
            dialog.detail.dataTable.dataTable("clear");

            targetData = data.Items || data;

            //TODO: 一覧表示部へのデータバインド処理をここに記述します。
            dialog.detail.dataTable.dataTable("addRows", targetData, function (row, item) {
                (isNewData ? dataSet.add : dataSet.attach).bind(dataSet)(item);
                row.form(dialog.detail.options.bindOption).bind(item);
                return row;
            });

            root.find(".data-count").text(targetData.length);
            root.find(".data-count-total").text(totalCount);

            if (App.isNum(totalCount) && totalCount > App.settings.base.dialogDataTakeCount) {
                dialog.notify.info.message(page.options.messages.TooManyData).show();
                return;
            }
        };

        /**
         * 一覧から行を選択された際の処理を実行します。
         */
        dialog.detail.operations.defaults.select = function (e, row) {

            var root = dialog.element,
                entityId = row.element.attr("data-key"),
                entity;

            root.modal("hide");

            if (App.isUndef(entityId)) {
                return;
            }

            entity = dialog.detail.data.entry(entityId);

            if (App.isFunc(dialog.events.complete)) {
                dialog.events.complete(entity);
            }
        };

        //window./*TODO: ここに公開するダイアログ名を設定します。*/ = dialog;
        window.searchModal = dialog;

    })();

</script>