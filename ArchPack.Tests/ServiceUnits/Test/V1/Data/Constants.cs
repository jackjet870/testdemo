using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArchPack.Tests.ServiceUnits.Test.V1.Data
{
    public static class Constants
    {
        /// <summary>
        /// 全てのプロジェクトで利用するメタデータを保持するためのプロジェクトID
        /// </summary>
        public const int MetadataParojectId = 0;

        /// <summary>
        /// ページセクション・ヘッダ
        /// </summary>
        public const string HeaderSection = "Header";
        /// <summary>
        /// ページセクション・明細
        /// </summary>
        public const string DetailSection = "Detail";
    }

    public static class ItemTypeName
    {
        /// <summary>
        /// データモデルの ProjectItemType の値を表します。
        /// </summary>
        public const string DataModel = "DataModel";
        /// <summary>
        /// 画面定義の ProjectItemType の値を表します。
        /// </summary>
        public const string Page = "Page";
        /// <summary>
        /// API定義の ProjectItemType の値を表します。
        /// </summary>
        public const string Api = "Api";
        /// <summary>
        /// テストケースの ProjectItemType の値を表します。
        /// </summary>
        public const string TestCase = "TestCase";
        /// <summary>
        /// パタンの ProjectItemType の値を表します。
        /// </summary>
        public const string Pattern = "Pattern";
        /// <summary>
        /// UI パターンの ProjectItemType の値を表します。
        /// </summary>
        public const string UIPattern = "UIPattern";
        /// <summary>
        /// コントロール型の ProjectItemType の値を表します。
        /// </summary>
        public const string ControlType = "ControlTypes";
        /// <summary>
        /// バリデーションの ProjectItemType の値を表します。
        /// </summary>
        public const string Validation = "Validations";
        /// <summary>
        /// データ型の ProjectItemType の値を表します。
        /// </summary>
        public const string DataType = "DataTypes";
        /// <summary>
        /// データ型の ProjectItemType の値を表します。
        /// </summary>
        public const string TestResult = "TestResult";
        /// <summary>
        /// API パターンの ProjectItemType の値を表します。
        /// </summary>
        public const string APIPattern = "APIPattern";
    }
}
