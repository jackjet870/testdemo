describe("①画面定義", function () {

    describe("初期表示", function () {

        describe("ウィンドウタイトル", function (done) {

            it("「ユーザー検索」と表示される", function () {
                expect(document.title).toBe("ユーザー検索");
            });
        });

        describe("画面タイトル", function () {
            it("「ユーザー検索」と表示される", function () {
                expect($(".page-title")).toHaveText("ユーザー検索");
            });
        });

        describe("画面項目", function () {
            it("検索条件の項目が正しく設定されている", function () {
                var element = page.header.element;

                expect(element.findP("UserName").length).not.toEqual(0);
                expect(element.findP("Mail").length).not.toEqual(0);
                expect(element.findP("LastName").length).not.toEqual(0);
                expect(element.findP("FirstName").length).not.toEqual(0);
                expect(element.findP("UnitId").length).not.toEqual(0);
            });

            it("検索結果のグリッドのヘッダーが正しく設定されている", function () {
                var header$ = $(".datatable thead tr:first");

                expect(header$.findP("UserName").length).not.toEqual(0);
                expect(header$.findP("Email").length).not.toEqual(0);
                expect(header$.findP("LastName").length).not.toEqual(0);
                expect(header$.findP("FirstName").length).not.toEqual(0);
                expect(header$.findP("UnitName").length).not.toEqual(0);
            });

            it("検索結果のグリッドのテンプレートが正しく設定されている", function () {
                var row$ = $(".datatable tbody.item-tmpl");

                expect(row$.findP("UserName").length).not.toEqual(0);
                expect(row$.findP("Email").length).not.toEqual(0);
                expect(row$.findP("LastName").length).not.toEqual(0);
                expect(row$.findP("FirstName").length).not.toEqual(0);
                expect(row$.findP("UnitName").length).not.toEqual(0);
            });
        });

        describe("セクション開閉", function () {
            describe("検索条件", function () {
                beforeEach(function (done) {
                    $("[data-target = '.header.panel-collapse']").click();
                    setTimeout(function () {
                        done();
                    }, 500);
                });
                it("セクションが開いている状態でタイトル部をクリックすると、セクションが閉じる", function () {
                    expect($("[data-target = '.header.panel-collapse']").next().attr("aria-expanded")).toEqual("false");
                });

                it("セクションが閉じている状態でタイトル部をクリックすると、セクションが開く", function () {
                    expect($("[data-target = '.header.panel-collapse']").next().attr("aria-expanded")).toEqual("true");
                });
            });
        });
    });

    describe("②処理定義", function () {

        describe("定型画面機能定義", function () {

            describe("画面コントロールとイベントの紐づけ処理", function () {
                it("新規登録ボタンクリック時にpage.events.defaults.transfer関数が呼び出される", function () {
                    $._data($(".commands")[0], "events")["click"].forEach(function (item) {
                        if (item.selector == ".add") {
                            expect(page.events.defaults.transfer).toEqual(item.handler);
                        }
                    });
                });


                it("検索ボタンクリック時にpage.header.operations.defaults.search関数が呼び出される", function () {
                    $._data($(".commands")[0], "events")["click"].forEach(function (item) {
                        if (item.selector == ".search") {
                            expect(page.header.operations.defaults.search).toEqual(item.handler);
                        }
                    });
                });

                it("ダウンロードボタンクリック時にpage.header.operations.defaults.download関数が呼び出される", function () {
                    $._data($(".commands")[0], "events")["click"].forEach(function (item) {
                        if (item.selector == ".download") {
                            expect(page.header.operations.defaults.download).toEqual(item.handler);
                        }
                    });
                });

                it("PDFボタンクリック時にpage.header.operations.defaults.ouputPdf関数が呼び出される", function () {
                    $._data($(".commands")[0], "events")["click"].forEach(function (item) {
                        if (item.selector == ".ouputPdf") {
                            expect(page.header.operations.defaults.ouputPdf).toEqual(item.handler);
                        }
                    });
                });
            });

            describe("入力検証処理", function () {
                var criterias;

                criterias = [
                       {
                           UserName: "012345678901234567890123456789012345678901234567890",
                           Mail: null,
                           LastName: null,
                           FirstName: null,
                           UnitId: null
                       },
                ];

                validationBeforeEach = function (criteria, done) {
                    page.header.element.find("textarea, :text, select").val("").end().find(":checked").prop("checked", false);
                    page.header.element.form().bind(criteria);

                    spyOn($, 'ajax').and.callFake(function (req) {
                        url = req.url;

                        var d = $.Deferred();
                        d.resolve({});
                        return d.promise();
                    });

                    $(".commands .search").trigger("click");

                    setTimeout(function () {
                        if ($(".loading").length === 0) {
                            done();
                        }

                    }, 1000);
                };

                afterEach(function (done) {
                    page.notify.alert.clear();

                    setTimeout(function () {
                        done();
                    }, 500);
                });

                describe("入力検証パターン1", function () {
                    beforeEach(function (done) {
                        validationBeforeEach(criterias[0], done);
                    });

                    it("入力検証処理が失敗した場合はエラーが表示される", function () {
                        expect(page.notify.alert.count()).toHaveLength(1);
                    });
                });
            });

            describe("データ取得処理", function () {

                describe("処理成功時", function () {
                    var url, urls, criterias, results;

                    criterias = [
                        {
                            UserName: null,
                            Mail: null,
                            LastName: null,
                            FirstName: null,
                            UnitId: null
                        },
                        {
                            UserName: "quang@archway.co.jp",
                            Mail: null,
                            LastName: null,
                            FirstName: null,
                            UnitId: null
                        },
                        {
                            UserName: null,
                            Mail: "renk@archway.co.jp",
                            LastName: null,
                            FirstName: null,
                            UnitId: null
                        },
                        {
                            UserName: null,
                            Mail: null,
                            LastName: "Pham",
                            FirstName: null,
                            UnitId: null
                        },
                        {
                            UserName: null,
                            Mail: null,
                            LastName: null,
                            FirstName: "Hieu",
                            UnitId: null
                        },
                        {
                            UserName: null,
                            Mail: null,
                            LastName: null,
                            FirstName: null,
                            UnitId: "c3ba8900-7331-4f7a-b508-3880f69e7ee3"
                        },
                        {
                            UserName: "n",
                            Mail: "n",
                            LastName: null,
                            FirstName: null,
                            UnitId: null
                        },
                        {
                            UserName: null,
                            Mail: "n",
                            LastName: "h",
                            FirstName: null,
                            UnitId: null
                        },
                        {
                            UserName: null,
                            Mail: null,
                            LastName: "h",
                            FirstName: "o",
                            UnitId: null
                        },
                        {
                            UserName: null,
                            Mail: null,
                            LastName: null,
                            FirstName: "管理者",
                            UnitId: "c3ba8900-7331-4f7a-b508-3880f69e7ee3"
                        },
                        {
                            UserName: "a",
                            Mail: "a",
                            LastName: "システム",
                            FirstName: "管理者",
                            UnitId: "c3ba8900-7331-4f7a-b508-3880f69e7ee3"
                        }
                    ];

                    urls = [
                        { url: "/Membership/V1/Users/api/Users?$skip=0&$top=100&$count=true" },
                        { url: "/Membership/V1/Users/api/Users?$filter=contains(UserName, 'quang%40archway.co.jp') eq true&$skip=0&$top=100&$count=true" },
                        { url: "/Membership/V1/Users/api/Users?$filter=contains(Email, 'renk%40archway.co.jp') eq true&$skip=0&$top=100&$count=true" },
                        { url: "/Membership/V1/Users/api/Users?$filter=contains(LastName, 'Pham') eq true&$skip=0&$top=100&$count=true" },
                        { url: "/Membership/V1/Users/api/Users?$filter=contains(FirstName, 'Hieu') eq true&$skip=0&$top=100&$count=true" },
                        { url: "/Membership/V1/Users/api/Users?$filter=UnitId eq c3ba8900-7331-4f7a-b508-3880f69e7ee3&$skip=0&$top=100&$count=true" },
                        { url: "/Membership/V1/Users/api/Users?$filter=contains(UserName, 'n') eq true and contains(Email, 'n') eq true&$skip=0&$top=100&$count=true" },
                        { url: "/Membership/V1/Users/api/Users?$filter=contains(Email, 'n') eq true and contains(LastName, 'h') eq true&$skip=0&$top=100&$count=true" },
                        { url: "/Membership/V1/Users/api/Users?$filter=contains(LastName, 'h') eq true and contains(FirstName, 'o') eq true&$skip=0&$top=100&$count=true" },
                        { url: "/Membership/V1/Users/api/Users?$filter=contains(FirstName, '%E7%AE%A1%E7%90%86%E8%80%85') eq true and UnitId eq c3ba8900-7331-4f7a-b508-3880f69e7ee3&$skip=0&$top=100&$count=true" },
                        { url: "/Membership/V1/Users/api/Users?$filter=contains(UserName, 'a') eq true and contains(Email, 'a') eq true and contains(LastName, '%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0') eq true and contains(FirstName, '%E7%AE%A1%E7%90%86%E8%80%85') eq true and UnitId eq c3ba8900-7331-4f7a-b508-3880f69e7ee3&$skip=0&$top=100&$count=true" }
                    ];

                    results = [
                        {
                            Items: [
                                { UserId: "d6450aca-36b6-49ba-b962-6bd9f5fb20f1", UserName: "quang@archway.co.jp", UsersTimestamp: "AAAAAAAAEQU=", Email: "quang@archway.co.jp", FirstName: "QUANG", LastName: "VO NHAT", ProfilesLastUpdatedDate: "2015-08-12T13:55:33.0357426+09:00", ProfilesTimestamp: "AAAAAAAAEQY=", UnitId: null, UnitName: null, UnitsLastUpdatedDate: null, UnitsTimestamp: "", Password: "9wSfWl4YfmQjUTXL0d97uG5HjdGZ9J6YPQU4fCGlpoyNrEhwSjNibR4B2ep45kcI" },
                                { UserId: "6e9c785f-3502-4f7a-885b-b2c6f2661548", UserName: "son@archway.co.jp", UsersTimestamp: "AAAAAAAAEQM=", Email: "son@archway.co.jp", FirstName: "Son", LastName: "Pham", ProfilesLastUpdatedDate: "2015-09-07T18:47:55.7620939+09:00", ProfilesTimestamp: "AAAAAAAAF9g=", UnitId: null, UnitName: null, UnitsLastUpdatedDate: null, UnitsTimestamp: "", Password: "A3jgeza1WqPqzVH7FdcJ3ltrrlnQtyC9JqvNBQqYI6xkyqweNRzgkb0f3WqfeGa9" },
                                { UserId: "ff2c7cc4-70b6-4c96-9de7-ef07a030a0d4", UserName: "ngocha@archway.co.jp", UsersTimestamp: "AAAAAAAAEoc=", Email: "ngocha@archway.co.jp", FirstName: "Ngoc Ha", LastName: "Nguyen Thi", ProfilesLastUpdatedDate: "2015-08-21T11:16:07.8280701+09:00", ProfilesTimestamp: "AAAAAAAAEoA=", UnitId: null, UnitName: null, UnitsLastUpdatedDate: null, UnitsTimestamp: "", Password: "ZLtrbMokwnoYZxNJqg9bHyxo4CGcaXVm7wSN9mG0KdD9sIsdrNlVGRVu2orvIQjO" },
                                { UserId: "878d3d7d-ef3f-45c0-85a3-80c901217838", UserName: "hieu@archway.co.jp", UsersTimestamp: "AAAAAAAAETo=", Email: "hieu@archway.co.jp", FirstName: "Hieu", LastName: "Luong Nguyen Trung", ProfilesLastUpdatedDate: "2015-08-12T13:56:48.6883253+09:00", ProfilesTimestamp: "AAAAAAAAEQg=", UnitId: null, UnitName: null, UnitsLastUpdatedDate: null, UnitsTimestamp: "", Password: "WOwgZ5MBhJvnpD3dV6hAp6ylNMYKW7pni8LoSVeLCFf5G2mzjuBVIyPVIvWdnjUM" },
                                { UserId: "85484381-cfc8-45e5-ba6c-966eec55b9cb", UserName: "k-maru@archway.co.jp", UsersTimestamp: "AAAAAAAAGBM=", Email: "k-maru@archway.co.jp", FirstName: "Kazuhide", LastName: "Maruyama", ProfilesLastUpdatedDate: "2015-07-14T11:40:37.6394227+09:00", ProfilesTimestamp: "AAAAAAAADm0=", UnitId: null, UnitName: null, UnitsLastUpdatedDate: null, UnitsTimestamp: "", Password: "FHo6sLC+Hp4M5I9eGWUKYX4New+mMc8xaLk3CI1tvNqdzR+xiRcr3rcws69+Sfk0" },
                                { UserId: "ceea4132-a82b-43fa-8e39-2d29bc304d3a", UserName: "nokuda@archway.co.jp", UsersTimestamp: "AAAAAAAAF+U=", Email: "nokuda@archway.co.jp", FirstName: "Okuda", LastName: "Naoto", ProfilesLastUpdatedDate: "2015-07-14T08:10:54.2059343+09:00", ProfilesTimestamp: "AAAAAAAADmM=", UnitId: null, UnitName: null, UnitsLastUpdatedDate: null, UnitsTimestamp: "", Password: "H0juTJJdj/H5Nbw4aOCWIPo/NGSQsZYo5zf7t5z+MUT4zn9jjyQkvDHE+UM55xdO" },
                                { UserId: "c0af8434-2b63-4c7a-a8a0-8b66fb6960d8", UserName: "tsune@archway.co.jp", UsersTimestamp: "AAAAAAAADok=", Email: "tsune@archway.co.jp", FirstName: "Tsunefumi", LastName: "Nakanishi", ProfilesLastUpdatedDate: "2015-07-15T14:00:09.3796134+09:00", ProfilesTimestamp: "AAAAAAAADrc=", UnitId: null, UnitName: null, UnitsLastUpdatedDate: null, UnitsTimestamp: "", Password: "Htc4GGeVzc8peE4dP7oFoAMPOYInCRRrU3yILzIvN+gbyAlnXCJct57lqjPkcT33" },
                                { UserId: "a2099673-cb4e-43b6-994f-28d7e69ba748", UserName: "sae@archway.co.jp", UsersTimestamp: "AAAAAAAADrU=", Email: "sae@archway.co.jp", FirstName: "佐江", LastName: "若松", ProfilesLastUpdatedDate: "2015-07-15T13:58:02.6464995+09:00", ProfilesTimestamp: "AAAAAAAADrY=", UnitId: null, UnitName: null, UnitsLastUpdatedDate: null, UnitsTimestamp: "", Password: "hVQsUkGcVAtpmiB2m38hTgmO437INnQw0726Jv+TTc+1giQM0+mx3B9VAcHgfo8n" },
                                { UserId: "44449919-fb09-4b01-924a-76a3c5a74d3a", UserName: "renk@archway.co.jp", UsersTimestamp: "AAAAAAAADrw=", Email: "renk@archway.co.jp", FirstName: "錬", LastName: "河野", ProfilesLastUpdatedDate: "2015-07-15T14:01:21.1295939+09:00", ProfilesTimestamp: "AAAAAAAADr0=", UnitId: null, UnitName: null, UnitsLastUpdatedDate: null, UnitsTimestamp: "", Password: "IQ568AOSc7kZBV/9quxJA2gUUHksRw59tPEp7NMfnMBYGi0GKhxkirvFZceGpx0o" },
                                { UserId: "70ce3ee5-905a-400f-bdaa-abb5475bf224", UserName: "amimata@archway.co.jp", UsersTimestamp: "AAAAAAAAG9g=", Email: "amimata@archway.co.jp", FirstName: "Aya", LastName: "Mimata", ProfilesLastUpdatedDate: "2015-07-14T08:13:16.9997182+09:00", ProfilesTimestamp: "AAAAAAAADmc=", UnitId: null, UnitName: null, UnitsLastUpdatedDate: null, UnitsTimestamp: "", Password: "RI/B7XNLOPRVhdu8Z0XJUaEqZrKhUeeNsR/uBpQana98VxHnt3ebzAF4LUR3Y5Vq" },
                                { UserId: "ec39441b-84d2-4ba0-b738-853afb8ad014", UserName: "kasuya@archway.co.jp", UsersTimestamp: "AAAAAAAADr4=", Email: "kasuya@archway.co.jp", FirstName: "洋子", LastName: "粕谷", ProfilesLastUpdatedDate: "2015-07-15T14:01:38.1138004+09:00", ProfilesTimestamp: "AAAAAAAADr8=", UnitId: null, UnitName: null, UnitsLastUpdatedDate: null, UnitsTimestamp: "", Password: "UVdnJQj9A9MzAZJXuTxVPxu4/BxWeNseN5e0Xuogl2CY3RRA/KysCy+04HEa5EY2" },
                                { UserId: "1f5f548e-e50b-4956-a1ef-b726bdb52d94", UserName: "hmoriya@archway.co.jp", UsersTimestamp: "AAAAAAAADm4=", Email: "hmoriya@archway.co.jp", FirstName: "Hideharu", LastName: "Moriya", ProfilesLastUpdatedDate: "2015-07-14T11:41:29.6190365+09:00", ProfilesTimestamp: "AAAAAAAADm8=", UnitId: null, UnitName: null, UnitsLastUpdatedDate: null, UnitsTimestamp: "", Password: "vQ9wEIe1nzM4gikoXs+KlhVKR6sff86L+4DTIrC9FBJAl0uAUjkA9PiEemeYZRod" },
                                { UserId: "5361d9cd-e471-4d80-b70f-a3c1b3b32724", UserName: "h-saitou@archway.co.jp", UsersTimestamp: "AAAAAAAADs0=", Email: "h-saitou@archway.co.jp", FirstName: "宏明", LastName: "斉藤", ProfilesLastUpdatedDate: "2015-07-15T14:08:46.955805+09:00", ProfilesTimestamp: "AAAAAAAADs4=", UnitId: null, UnitName: null, UnitsLastUpdatedDate: null, UnitsTimestamp: "", Password: "YCRVkWNFtO558qCDvbk/HC2wBjDeZGmiSsGvkpkHN9MU99qrM3F/qg4kmYYRcpWn" },
                                { UserId: "6714612d-01c1-422b-b49c-1c470dacc634", UserName: "Admin", UsersTimestamp: "AAAAAAAAH1E=", Email: "admin@aspnet15.co.jp", FirstName: "管理者", LastName: "システム", ProfilesLastUpdatedDate: "2014-12-09T18:11:41.8889383+09:00", ProfilesTimestamp: "AAAAAAAAB9M=", UnitId: "c3ba8900-7331-4f7a-b508-3880f69e7ee3", UnitName: "情報システム部", UnitsLastUpdatedDate: "2014-12-05T00:00:00+09:00", UnitsTimestamp: "AAAAAAAAB9c=", Password: "NsmioOqzCPsjyybCPTU5gErCdzUccW+3m9M6vF3Gx2s4DMedCCF8WheeCjQL3Mkb" }
                            ],
                            NextPageLink: null,
                            Count: 14
                        },
                        {
                            Items: [
                                { UserId: "d6450aca-36b6-49ba-b962-6bd9f5fb20f1", UserName: "quang@archway.co.jp", UsersTimestamp: "AAAAAAAAEQU=", Email: "quang@archway.co.jp", FirstName: "QUANG", LastName: "VO NHAT", ProfilesLastUpdatedDate: "2015-08-12T13:55:33.0357426+09:00", ProfilesTimestamp: "AAAAAAAAEQY=", UnitId: null, UnitName: null, UnitsLastUpdatedDate: null, UnitsTimestamp: "", Password: "9wSfWl4YfmQjUTXL0d97uG5HjdGZ9J6YPQU4fCGlpoyNrEhwSjNibR4B2ep45kcI" }
                            ],
                            NextPageLink: null,
                            Count: 1
                        },
                        {
                            Items: [
                                { UserId: "44449919-fb09-4b01-924a-76a3c5a74d3a", UserName: "renk@archway.co.jp", UsersTimestamp: "AAAAAAAADrw=", Email: "renk@archway.co.jp", FirstName: "錬", LastName: "河野", ProfilesLastUpdatedDate: "2015-07-15T14:01:21.1295939+09:00", ProfilesTimestamp: "AAAAAAAADr0=", UnitId: null, UnitName: null, UnitsLastUpdatedDate: null, UnitsTimestamp: "", Password: "IQ568AOSc7kZBV/9quxJA2gUUHksRw59tPEp7NMfnMBYGi0GKhxkirvFZceGpx0o" }
                            ],
                            NextPageLink: null,
                            Count: 1
                        },
                        {
                            Items: [
                                { UserId: "6e9c785f-3502-4f7a-885b-b2c6f2661548", UserName: "son@archway.co.jp", UsersTimestamp: "AAAAAAAAEQM=", Email: "son@archway.co.jp", FirstName: "Son", LastName: "Pham", ProfilesLastUpdatedDate: "2015-09-07T18:47:55.7620939+09:00", ProfilesTimestamp: "AAAAAAAAF9g=", UnitId: null, UnitName: null, UnitsLastUpdatedDate: null, UnitsTimestamp: "", Password: "A3jgeza1WqPqzVH7FdcJ3ltrrlnQtyC9JqvNBQqYI6xkyqweNRzgkb0f3WqfeGa9" },
                            ],
                            NextPageLink: null,
                            Count: 1
                        },
                        {
                            Items: [
                                { UserId: "878d3d7d-ef3f-45c0-85a3-80c901217838", UserName: "hieu@archway.co.jp", UsersTimestamp: "AAAAAAAAETo=", Email: "hieu@archway.co.jp", FirstName: "Hieu", LastName: "Luong Nguyen Trung", ProfilesLastUpdatedDate: "2015-08-12T13:56:48.6883253+09:00", ProfilesTimestamp: "AAAAAAAAEQg=", UnitId: null, UnitName: null, UnitsLastUpdatedDate: null, UnitsTimestamp: "", Password: "WOwgZ5MBhJvnpD3dV6hAp6ylNMYKW7pni8LoSVeLCFf5G2mzjuBVIyPVIvWdnjUM" },
                            ],
                            NextPageLink: null,
                            Count: 1
                        },
                        {
                            Items: [
                                { UserId: "6714612d-01c1-422b-b49c-1c470dacc634", UserName: "Admin", UsersTimestamp: "AAAAAAAAH1E=", Email: "admin@aspnet15.co.jp", FirstName: "管理者", LastName: "システム", ProfilesLastUpdatedDate: "2014-12-09T18:11:41.8889383+09:00", ProfilesTimestamp: "AAAAAAAAB9M=", UnitId: "c3ba8900-7331-4f7a-b508-3880f69e7ee3", UnitName: "情報システム部", UnitsLastUpdatedDate: "2014-12-05T00:00:00+09:00", UnitsTimestamp: "AAAAAAAAB9c=", Password: "NsmioOqzCPsjyybCPTU5gErCdzUccW+3m9M6vF3Gx2s4DMedCCF8WheeCjQL3Mkb" }
                            ],
                            NextPageLink: null,
                            Count: 1
                        },
                        {
                            Items: [
                                { UserId: "d6450aca-36b6-49ba-b962-6bd9f5fb20f1", UserName: "quang@archway.co.jp", UsersTimestamp: "AAAAAAAAEQU=", Email: "quang@archway.co.jp", FirstName: "QUANG", LastName: "VO NHAT", ProfilesLastUpdatedDate: "2015-08-12T13:55:33.0357426+09:00", ProfilesTimestamp: "AAAAAAAAEQY=", UnitId: null, UnitName: null, UnitsLastUpdatedDate: null, UnitsTimestamp: "", Password: "9wSfWl4YfmQjUTXL0d97uG5HjdGZ9J6YPQU4fCGlpoyNrEhwSjNibR4B2ep45kcI" },
                                { UserId: "6e9c785f-3502-4f7a-885b-b2c6f2661548", UserName: "son@archway.co.jp", UsersTimestamp: "AAAAAAAAEQM=", Email: "son@archway.co.jp", FirstName: "Son", LastName: "Pham", ProfilesLastUpdatedDate: "2015-09-07T18:47:55.7620939+09:00", ProfilesTimestamp: "AAAAAAAAF9g=", UnitId: null, UnitName: null, UnitsLastUpdatedDate: null, UnitsTimestamp: "", Password: "A3jgeza1WqPqzVH7FdcJ3ltrrlnQtyC9JqvNBQqYI6xkyqweNRzgkb0f3WqfeGa9" },
                                { UserId: "ff2c7cc4-70b6-4c96-9de7-ef07a030a0d4", UserName: "ngocha@archway.co.jp", UsersTimestamp: "AAAAAAAAEoc=", Email: "ngocha@archway.co.jp", FirstName: "Ngoc Ha", LastName: "Nguyen Thi", ProfilesLastUpdatedDate: "2015-08-21T11:16:07.8280701+09:00", ProfilesTimestamp: "AAAAAAAAEoA=", UnitId: null, UnitName: null, UnitsLastUpdatedDate: null, UnitsTimestamp: "", Password: "ZLtrbMokwnoYZxNJqg9bHyxo4CGcaXVm7wSN9mG0KdD9sIsdrNlVGRVu2orvIQjO" },
                                { UserId: "ceea4132-a82b-43fa-8e39-2d29bc304d3a", UserName: "nokuda@archway.co.jp", UsersTimestamp: "AAAAAAAAF+U=", Email: "nokuda@archway.co.jp", FirstName: "Okuda", LastName: "Naoto", ProfilesLastUpdatedDate: "2015-07-14T08:10:54.2059343+09:00", ProfilesTimestamp: "AAAAAAAADmM=", UnitId: null, UnitName: null, UnitsLastUpdatedDate: null, UnitsTimestamp: "", Password: "H0juTJJdj/H5Nbw4aOCWIPo/NGSQsZYo5zf7t5z+MUT4zn9jjyQkvDHE+UM55xdO" },
                                { UserId: "c0af8434-2b63-4c7a-a8a0-8b66fb6960d8", UserName: "tsune@archway.co.jp", UsersTimestamp: "AAAAAAAADok=", Email: "tsune@archway.co.jp", FirstName: "Tsunefumi", LastName: "Nakanishi", ProfilesLastUpdatedDate: "2015-07-15T14:00:09.3796134+09:00", ProfilesTimestamp: "AAAAAAAADrc=", UnitId: null, UnitName: null, UnitsLastUpdatedDate: null, UnitsTimestamp: "", Password: "Htc4GGeVzc8peE4dP7oFoAMPOYInCRRrU3yILzIvN+gbyAlnXCJct57lqjPkcT33" },
                                { UserId: "6714612d-01c1-422b-b49c-1c470dacc634", UserName: "Admin", UsersTimestamp: "AAAAAAAAH1E=", Email: "admin@aspnet15.co.jp", FirstName: "管理者", LastName: "システム", ProfilesLastUpdatedDate: "2014-12-09T18:11:41.8889383+09:00", ProfilesTimestamp: "AAAAAAAAB9M=", UnitId: "c3ba8900-7331-4f7a-b508-3880f69e7ee3", UnitName: "情報システム部", UnitsLastUpdatedDate: "2014-12-05T00:00:00+09:00", UnitsTimestamp: "AAAAAAAAB9c=", Password: "NsmioOqzCPsjyybCPTU5gErCdzUccW+3m9M6vF3Gx2s4DMedCCF8WheeCjQL3Mkb" }
                            ],
                            NextPageLink: null,
                            Count: 6
                        },
                        {
                            Items: [
                                { UserId: "d6450aca-36b6-49ba-b962-6bd9f5fb20f1", UserName: "quang@archway.co.jp", UsersTimestamp: "AAAAAAAAEQU=", Email: "quang@archway.co.jp", FirstName: "QUANG", LastName: "VO NHAT", ProfilesLastUpdatedDate: "2015-08-12T13:55:33.0357426+09:00", ProfilesTimestamp: "AAAAAAAAEQY=", UnitId: null, UnitName: null, UnitsLastUpdatedDate: null, UnitsTimestamp: "", Password: "9wSfWl4YfmQjUTXL0d97uG5HjdGZ9J6YPQU4fCGlpoyNrEhwSjNibR4B2ep45kcI" },
                                { UserId: "6e9c785f-3502-4f7a-885b-b2c6f2661548", UserName: "son@archway.co.jp", UsersTimestamp: "AAAAAAAAEQM=", Email: "son@archway.co.jp", FirstName: "Son", LastName: "Pham", ProfilesLastUpdatedDate: "2015-09-07T18:47:55.7620939+09:00", ProfilesTimestamp: "AAAAAAAAF9g=", UnitId: null, UnitName: null, UnitsLastUpdatedDate: null, UnitsTimestamp: "", Password: "A3jgeza1WqPqzVH7FdcJ3ltrrlnQtyC9JqvNBQqYI6xkyqweNRzgkb0f3WqfeGa9" },
                                { UserId: "ff2c7cc4-70b6-4c96-9de7-ef07a030a0d4", UserName: "ngocha@archway.co.jp", UsersTimestamp: "AAAAAAAAEoc=", Email: "ngocha@archway.co.jp", FirstName: "Ngoc Ha", LastName: "Nguyen Thi", ProfilesLastUpdatedDate: "2015-08-21T11:16:07.8280701+09:00", ProfilesTimestamp: "AAAAAAAAEoA=", UnitId: null, UnitName: null, UnitsLastUpdatedDate: null, UnitsTimestamp: "", Password: "ZLtrbMokwnoYZxNJqg9bHyxo4CGcaXVm7wSN9mG0KdD9sIsdrNlVGRVu2orvIQjO" }
                            ],
                            NextPageLink: null,
                            Count: 3
                        },
                        {
                            Items: [
                                { UserId: "6e9c785f-3502-4f7a-885b-b2c6f2661548", UserName: "son@archway.co.jp", UsersTimestamp: "AAAAAAAAEQM=", Email: "son@archway.co.jp", FirstName: "Son", LastName: "Pham", ProfilesLastUpdatedDate: "2015-09-07T18:47:55.7620939+09:00", ProfilesTimestamp: "AAAAAAAAF9g=", UnitId: null, UnitName: null, UnitsLastUpdatedDate: null, UnitsTimestamp: "", Password: "A3jgeza1WqPqzVH7FdcJ3ltrrlnQtyC9JqvNBQqYI6xkyqweNRzgkb0f3WqfeGa9" },
                                { UserId: "ff2c7cc4-70b6-4c96-9de7-ef07a030a0d4", UserName: "ngocha@archway.co.jp", UsersTimestamp: "AAAAAAAAEoc=", Email: "ngocha@archway.co.jp", FirstName: "Ngoc Ha", LastName: "Nguyen Thi", ProfilesLastUpdatedDate: "2015-08-21T11:16:07.8280701+09:00", ProfilesTimestamp: "AAAAAAAAEoA=", UnitId: null, UnitName: null, UnitsLastUpdatedDate: null, UnitsTimestamp: "", Password: "ZLtrbMokwnoYZxNJqg9bHyxo4CGcaXVm7wSN9mG0KdD9sIsdrNlVGRVu2orvIQjO" }
                            ],
                            NextPageLink: null,
                            Count: 2
                        },
                        {
                            Items: [
                                { UserId: "6714612d-01c1-422b-b49c-1c470dacc634", UserName: "Admin", UsersTimestamp: "AAAAAAAAH1E=", Email: "admin@aspnet15.co.jp", FirstName: "管理者", LastName: "システム", ProfilesLastUpdatedDate: "2014-12-09T18:11:41.8889383+09:00", ProfilesTimestamp: "AAAAAAAAB9M=", UnitId: "c3ba8900-7331-4f7a-b508-3880f69e7ee3", UnitName: "情報システム部", UnitsLastUpdatedDate: "2014-12-05T00:00:00+09:00", UnitsTimestamp: "AAAAAAAAB9c=", Password: "NsmioOqzCPsjyybCPTU5gErCdzUccW+3m9M6vF3Gx2s4DMedCCF8WheeCjQL3Mkb" }
                            ],
                            NextPageLink: null,
                            Count: 1
                        },
                        {
                            Items: [
                                { UserId: "6714612d-01c1-422b-b49c-1c470dacc634", UserName: "Admin", UsersTimestamp: "AAAAAAAAH1E=", Email: "admin@aspnet15.co.jp", FirstName: "管理者", LastName: "システム", ProfilesLastUpdatedDate: "2014-12-09T18:11:41.8889383+09:00", ProfilesTimestamp: "AAAAAAAAB9M=", UnitId: "c3ba8900-7331-4f7a-b508-3880f69e7ee3", UnitName: "情報システム部", UnitsLastUpdatedDate: "2014-12-05T00:00:00+09:00", UnitsTimestamp: "AAAAAAAAB9c=", Password: "NsmioOqzCPsjyybCPTU5gErCdzUccW+3m9M6vF3Gx2s4DMedCCF8WheeCjQL3Mkb" }
                            ],
                            NextPageLink: null,
                            Count: 1
                        }
                    ];

                    dataPatternBeforeach = function (criteria, result, done) {
                        page.header.element.find("textarea, :text, select").val("").end().find(":checked").prop("checked", false);

                        page.header.element.form().bind(criteria);

                        spyOn($, 'ajax').and.callFake(function (req) {
                            url = req.url;

                            var d = $.Deferred();
                            d.resolve(result);
                            return d.promise();
                        });

                        $(".commands .search").trigger("click");

                        setTimeout(function () {
                            if ($(".loading").length === 0) {
                                done();
                            }

                        }, 1000);
                    };

                    dataPatternExpectUrl = function (expectUrl) {
                        expect(url).toEqual(expectUrl.url);
                    };

                    dataPatternExpectBind = function (result) {
                        var row$ = $(".datatable tbody:not(.item-tmpl):first");

                        expect(row$.findP("UserName")).toHaveText(App.isUndefOrNull(result.Items[0].UserName) ? "" : result.Items[0].UserName);
                        expect(row$.findP("Email")).toHaveText(App.isUndefOrNull(result.Items[0].Email) ? "" : result.Items[0].Email);
                        expect(row$.findP("LastName")).toHaveText(App.isUndefOrNull(result.Items[0].LastName) ? "" : result.Items[0].LastName);
                        expect(row$.findP("FirstName")).toHaveText(App.isUndefOrNull(result.Items[0].FirstName) ? "" : result.Items[0].FirstName);
                        expect(row$.findP("UnitName")).toHaveText(App.isUndefOrNull(result.Items[0].UnitName) ? "" : result.Items[0].UnitName);
                    };

                    describe("検索パターン1", function () {
                        beforeEach(function (done) {
                            dataPatternBeforeach(criterias[0], results[0], done);
                        });

                        it("ユーザー検索処理で正しいURLでサービスが呼び出される", function () {
                            dataPatternExpectUrl(urls[0]);
                        });

                        it("サービスから受け取ったデータを画面項目にセットする", function () {
                            dataPatternExpectBind(results[0]);
                        });
                    });

                    describe("検索パターン2", function () {
                        beforeEach(function (done) {
                            dataPatternBeforeach(criterias[1], results[1], done);
                        });

                        it("ユーザー検索処理で正しいURLでサービスが呼び出される", function () {
                            dataPatternExpectUrl(urls[1]);
                        });

                        it("サービスから受け取ったデータを画面項目にセットする", function () {
                            dataPatternExpectBind(results[1]);
                        });
                    });

                    describe("検索パターン3", function () {
                        beforeEach(function (done) {
                            dataPatternBeforeach(criterias[2], results[2], done);
                        });

                        it("ユーザー検索処理で正しいURLでサービスが呼び出される", function () {
                            dataPatternExpectUrl(urls[2]);
                        });

                        it("サービスから受け取ったデータを画面項目にセットする", function () {
                            dataPatternExpectBind(results[2]);
                        });
                    });

                    describe("検索パターン4", function () {
                        beforeEach(function (done) {
                            dataPatternBeforeach(criterias[3], results[3], done);
                        });

                        it("ユーザー検索処理で正しいURLでサービスが呼び出される", function () {
                            dataPatternExpectUrl(urls[3]);
                        });

                        it("サービスから受け取ったデータを画面項目にセットする", function () {
                            dataPatternExpectBind(results[3]);
                        });
                    });

                    describe("検索パターン5", function () {
                        beforeEach(function (done) {
                            dataPatternBeforeach(criterias[4], results[4], done);
                        });

                        it("ユーザー検索処理で正しいURLでサービスが呼び出される", function () {
                            dataPatternExpectUrl(urls[4]);
                        });

                        it("サービスから受け取ったデータを画面項目にセットする", function () {
                            dataPatternExpectBind(results[4]);
                        });
                    });

                    describe("検索パターン6", function () {
                        beforeEach(function (done) {
                            dataPatternBeforeach(criterias[5], results[5], done);
                        });

                        it("ユーザー検索処理で正しいURLでサービスが呼び出される", function () {
                            dataPatternExpectUrl(urls[5]);
                        });

                        it("サービスから受け取ったデータを画面項目にセットする", function () {
                            dataPatternExpectBind(results[5]);
                        });
                    });

                    describe("検索パターン7", function () {
                        beforeEach(function (done) {
                            dataPatternBeforeach(criterias[6], results[6], done);
                        });

                        it("ユーザー検索処理で正しいURLでサービスが呼び出される", function () {
                            dataPatternExpectUrl(urls[6]);
                        });

                        it("サービスから受け取ったデータを画面項目にセットする", function () {
                            dataPatternExpectBind(results[6]);
                        });
                    });

                    describe("検索パターン8", function () {
                        beforeEach(function (done) {
                            dataPatternBeforeach(criterias[7], results[7], done);
                        });

                        it("ユーザー検索処理で正しいURLでサービスが呼び出される", function () {
                            dataPatternExpectUrl(urls[7]);
                        });

                        it("サービスから受け取ったデータを画面項目にセットする", function () {
                            dataPatternExpectBind(results[7]);
                        });
                    });

                    describe("検索パターン9", function () {
                        beforeEach(function (done) {
                            dataPatternBeforeach(criterias[8], results[8], done);
                        });

                        it("ユーザー検索処理で正しいURLでサービスが呼び出される", function () {
                            dataPatternExpectUrl(urls[8]);
                        });

                        it("サービスから受け取ったデータを画面項目にセットする", function () {
                            dataPatternExpectBind(results[8]);
                        });
                    });

                    describe("検索パターン10", function () {
                        beforeEach(function (done) {
                            dataPatternBeforeach(criterias[9], results[9], done);
                        });

                        it("ユーザー検索処理で正しいURLでサービスが呼び出される", function () {
                            dataPatternExpectUrl(urls[9]);
                        });

                        it("サービスから受け取ったデータを画面項目にセットする", function () {
                            dataPatternExpectBind(results[9]);
                        });
                    });

                    describe("検索パターン11", function () {
                        beforeEach(function (done) {
                            dataPatternBeforeach(criterias[10], results[10], done);
                        });

                        it("ユーザー検索処理で正しいURLでサービスが呼び出される", function () {
                            dataPatternExpectUrl(urls[10]);
                        });

                        it("サービスから受け取ったデータを画面項目にセットする", function () {
                            dataPatternExpectBind(results[10]);
                        });
                    });
                });

                describe("処理失敗時", function () {
                    beforeEach(function (done) {
                        spyOn($, 'ajax').and.callFake(function (req) {
                            url = req.url;
                            var d = $.Deferred();
                            d.reject({
                                errorType: "system_error",
                                message: "サービスでエラーが発生しました。",
                                description: "",
                                errors: []
                            });

                            return d.promise();
                        });

                        $(".commands .search").trigger("click");

                        setTimeout(function () {
                            if ($(".loading").length === 0) {
                                done();
                            }

                        }, 1000);
                    });

                    afterEach(function (done) {
                        page.notify.alert.clear();

                        setTimeout(function () {
                            done();
                        }, 500);
                    });

                    it("ユーザー検索処理が失敗した場合はエラーが表示される", function () {
                        expect(page.notify.alert.count()).toHaveLength(1);
                    });
                });
            });

            describe("次のデータ取得処理", function () {

                describe("処理成功時", function () {
                    var url, urls, criterias, results;

                    criterias = [
                        {
                            UserName: null,
                            Mail: null,
                            LastName: null,
                            FirstName: null,
                            UnitId: null
                        }
                    ];

                    urls = [
                        { url: "/Membership/V1/Users/api/Users?$skip=0&$top=4&$count=true" }
                    ];

                    results = [
                        {
                            Items: [
                                { UserId: "d6450aca-36b6-49ba-b962-6bd9f5fb20f1", UserName: "quang@archway.co.jp", UsersTimestamp: "AAAAAAAAEQU=", Email: "quang@archway.co.jp", FirstName: "QUANG", LastName: "VO NHAT", ProfilesLastUpdatedDate: "2015-08-12T13:55:33.0357426+09:00", ProfilesTimestamp: "AAAAAAAAEQY=", UnitId: null, UnitName: null, UnitsLastUpdatedDate: null, UnitsTimestamp: "", Password: "9wSfWl4YfmQjUTXL0d97uG5HjdGZ9J6YPQU4fCGlpoyNrEhwSjNibR4B2ep45kcI" },
                                { UserId: "6e9c785f-3502-4f7a-885b-b2c6f2661548", UserName: "son@archway.co.jp", UsersTimestamp: "AAAAAAAAEQM=", Email: "son@archway.co.jp", FirstName: "Son", LastName: "Pham", ProfilesLastUpdatedDate: "2015-09-07T18:47:55.7620939+09:00", ProfilesTimestamp: "AAAAAAAAF9g=", UnitId: null, UnitName: null, UnitsLastUpdatedDate: null, UnitsTimestamp: "", Password: "A3jgeza1WqPqzVH7FdcJ3ltrrlnQtyC9JqvNBQqYI6xkyqweNRzgkb0f3WqfeGa9" },
                                { UserId: "ff2c7cc4-70b6-4c96-9de7-ef07a030a0d4", UserName: "ngocha@archway.co.jp", UsersTimestamp: "AAAAAAAAEoc=", Email: "ngocha@archway.co.jp", FirstName: "Ngoc Ha", LastName: "Nguyen Thi", ProfilesLastUpdatedDate: "2015-08-21T11:16:07.8280701+09:00", ProfilesTimestamp: "AAAAAAAAEoA=", UnitId: null, UnitName: null, UnitsLastUpdatedDate: null, UnitsTimestamp: "", Password: "ZLtrbMokwnoYZxNJqg9bHyxo4CGcaXVm7wSN9mG0KdD9sIsdrNlVGRVu2orvIQjO" },
                                { UserId: "878d3d7d-ef3f-45c0-85a3-80c901217838", UserName: "hieu@archway.co.jp", UsersTimestamp: "AAAAAAAAETo=", Email: "hieu@archway.co.jp", FirstName: "Hieu", LastName: "Luong Nguyen Trung", ProfilesLastUpdatedDate: "2015-08-12T13:56:48.6883253+09:00", ProfilesTimestamp: "AAAAAAAAEQg=", UnitId: null, UnitName: null, UnitsLastUpdatedDate: null, UnitsTimestamp: "", Password: "WOwgZ5MBhJvnpD3dV6hAp6ylNMYKW7pni8LoSVeLCFf5G2mzjuBVIyPVIvWdnjUM" }
                            ],
                            NextPageLink: null,
                            Count: 12
                        },
                        {
                            Items: [
                                { UserId: "85484381-cfc8-45e5-ba6c-966eec55b9cb", UserName: "k-maru@archway.co.jp", UsersTimestamp: "AAAAAAAAGBM=", Email: "k-maru@archway.co.jp", FirstName: "Kazuhide", LastName: "Maruyama", ProfilesLastUpdatedDate: "2015-07-14T11:40:37.6394227+09:00", ProfilesTimestamp: "AAAAAAAADm0=", UnitId: null, UnitName: null, UnitsLastUpdatedDate: null, UnitsTimestamp: "", Password: "FHo6sLC+Hp4M5I9eGWUKYX4New+mMc8xaLk3CI1tvNqdzR+xiRcr3rcws69+Sfk0" },
                                { UserId: "ceea4132-a82b-43fa-8e39-2d29bc304d3a", UserName: "nokuda@archway.co.jp", UsersTimestamp: "AAAAAAAAF+U=", Email: "nokuda@archway.co.jp", FirstName: "Okuda", LastName: "Naoto", ProfilesLastUpdatedDate: "2015-07-14T08:10:54.2059343+09:00", ProfilesTimestamp: "AAAAAAAADmM=", UnitId: null, UnitName: null, UnitsLastUpdatedDate: null, UnitsTimestamp: "", Password: "H0juTJJdj/H5Nbw4aOCWIPo/NGSQsZYo5zf7t5z+MUT4zn9jjyQkvDHE+UM55xdO" },
                                { UserId: "c0af8434-2b63-4c7a-a8a0-8b66fb6960d8", UserName: "tsune@archway.co.jp", UsersTimestamp: "AAAAAAAADok=", Email: "tsune@archway.co.jp", FirstName: "Tsunefumi", LastName: "Nakanishi", ProfilesLastUpdatedDate: "2015-07-15T14:00:09.3796134+09:00", ProfilesTimestamp: "AAAAAAAADrc=", UnitId: null, UnitName: null, UnitsLastUpdatedDate: null, UnitsTimestamp: "", Password: "Htc4GGeVzc8peE4dP7oFoAMPOYInCRRrU3yILzIvN+gbyAlnXCJct57lqjPkcT33" },
                                { UserId: "a2099673-cb4e-43b6-994f-28d7e69ba748", UserName: "sae@archway.co.jp", UsersTimestamp: "AAAAAAAADrU=", Email: "sae@archway.co.jp", FirstName: "佐江", LastName: "若松", ProfilesLastUpdatedDate: "2015-07-15T13:58:02.6464995+09:00", ProfilesTimestamp: "AAAAAAAADrY=", UnitId: null, UnitName: null, UnitsLastUpdatedDate: null, UnitsTimestamp: "", Password: "hVQsUkGcVAtpmiB2m38hTgmO437INnQw0726Jv+TTc+1giQM0+mx3B9VAcHgfo8n" },
                            ],
                            NextPageLink: null,
                            Count: 12
                        },
                        {
                            Items: [
                                { UserId: "44449919-fb09-4b01-924a-76a3c5a74d3a", UserName: "renk@archway.co.jp", UsersTimestamp: "AAAAAAAADrw=", Email: "renk@archway.co.jp", FirstName: "錬", LastName: "河野", ProfilesLastUpdatedDate: "2015-07-15T14:01:21.1295939+09:00", ProfilesTimestamp: "AAAAAAAADr0=", UnitId: null, UnitName: null, UnitsLastUpdatedDate: null, UnitsTimestamp: "", Password: "IQ568AOSc7kZBV/9quxJA2gUUHksRw59tPEp7NMfnMBYGi0GKhxkirvFZceGpx0o" },
                                { UserId: "70ce3ee5-905a-400f-bdaa-abb5475bf224", UserName: "amimata@archway.co.jp", UsersTimestamp: "AAAAAAAAG9g=", Email: "amimata@archway.co.jp", FirstName: "Aya", LastName: "Mimata", ProfilesLastUpdatedDate: "2015-07-14T08:13:16.9997182+09:00", ProfilesTimestamp: "AAAAAAAADmc=", UnitId: null, UnitName: null, UnitsLastUpdatedDate: null, UnitsTimestamp: "", Password: "RI/B7XNLOPRVhdu8Z0XJUaEqZrKhUeeNsR/uBpQana98VxHnt3ebzAF4LUR3Y5Vq" },
                                { UserId: "ec39441b-84d2-4ba0-b738-853afb8ad014", UserName: "kasuya@archway.co.jp", UsersTimestamp: "AAAAAAAADr4=", Email: "kasuya@archway.co.jp", FirstName: "洋子", LastName: "粕谷", ProfilesLastUpdatedDate: "2015-07-15T14:01:38.1138004+09:00", ProfilesTimestamp: "AAAAAAAADr8=", UnitId: null, UnitName: null, UnitsLastUpdatedDate: null, UnitsTimestamp: "", Password: "UVdnJQj9A9MzAZJXuTxVPxu4/BxWeNseN5e0Xuogl2CY3RRA/KysCy+04HEa5EY2" },
                                { UserId: "1f5f548e-e50b-4956-a1ef-b726bdb52d94", UserName: "hmoriya@archway.co.jp", UsersTimestamp: "AAAAAAAADm4=", Email: "hmoriya@archway.co.jp", FirstName: "Hideharu", LastName: "Moriya", ProfilesLastUpdatedDate: "2015-07-14T11:41:29.6190365+09:00", ProfilesTimestamp: "AAAAAAAADm8=", UnitId: null, UnitName: null, UnitsLastUpdatedDate: null, UnitsTimestamp: "", Password: "vQ9wEIe1nzM4gikoXs+KlhVKR6sff86L+4DTIrC9FBJAl0uAUjkA9PiEemeYZRod" },
                            ],
                            NextPageLink: null,
                            Count: 12
                        }
                    ];

                    nextDataExpectUrl = function (expectUrl) {
                        expect(url).toEqual(expectUrl.url);
                    };

                    nextDataBeforeach = function (criteria, done) {
                        page.header.element.find("textarea, :text, select").val("").end().find(":checked").prop("checked", false);

                        page.header.element.form().bind(criteria);

                        var callCount = 0;

                        spyOn($, 'ajax').and.callFake(function (req) {
                            url = req.url;

                            var d = $.Deferred();
                            d.resolve(results[callCount]);
                            callCount++;

                            return d.promise();
                        });

                        $(".commands .search").trigger("click");

                        setTimeout(function () {
                            if ($(".loading").length === 0) {
                                done();
                            }

                        }, 1000);
                    };

                    describe("データ件数より取得件数の合計が少ない場合", function () {
                        beforeEach(function (done) {
                            page.options.top = 4;

                            nextDataBeforeach(criterias[0],done);
                        });

                        it("ユーザー検索処理で正しいURLでサービスが呼び出される", function () {
                            nextDataExpectUrl(urls[0]);
                        });
                       
                        it("次を検索ボタンが表示される", function () {
                            expect($("#nextsearch")).toBeVisible();
                        });

                        it("次を検索ボタンをクリックすると末尾にデータが追加される", function (done) {
                      
                            $("#nextsearch").trigger("click");

                            setTimeout(function () {
                                if ($(".loading").length === 0) {

                                    expect($(".datatable tbody:not(.item-tmpl)").length).toEqual(8);

                                    done();
                                }

                            }, 1000);
                        });
                    });

                    describe("データ件数と取得件数の合計が一致した場合", function () {
                        beforeEach(function (done) {
                            page.options.top = 4;

                            nextDataBeforeach(criterias[0], done);
                        });


                        it("次を検索ボタンが非表示になる", function (done) {
                            $("#nextsearch").trigger("click");

                            setTimeout(function () {
                                if ($(".loading").length === 0) {

                                    $("#nextsearch").trigger("click");

                                    setTimeout(function () {
                                        if ($(".loading").length === 0) {

                                            expect($("#nextsearch")).not.toBeVisible();

                                            done();
                                        }

                                    }, 1000);
                                }

                            }, 1000);
                        });
                    });

                    describe("取得件数が最大件数を超えた場合", function () {
                        var maxSearchDataCount;

                        beforeEach(function (done) {
                            maxSearchDataCount = App.settings.base.maxSearchDataCount;
                            App.settings.base.maxSearchDataCount = 3;
                            page.options.top = 4;

                            nextDataBeforeach(criterias[0], done);
                        });

                        afterEach(function (done) {
                            App.settings.base.maxSearchDataCount = maxSearchDataCount;
                            page.notify.info.clear();

                            setTimeout(function () {
                                done();
                            }, 500);
                        });

                        it("次を検索ボタンが非表示になる", function () {
                            expect($("#nextsearch")).not.toBeVisible();
                        });
                    });
                });

                describe("処理失敗時", function () {
                    var url, criterias, results;

                    criterias = [
                        {
                            UserName: null,
                            Mail: null,
                            LastName: null,
                            FirstName: null,
                            UnitId: null
                        }
                    ];

                    results = [
                        {
                            Items: [
                                { UserId: "d6450aca-36b6-49ba-b962-6bd9f5fb20f1", UserName: "quang@archway.co.jp", UsersTimestamp: "AAAAAAAAEQU=", Email: "quang@archway.co.jp", FirstName: "QUANG", LastName: "VO NHAT", ProfilesLastUpdatedDate: "2015-08-12T13:55:33.0357426+09:00", ProfilesTimestamp: "AAAAAAAAEQY=", UnitId: null, UnitName: null, UnitsLastUpdatedDate: null, UnitsTimestamp: "", Password: "9wSfWl4YfmQjUTXL0d97uG5HjdGZ9J6YPQU4fCGlpoyNrEhwSjNibR4B2ep45kcI" },
                                { UserId: "6e9c785f-3502-4f7a-885b-b2c6f2661548", UserName: "son@archway.co.jp", UsersTimestamp: "AAAAAAAAEQM=", Email: "son@archway.co.jp", FirstName: "Son", LastName: "Pham", ProfilesLastUpdatedDate: "2015-09-07T18:47:55.7620939+09:00", ProfilesTimestamp: "AAAAAAAAF9g=", UnitId: null, UnitName: null, UnitsLastUpdatedDate: null, UnitsTimestamp: "", Password: "A3jgeza1WqPqzVH7FdcJ3ltrrlnQtyC9JqvNBQqYI6xkyqweNRzgkb0f3WqfeGa9" },
                                { UserId: "ff2c7cc4-70b6-4c96-9de7-ef07a030a0d4", UserName: "ngocha@archway.co.jp", UsersTimestamp: "AAAAAAAAEoc=", Email: "ngocha@archway.co.jp", FirstName: "Ngoc Ha", LastName: "Nguyen Thi", ProfilesLastUpdatedDate: "2015-08-21T11:16:07.8280701+09:00", ProfilesTimestamp: "AAAAAAAAEoA=", UnitId: null, UnitName: null, UnitsLastUpdatedDate: null, UnitsTimestamp: "", Password: "ZLtrbMokwnoYZxNJqg9bHyxo4CGcaXVm7wSN9mG0KdD9sIsdrNlVGRVu2orvIQjO" },
                                { UserId: "878d3d7d-ef3f-45c0-85a3-80c901217838", UserName: "hieu@archway.co.jp", UsersTimestamp: "AAAAAAAAETo=", Email: "hieu@archway.co.jp", FirstName: "Hieu", LastName: "Luong Nguyen Trung", ProfilesLastUpdatedDate: "2015-08-12T13:56:48.6883253+09:00", ProfilesTimestamp: "AAAAAAAAEQg=", UnitId: null, UnitName: null, UnitsLastUpdatedDate: null, UnitsTimestamp: "", Password: "WOwgZ5MBhJvnpD3dV6hAp6ylNMYKW7pni8LoSVeLCFf5G2mzjuBVIyPVIvWdnjUM" }
                            ],
                            NextPageLink: null,
                            Count: 12
                        }
                    ];

                    
                    nextDataFaliBeforeach = function (criteria, done) {
                        page.header.element.find("textarea, :text, select").val("").end().find(":checked").prop("checked", false);

                        page.header.element.form().bind(criteria);

                        var callCount = 0;

                        spyOn($, 'ajax').and.callFake(function (req) {
                            url = req.url;

                            var d = $.Deferred();

                            if (callCount === 0) {
                                d.resolve(results[callCount]);
                            } else {
                                d.reject({
                                    errorType: "system_error",
                                    message: "サービスでエラーが発生しました。",
                                    description: "",
                                    errors: []
                                });
                            }
                           
                            callCount++;

                            return d.promise();
                        });

                        $(".commands .search").trigger("click");

                        setTimeout(function () {
                            if ($(".loading").length === 0) {
                                done();
                            }

                        }, 1000);
                    };

                    beforeEach(function (done) {
                        page.options.top = 4;

                        nextDataFaliBeforeach(criterias[0], done);
                    });

                    afterEach(function (done) {
                        page.notify.alert.clear();
                        page.notify.info.clear();

                        setTimeout(function () {
                            done();
                        }, 500);
                    });

                    it("次を検索ボタンが表示されている状態で検索条件を変更するとメッセージが表される", function (done) {
                        page.header.element.findP("UserName").val("test").change();

                        setTimeout(function () {
                            expect(page.notify.info.count()).toHaveLength(1);
                            done();
                        }, 500);
                    });

                    it("ユーザー検索処理が失敗した場合はエラーが表示される", function (done) {
                        $("#nextsearch").trigger("click");

                        setTimeout(function () {
                            if ($(".loading").length === 0) {
                                expect(page.notify.alert.count()).toHaveLength(1);

                                done();
                            }

                        }, 1000);
                    });
                });
            });

            describe("マスターデータのロード処理", function () {
                var url;

                describe("処理成功時", function () {
                    beforeEach(function () {
                        spyOn($, 'ajax').and.callFake(function (req) {
                            url = req.url;
                            var d = $.Deferred();
                            d.resolve({
                                UnitId: "c3ba8900-7331-4f7a-b508-3880f69e7ee3",
                                UnitName: "情報システム部",
                                LastUpdatedDate: "2014-12-05T00:00:00+09:00",
                                Ts: "AAAAAAAAB9c="
                            });

                            return d.promise();
                        });
                    });

                    it("ユニットマスター取得処理で正しいURLでサービスが呼び出される", function (done) {
                        page.events.defaults.initialize().always(function () {
                            expect(url).toEqual("/Membership/V1/Users/api/Units");
                            done();
                        });
                    });
                });

                describe("処理失敗時", function () {
                    beforeEach(function () {
                        spyOn($, 'ajax').and.callFake(function (req) {
                            url = req.url;
                            var d = $.Deferred();
                            d.reject({
                                errorType: "system_error",
                                message: "サービスでエラーが発生しました。",
                                description: "",
                                errors: []
                            });
                            return d.promise();
                        });
                    });

                    afterEach(function () {
                        page.notify.alert.clear();
                    });

                    it("ユニットマスター取得処理が失敗した場合はエラーが表示される", function (done) {
                        page.events.defaults.initialize().always(function () {
                            expect(page.notify.alert.count()).toHaveLength(1);
                            done();
                        });
                    });
                });
            });
   
        });

        describe("固有画面機能定義", function () {

        });
    });

});