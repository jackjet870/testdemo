using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.Serialization;
using System.Collections;
using System.Reflection;

namespace ArchPack.Tests.TestUnits.Helpers.V1
{
    /// <summary>
    /// SqlExceptionを生成するためのヘルパークラスです。
    /// </summary>
    public class SqlExceptionHelper
    {
        /// <summary>
        /// SqlExceptionを生成します。
        /// </summary>
        /// <param name="errorNumber">エラー番号</param>
        /// <returns>SqlExceptionのインスタンス</returns>
        public static SqlException Create(int errorNumber)
        {
            SqlException ex = (SqlException)FormatterServices.GetUninitializedObject(typeof(SqlException));

            var errors = CreateSqlErrorCollection(errorNumber);
            SetFieldValue(ex, "_errors", errors);

            return ex;
        }

        private static SqlErrorCollection CreateSqlErrorCollection(int errorNumber)
        {
            Type type = typeof(SqlErrorCollection);
            SqlErrorCollection collection = (SqlErrorCollection)FormatterServices.GetUninitializedObject(type);

            SetFieldValue(collection, "errors", new ArrayList());

            SqlError error = CreateSqlError(errorNumber);
            var method = type.GetMethod("Add", BindingFlags.NonPublic | BindingFlags.Instance);
            method.Invoke(collection, new object[] { error });

            return collection;
        }

        private static SqlError CreateSqlError(int errorNumber)
        {
            var error = (SqlError)FormatterServices.GetUninitializedObject(typeof(SqlError));
            SetFieldValue(error, "number", errorNumber);

            return error;
        }

        private static void SetFieldValue(object obj, string field, object value)
        {
            var member = obj.GetType().GetField(field, BindingFlags.NonPublic | BindingFlags.Instance);
            member.SetValue(obj, value);
        }
    }
}
