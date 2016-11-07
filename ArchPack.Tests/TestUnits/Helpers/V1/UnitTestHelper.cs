using ArchPack.ArchUnits.Routing.V1;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Security.Principal;
using System.Text;
using System.Web.Http;
using System.Web.Http.Controllers;
using ArchPack.ArchUnits.Routing.WebApi.V1;
using ArchPack.ArchUnits.Container.V1;

namespace ArchPack.Tests.TestUnits.Helpers.V1
{
    public static class UnitTestHelper
    {
        const string encodeName = "shift_jis";
        public const string ParameterRegexPattern = @"(/\*(?<type>[A-Za-z0-9]+)(\((?<size>[A-Za-z0-9]+)\))?\*/)?";
        public static T CreateController<T>(HttpMethod method, string url) where T : ApiController
        {
            var identity = new GenericIdentity("test-user");
            var principal = new GenericPrincipal(identity, null);
            var suContext = new ServiceUnitContext(url, principal);
            var requestContext = new HttpRequestContext();
            requestContext.Principal = principal;
            requestContext.Configuration = new HttpConfiguration();

            var container = GlobalContainer.CreateChild();

            container.AddTransient(typeof(T));
            container.AddInstance(suContext);
            var controller = container.GetService<T>();

            //var controller = Activator.CreateInstance<T>();
            controller.Request = new HttpRequestMessage(method, "http://localhost/archpack" + url);
            controller.RequestContext = requestContext;
            controller.Request.SetServiceUnitContext(suContext);

            return controller;
        }

        public static T GetObjectFromRespone<T>(HttpResponseMessage respone)
        {
            var result = respone.Content.ReadAsAsync<T>().Result;
            return result;
        }

        public static List<string> LoadFileData(string filePath)
        {
            List<string> lines = new List<string>();
            using (FileStream stream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read))
            {
                using (TextReader reader = new StreamReader(stream, Encoding.UTF8))
                {
                    string line = string.Empty;
                    while ((line = reader.ReadLine()) != null)
                    {
                        lines.Add(line);
                    }
                }
            }
            return lines;
        }

        public static string Fist(string filePath)
        {
            List<string> lines = LoadFileData(filePath);
            return lines[0];
        }

        public static string GetAugementNullMessage(string message, string param)
        {
            return new ArgumentNullException(param, message).Message;
        }
        public static string GetAugementMessage(string message, string param)
        {
            return new ArgumentException(message, param).Message;
        }
    }
}
