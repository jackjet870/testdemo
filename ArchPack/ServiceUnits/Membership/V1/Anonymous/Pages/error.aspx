<%@ Page Language="C#" AutoEventWireup="true" MasterPageFile="~/ServiceUnits/Membership/V1/Site.Master" CodeBehind="error.aspx.cs" Inherits="ArchPack.ServiceUnits.Membership.V1.Anonymous.Pages.error" %>

<asp:Content ID="StyleIncludeContent" ContentPlaceHolderID="StyleIncludeContent" runat="server">

    <!--TODO: インポートするスタイルシートのパスをここに記述します。-->
    <link media="all" rel="stylesheet" href="<%=ResolveUrl("./UserInput.css") %>" type="text/css" />

</asp:Content>
<asp:Content ID="HeadContent" ContentPlaceHolderID="HeadContent" runat="server">
    <style>

    </style>
    <!--TODO: 画面個別のヘッダーを定義はここに記述します-->

</asp:Content>
<asp:Content ID="MainContent" ContentPlaceHolderID="MainContent" runat="server">
    <div class="wrap">
        <!-- ヘッダーのレイアウト -->
        <div data-part-template="header">
        </div>
        <div class="body-content">

            <div class="content-wrap container">
                <div class="page-header">
                    <h3>予期しないシステムエラーが発生しました</h3>
                </div>
                <div class="alert alert-warning" role="alert">
                    <h4><%=Message%></h4>
                    <p><%=StackTrace%></p>
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

    <!--<script data-part-template="scripts"></script>-->

</asp:Content>
