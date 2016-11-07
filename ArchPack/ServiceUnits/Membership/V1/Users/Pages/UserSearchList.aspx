<%@ Page Title="ユーザー検索" Language="C#" MasterPageFile="~/ServiceUnits/Membership/V1/Site.Master" AutoEventWireup="true" CodeBehind="UserSearchList.aspx.cs" Inherits="ArchPack.ServiceUnits.Membership.V1.Users.Pages.UserSearchList" %>

<%@ Import Namespace="ArchPack.ServiceUnits.Membership.V1.Resources" %>
<%@ Import Namespace="ArchPack.ArchUnits.Routing.WebForm.V1" %>

<asp:Content ID="StyleIncludeContent" ContentPlaceHolderID="StyleIncludeContent" runat="server">

    <!--TODO: インポートするスタイルシートのパスをここに記述します。-->
    <link media="all" rel="stylesheet" href="<%=ResolveUrl("./UserSearchList.css") %>" type="text/css" />

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
                        <label class="item-name"><%= StringContents.UserName %></label>
                    </div>
                    <div class="control col-xs-4">
                        <input type="text" data-prop="UserName" class="" />
                    </div>
                    <div class="control col-xs-6">
                    </div>
                </div>
                <div class="row">
                    <div class="control-label col-xs-2">
                        <label class="item-name"><%= StringContents.Mail %></label>
                    </div>
                    <div class="control col-xs-4">
                        <input type="text" data-prop="Mail" class="" />
                    </div>
                    <div class="control col-xs-6">
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

            <%--            
            <div class="panel-footer">
                <div class="commands">
                </div>
            </div>
            --%>
        </div>
    </div>

    <!--TODO: 明細を定義するHTMLをここに記述します。-->
    <div class="panel panel-default">
        <div class="panel-heading">
            <div class="panel-title panel-title-center">
                <div class="pull-left"><%= StringContents.UserList %></div>
                <div>
                    <span class="data-count-total">-</span>
                    <span><%= StringContents.OfCount %></span>
                    <span class="data-count">0</span>
                    <span><%= StringContents.ToDisplayCount %></span>
                </div>
            </div>
        </div>
        <div class="clearfix"></div>
        <div class="detail">
            <div class="panel-body">
                <!--TODO: 検索結果一覧を定義するHTMLをここに記述します。-->
                <table class="datatable">
                    <!--TODO: 検索結果一覧のヘッダーを定義するHTMLをここに記述します。-->
                    <thead>
                        <tr>
                            <%--<th style="width: 10px;"></th>--%>
                            <th style="width: 220px;" data-prop="UserName"><%=StringContents.UserName %></th>
                            <th style="width: 220px;" data-prop="Email"><%=StringContents.Mail %></th>
                            <th style="width: 150px;" data-prop="LastName"><%=StringContents.LastName %></th>
                            <th style="width: 150px;" data-prop="FirstName"><%=StringContents.FirstName %></th>
                            <th data-prop="UnitName"><%=StringContents.BusinessUnit %></th>
                        </tr>
                    </thead>
                    <!--TODO: 検索結果一覧の明細行を定義するHTMLをここに記述します。-->
                    <tbody class="item-tmpl">
                        <tr>
                            <td>
                                <input type="hidden" data-prop="UserId" />
                                <div class="dropdown" style="display:inline-block">
                                    <a class="btn btn-link btn-xs edit-menu" id="edit-menu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                        <span class="glyphicon glyphicon-option-vertical"></span>
                                    </a>
                                    <ul class="dropdown-menu" aria-labelledby="edit-menu">
                                        <li><a href="#">ダイアログで参照</a></li>
                                        <li><a href="#">ダイアログで編集</a></li>
                                        <li><a href="#">別のページで参照</a></li>
                                        <li><a href="#" target="_blank" class="transfer edit">別のページで編集</a></li>
                                    </ul>
                                </div>  
                                <span data-prop="UserName"></span>
                            </td>
                            <td>
                                <span data-prop="Email"></span>
                            </td>
                            <td>
                                <span data-prop="LastName"></span>
                            </td>
                            <td>
                                <span data-prop="FirstName"></span>
                            </td>
                            <td>
                                <span data-prop="UnitName"></span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="detail-command">
                    <button type="button" id="nextsearch" class="btn btn-sm btn-default btn-next-search" style="display: none;">
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
        <button type="button" class="btn btn-sm btn-primary download"><%= StringContents.Download %></button>
        <button  type="button" class="btn btn-sm btn-primary add"><%= StringContents.Add %></button>
        <button type="button" class="btn btn-sm btn-primary search"><%= StringContents.Search %></button>
        <button type="button" class="btn btn-sm btn-primary ouputPdf">PDF</button>
    </div>

</asp:Content>
<asp:Content ID="DialogsContent" ContentPlaceHolderID="DialogsContent" runat="server">

    <div class="modal fade wide" id="password-dialog">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">Change Password</h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="control-label col-xs-2">
                            <label class="item-name">Old Password</label>
                        </div>
                        <div class="control col-xs-10">
                            <input type="text" data-prop="oldpassword">
                        </div>
                        <div class="control-label col-xs-2">
                            <label class="item-name">New Password</label>
                        </div>
                        <div class="control col-xs-10">
                            <input type="text" data-prop="newpassword">
                        </div>
                    </div>
                </div>
                <div class="message-area dialog-slideup-area">
                    <div class="alert-message" style="display: none">
                        <ul></ul>
                    </div>
                    <div class="info-message" style="display: none">
                        <ul></ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="commands">
                        <button class="btn btn-sm btn-primary" id="savepassword"><%=StringContents.OK %></button>
                    </div>
                </div>
            </div>
        </div>

    </div>

</asp:Content>
<asp:Content ID="ScriptIncrudeContent" ContentPlaceHolderID="ScriptIncrudeContent" runat="server">

    <!--TODO: インポートするスクリプトのパスをここに記述します。-->
    <script src="<%=ResolveUrl("./UserSearchList.js") %>" data-cover></script>
    <%if (this.Context.GetServiceUnitContext().IsTestMode())
      { %>
    <script src="<%=this.ResolveSuitableFileUrl("./UserSearchList.test.js") %>"></script>
    <%} %>
</asp:Content>
