<%@ Page Title="" Language="C#" MasterPageFile="~/ServiceUnits/Membership/V1/Site.Master" AutoEventWireup="true" CodeBehind="RoleHeaderDetail.aspx.cs" Inherits="ArchPack.ServiceUnits.Membership.V1.Users.Pages.RoleHeaderDetail" %>

<%@ Import Namespace="ArchPack.ServiceUnits.Membership.V1.Resources" %>
<asp:Content ID="StyleIncludeContent" ContentPlaceHolderID="StyleIncludeContent" runat="server">

    <!--TODO: インポートするスタイルシートのパスをここに記述します。-->
    <link media="all" rel="stylesheet" href="<%=ResolveUrl("./RoleHeaderDetail.css") %>" type="text/css" />

</asp:Content>
<asp:Content ID="HeadContent" ContentPlaceHolderID="HeadContent" runat="server">
</asp:Content>
<asp:Content ID="MainContent" ContentPlaceHolderID="MainContent" runat="server">

    <!--TODO: ヘッダーを定義するHTMLをここに記述します。-->
    <div class="panel panel-default">
        <div class="panel-heading" data-toggle="collapse" data-target=".header.panel-collapse">
            <p class="pull-right">
                <i class="glyphicon glyphicon-chevron-up"></i>
                <i class="glyphicon glyphicon-chevron-down" style="display: none;"></i>
            </p>
            <div class="panel-title">
                <%= StringContents.Roles %>
            </div>
        </div>
        <div class="header panel-collapse collapse in">
            <div class="panel-body">
                <!--TODO: ヘッダー項目を定義するHTMLをここに記述します。-->
                <div class="row">
                    <div class="control-label col-xs-2">
                        <label class="item-name"><%= StringContents.RoleName %></label>
                    </div>
                    <div class="control col-xs-4">
                        <input type="hidden" data-prop="RoleId" />
                        <input type="text" data-prop="RoleName" />
                    </div>
                    <div class="control col-xs-6">
                    </div>
                </div>
                <div class="row">
                    <div class="control-label col-xs-2">
                        <label class="item-name"><%= StringContents.Description %></label>
                    </div>
                    <div class="control col-xs-10">
                        <input type="text" data-prop="Description" />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!--TODO: 明細を定義するHTMLをここに記述します。-->
    <div class="panel panel-default">
        <div class="panel-heading">
            <div class="panel-title panel-title-center">
                <div class="pull-left"><%= StringContents.RolesInUsers %></div>
                <div>
                    <span class="data-count-total">0</span>
                    <span><%= StringContents.OfCount %></span>
                    <span class="data-count">0</span>
                    <span><%= StringContents.ToDisplayCount %></span>
                </div>
            </div>
        </div>
        <div class="detail">
            <div class="panel-body">
                <!--TODO: 明細項目を定義するHTMLをここに記述します。-->
                <div class="control-label toolbar">
                    <i class="glyphicon glyphicon-th"></i>
                    <div class="btn-group">
                        <button type="button" class="btn btn-default btn-xs" id="add-item"><%=StringContents.AddItem %></button>
                        <button type="button" class="btn btn-default btn-xs" id="del-item"><%=StringContents.DeleteItem %></button>
                    </div>
                </div>
                <table class="datatable">
                    <!--TODO: 検索結果一覧のヘッダーを定義するHTMLをここに記述します。-->
                    <thead>
                        <tr>
                            <th style="width: 220px;" data-prop="UserName"><%=StringContents.UserName %></th>
                            <th style="width: 220px;" data-prop="Email"><%=StringContents.Mail %></th>
                            <th data-prop="UnitName"><%=StringContents.BusinessUnit %></th>
                        </tr>
                    </thead>
                    <!--TODO: 検索結果一覧の明細行を定義するHTMLをここに記述します。-->
                    <tbody class="item-tmpl">
                        <tr>
                            <td>
                                <input type="hidden" data-prop="RoleId" />
                                <input type="hidden" data-prop="UserId" />
                                <input type="text" data-prop="UserName" readonly="readonly" style="width: 170px;" />
                                <button class="btn btn-info btn-xs show-search-dialog" style="display: none"><%=StringContents.SelectItem %></button>
                            </td>
                            <td>
                                <span data-prop="Email"></span>
                            </td>
                            <td>
                                <span data-prop="UnitName"></span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

</asp:Content>
<asp:Content ID="FooterContent" ContentPlaceHolderID="FooterContent" runat="server">

    <div class="commands">
        <!--TODO: コマンドボタンを定義するHTMLをここに記述します。-->
        <button id="remove" class="btn btn-sm btn-default"><%=StringContents.Delete %></button>
        <button id="save" class="btn btn-sm btn-primary"><%=StringContents.Save %></button>
    </div>

</asp:Content>
<asp:Content ID="DialogsContent" ContentPlaceHolderID="DialogsContent" runat="server">
</asp:Content>
<asp:Content ID="ScriptIncrudeContent" ContentPlaceHolderID="ScriptIncrudeContent" runat="server">

    <!--TODO: インポートするスクリプトのパスをここに記述します。-->
    <script src="<%=ResolveUrl("./RoleHeaderDetail.js") %>"></script>

</asp:Content>
