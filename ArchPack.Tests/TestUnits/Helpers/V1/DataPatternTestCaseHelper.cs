using ArchPack.ArchUnits.Configuration.V1;
using ArchPack.ArchUnits.Data.Entity.V1;
using Xunit;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace ArchPack.Tests.TestUnits.Helpers.V1
{

    public class DataPatternTestOptions<TRequest, TResponse, TKey>
    {
        public string TestCaseDataPath { get; set; }

        public string KeyColumnName { get; set; }

        public ConnectionStringItem ConnectionString { get; set; }

        public Func<TRequest, HttpResponseMessage> Operation { get; set; }

        public Func<TResponse, TKey> GetKeyColumn { get; set; }

        public string FileName { get; set; }

        public string[] Cases { get; set; }
    }

    public class DataPatternTestOptions<TRequest, TResponse, TKey, TTarget>
    {
        public string TestCaseDataPath { get; set; }

        public string KeyColumnName { get; set; }

        public ConnectionStringItem ConnectionString { get; set; }

        public Func<TRequest, HttpResponseMessage> Operation { get; set; }

        public Func<TTarget, TKey> GetKeyColumn { get; set; }

        public string FileName { get; set; }

        public Func<TResponse, IEnumerable<TTarget>> GetTarget { get; set; }

        public string category { get; set; }
    }
    public class DataPatternTestCaseHelper
    {

        public static void AssertSearchList<TRequest, TResponse, TKey>(DataPatternTestOptions<TRequest, TResponse, TKey> options)
        {
            var files = Directory.GetFiles(options.TestCaseDataPath);
            List<Tuple<string, Exception>> errors = new List<Tuple<string, Exception>>();

            if (options.Cases != null && options.Cases.Length > 0)
            {
                files = files.Where(f => options.Cases.Contains(Path.GetFileName(f).Substring(0, 3))).ToArray();
            }

            var testCases = files.Select(file => DeserializeTestData<TRequest>(file));

            foreach (var testCase in testCases)
            {
                string message = string.Format("API: {0}, Operation: {1}, Category: {2}, Pattern: {3}",
                            testCase.ApiName,
                            testCase.OperationName,
                            testCase.CategoryName,
                            testCase.PatternName);
                try
                {
                    AssertSearchList<TRequest, TResponse, TKey>(options, testCase);
                }
                catch (Exception ex)
                {
                    errors.Add(new Tuple<string, Exception>(message, ex));
                }
            }

            if (errors.Count > 0) 
            {
                var messages = errors.Select(item => item.Item1 + "\r\n" + item.Item2.ToString());
                var message = string.Join("\r\n", messages);
                throw new ApplicationException(message);
            }
        }

        public static void AssertSearchList<TRequest, TResponse, TKey>(string fileName, DataPatternTestOptions<TRequest, TResponse, TKey> options)
        {
            List<Tuple<string, Exception>> errors = new List<Tuple<string, Exception>>();

            var testCase = DeserializeTestData<TRequest>(fileName);

            string message = string.Format("API: {0}, Operation: {1}, Category: {2}, Pattern: {3}",
                        testCase.ApiName,
                        testCase.OperationName,
                        testCase.CategoryName,
                        testCase.PatternName);

            AssertSearchList<TRequest, TResponse, TKey>(options, testCase);
        }

        public static void AssertGetSingleObject<TRequest, TResponse, TKey>(DataPatternTestOptions<TRequest, TResponse, TKey> options)
        {
            var files = Directory.GetFiles(options.TestCaseDataPath);
            List<Tuple<string, Exception>> errors = new List<Tuple<string, Exception>>();

            // loop for files.
            foreach (var file in files)
            {
                var fileName = file;
                var testCase = DeserializeTestData<TRequest>(fileName);

                string message = string.Format("API: {0}, Operation: {1}, Category: {2}, Pattern: {3}",
                            testCase.ApiName,
                            testCase.OperationName,
                            testCase.CategoryName,
                            testCase.PatternName);
                try
                {
                    AssertGetSingleObject<TRequest, TResponse, TKey>(options, testCase);
                }
                catch (Exception ex)
                {
                    errors.Add(new Tuple<string, Exception>(message, ex));
                }
            }

            if (errors.Count > 0)
            {
                var messages = errors.Select(item => item.Item1 + "\r\n" + item.Item2.ToString());
                var message = string.Join("\r\n", messages);
                throw new ApplicationException(message);
            }
        }

        public static void AssertSearchList<TRequest, TResponse, TKey, TTarget>(DataPatternTestOptions<TRequest, TResponse, TKey, TTarget> options)
        {
            var files = Directory.GetFiles(options.TestCaseDataPath);
            List<Tuple<string, Exception>> errors = new List<Tuple<string, Exception>>();

            // loop for files.
            foreach (var file in files)
            {
                var fileName = file;
                var testCase = DeserializeTestData<TRequest>(fileName);

                string message = string.Format("API: {0}, Operation: {1}, Category: {2}, Pattern: {3}",
                            testCase.ApiName,
                            testCase.OperationName,
                            testCase.CategoryName,
                            testCase.PatternName);
                try
                {
                    if (options.category == testCase.CategoryName)
                    {
                        AssertSearchList<TRequest, TResponse, TKey, TTarget>(options, testCase);
                    }
                }
                catch (Exception ex)
                {
                    errors.Add(new Tuple<string, Exception>(message, ex));
                }
            }

            if (errors.Count > 0)
            {
                var messages = errors.Select(item => item.Item1 + "\r\n" + item.Item2.ToString());
                var message = string.Join("\r\n", messages);
                throw new ApplicationException(message);
            }
        }
        
        public static void AssertSearchList<TRequest, TResponse, TKey>(DataPatternTestOptions<TRequest, TResponse, TKey> options, DataPatternTestCase<TRequest> testCase)
        {
            TRequest request = testCase.Data;
            HttpResponseMessage response = options.Operation(request);
            IEnumerable<TResponse> result = UnitTestHelper.GetObjectFromRespone<IEnumerable<TResponse>>(response);

            DataTable table = GetDataTable(options.ConnectionString, testCase.Sql, testCase.Parameters);



            Assert.Equal(table.Rows.Count, result.Count());

            TKey[] expectedKeys = table.AsEnumerable().Select(r => (TKey)r.Field<TKey>(options.KeyColumnName)).ToArray();
            TKey[] actualKeys = result.Select(options.GetKeyColumn).ToArray();

            Assert.Equal(expectedKeys, actualKeys);
        }

        public static void AssertSearchList<TRequest, TResponse, TKey, TTarget>(DataPatternTestOptions<TRequest, TResponse, TKey, TTarget> options, DataPatternTestCase<TRequest> testCase)
        {
            TRequest request = testCase.Data;
            HttpResponseMessage response = options.Operation(request);
            TResponse result = UnitTestHelper.GetObjectFromRespone<TResponse>(response);

            DataTable table = GetDataTable(options.ConnectionString, testCase.Sql, testCase.Parameters);

            TKey[] expectedKeys = table.AsEnumerable().Select(r => (TKey)r.Field<TKey>(options.KeyColumnName)).ToArray();
            TKey[] actualKeys = options.GetTarget(result).Select(options.GetKeyColumn).ToArray();

            Assert.Equal(expectedKeys, actualKeys);
        }

        public static void AssertGetSingleObject<TRequest, TResponse, TKey>(DataPatternTestOptions<TRequest, TResponse, TKey> options, DataPatternTestCase<TRequest> testCase)
        {
            TRequest request = testCase.Data;
            HttpResponseMessage response = options.Operation(request);
            TResponse result = UnitTestHelper.GetObjectFromRespone<TResponse>(response);

            DataTable table = GetDataTable(options.ConnectionString, testCase.Sql, testCase.Parameters);

            TKey[] expectedKeys = table.AsEnumerable().Select(r => (TKey)r.Field<TKey>(options.KeyColumnName)).ToArray();
            TKey[] actualKeys = new TKey[]{ options.GetKeyColumn(result) };

            Assert.Equal(expectedKeys, actualKeys);
        }

        private static DataTable GetDataTable(ConnectionStringItem connectionString, string commandText, string[] parameters)
        {
            using (DbConnection connection = ConnectionFactory.Create(connectionString))
            {
                using (DbCommand command = connection.CreateCommand()) 
                {
                    command.CommandText = commandText;
                    if (parameters != null)
                    {
                        foreach (var parameter in parameters)
                        {
                            var param = command.CreateParameter();
                            param.Value = parameter;
                            command.Parameters.Add(param);
                        }
                    }

                    using (DbDataAdapter adapter = DbProviderFactories.GetFactory(connection).CreateDataAdapter())
                    {
                        adapter.SelectCommand = command;

                        DataTable table = new DataTable();
                        adapter.Fill(table);

                        return table;
                    }
                }
            }
        }

        private static DataPatternTestCase<TRequest> DeserializeTestData<TRequest>(string fileName)
        {
            DataPatternTestCase<TRequest> testCase;

            using (FileStream stream = new FileStream(fileName, FileMode.Open, FileAccess.Read, FileShare.Read))
            using (StreamReader reader = new StreamReader(stream))
            {
                using (JsonTextReader jReader = new JsonTextReader(reader))
                {
                    JsonSerializer serializer = new JsonSerializer();
                    testCase = serializer.Deserialize<DataPatternTestCase<TRequest>>(jReader);
                }
            }

            return testCase;
        }
    }

    public class DataPatternTestCase<T>
    {
        [JsonProperty("api")]
        public string ApiName { get; set; }

        [JsonProperty("operation")]
        public string OperationName { get; set; }

        [JsonProperty("pattern")]
        public string PatternName { get; set; }


        [JsonProperty("categoryName")]
        public string CategoryName { get; set; }

        [JsonProperty("sql")]
        public string Sql { get; set; }

        [JsonProperty("data")]
        public T Data { get; set; }

        [JsonProperty("parameters")]
        public string[] Parameters { get; set; }

    }

}
