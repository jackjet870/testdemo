using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Hosting;

namespace ArchPack.ArchUnits.Configuration.V1
{
    /// <summary>
    /// Service定義に定義された内容を表します。
    /// </summary>
    public sealed class ServiceConfiguration
    {
        private IDictionary<string, JToken> source;
        /// <summary>
        /// 指定された値を利用してインスタンスを初期化します。
        /// </summary>
        /// <param name="source">元となる定義のJSONオブジェクト</param>
        /// <param name="name">ServiceUnit名</param>
        /// <param name="version">ServiceUnitバージョン</param>
        /// <param name="role">ServiceUnitロール</param>
        /// <param name="env">環境名</param>
        public ServiceConfiguration(IDictionary<string, JToken> source, string name, string version = null, string role = null, string env = null)
        {
            this.source = new ReadOnlyDictionary<string, JToken>(source);
            this.Items = new Dictionary<string, Object>();
            this.Name = name;
            this.Version = version;
            this.Role = role;
            this.Environment = env ?? "";
        }
        /// <summary>
        /// 読み込んだ環境名を取得します。
        /// </summary>
        public string Environment { get; private set; }
        /// <summary>
        /// ServiceUnit名を取得します。
        /// </summary>
        public string Name { get; private set; }
        /// <summary>
        /// ServiceUnitバージョンを取得します。
        /// </summary>
        public string Version { get; private set; }
        /// <summary>
        /// ServiceUnitロールを取得します。
        /// </summary>
        public string Role { get; private set; }
        /// <summary>
        /// ServiceUnitが未稼働かどうかを取得します。
        /// </summary>
        public bool ServiceUnavailable
        {
            get { return SafeGet<Boolean>("unavailable", () => false); }
        }
        /// <summary>
        /// ServiceUnitの表示名を取得します。
        /// </summary>
        public string DisplayName
        {
            get { return SafeGet<string>("displayName", () => null); }
        }

        private string[] authProviders = null;
        /// <summary>
        /// 認証プロバイダーを取得します。
        /// </summary>
        public string[] AuthProviders
        {
            get
            {
                if (authProviders != null)
                {
                    return authProviders;
                }
                if (source.ContainsKey("authProviders"))
                {
                    var list = source["authProviders"].ToObject<List<string>>();
                    authProviders = list.ToArray();
                    return authProviders;
                }
                return new string[] { };
            }
        }

        private string[] availableRoles = null;
        /// <summary>
        /// 利用可能なロールを取得します。
        /// </summary>
        public string[] AvailableRoles
        {
            get
            {
                if (availableRoles != null)
                {
                    return availableRoles;
                }
                if (source.ContainsKey("availableRoles"))
                {
                    var list = source["availableRoles"].ToObject<List<string>>();
                    availableRoles = list.ToArray();
                    return availableRoles;
                }
                return new string[] { };
            }
        }

        private ConnectionStringConfiguration emptyConnectionStrings = new ConnectionStringConfiguration(null);
        private ConnectionStringConfiguration connectionStrings = null;
        /// <summary>
        /// 接続文字列の定義を取得します。
        /// </summary>
        public ConnectionStringConfiguration ConnectionStrings
        {
            get
            {
                if (connectionStrings != null)
                {
                    return connectionStrings;
                }
                if (source.ContainsKey("connectionStrings"))
                {
                    var dic = source["connectionStrings"].ToObject<ConnectionStringConfiguration>();
                    return dic;
                }
                return emptyConnectionStrings;
            }
        }

        private IDictionary<string, ErrorPageConfiguration> errorPages = null;
        /// <summary>
        /// エラーページ設定を取得します。
        /// </summary>
        public IDictionary<string, ErrorPageConfiguration> ErrorPages
        {
            get
            {
                if (errorPages != null)
                {
                    return errorPages;
                }

                if (source.ContainsKey("errorPages"))
                {
                    var dic = source["errorPages"].ToObject<Dictionary<string, ErrorPageConfiguration>>();
                    errorPages = new ReadOnlyDictionary<string, ErrorPageConfiguration>(dic);
                    return errorPages;
                }

                return new Dictionary<string, ErrorPageConfiguration>();
            }
        }
        /// <summary>
        /// ルートのプロパティ毎の生の定義を取得します。
        /// </summary>
        public IDictionary<string, JToken> Raw
        {
            get { return this.source; }
        }
        /// <summary>
        /// 生の定義からオブジェクトに変換された値の一覧を取得します。
        /// </summary>
        public IDictionary<string, object> Items { get; private set; }
        
        private T SafeGet<T>(JToken source, string key, Func<T> defaultValueResolver = null)
        {
            var val = source[key];
            if (val == null)
            {
                if (defaultValueResolver != null)
                {
                    return defaultValueResolver();
                }
                return default(T);
            }
            return source.Value<T>(key);
        }

        private T SafeGet<T>(string key, Func<T> defaultValueResolver = null)
        {
            if (!source.ContainsKey(key))
            {
                if (defaultValueResolver != null)
                {
                    return defaultValueResolver();
                }
                return default(T);
            };
            var val = source[key];
            return val.Value<T>();
        }

        private IDictionary<string, object> appSettings = null;
        /// <summary>
        /// アプリケーション用の設定を取得します。
        /// </summary>
        public IDictionary<string, object> AppSettings 
        {
            get {
                if (appSettings != null)
                {
                    return appSettings;
                }
                if (source.ContainsKey("appSettings"))
                {
                    appSettings = source["appSettings"].ToObject<Dictionary<string, Object>>();                    
                    return appSettings;
                }
                return new Dictionary<string, Object>();
            }
        }

    }
}