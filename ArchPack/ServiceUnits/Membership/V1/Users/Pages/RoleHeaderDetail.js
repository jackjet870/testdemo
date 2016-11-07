; (function () {
    /**
    * ページのレイアウト構造に対応するオブジェクトを定義します。
    */
    var page = {
        //TODO: ページのレイアウト構造に対応するオブジェクト定義を記述します。
        options: {
            urls: {
                roles: "/Membership/V1/Users/api/Roles",
                usersInRoles: "/Membership/V1/Users/api/UsersInRoles",
                self: "/Membership/V1/Users/Page/RoleHeaderDetail",
                decrypt: "/Membership/V1/Users/api/Crypto/Decrypt"
            },
            messages: App.str.text("Messages"),
            strings: App.str.text("StringContents")
        },
        values: {
            role_id: {}
        },
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
                validateAll: {},
                serviceValidationFail: {},
                confirm: {}
            }
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
            events: {
                defaults: {
                    initialize: {},
                    bind: {},
                    change: {}
                }
            }
        },
        //テーブル形式の検索結果一覧
        detail: {
            options: {
                urls: {
                    users: "/Membership/V1/Users/api/Users"
                },
                validations: {},
                bindOption: {}
            },
            values: {},
            events: {
                defaults: {
                    initialize: {},
                    bind: {},
                    change: {},
                    validateList: {},
                    validateListCount: {}
                }
            },
            operations: {
                defaults: {
                    select: {},
                    addNewItem: {},
                    deleteItem: {}
                }
            }
        },
        dialogs: {
            searchModal: {
                options: {
                    urls: {
                        searchDialog: "/Membership/V1/Users/page/SearchDialog"
                    }
                }
            }
        }
    };

    /**
     * Window を閉じる際のイベントを定義します。
     * @return 文字列を返却した場合に確認メッセージが表示されます。
     */

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

        page.events.defaults.decryptParameters().then(function () {

            //マスターデータ以外の取得処理を実行します。
            return page.events.defaults.loadMasterData();

        }).then(function () {

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

            $("#save").hide();
            $("#remove").hide();

        }).always(function (result) {
            $(":input:visible:not(:disabled):first").focus();
            App.ui.loading.close();
        });
    };

    /**
     * 遷移元から渡されたパラメーターの取得を行います。
     */
    page.events.defaults.getParameters = function () {
        //TODO: URLパラメーターで渡された値を取得し、保持する処理を記述します。
        var query = App.uri.splitQuery(location.search);
        if (!App.isUndefOrNull(query.role_id)) {
            page.values.role_id = query.role_id;
        } else {
            page.values.role_id = "";
            $("#remove").hide();
        }
    };
    /**
     * 画面コントロールの初期化処理を行います。
     */
    page.events.defaults.initializeControl = function () {

        //TODO: 画面全体で利用するコントロールの初期化処理をここに記述します。
        var title = page.options.strings.RoleHeaderDetail;
        $(".page-title").text(title);
        document.title = title;

        if (App.isUndefOrNull(page.values.role_id)) {
            $("#remove").hide();
        }
    };

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
     * コントロールへのイベントの紐づけを行います。
     */
    page.events.defaults.initializeControlEvent = function () {
        App.ui.page.applyCollapsePanel();

        //TODO: 画面全体で利用するコントロールのイベントの紐づけ処理をここに記述します。
        page.on($("#save"), "click", page.operations.defaults.save);
        page.on($("#remove"), "click", page.operations.defaults.remove);
    };


    /**
     * 遷移元から渡されたパラメーターの取得を行います。
     */
    page.events.defaults.decryptParameters = function () {
        var parameters = [page.values.role_id];
        return $.ajax(App.ajax.webapi.post(page.options.urls.decrypt, parameters)
            ).then(function (result) {
                page.values.role_id = result[0];
            });
    };

    /**
   * マスターデータのロード処理を実行します。
   */
    page.events.defaults.loadMasterData = function () {

        ////TODO: 画面内のドロップダウンなどで利用されるマスターデータを取得し、画面にバインドする処理を記述します。
        //return App.async.all(
        //    $.ajax(App.ajax.webapi.get(/* TODO:マスターデータ取得サービスの URL */))
        //    .then(function (result) {
        //        //TODO:マスターデータ取得成功時のデータ設定処理を記述します
        //    }),
        //    $.ajax(App.ajax.webapi.get(/* TODO:マスターデータ取得サービスの URL */))
        //    .then(function (result) {
        //        //TODO:マスターデータ取得成功時のデータ設定処理を記述します
        //    })
        //);

        return App.async.success();
    };

    /**
     * 画面で処理の対象とするデータのロード処理を実行します。
     */
    page.events.defaults.loadData = function () {

        if (!App.isUndefOrNull(page.values.role_id)) {
            //更新モードとして処理を行うために詳細データを取得します。
            var query = {
                url: page.options.urls.roles,
                filter: "RoleId eq " + page.values.role_id + "",
                skip: 0,
                top: 1,
                count: true
            };
            return App.async.all({

                //TODO: 取得の実行をpage.options.urls.dataにurlを設定後に以下のajaxの実行に置き換えます。

                header: $.ajax(App.ajax.webapi.get(App.data.toODataFormat(query))),
                detail: $.ajax(App.ajax.webapi.get(page.options.urls.usersInRoles, { roleId: page.values.role_id }))

            }).then(function (result) {
                var header = result.successes.header;
                var detail = result.successes.detail;

                //データが取得できなかった場合は、新規モードとしてバインドを行いメッセージを表示したうえで処理を返す。
                if (!header) {
                    page.header.events.defaults.bind({}, true);
                    page.detail.events.defaults.bind([], true);

                    page.notify.alert.message(page.options.messages.CannotDataRetrieved + page.options.messages.DoNewCreationMode).show();
                    return App.async.success();
                }

                //データが取得できた場合は画面にバインドを行います。

                //header
                page.header.events.defaults.bind(header.Items[0] || {});
                //detail
                page.detail.events.defaults.bind(detail || []);

                $("#remove").show();

            }, function (error) {
                //失敗の場合は新規モードとしメッセージを表示したうえで処理を返す。
                App.ui.page.normalizeError(error).forEach(function (e) {
                    page.notify.alert.message(e.message).show();
                });

                page.header.events.defaults.bind({}, true);
                page.detail.events.defaults.bind([], true);

                return App.async.success();
            });
        } else {
            page.header.events.defaults.bind({}, true);
            page.detail.events.defaults.bind([], true);
            return App.async.success();
        }
    };

    /**
    * 画面で利用するダイアログのロード処理を実行します。
    */
    page.events.defaults.loadDialogs = function () {

        return $.get(page.dialogs.searchModal.options.urls.searchDialog).then(function (result) {
            $("#dialog-container").append(result);
            //TODO: ページのレイアウト構造に対応するオブジェクトに紐づけます。


            page.dialogs.searchModal = window.searchModal;
            page.dialogs.searchModal.events.defaults.initialize();

            //検索ダイアログで選択が実行された時に呼び出される関数を設定しています。
            page.dialogs.searchModal.events.complete = page.detail.events.setUser;
        });
    };

    /**
     * バリデーション失敗時の処理を実行します。
     */
    page.events.defaults.serviceValidationFail = function (error) {

        page.notify.alert.message(error.message).show();
    };

    /**
     * すべてのバリデーションを実行します。
     */
    page.events.defaults.validateAll = function () {

        var validations = [];

        validations.push(page.header.validator.validate());
        validations.push(page.detail.events.defaults.validateList());

        //TODO: 画面内で定義されているバリデーションを実行する処理を記述します。

        return App.async.all(validations);
    };

    /**
      * 指定された定義をもとにバリデータを作成します。
      * @param target バリデーション定義
      * @param options オプションに設定する値。指定されていない場合は、
      *                画面の success/fail/always のハンドル処理が指定されたオプションが設定されます。
      */
    page.events.createValidator = function (target, options) {
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

    /**
    * データの保存処理を実行します。
    */
    page.operations.defaults.save = function () {

        App.ui.loading.show();
        page.notify.alert.clear();
        page.notify.info.clear();

        page.events.defaults.validateAll()
        .then(function () {

            var entityId = page.header.element.attr("data-key"),
                entity = page.header.data.entry(entityId),
                changeSets;

            //changeSets = {
            //    Header: page.header.data.getChangeSet(),
            //    Detail: page.detail.data.getChangeSet()
            //};

            //TODO: データの保存処理をここに記述します。
            var mode = {};
            if (page.values.role_id == "") {
                mode = "new";
            }
            return $.ajax(App.ajax.webapi.post(page.options.urls.usersInRoles,
                {
                    changeSet: page.detail.data.getChangeSet(),
                    mode: mode,
                    RoleID: page.values.role_id,
                    RoleName: $.findP("RoleName").val(),
                    Description: $.findP("Description").val(),
                }))
                    .then(function (result) {

                        //TODO: データの保存成功時の処理をここに記述します。

                        if (result.RoleID != "00000000-0000-0000-0000-000000000000") {
                            page.notify.info.message(page.options.messages.SaveCompleted).show();
                            var url = App.uri.setQuery(page.options.urls.self, { role_id: result.RoleID });
                            window.open(url, "_self");
                        }
                        else {
                            page.notify.alert.clear();
                            page.notify.info.clear();

                            //最後に再度データを取得しなおします。
                            page.events.defaults.loadData();
                            page.notify.info.message(page.options.messages.SaveCompleted).show();
                        }
                    }).fail(function (error) {
                        //TODO: データの保存失敗時の処理をここに記述します。

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
                                page.notify.alert.message(page.options.messages.UpdateConfilict).show();
                                return;
                            }
                        }

                        normalizedErrors.forEach(function (e) {
                            page.notify.alert.message(e.message).show();
                        });

                    });

        }).always(function () {
            setTimeout(function () {
                page.header.element.find(":input:first").focus();
            }, 100);
            App.ui.loading.close();
        });
    };

    page.operations.defaults.remove = function () {
        page.notify.alert.clear();
        page.notify.info.clear();

        App.ui.page.confirm({
            // 明細行を削除する際のメッセージを設定します
            text: page.options.messages.ConfirmDelete
        }).then(function () {
            App.ui.loading.show();

            var uri = App.uri.setQuery(page.options.urls.usersInRoles, {
                roleId: page.values.role_id
            });

            //TODO: データの削除処理をここに記述します。
            $.ajax(App.ajax.webapi["delete"](uri))
            .then(function (result) {
                page.notify.alert.clear();
                page.notify.info.clear();

                page.notify.info.message(page.options.RemoveCompleted).show();

                //新規モードで画面を再表示します。
                setTimeout(function () {
                    var uri = App.uri.parse(location.href);
                    if (uri.query) {
                        delete uri.query;
                    }
                    location.href = App.uri.toUriString(uri);
                }, 100);
            }).fail(function (error) {
                //TODO: データの保存失敗時の処理をここに記述します。
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
                        page.notify.alert.message(page.options.messages.UpdateConfilict).show();
                        return;
                    }
                }

                normalizedErrors.forEach(function (e) {
                    page.notify.alert.message(e.message).show();
                });
            }).always(function () {
                setTimeout(function () {
                    $(":input:visible:not(:disabled):first").focus();
                }, 100);
                App.ui.loading.close();
            });
        });
    };


    //TODO: 以下の page.header の各宣言は画面仕様ごとにことなるため、
    //不要の場合は削除してください。

    /**
     * 画面ヘッダーのバリデーションを定義します。
     */
    page.header.options.validations = {
        //TODO: 画面ヘッダーのバリデーションの定義を記述します。
        RoleName: {
            rules: {
                required: true,
                maxlength: 50
            },
            options: {
                name: page.options.strings.RoleName
            },
            messages: {
                required: page.options.messages.Required,
                maxlength: page.options.messages.MaxLength
            }
        }
    };

    /**
     * 画面ヘッダーの初期化処理を行います。
     */
    page.header.events.defaults.initialize = function () {

        var element = $(".header");
        page.header.validator = element.validation(page.events.createValidator(page.header.options.validations));
        page.on(element, "change", ":input", page.header.events.defaults.change);
        page.header.element = element;

        //TODO: 画面ヘッダーの初期化処理をここに記述します。
        //TODO: 画面ヘッダーで利用するコントロールのイベントの紐づけ処理をここに記述します。

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

    };

    //TODO: 以下の page.header の各宣言は画面仕様ごとにことなるため、
    //不要の場合は削除してください。
    /**
     * TODO: カスタムバリデーションの処理を定義します。
     */

    //TODO: 以下の page.detail の各宣言は画面仕様ごとにことなるため、
    //不要の場合は削除してください。

    /**
     * 画面明細のバリデーションを定義します。
     */
    page.detail.options.validations = {
        //TODO: 画面明細のバリデーションの定義を記述します。
        UserName: {
            rules: {
                required: true,
                maxlength: 50
            },
            options: {
                name: page.options.strings.UserName
            },
            messages: {
                required: page.options.messages.Required,
                maxlength: page.options.messages.MaxLength
            }
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
                onselect: page.detail.operations.defaults.select,
                onchange: page.detail.events.defaults.change,
                resize: false
            });

        page.detail.validator = element.validation(page.events.createValidator(page.detail.options.validations));
        page.detail.element = element;
        page.detail.dataTable = datatable;

        var dataSet = App.ui.page.dataSet();
        page.detail.data = dataSet;

        page.on(element, "click", "#add-item", page.detail.operations.defaults.addNewItem);
        page.on(element, "click", "#del-item", page.detail.operations.defaults.deleteItem);
        page.on(element, "click", ".show-search-dialog", page.detail.operations.showsearchdialog);

        //TODO: 画面明細の初期化処理をここに記述します。
        //TODO: 画面明細で利用するコントロールのイベントの紐づけ処理をここに記述します。
    };

    page.detail.operations.showsearchdialog = function () {
        var element = page.dialogs.searchModal.element;

        element.modal("show");
    }
    /**
     * 画面明細へのデータバインド処理を行います。
     */
    page.detail.events.defaults.bind = function (data, isNewData) {
        var element = page.detail.element,
            i, l, item,
            dataSet = App.ui.page.dataSet();

        totalCount = App.isNum(data.length) ? data.length : "-";
        count = (data.length || 0);

        page.detail.data = dataSet;
        page.detail.dataTable.dataTable("clear");

        for (i = 0, l = data.length; i < l; i++) {
            item = data[i];
            (isNewData ? dataSet.add : dataSet.attach).bind(dataSet)(item);
            page.detail.events.defaults.addRow(item, i === 0);
        }

        //取得件数および全件数を設定します。
        $(".data-count").text(count);
        $(".data-count-total").text(totalCount);

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
                tbody: row,
                isGridValidation: true
            }
        }).then(function () {
            entity[propertyName] = row.element.form().data()[propertyName];
            page.detail.data.update(entity);
        });
    };


    /**
    * TODO: カスタムバリデーションの処理を定義します。
    */

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
     * 画面明細の明細ごとの計をもとにした合計金額を計算し、表示します。
     */
    page.detail.events.calculate = function (row, entity) {
        var items,
            total;


        if (page.detail.values.suppressCalculate) {
            return;
        }

        items = page.detail.data.findAll(function (item, entity) {
            return entity.state !== App.ui.page.dataSet.status.Deleted;
        });

        total = items.reduce(function (init, value) {
            return init;
        }, 0);
    };

    /**
     * 画面明細の一覧に新しい行を追加します。
     */
    page.detail.events.defaults.addRow = function (data, select) {
        var length = page.detail.dataTable.length;

        page.detail.dataTable.dataTable("addRow", function (tbody) {
            tbody.form(page.detail.options.bindOption).bind(data);
            if (!data.UserId) {
                tbody.find(".show-search-dialog").css('display', '');
            }

            var unique = tbody.findP("UserName");
            unique.prop("data-id", data.__id);

            tbody.findP("UserName").complete({
                textLength: 50,
                ajax: function (val) {
                    var query = {
                        url: page.detail.options.urls.users,
                        filter: "contains(UserName, '" + encodeURIComponent(val) + "') eq true",
                        skip: 0,
                        top: 1,
                        count: true
                    };
                    return $.ajax(App.ajax.webapi.get(App.data.toODataFormat(query), null, { async: false }));
                },
                success: function (result) {
                    if (result.Count == 0) {
                        page.notify.alert.remove(unique);
                        return page.notify.alert.message(page.options.messages.NotEixistsUser, unique).show();
                    }
                    else {
                        page.notify.alert.remove(unique);

                        var user = result.Items[0];
                        tbody.findP("RoleId").val(page.values.role_id);
                        tbody.findP("UserId").val(user.UserId);
                        tbody.findP("Email").text(user.Email);
                        var unitName = !user.UnitName ? "" : user.UnitName;
                        tbody.findP("UnitName").text(unitName);
                    }
                },
                error: function (error) {
                    page.notify.alert.remove(unique);
                    return page.notify.alert.message(page.options.messages.NotEixistsUser, unique).show();
                }
            });

            return tbody;
        }, select);
    };

    /**
    * 画面明細の一覧に新規データを追加します。
    */
    page.detail.operations.defaults.addNewItem = function () {
        //TODO:新規データおよび初期値を設定する処理を記述します。
        var newData = {
            // TODO:URLパラメーターで渡された値(キー項目)を設定します。
            RoleId: page.values.role_id
        };
        page.detail.data.add(newData);
        page.detail.events.defaults.addRow(newData, true);

    };


    /**
    * 画面明細の一覧で選択されている行とデータを削除します。
    */
    page.detail.operations.defaults.deleteItem = function (e) {
        var selectedRow;
        //選択中の行を取得します。
        page.detail.dataTable.dataTable("lastSelectedRow", function (item) { selectedRow = item; });

        if (!selectedRow || !selectedRow.element) {
            page.notify.info.message(page.options.messages.RemoveNotSletcted).show();
            return;
        }

        App.ui.page.confirm({
            // 明細行を削除する際のメッセージを設定します
            text: page.options.messages.ConfirmDeleteDetail
        }).then(function () {
            //選択行のエラーを削除します。
            selectedRow.element.find(":input").each(function (i, elem) {
                page.notify.alert.remove(elem);
            });
            var indexSelectedRow = $(selectedRow.element).index(),
                preIndexRow = 0,
                enableRowCount = 0,
                previousRow;
            page.detail.dataTable.dataTable("enableRowCount", function (count) {
                enableRowCount = count + 1;
            });
            if (indexSelectedRow < enableRowCount) {
                preIndexRow = indexSelectedRow;
            } else {
                preIndexRow = indexSelectedRow - 2;
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
     * 画面明細の一覧の行が選択された時の処理を行います。
     */
    page.detail.operations.defaults.select = function (e, row) {

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
   * 画面明細にあるユーザーにマスターデータを取得し画面にバインドします。
   */
    page.detail.events.setUser = function (data) {

        var element = page.detail.element,
            selected = element.find(".datatable .new.selected").closest("tbody");

        if (!selected.length) {
            return;
        }

        selected.findP("RoleId").val(page.values.role_id).change();
        selected.findP("UserId").val(data.UserId).change();
        selected.findP("UserName").val(data.UserName).change();
        selected.findP("Email").text(data.Email).change();
        var unitName = !data.UnitName ? "" : data.UnitName;
        selected.findP("UnitName").text(unitName).change();
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


