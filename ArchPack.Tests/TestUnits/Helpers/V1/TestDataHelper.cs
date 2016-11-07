using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace ArchPack.Tests.TestUnits.Helpers.V1
{
    /// <summary>
    /// データアクセステストのための抽象基底クラスです。
    /// </summary>
    /// <typeparam name="T">DbContextの派生クラスを指定します。</typeparam>
    public abstract class TestDataHelper<T> where T : DbContext
    {
        private T dbContext;
        public TestDataHelper(T dbContext) { this.dbContext = dbContext; }

        /// <summary>
        /// テーブルに挿入されたレコード数を取得または設定します。
        /// </summary>
        public int InsertedCount { get; set; }

        /// <summary>
        /// 対象テーブルにJSONファイルから読み込んだデータを挿入します。
        /// </summary>
        /// <param name="jsonFilePath">JSONファイルのパス</param>
        public void InsertData(string jsonFilePath)
        {
            JArray entities = CreateEntities(jsonFilePath);

            foreach (JObject entity in entities)
            {
                AddData(this.dbContext, entity);
                InsertedCount++;
            }

            try
            {
                this.dbContext.SaveChanges();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw;
            }
        }

        /// <summary>
        /// JSONファイルをJArrayにパースします。
        /// </summary>
        /// <param name="jsonFilePath"></param>
        /// <returns></returns>
        public JArray CreateEntities(string jsonFilePath)
        {
            string json = File.ReadAllText(jsonFilePath);
            JArray entities = JArray.Parse(json);

            return entities;
        }

        /// <summary>
        /// テーブルに行を追加します。
        /// </summary>
        /// <param name="context">DbContextの派生クラス</param>
        /// <param name="entity">JSONファイルからパースされたJObject</param>
        public abstract void AddData(T context, JObject entity);

        /// <summary>
        /// 対象テーブルのデータをクリアします。
        /// </summary>
        /// <param name="tableName">テーブル名</param>
        public void DeleteData(string tableName, string where = null)
        {
            int result = this.dbContext.Database.ExecuteSqlCommand(string.Format("DELETE FROM {0} {1}", tableName, where));
        }

        public int CountData(string tableName, string where = null)
        {
            int count = this.dbContext.Database.SqlQuery<int>(string.Format("SELECT COUNT(*) FROM {0} {1}", tableName, where)).Single<int>();
            return count;
        }

        /// <summary>
        /// サービスユニット用のservice-config.jsonの格納先パスを取得します。
        /// </summary>
        /// <param name="service">サービス名</param>
        /// <param name="version">バージョン</param>
        /// <returns></returns>
//        public string GetConfigPath(string service, string version)
//        {
//#if DEBUG
//            return string.Format(@"Settings/Debug/{0}/{1}/", service, version);
//#else
//            return string.Format(@"Settings/Release/{0}/{1}", service, version);
//#endif
//        }
    }
}
