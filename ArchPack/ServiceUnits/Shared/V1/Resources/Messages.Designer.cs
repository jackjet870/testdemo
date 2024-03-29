﻿//------------------------------------------------------------------------------
// <auto-generated>
//     このコードはツールによって生成されました。
//     ランタイム バージョン:4.0.30319.42000
//
//     このファイルへの変更は、以下の状況下で不正な動作の原因になったり、
//     コードが再生成されるときに損失したりします。
// </auto-generated>
//------------------------------------------------------------------------------

namespace ArchPack.ServiceUnits.Shared.V1.Resources {
    using System;
    
    
    /// <summary>
    ///   ローカライズされた文字列などを検索するための、厳密に型指定されたリソース クラスです。
    /// </summary>
    // このクラスは StronglyTypedResourceBuilder クラスが ResGen
    // または Visual Studio のようなツールを使用して自動生成されました。
    // メンバーを追加または削除するには、.ResX ファイルを編集して、/str オプションと共に
    // ResGen を実行し直すか、または VS プロジェクトをビルドし直します。
    [global::System.CodeDom.Compiler.GeneratedCodeAttribute("System.Resources.Tools.StronglyTypedResourceBuilder", "4.0.0.0")]
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
    [global::System.Runtime.CompilerServices.CompilerGeneratedAttribute()]
    public class Messages {
        
        private static global::System.Resources.ResourceManager resourceMan;
        
        private static global::System.Globalization.CultureInfo resourceCulture;
        
        [global::System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
        internal Messages() {
        }
        
        /// <summary>
        ///   このクラスで使用されているキャッシュされた ResourceManager インスタンスを返します。
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        public static global::System.Resources.ResourceManager ResourceManager {
            get {
                if (object.ReferenceEquals(resourceMan, null)) {
                    global::System.Resources.ResourceManager temp = new global::System.Resources.ResourceManager("ArchPack.ServiceUnits.Shared.V1.Resources.Messages", typeof(Messages).Assembly);
                    resourceMan = temp;
                }
                return resourceMan;
            }
        }
        
        /// <summary>
        ///   厳密に型指定されたこのリソース クラスを使用して、すべての検索リソースに対し、
        ///   現在のスレッドの CurrentUICulture プロパティをオーバーライドします。
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        public static global::System.Globalization.CultureInfo Culture {
            get {
                return resourceCulture;
            }
            set {
                resourceCulture = value;
            }
        }
        
        /// <summary>
        ///   現在ログインIDはロックされています。システム管理者に問い合わせてください に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string AccountLockedOut {
            get {
                return ResourceManager.GetString("AccountLockedOut", resourceCulture);
            }
        }
        
        /// <summary>
        ///   権限エラー に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string AuthorizedError {
            get {
                return ResourceManager.GetString("AuthorizedError", resourceCulture);
            }
        }
        
        /// <summary>
        ///   適切な権限のあるユーザーでログインしてください。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string AuthorizedErrorMessage {
            get {
                return ResourceManager.GetString("AuthorizedErrorMessage", resourceCulture);
            }
        }
        
        /// <summary>
        ///   ページにアクセスする権限がありません。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string AuthorizedErrorMessageTitle {
            get {
                return ResourceManager.GetString("AuthorizedErrorMessageTitle", resourceCulture);
            }
        }
        
        /// <summary>
        ///   明細件数が上限{0}件を超えています。請求書を出力しますか？ に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string BillingDetailsCountOverMessage {
            get {
                return ResourceManager.GetString("BillingDetailsCountOverMessage", resourceCulture);
            }
        }
        
        /// <summary>
        ///   検索条件が変更されました。再検索してください。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string ChangeSearchCriteria {
            get {
                return ResourceManager.GetString("ChangeSearchCriteria", resourceCulture);
            }
        }
        
        /// <summary>
        ///   明細行を削除しますか？ に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string ConfirmDeleteDetail {
            get {
                return ResourceManager.GetString("ConfirmDeleteDetail", resourceCulture);
            }
        }
        
        /// <summary>
        ///   すでに他のユーザーがこのデータを変更したために、最新のデータを再度取得しました。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string ConflictAndGetNew {
            get {
                return ResourceManager.GetString("ConflictAndGetNew", resourceCulture);
            }
        }
        
        /// <summary>
        ///   アカウント登録完了のお知らせ に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string CreateUserMailSubject {
            get {
                return ResourceManager.GetString("CreateUserMailSubject", resourceCulture);
            }
        }
        
        /// <summary>
        ///   アップロードでエラーが発生しています。
        ///アップロードしたファイルの下記のエラーを修正して再度アップロードしてください。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string CSVUploadError {
            get {
                return ResourceManager.GetString("CSVUploadError", resourceCulture);
            }
        }
        
        /// <summary>
        ///   {name} は金額で入力してください。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string Currency {
            get {
                return ResourceManager.GetString("Currency", resourceCulture);
            }
        }
        
        /// <summary>
        ///   {name} は日付を入力してください。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string Date {
            get {
                return ResourceManager.GetString("Date", resourceCulture);
            }
        }
        
        /// <summary>
        ///   削除処理が完了しました。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string DeleteComplete {
            get {
                return ResourceManager.GetString("DeleteComplete", resourceCulture);
            }
        }
        
        /// <summary>
        ///   {name} は数字のみで入力してください。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string Digits {
            get {
                return ResourceManager.GetString("Digits", resourceCulture);
            }
        }
        
        /// <summary>
        ///   {0}は半角英数記号のみで入力して下さい。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string ErrorAlphaNumberSymbolFormat {
            get {
                return ResourceManager.GetString("ErrorAlphaNumberSymbolFormat", resourceCulture);
            }
        }
        
        /// <summary>
        ///   {0}は{1}形式で入力してください。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string ErrorDateFormat {
            get {
                return ResourceManager.GetString("ErrorDateFormat", resourceCulture);
            }
        }
        
        /// <summary>
        ///   桁数にマイナスは指定できません。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string ErrorDigitMinus {
            get {
                return ResourceManager.GetString("ErrorDigitMinus", resourceCulture);
            }
        }
        
        /// <summary>
        ///   {0}は半角英数字のみで入力してください。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string ErrorHalfAlphaNumberFormat {
            get {
                return ResourceManager.GetString("ErrorHalfAlphaNumberFormat", resourceCulture);
            }
        }
        
        /// <summary>
        ///   {0}は半角文字で入力してください。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string ErrorHalfStringFormat {
            get {
                return ResourceManager.GetString("ErrorHalfStringFormat", resourceCulture);
            }
        }
        
        /// <summary>
        ///   {0}はメールアドレスを入力してください。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string ErrorMailAddressFormat {
            get {
                return ResourceManager.GetString("ErrorMailAddressFormat", resourceCulture);
            }
        }
        
        /// <summary>
        ///   {0}は{1}文字以下で入力してください。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string ErrorMaxLength {
            get {
                return ResourceManager.GetString("ErrorMaxLength", resourceCulture);
            }
        }
        
        /// <summary>
        ///   {0}は{1}以下の値を入力してください。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string ErrorMaxValue {
            get {
                return ResourceManager.GetString("ErrorMaxValue", resourceCulture);
            }
        }
        
        /// <summary>
        ///   エラーが発生しました。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string ErrorMessageTitle {
            get {
                return ResourceManager.GetString("ErrorMessageTitle", resourceCulture);
            }
        }
        
        /// <summary>
        ///   エラーが発生しました。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string ErrorMessageTitle1 {
            get {
                return ResourceManager.GetString("ErrorMessageTitle1", resourceCulture);
            }
        }
        
        /// <summary>
        ///   {0}は{1}文字以上で入力してください。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string ErrorMinLength {
            get {
                return ResourceManager.GetString("ErrorMinLength", resourceCulture);
            }
        }
        
        /// <summary>
        ///   {0}は{1}以上の値を入力してください。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string ErrorMinValue {
            get {
                return ResourceManager.GetString("ErrorMinValue", resourceCulture);
            }
        }
        
        /// <summary>
        ///   {0}は数値で入力してください。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string ErrorNumberFormat {
            get {
                return ResourceManager.GetString("ErrorNumberFormat", resourceCulture);
            }
        }
        
        /// <summary>
        ///   {0}は必須入力です。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string ErrorRequired {
            get {
                return ResourceManager.GetString("ErrorRequired", resourceCulture);
            }
        }
        
        /// <summary>
        ///   {0}は全角文字で入力してください。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string ErrorWideStringFormat {
            get {
                return ResourceManager.GetString("ErrorWideStringFormat", resourceCulture);
            }
        }
        
        /// <summary>
        ///   明細件数が上限{0}件を超えています。見積書を出力しますか？ に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string EstimateDetailsCountOverMessage {
            get {
                return ResourceManager.GetString("EstimateDetailsCountOverMessage", resourceCulture);
            }
        }
        
        /// <summary>
        ///   内容が変更されています、終了しますか？ に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string Exit {
            get {
                return ResourceManager.GetString("Exit", resourceCulture);
            }
        }
        
        /// <summary>
        ///   データアップロードに失敗しました。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string FailUpload {
            get {
                return ResourceManager.GetString("FailUpload", resourceCulture);
            }
        }
        
        /// <summary>
        ///   {0}を{1}に保存しました。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string FileSaveMessage {
            get {
                return ResourceManager.GetString("FileSaveMessage", resourceCulture);
            }
        }
        
        /// <summary>
        ///   ファイルサイズが{0}MB以上です。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string FileSizeErrorMessage {
            get {
                return ResourceManager.GetString("FileSizeErrorMessage", resourceCulture);
            }
        }
        
        /// <summary>
        ///   {name} は半角英数記号を入力してください。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string HanEisuKigo {
            get {
                return ResourceManager.GetString("HanEisuKigo", resourceCulture);
            }
        }
        
        /// <summary>
        ///   {name} は半角を入力してください。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string Hankaku {
            get {
                return ResourceManager.GetString("Hankaku", resourceCulture);
            }
        }
        
        /// <summary>
        ///   {name} は整数値のみで入力してください。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string Integer {
            get {
                return ResourceManager.GetString("Integer", resourceCulture);
            }
        }
        
        /// <summary>
        ///   列数が不正です。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string InvalidColumnSizeTextFieldFile {
            get {
                return ResourceManager.GetString("InvalidColumnSizeTextFieldFile", resourceCulture);
            }
        }
        
        /// <summary>
        ///   ログインIDまたはパスワードのいずれかに誤りがあります に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string InvalidUserNameOrPassword {
            get {
                return ResourceManager.GetString("InvalidUserNameOrPassword", resourceCulture);
            }
        }
        
        /// <summary>
        ///   {name} は {param} 以下で入力してください。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string Max {
            get {
                return ResourceManager.GetString("Max", resourceCulture);
            }
        }
        
        /// <summary>
        ///   {name} は {param} 文字以内で入力してください。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string MaxByteLength {
            get {
                return ResourceManager.GetString("MaxByteLength", resourceCulture);
            }
        }
        
        /// <summary>
        ///   {name} は {param} 文字以内で入力してください。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string MaxLength {
            get {
                return ResourceManager.GetString("MaxLength", resourceCulture);
            }
        }
        
        /// <summary>
        ///   {name} は {param} 以上で入力してください。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string Min {
            get {
                return ResourceManager.GetString("Min", resourceCulture);
            }
        }
        
        /// <summary>
        ///   {name} は {param} 文字以上で入力してください。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string MinByteLength {
            get {
                return ResourceManager.GetString("MinByteLength", resourceCulture);
            }
        }
        
        /// <summary>
        ///   {name} は {param} 文字以上で入力してください。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string MinLength {
            get {
                return ResourceManager.GetString("MinLength", resourceCulture);
            }
        }
        
        /// <summary>
        ///   データがありません。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string NoDataExsists {
            get {
                return ResourceManager.GetString("NoDataExsists", resourceCulture);
            }
        }
        
        /// <summary>
        ///   検索結果は0件です。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string NoDataSearch {
            get {
                return ResourceManager.GetString("NoDataSearch", resourceCulture);
            }
        }
        
        /// <summary>
        ///   明細行が存在しません。明細行を追加してください。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string NoDetailLine {
            get {
                return ResourceManager.GetString("NoDetailLine", resourceCulture);
            }
        }
        
        /// <summary>
        ///   明細行を選択してください。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string NoDetailLineSelected {
            get {
                return ResourceManager.GetString("NoDetailLineSelected", resourceCulture);
            }
        }
        
        /// <summary>
        ///   データがありません。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string NoFileDataMessage {
            get {
                return ResourceManager.GetString("NoFileDataMessage", resourceCulture);
            }
        }
        
        /// <summary>
        ///   ユーザーマスタに該当するデータが1件もありませんでした。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string NotEixistsUser {
            get {
                return ResourceManager.GetString("NotEixistsUser", resourceCulture);
            }
        }
        
        /// <summary>
        ///   入力されたパスワードが一致しません。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string NotEqualPassword {
            get {
                return ResourceManager.GetString("NotEqualPassword", resourceCulture);
            }
        }
        
        /// <summary>
        ///   該当するデータが存在しません。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string NotFoundData {
            get {
                return ResourceManager.GetString("NotFoundData", resourceCulture);
            }
        }
        
        /// <summary>
        ///   ファイルをアップロードしてください。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string NotFoundUploadFile {
            get {
                return ResourceManager.GetString("NotFoundUploadFile", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Nullは許可されません。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string NotNullError {
            get {
                return ResourceManager.GetString("NotNullError", resourceCulture);
            }
        }
        
        /// <summary>
        ///   {name} は数値のみで入力してください。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string Number {
            get {
                return ResourceManager.GetString("Number", resourceCulture);
            }
        }
        
        /// <summary>
        ///   値が範囲を超えています。{0} から {1} までの数値を設定してください。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string OutOfRangeTextField {
            get {
                return ResourceManager.GetString("OutOfRangeTextField", resourceCulture);
            }
        }
        
        /// <summary>
        ///   最大表示可能件数を超えました。検索条件を絞って再検索してください。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string OverDisplayCount {
            get {
                return ResourceManager.GetString("OverDisplayCount", resourceCulture);
            }
        }
        
        /// <summary>
        ///   {name} は {param[0]} から {param[1]} の範囲で入力してください。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string Range {
            get {
                return ResourceManager.GetString("Range", resourceCulture);
            }
        }
        
        /// <summary>
        ///   {name} は {param[0]} 文字以上 {param[1]} 文字以内で入力してください。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string RangeLength {
            get {
                return ResourceManager.GetString("RangeLength", resourceCulture);
            }
        }
        
        /// <summary>
        ///   削除処理が完了しました。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string RemoveCompleted {
            get {
                return ResourceManager.GetString("RemoveCompleted", resourceCulture);
            }
        }
        
        /// <summary>
        ///   {name} は入力必須です。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string Required {
            get {
                return ResourceManager.GetString("Required", resourceCulture);
            }
        }
        
        /// <summary>
        ///   必須の項目です。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string RequiredTextField {
            get {
                return ResourceManager.GetString("RequiredTextField", resourceCulture);
            }
        }
        
        /// <summary>
        ///   進捗情報更新リストは必須項目です。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string RequireParameter {
            get {
                return ResourceManager.GetString("RequireParameter", resourceCulture);
            }
        }
        
        /// <summary>
        ///   保存処理が完了しました。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string SaveCompleted {
            get {
                return ResourceManager.GetString("SaveCompleted", resourceCulture);
            }
        }
        
        /// <summary>
        ///   サービスでエラーが発生しました。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string ServiceError {
            get {
                return ResourceManager.GetString("ServiceError", resourceCulture);
            }
        }
        
        /// <summary>
        ///   指定された進捗ステータスの進捗情報法は存在しません に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string StatusNotDefine {
            get {
                return ResourceManager.GetString("StatusNotDefine", resourceCulture);
            }
        }
        
        /// <summary>
        ///   パスワードを変更しました。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string SuccessChangePassword {
            get {
                return ResourceManager.GetString("SuccessChangePassword", resourceCulture);
            }
        }
        
        /// <summary>
        ///   データアップロードに成功しました。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string SuccessUpload {
            get {
                return ResourceManager.GetString("SuccessUpload", resourceCulture);
            }
        }
        
        /// <summary>
        ///   {name} は電話番号を入力してください（例:012-345-6789）。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string TelNum {
            get {
                return ResourceManager.GetString("TelNum", resourceCulture);
            }
        }
        
        /// <summary>
        ///   あまりにも多くのデータ に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string TooManyData {
            get {
                return ResourceManager.GetString("TooManyData", resourceCulture);
            }
        }
        
        /// <summary>
        ///   不明なエラーが発生しました。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string UnknownError {
            get {
                return ResourceManager.GetString("UnknownError", resourceCulture);
            }
        }
        
        /// <summary>
        ///   すでに他のユーザーがこのデータを変更しています。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string UpdateConfilict {
            get {
                return ResourceManager.GetString("UpdateConfilict", resourceCulture);
            }
        }
        
        /// <summary>
        ///   画面を閉じますか？ に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string WindowsClose {
            get {
                return ResourceManager.GetString("WindowsClose", resourceCulture);
            }
        }
        
        /// <summary>
        ///   {name} は全角を入力してください。 に類似しているローカライズされた文字列を検索します。
        /// </summary>
        public static string Zenkaku {
            get {
                return ResourceManager.GetString("Zenkaku", resourceCulture);
            }
        }
    }
}
