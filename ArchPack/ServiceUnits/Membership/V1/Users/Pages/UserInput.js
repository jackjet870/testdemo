; (function () {
    "use strict";

    /**
    * ページのレイアウト構造に対応するオブジェクトを定義します。
    */
    var page = {
        //TODO: ページのレイアウト構造に対応するオブジェクト定義を記述します。
        options: {
            urls: {
                data: "/Membership/V1/Users/api/Users",
                save: "/Membership/V1/Users/api/Users/Post",
                units: "/Membership/V1/Users/api/Units",
                decrypt: "/Membership/V1/Users/api/Crypto/Decrypt"
            },
            messages: App.str.text("Messages"),
            strings: App.str.text("StringContents")
        },
        values: {
            isNew: true
        },
        events: {
            defaults: {
                initialize: {},
                getParameters: {},
                initializeControl: {},
                initializeControlEvent: {},
                loadMasterData: {},
                loadData: {},
                loadDialogs: {},
                createValidator: {},
                validateAll: {},
                serviceValidationFail: {}
            }
        },
        //ユーザ操作イベント
        operations: {
            defaults: {
                save: {},
                remove: {}
            }
        },
        //TODO: 単票パターンでは以下のセクションのオブジェクト構造をセクション数分だけ作成します。
        //各ルートのプロパティはセクション名に変更します。
        //セクション
        section: {
            options: {
                urls: {
                    units: "/Account/_/_/api/Units" // App.ui.page.resolveUrl("/api/Account/Units"),
                },
                validations: {}
            },
            events: {
                defaults: {
                    initialize: {},
                    loadMasterData: {},
                    loadData: {},
                    bind: {},
                    change: {}
                }
            },
            dialogs: {
            }
        }
    };


    /**
    * 画面の初期化処理を行います。
    */
    page.events.defaults.initialize = function () {

        page.notify = App.ui.page.notify();
        App.ui.loading.show();

        page.events.defaults.getParameters();

        page.events.defaults.initializeControl();
        page.events.defaults.initializeControlEvent();

        page.section.events.defaults.initialize();

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
        //TODO: 遷移元から渡された値を取得し、保持する処理を記述します。

        var query = App.uri.splitQuery(location.search);
        page.values.user_id = query.user_id;
        if (App.isUndefOrNull(page.values.user_id)) {
            $.findP("UserName").prop("disabled", false);
        } else {
            $.findP("UserName").prop("disabled", true);
        }
    };

    /**
     * 画面コントロールの初期化処理を行います。
     */
    page.events.defaults.initializeControl = function () {
        //TODO: 画面全体で利用するコントロールの初期化処理をここに記述します。
        var title = page.options.strings.UserInput;
        $(".page-title").text(title);
        document.title = title;
    };
    /**
     * コントロールへのイベントの紐づけを行います。
     */
    page.events.defaults.initializeControlEvent = function () {

        App.ui.page.applyCollapsePanel();

        page.on($("#save"), "click", page.operations.defaults.save);
        page.on($("#remove"), "click", page.operations.defaults.remove);

        //TODO: 画面全体で利用するコントロールのイベントの紐づけ処理をここに記述します。
    };

    /**
     * 遷移元から渡されたパラメーターの取得を行います。
     */
    page.events.defaults.decryptParameters = function () {        
        var parameters = [page.values.user_id];
        return $.ajax(App.ajax.webapi.post(page.options.urls.decrypt, parameters)
        ).then(function (result) {
            page.values.user_id = result[0];
        });
    };

    /**
     * マスターデータのロード処理を実行します。
     */
    page.events.defaults.loadMasterData = function () {
        //TODO: 画面内のドロップダウンなどで利用されるマスターデータを取得し、画面にバインドする処理を記述します。
        return App.async.all(
            $.ajax(App.ajax.webapi.get(page.options.urls.units))
            .then(function (result) {
                page.events.setUnit(result);
            })
        );
    };

    page.events.setUnit = function (data) {
        var UnitId = $.findP("UnitId");
        UnitId.children().remove();
        App.ui.util.appendOptions(
            {
                target: UnitId,
                data: data,
                useEmpty: true,
                reviver: function (item) {
                    return {
                        value: item.UnitId,
                        display: App.str.format("{UnitName}", item)
                    }
                }
            }
        );
    }

    /**
     * 画面データのロード処理を実行します。
     */
    page.events.defaults.loadData = function () {
        //TODO: 保持しているキー項目をもとに処理を振り分けます。
        //キー項目がある場合は、詳細データを取得し更新モードとして処理を行います。
        //キー項目がない場合は、新規モードとして処理を行います。

        $("#remove").hide();

        //TODO: キー項目の判定を修正してください。
        if (!App.isUndefOrNull(page.values.user_id)) {
            //更新モードとして処理を行うために詳細データを取得します。

            var query = {
                url: page.options.urls.data,
                filter: "UserId eq " + page.values.user_id + "",
                skip: 0,
                top: 1,
                count: true
            };

            return App.async.all({

                //TODO: 取得の実行をpage.options.urls.dataにurlを設定後に以下のajaxの実行に置き換えます。
                
                data: $.ajax(App.ajax.webapi.get(App.data.toODataFormat(query)))

            }).then(function (result) {
                var data = result.successes.data;

                //データが取得できなかった場合は、新規モードとしてバインドを行いメッセージを表示したうえで処理を返す。
                if (data.Items.length) {
                    page.section.events.defaults.bind((data.Items || data)[0]);

                    $("#remove").show();
                }
                else {
                    page.notify.alert.message(page.options.messages.NotEixistsUser).show();
                    page.section.events.defaults.bind({
                        //TODO: デフォルト値を設定します。
                    }, true);

                    return App.async.success();
                }

            }, function (result) {

                //失敗の場合は新規モードとしメッセージを表示したうえで処理を返す。
                App.ui.page.normalizeError(result).forEach(function (e) {
                    page.notify.alert.message(e.message).show();
                });

                page.section.events.defaults.bind({
                    //TODO: デフォルト値を設定します。
                }, true);

                return App.async.success();
            });
        } else {
            //保持しているデータがない場合は、新規モードとし空の値をバインドします。
            page.section.events.defaults.bind({
                //TODO: デフォルト値を設定します。
            }, true);
            return App.async.success();
        }
    };

    /**
     * 画面で利用するダイアログのロード処理を実行します。
     */
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
    /**
     * すべてのバリデーションを実行します。
     */
    page.events.defaults.validateAll = function () {

        //TODO: 画面内で定義されているバリデーションを実行する処理を記述します。

        //各セクションで定義されているバリデーションを実行する処理を記述します。
        //var validations = page.events.defaults.getTargetSections().map(function (section) {
        //    return page[section].validator.validate();
        //});

        //return App.async.all(validations);
        return page.section.validator.validate();
    };

    /**
     * データの保存処理を実行します。
     */
    page.operations.defaults.save = function () {

        App.ui.loading.show();
        page.notify.alert.clear();
        page.notify.info.clear();

        page.events.defaults.validateAll().then(function () {

            //各セクションの変更セットを取得してセットします。
            //var changeSets = page.events.defaults.getTargetSections().reduce(function (changeSets, section) {
            //    changeSets[section] = page[section].data.getChangeSet();
            //    return changeSets;
            //}, {});
            var changeSet = page.section.data.getChangeSet();
            if (changeSet.created.length === 0 && changeSet.updated.length === 0 && changeSet.deleted.length === 0) {
                return App.async.success();
            }
            
            //TODO: 必要な場合はデータの整形を行います。

            //データの保存処理をここに記述します。
            //TODO: 保存の実行をpage.options.urls.dataにurlを設定後に以下のajaxの実行に置き換えます。
            return $.ajax(App.ajax.webapi.post(page.options.urls.save, changeSet)).then(function (result) {

                //TODO: データの保存成功時の処理をここに記述します。

                page.notify.alert.clear();
                page.notify.info.clear();

                //TODO: 更新されたキー情報を取得します。
                //ここでは同時に表示されるセクションが一つの前提とし先頭のセクション名をもとにキーを取得しています。
                //var sectionResult = result[page.events.defaults.getTargetSections()[0]];
                //if (sectionResult && sectionResult[0]) {
                page.values.user_id = (result.Users[0] || {}).UserId;
                //}

                $("#remove").show();
                $.findP("UserName").prop("disabled", true);
                //最後に再度データを取得しなおします。
                page.events.defaults.loadData();
                page.notify.info.message(page.options.messages.SaveCompleted).show();

            }, function (error) {
                //データの保存失敗時の処理をここに記述します。
                var normalizedErrors = App.ui.page.normalizeError(error);

                var normalizedError = normalizedErrors[0];
                if (normalizedError) {
                    //TODO: バリデーションエラーの処理を行います。
                    if (normalizedError.errorType === App.settings.base.errorTypes.inputError) {
                        page.events.defautls.serviceValidationFail(result);
                        return;
                    }
                    // TODO: 同時実行エラー時の処理を行っています。
                    if (normalizedError.errorType === App.settings.base.errorTypes.conflictError) {
                        // 既定では、メッセージを表示します。
                        page.notify.alert.message(page.options.messages.UpdateConfilict).show();
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
                $(":input:visible:not(:disabled):first").focus();
            }, 100);
            App.ui.loading.close();
        });
    };
    /**
     * データの削除処理を実行します。
     */
    page.operations.defaults.remove = function () {
        App.ui.page.confirm({
            // 明細行を削除する際のメッセージを設定します
            text: page.options.messages.ConfirmDelete
        }).then(function () {var element = page.section.element,
            entityId = element.attr("data-key"),
            entity = page.section.data.entry(entityId),
            changeSet;

        

            App.ui.loading.show();
            page.notify.alert.clear();
            page.notify.info.clear();

            //データの削除処理をここに記述します。
            return $.ajax(App.ajax.webapi.delete(page.options.urls.data + "?UserId=" + page.values.user_id)).then(function (result) {

                page.notify.info.message(page.options.messages.RemoveCompleted).show();

                //データの保存成功時の処理をここに記述します。
                //既定では新規モードで画面を開きなおします。
                setTimeout(function () {
                    var uri = App.uri.parse(location.href);
                    if (uri.query) {
                        delete uri.query.user_id;
                    }
                    location.href = App.uri.toUriString(uri);
                }, 100);
            }, function (error) {
                //データの削除失敗時の処理をここに記述します。
                var normalizedErrors = App.ui.page.normalizeError(error);
                var normalizedError = normalizedErrors[0];
                if (normalizedError) {
                    // TODO: 同時実行エラー時の処理を行っています。
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

    /**
     * サービスの入力検証エラー結果を表示します。
     */
    page.events.defaults.serviceValidationFail = function (error) {

        page.notify.alert.message(error.message).show();

        //エラーを逐次処理する
        error.errors.forEach(function (item) {
            var element,
                section = page[item.objectId];

            if (!section) {
                return;
            }
            element = section.element.findP(item.propertyId);
            page.events.defaults.validationFail([{
                message: item.message, element: element
            }]);
        });
    };

    /**
     * セクションのバリデーションを定義します。
     */
    page.section.options.validations = {
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
        },
        Password: {
            rules: {
                required: true,
                minlength: 6
            },
            options: {
                name: page.options.strings.Password
            },
            messages: {
                required: page.options.messages.Required,
                minlength: page.options.messages.MinLength
            }
        },
        Email: {
            rules: {
                required: true,
                maxlength: 100
            },
            options: {
                name: page.options.strings.Mail
            },
            messages: {
                required: page.options.messages.Required,
                maxlength: page.options.messages.MaxLength
            }
        },
        LastName: {
            rules: {
                required: true,
                maxlength: 50
            },
            options: {
                name: page.options.strings.LastName
            },
            messages: {
                required: page.options.messages.Required,
                maxlength: page.options.messages.MaxLength
            }
        },
        FirstName: {
            rules: {
                required: true,
                maxlength: 50
            },
            options: {
                name: page.options.strings.FirstName
            },
            messages: {
                required: page.options.messages.Required,
                maxlength: page.options.messages.MaxLength
            }
        }
    };
    /**
     * セクションのバインドを定義します。
     */
    page.section.options.bindOption = {
        appliers: {},
        converters: {}
    };
    /**
     * セクションを初期化します。
     */
    page.section.events.defaults.initialize = function () {
        var element = $(".section");
        page.section.validator = element.validation(page.events.defaults.createValidator(page.section.options.validations));

        page.section.element = element;
        App.ui.page.applyInput(element);

        page.on(element, "change", ":input", page.section.events.defaults.change);

        element.show();
    };
    /**
     * セクションのマスターデータロード処理を実行します。
     */
    //page.section.events.defaults.loadMasterData = function () {
    //    //TODO: セクションごとのドロップダウンなどで利用されるマスターデータを取得し、バインドする処理を記述します。
    //    return App.async.all({
    //        //service: $.ajax(App.ajax.webapi.get(page.section.options.urls/*TODO: マスターデータ取得サービスの URL*/))
    //    }).then(function (result) {

    //        //TODO:マスターデータ取得成功時のデータ設定処理を記述します

    //        var data = result.successes,
    //            element = page.section.element;

    //        //var serviceData = data.service;

    //    });
    //};
    /**
     * セクションのデータロード処理を実行します。
     */
    //page.section.events.defaults.loadData = function () {

    //};
    /**
     * セクションのデータバインド処理を実行します。
     */
    page.section.events.defaults.bind = function (data, isNewData) {
        var element = page.section.element,
            dataSet = App.ui.page.dataSet();

        page.section.data = dataSet;
        //新規データの場合はadd、そうでない場合はattachを行います。
        (isNewData ? dataSet.add : dataSet.attach).bind(dataSet)(data);
        //値を画面にバインドします。
        element.form(page.section.options.bindOption).bind(data);

        if (isNewData) {
            //TODO: 新規データの場合の処理を記述します。
            //ドロップダウンなど初期値がある場合は、
            //DataSetに値を反映させるために change 関数を呼び出します。
        }
    };
    /**
     * セクションのデータ変更処理を実行します。
     */
    page.section.events.defaults.change = function (e) {
        var element = page.section.element,
            target = $(e.target),
            entityId = element.attr("data-key"),
            property = target.attr("data-prop"),
            entity = page.section.data.entry(entityId),
            data = element.form(page.section.options.bindOption).data();

        //バリデーションを実行します。
        element.validation().validate({
            targets: target
        }).then(function () {
            //入力された値を取得し、エンティティを更新後、更新状態に変更します。
            entity[property] = data[property];
            page.section.data.update(entity);
        });
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


