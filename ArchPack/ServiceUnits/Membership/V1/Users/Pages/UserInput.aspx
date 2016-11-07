<%@ Page Title="" Language="C#" MasterPageFile="~/ServiceUnits/Membership/V1/Site.Master" AutoEventWireup="true" CodeBehind="UserInput.aspx.cs" Inherits="ArchPack.ServiceUnits.Membership.V1.Users.Pages.UserInput" %>

<%@ Import Namespace="ArchPack.ServiceUnits.Membership.V1.Resources" %>
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

    <!--TODO: ヘッダーを定義するHTMLをここに記述します。-->
    <!--TODO: ヘッダーを定義するHTMLをここに記述します。-->
    <div class="panel panel-default">
        <div class="panel-heading" data-toggle="collapse" data-target=".section.panel-collapse">
            <p class="pull-right">
                <i class="glyphicon glyphicon-chevron-up"></i>
                <i class="glyphicon glyphicon-chevron-down" style="display: none;"></i>
            </p>
            <div class="panel-title">
                <%=StringContents.Edit %>
            </div>
        </div>
        <div class="section panel-collapse collapse in">
            <div class="panel-body">
                <!--TODO: ヘッダーを定義するHTMLをここに記述します。-->
                <div class="row">
                    <div class="control-label col-sm-2">
                        <label class="item-name"><%=StringContents.UserId %></label>
                    </div>
                    <div class="control col-sm-4">
                        <span data-prop="UserId"></span>
                    </div>
                </div>
                <div class="row">
                    <div class="control-label col-sm-2">
                        <label class="item-name"><%=StringContents.UserName %></label>
                    </div>
                    <div class="control col-sm-2">
                        <input type="text" data-prop="UserName" />
                    </div>
                    <div class="control-label col-sm-1">
                        <label class="item-name"><%=StringContents.Mail %></label>
                    </div>
                    <div class="control col-sm-5">
                        <input type="text" data-prop="Email" />
                    </div>
                </div>
                <div class="row">
                    <div class="control-label col-sm-2">
                        <label class="item-name"><%=StringContents.LastName %></label>
                    </div>
                    <div class="control col-sm-2">
                        <input type="text" data-prop="LastName" />
                    </div>
                    <div class="control-label col-sm-1">
                        <label class="item-name"><%=StringContents.FirstName %></label>
                    </div>
                    <div class="control col-sm-2">
                        <input type="text" data-prop="FirstName" />
                    </div>
                    <div class="control-label col-sm-1">
                        <label class="item-name"><%=StringContents.BusinessUnit %></label>
                    </div>
                    <div class="control col-sm-2">
                        <select data-prop="UnitId">
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="FooterContent" ContentPlaceHolderID="FooterContent" runat="server">

    <div class="commands">
        <!--TODO: コマンドボタンを定義するHTMLをここに記述します。-->
        <button id="remove" class="btn btn-sm btn-primary"><%=StringContents.Delete %></button>
        <button id="save" class="btn btn-sm btn-primary"><%=StringContents.Save %></button>
    </div>

</asp:Content>
<asp:Content ID="DialogsContent" ContentPlaceHolderID="DialogsContent" runat="server">
</asp:Content>
<asp:Content ID="ScriptIncrudeContent" ContentPlaceHolderID="ScriptIncrudeContent" runat="server">

    <!--TODO: インポートするスクリプトのパスをここに記述します。-->
    <script src="<%=ResolveUrl("./UserInput.js") %>"></script>

</asp:Content>
