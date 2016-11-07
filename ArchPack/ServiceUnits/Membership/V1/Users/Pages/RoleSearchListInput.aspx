<%@ Page Title="" Language="C#" MasterPageFile="~/ServiceUnits/Membership/V1/Site.Master" AutoEventWireup="true" CodeBehind="RoleSearchListInput.aspx.cs" Inherits="ArchPack.ServiceUnits.Membership.V1.Users.Pages.RoleSearchListInput" %>

<%@ Import Namespace="ArchPack.ServiceUnits.Membership.V1.Resources" %>
<asp:Content ID="StyleIncludeContent" ContentPlaceHolderID="StyleIncludeContent" runat="server">

    <!--TODO: インポートするスタイルシートのパスをここに記述します。-->
    <link media="all" rel="stylesheet" href="<%=ResolveUrl("./RoleSearchListInput.css") %>" type="text/css" />

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
                <%= StringContents.SearchCriteria %>
            </div>
        </div>
        <div class="header panel-collapse collapse in">
            <div class="panel-body">
                <!--TODO: 検索条件を定義するHTMLをここに記述します。-->
                <div class="row">
                    <div class="control-label col-xs-2">
                        <label class="item-name"><%=StringContents.RoleName %></label>
                    </div>
                    <div class="control col-xs-4">
                        <input type="text" data-prop="RoleName" class="" />
                    </div>
                    <div class="control col-xs-6"></div>
                </div>
            </div>
        </div>
    </div>

    <!--TODO: 明細を定義するHTMLをここに記述します。-->
    <div class="panel panel-default">
        <div class="panel-heading">
            <div class="panel-title panel-title-center">
                <div class="pull-left"><%= StringContents.RoleList %></div>
                <div>
                    <span class="data-count-total">-</span>
                    <span><%= StringContents.OfCount %></span>
                    <span class="data-count">0</span>
                    <span><%= StringContents.ToDisplayCount %></span>
                </div>
            </div>
        </div>
        <div class="detail">
            <div class="panel-body">
                <!--TODO: 検索結果一覧を定義するHTMLをここに記述します。-->
                <div class="control-label toolbar">
                    <i class="glyphicon glyphicon-th"></i>
                    <div class="btn-group">
                        <button type="button" class="btn btn-default btn-xs" id="add-item"><%=StringContents.AddItem %></button>
                        <button type="button" class="btn btn-default btn-xs" id="del-item"><%=StringContents.DeleteItem %></button>
                    </div>
                </div>
                <table class="datatable">
                    <!--TODO: 明細一覧のヘッダーを定義するHTMLをここに記述します。-->
                    <thead>
                        <tr>
                            <th style="width: 300px;" data-prop="RoleName"><%=StringContents.RoleName %></th>
                            <th data-prop="Description"><%=StringContents.Description %></th>
                        </tr>
                    </thead>
                    <!--TODO: 明細一覧のフッターを定義するHTMLをここに記述します。-->
                    <tfoot>
                    </tfoot>
                    <!--TODO: 明細一覧の明細行を定義するHTMLをここに記述します。-->
                    <tbody class="item-tmpl" style="display: none;">
                        <tr>
                            <td>
                                <input type="hidden" data-prop="ApplicationId" />
                                <input type="hidden" data-prop="RoleId" />

                                <div class="dropdown" style="display:inline-block">
                                    <a class="btn btn-link btn-xs edit-menu" id="edit-menu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                        <span class="glyphicon glyphicon-option-vertical"></span>
                                    </a>
                                    <ul class="dropdown-menu" aria-labelledby="edit-menu">
                                        <li><a href="#" target="_blank" class="transfer edit"><%=StringContents.Edit %></a></li>
                                    </ul>
                                </div>  
                                <input type="text" data-prop="RoleName" style="width:250px" class="" />
                            </td>
                            <td>
                                <input type="text" data-prop="Description" class="" />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="detail-command">
                    <button type="button" id="nextsearch" class="btn btn-xs btn-default btn-next-search" style="display: none">
                        <%--<%= StringContents.NextSearch %>--%>                        
                        <span><%= StringContents.TheNext %></span>
                        <span class="data-take-count">0</span>
                        <span><%= StringContents.ToDisplayCount %></span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="FooterContent" ContentPlaceHolderID="FooterContent" runat="server">

    <div class="commands">
        <!--TODO: コマンドボタンを定義するHTMLをここに記述します。-->
        <button type="button" id="save" class="btn btn-sm btn-primary"><%=StringContents.Save %></button>
        <button type="button" id="search" class="btn btn-sm btn-primary"><%= StringContents.Search %></button>
    </div>

</asp:Content>
<asp:Content ID="DialogsContent" ContentPlaceHolderID="DialogsContent" runat="server">

    <!--TODO: ダイアログを定義するHTMLをここに記述します。-->

</asp:Content>
<asp:Content ID="ScriptIncrudeContent" ContentPlaceHolderID="ScriptIncrudeContent" runat="server">

    <!--TODO: インポートするスクリプトのパスをここに記述します。-->
    <script src="<%=ResolveUrl("./RoleSearchListInput.js") %>"></script>

</asp:Content>
