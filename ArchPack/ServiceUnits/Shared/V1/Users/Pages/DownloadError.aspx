<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="DownloadError.aspx.cs" Inherits="ArchPack.ServiceUnits.Shared.V1.Users.Pages.DownloadError" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>ファイルダウンロードエラー</title>

    <link data-part-template="styles" />

</head>
<body>
    <div class="wrap">
        <!-- ヘッダーのレイアウト -->
        <!--<div data-part-template="header">
        </div>-->
        <div class="body-content">

            <div class="content-wrap container">
                <div class="page-header">
                    <h3>ファイルダウンロード時にエラーが発生しました。詳細については下記の情報を参照ください。</h3>
                </div>
                <div class="alert alert-warning" role="alert">
                    <h4><%=Message %></h4>
                    <p><%=Detail %></p>
                </div>
            </div>

        </div>
    </div>
    <!-- フッターのレイアウト -->
    <div class="footer">
        <div class="footer-container">

            <div class="footer-content">

                <div class="command-total">
                </div>
                <div class="command">
                </div>

            </div>
        </div>
    </div>
</body>
</html>
