using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Schema;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace ArchPack.Tests.ServiceUnits.Test.V1.Data
{
    public static class Utils
    {
        public static IList<string> CheckSchemaJson(string schemaJson, string jsonInput)
        {
            IList<string> errorMessage = new List<string>();
            if(string.IsNullOrEmpty(schemaJson) || string.IsNullOrEmpty(jsonInput))
            {
                errorMessage.Add("Not data to input");
                return errorMessage;
            }

            JsonSchema schema = JsonSchema.Parse(schemaJson);

            JObject obj = JObject.Parse(jsonInput);            
            
            bool valid = obj.IsValid(schema, out errorMessage);

            return errorMessage;
        }

        public static string GetJsonStringFrom(string pathFile)
        {
            if(!File.Exists(pathFile))
            {
                return "";
            }

            using (TextReader file = File.OpenText(pathFile))
            {
                using (JsonTextReader reader = new JsonTextReader(file))
                {
                    JObject obj = JObject.Load(reader);                    
                    return obj.ToString();
                }
            }
        }
    }
}