<%@ Page Title="メインメニュー" Language="C#" MasterPageFile="~/ServiceUnits/Membership/V1/Site.Master" AutoEventWireup="true" CodeBehind="Menu.aspx.cs" Inherits="ArchPack.ServiceUnits.Membership.V1.Users.Pages.Menu" %>
<asp:Content ID="Styles" ContentPlaceHolderID="StyleIncludeContent" runat="server">
    <style type="text/css">
        .count {
            font-weight: bold;
            font-size: 32px;
        }

        .datalist-item table {
            width: 100%;
        }
        .datalist-item table td {
            vertical-align: bottom;
        }
    </style>
</asp:Content>
<asp:Content ID="Head" ContentPlaceHolderID="HeadContent" runat="server">
</asp:Content>
<asp:Content ID="Main" ContentPlaceHolderID="MainContent" runat="server">

    <div class="datalist">
        <div class="row">
            <div class="col-sm-3">
                <div class="datalist-item">
                    <a href="#">プロフィール</a>
                    <hr />
                </div>
            </div>
            <div class="col-sm-3">
                <div class="datalist-item">
                    <a href="#">追加求人検索</a>
                    <hr />
<%--                    <table>
                        <tbody>
                            <tr>
                                <td>おすすめ案件</td>
                                <td><span class="count">10</span>件</td>
                            </tr>
                        </tbody>
                    </table>--%>
                </div>
            </div>
            <div class="col-sm-3">
                <div class="datalist-item">
                    <a href="#">アラーム期日登録</a>
                    <hr />
                </div>
            </div>
            <div class="col-sm-3">
                <div class="datalist-item">
                    <a href="#">紹介済案件</a>
                    <hr />
                </div>
            </div>
            <div class="col-sm-3">
                <div class="datalist-item">
                    <a href="#">紹介済案件</a>
                    <hr />
                </div>
            </div>
        </div>
    </div>

</asp:Content>
<asp:Content ID="Footer" ContentPlaceHolderID="FooterContent" runat="server">
</asp:Content>
<asp:Content ID="Dialog" ContentPlaceHolderID="DialogsContent" runat="server">
</asp:Content>
<asp:Content ID="Script" ContentPlaceHolderID="ScriptIncrudeContent" runat="server">
</asp:Content>
