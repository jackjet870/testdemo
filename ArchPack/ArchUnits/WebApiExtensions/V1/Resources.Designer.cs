﻿//------------------------------------------------------------------------------
// <auto-generated>
//     このコードはツールによって生成されました。
//     ランタイム バージョン:4.0.30319.34014
//
//     このファイルへの変更は、以下の状況下で不正な動作の原因になったり、
//     コードが再生成されるときに損失したりします。
// </auto-generated>
//------------------------------------------------------------------------------

namespace ArchPack.ArchUnits.WebApiExtensions.V1 {
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
    internal class Resources {
        
        private static global::System.Resources.ResourceManager resourceMan;
        
        private static global::System.Globalization.CultureInfo resourceCulture;
        
        [global::System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
        internal Resources() {
        }
        
        /// <summary>
        ///   このクラスで使用されているキャッシュされた ResourceManager インスタンスを返します。
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        internal static global::System.Resources.ResourceManager ResourceManager {
            get {
                if (object.ReferenceEquals(resourceMan, null)) {
                    global::System.Resources.ResourceManager temp = new global::System.Resources.ResourceManager("ArchPack.ArchUnits.WebApiExtensions.V1.Resources", typeof(Resources).Assembly);
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
        internal static global::System.Globalization.CultureInfo Culture {
            get {
                return resourceCulture;
            }
            set {
                resourceCulture = value;
            }
        }
        
        /// <summary>
        ///   __key に類似しているローカライズされた文字列を検索します。
        /// </summary>
        internal static string RequestClientKeyName {
            get {
                return ResourceManager.GetString("RequestClientKeyName", resourceCulture);
            }
        }
        
        /// <summary>
        ///   &lt;html&gt;
        ///    &lt;head&gt;
        ///        &lt;meta http-equiv=&apos;content-type&apos; content=&apos;text/html; charset=UTF-8&apos; /&gt;
        ///        &lt;script type=&apos;text/javascript&apos;&gt;
        ///            if(window.parent &amp;&amp; window.parent.postMessage){{
        ///                    window.parent.postMessage(&apos;{0}&apos;,&apos;{1}&apos;);
        ///             }}
        ///        &lt;/script&gt;
        ///    &lt;/head&gt;
        ///    &lt;body&gt;
        ///        &lt;div class=&apos;key&apos;&gt;{2}&lt;/div&gt; 
        ///        &lt;div class=&apos;result&apos;&gt;{3}&lt;/div&gt; 
        ///        &lt;div class=&apos;message&apos;&gt;{4}&lt;/div&gt; 
        ///        &lt;div class=&apos;data&apos;&gt;{5}&lt;/div&gt; 
        ///    &lt;/body&gt;
        ///&lt;/html&gt; に類似しているローカライズされた文字列を検索します。
        /// </summary>
        internal static string ResponseHtmlFormat {
            get {
                return ResourceManager.GetString("ResponseHtmlFormat", resourceCulture);
            }
        }
    }
}
