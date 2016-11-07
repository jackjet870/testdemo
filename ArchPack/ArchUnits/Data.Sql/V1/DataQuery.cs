using ArchPack.ArchUnits.Routing.V1;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Hosting;
using ArchPack.ArchUnits.Routing.Owin.V1;
using System.Data.SqlClient;
using System.Web.UI.WebControls;
using ArchPack.ArchUnits.Data.Sql.V1;
using System.Data.Common;
using ArchPack.ArchUnits.Logging.Entities.V1;
using ArchPack.ArchUnits.Logging.V1;
using ArchPack.ArchUnits.Configuration.V1;
using ArchPack.ArchUnits.Contracts.V1;

namespace ArchPack.ArchUnits.Data.Sql.V1
{
    /// <summary>
    /// 外部定義されたSQL文字列を追加、もしくは直接指定して実行する機能を提供します。
    /// </summary>
    public class DataQuery
    {
        //private List<DbParameter> parameters = new List<DbParameter>();
        private List<KeyValuePair<string, object>> parameters = new List<KeyValuePair<string, object>>();

        /// <summary>
        /// このインスタンスの名称を取得します。
        /// </summary>
        public string Name { get; private set; }

        public DbContext Context { get; private set; }

        public ISqlDefinitionFactory Factory { get; private set; }

        public SqlDefinition SqlDefinition { get; set; }

        public IEnumerable<KeyValuePair<string, object>> Parameters { get; private set; }

        private LogContext logContext = null;

        /// <summary>
        /// 指定された引数を利用してインスタンスを初期化します。
        /// </summary>
        /// <param name="context">利用する <see cref="DbContext"/> </param>
        /// <param name="factory">外部定義されたSQLを取得する <see cref="ISqlDefinitionFactory"/> のインスタンス</param>
        /// <param name="logContext">ログを出力するための <see cref="LogContext"/> </param>
        /// <param name="name"> <see cref="DataQuery"/> のインスタンスの名前</param>
        public DataQuery(DbContext context, ISqlDefinitionFactory factory, LogContext logContext = null, string name = null)
        {
            Contract.NotNull(context, "context");
            Contract.NotNull(factory, "factory");

            this.Context = context;
            this.Factory = factory;
            this.SqlDefinition = new SqlDefinition();
            this.Parameters = parameters.AsReadOnly();

            this.logContext = logContext;
            this.Name = name;
        }

        /// <summary>
        /// 指定された名前で SQL 定義を追加で読み込みます。
        /// </summary>
        /// <param name="queryName">クエリ名</param>
        /// <param name="replaceValues">置換プレースホルダーに適用する値</param>
        /// <returns><see cref="DataQuery"/>のインスタンス</returns>
        public DataQuery AppendNamedQuery(string queryName, params object[] replaceValues)
        {
            this.SqlDefinition.Merge(Factory.Create(queryName, replaceValues));
            return this;
        }

        /// <summary>
        /// SQL クエリを追加します。
        /// </summary>
        /// <param name="sql">SQL文字列</param>
        /// <returns><see cref="DataQuery"/>のインスタンス</returns>
        public DataQuery AppendQuery(string sql)
        {
            Contract.NotEmpty(sql, "sql");

            this.SqlDefinition.Merge(new SqlDefinition(sql));
            return this;
        }

        /// <summary>
        /// クエリのパラメータを設定します。
        /// </summary>
        /// <param name="name">パラメーター名</param>
        /// <param name="value">パラメーターの値</param>
        /// <returns><see cref="DataQuery"/>のインスタンス</returns>
        public DataQuery SetParameter(string name, object value)
        {
            Contract.NotEmpty(name, "name");

            if (!this.SqlDefinition.Parameters.ContainsKey(name))
            {
                throw new ArgumentException("対象のパラメータが存在しません。", name);
            }

            this.parameters.Add(new KeyValuePair<string, object>(name, value));

            return this;
        }

        /// <summary>
        /// クエリを実行します。
        /// </summary>
        /// <typeparam name="T">実行結果にバインドする型</typeparam>
        /// <returns>実行結果</returns>
        public List<T> GetList<T>()
        {
            var commandParameters = CreateDbParamters();

            try
            {
                if (Context.Database.Connection.State == ConnectionState.Closed)
                {
                    Context.Database.Connection.Open();
                }
                var task = Context.Database.SqlQuery<T>(this.SqlDefinition.Sql, commandParameters).ToListAsync();

                task.Wait();
                
                return task.Result;
            }
            catch (Exception ex)
            {
                RecordLog("Error", this.SqlDefinition.Sql, commandParameters, ex.Message);
                throw new DataQueryException(ex);
            }
        }

        private DbParameter[] CreateDbParamters()
        {
            var commandParameters = this.parameters.Select((pair =>
            {
                DbCommand command = Context.Database.Connection.CreateCommand();
                DbParameter param = command.CreateParameter();
                ParameterDefinition paramDefinition = this.SqlDefinition.Parameters[pair.Key];
                param.ParameterName = paramDefinition.Prefix + pair.Key;
                param.DbType = paramDefinition.Type;
                param.Size = paramDefinition.Size;
                param.Value = pair.Value;
                command.Parameters.Clear();

                return param;
            })).ToArray();

            return commandParameters;
        }

        /// <summary>
        /// クエリを実行します。
        /// </summary>
        /// <typeparam name="T">実行結果にバインドする型</typeparam>
        /// <returns>実行結果</returns>
        public T SingleOrDefault<T>()
        {
            var commandParameters = CreateDbParamters();

            try
            {
                if (Context.Database.Connection.State == ConnectionState.Closed)
                {
                    Context.Database.Connection.Open();
                }

                return Context.Database.SqlQuery<T>(this.SqlDefinition.Sql, commandParameters.ToArray()).SingleOrDefault();
            }
            catch (Exception ex)
            {
                RecordLog("Error", this.SqlDefinition.Sql, commandParameters, ex.Message);
                throw new DataQueryException(ex);
            }
        }

        private void RecordLog(string logType, string sql, IEnumerable<DbParameter> parameters, string message)
        {
            if (this.logContext == null)
            {
                return;
            }
            var logger = this.logContext.Logger;
            var logData = new LogData();
            logData.User = "User";
            logData.Message = "| SqlStatement: " + sql + "| Parameters :";
            foreach (DbParameter parameter in parameters)
            {
                logData.Message += " [" + parameter.ParameterName + " = " + parameter.Value + "] ";
            }
            if (logType == "Error")
            {
                logData.LogName = "error";
                logData.Message += "| Error Message: " + message;
                logger.Error(logData);
            }
            else
            {
                logData.LogName = "trace";
                logger.Trace(logData);
            }
        }
    }

}