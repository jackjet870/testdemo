using System;
using Xunit;
using Moq;
using System.Web;
using System.Collections.Generic;
using System.Security.Principal;
using System.Web.Http.Routing;
using System.Web.Http.Controllers;
using System.Net.Http;
using System.Net;
using ArchPack.ArchUnits.WebApiExtensions.V1;
using System.IO;
using System.IO.Compression;
using System.Collections.Specialized;

namespace ArchPack.Tests.ArchUnits.WebApiExtensions.V1
{
    public class FileHttpRequestMessageExtensionsTest
    {
        private HttpRequestMessage requestMessage = new HttpRequestMessage(HttpMethod.Get, "http://localhost:46061/api/Sales/V2/Users/Account");

        
        public FileHttpRequestMessageExtensionsTest()
        {
            //HttpServer create.
            Mock<HttpServerUtilityBase> server = new Mock<HttpServerUtilityBase>();
            //Set Server MapPath with return value = ""
            server.Setup(s => s.MapPath(It.IsAny<string>())).Returns<string>(s => @"");
            //HttpRequest Create
            Mock<HttpRequestBase> httpRequest = new Mock<HttpRequestBase>();
            //Set HttpRequest.Params with return value is Empty NameValueCollection 
            httpRequest.Setup(r => r.Params).Returns(new NameValueCollection());
            //Set HttpRequest.ApplicationPath with return value is Empty String
            httpRequest.Setup(r => r.ApplicationPath).Returns(string.Empty);

            //HttpContext Create.
            Mock<HttpContextBase> httpContext = new Mock<HttpContextBase>();
            //Set HttpContext Server with Server.Object.
            httpContext.Setup(c => c.Server).Returns(server.Object);
            //Set HttpContext Items with empty dictionary.
            Dictionary<string, object> items = new Dictionary<string, object>();
            httpContext.Setup(c => c.Items).Returns(items);
            //Set HttpContext Request with HttpRequest.Object
            httpContext.Setup(c => c.Request).Returns(httpRequest.Object);
            //Set HttpContext Authenticate with Login User.
            var identity = new GenericIdentity("amimata");
            var principal = new GenericPrincipal(identity, null);
            httpContext.SetupGet(x => x.User).Returns(principal);
            ////HttpRequestContext Create.
            //Mock<HttpRequestContext> context = new Mock<HttpRequestContext>();
            //HttpRoute Create.
            HttpRoute route = new HttpRoute();
            //HttpRouteData Create with HttpRoute.
            HttpRouteData routeData = new HttpRouteData(route);
            //Set Data for HttpRouteData
            /*
             * api/Sales/V2/Users/Account
             * */
            routeData.Values.Add("service", "Sales");
            routeData.Values.Add("version", "V2");
            routeData.Values.Add("role", "Users");
            routeData.Values.Add("controller", "Account");

            HttpRequestContext requestContext = new HttpRequestContext();
            requestContext.RouteData = routeData;

            requestMessage.SetRequestContext(requestContext);
            requestMessage.Properties["MS_HttpContext"] = httpContext.Object;
        }

        [Fact]
        public void CreateFileDownloadResponseTest()
        {            
            var nameAndContents = new Dictionary<string, string>();
            var stream = new MemoryStream();

            using (var archive = new ZipArchive(stream, ZipArchiveMode.Create, true))
            {
                foreach (var nameAndContent in nameAndContents)
                {
                    var entry = archive.CreateEntry(nameAndContent.Key);
                    using (var write = new StreamWriter(entry.Open()))
                    {
                        write.Write(nameAndContent.Value);
                    }
                }
            }
            stream.Flush();
            HttpResponseMessage result = FileHttpRequestMessageExtensions.CreateFileDownloadResponse(requestMessage, HttpStatusCode.OK, stream, "Test.zip");
            Assert.Equal(HttpStatusCode.OK, result.StatusCode);            
            Assert.Equal("application/octet-stream", result.Content.Headers.ContentType.MediaType);
            Assert.Equal("attachment", result.Content.Headers.ContentDisposition.DispositionType);
            Assert.Equal("Test.zip", result.Content.Headers.ContentDisposition.FileName);
        }


        [Fact]
        public void CreateFileResponseTest()
        {
            var nameAndContents = new Dictionary<string, string>();
            var stream = new MemoryStream();

            using (var archive = new ZipArchive(stream, ZipArchiveMode.Create, true))
            {
                foreach (var nameAndContent in nameAndContents)
                {
                    var entry = archive.CreateEntry(nameAndContent.Key);
                    using (var write = new StreamWriter(entry.Open()))
                    {
                        write.Write(nameAndContent.Value);
                    }
                }
            }
            stream.Flush();
            HttpResponseMessage result = FileHttpRequestMessageExtensions.CreateFileResponse(requestMessage, HttpStatusCode.OK, stream, "Test.zip");
            Assert.Equal(HttpStatusCode.OK, result.StatusCode);
            Assert.Equal("application/octet-stream", result.Content.Headers.ContentType.MediaType);
        }

        [Fact]
        public void CreateFileDownloadErrorResponseTest()
        {
            HttpResponseMessage respone = FileHttpRequestMessageExtensions.CreateFileDownloadErrorResponse(requestMessage, HttpStatusCode.Moved, "This is Error Test!","");
            Uri responeredirect = new Uri(requestMessage.RequestUri.GetLeftPart(UriPartial.Authority) + "/Shared/V1/Users/page/DownloadError?Message=This is Error Test!&Detail=");
            Assert.Equal(HttpStatusCode.Moved, respone.StatusCode);
            Assert.Equal(responeredirect, respone.Headers.Location);
        }

        [Fact]
        public void CreateFileErrorResponseTest()
        {
            HttpResponseMessage respone = FileHttpRequestMessageExtensions.CreateFileErrorResponse(requestMessage, HttpStatusCode.Moved, "This is Error Test!");
            string content = respone.Content.ReadAsStringAsync().Result;
            Assert.Equal(HttpStatusCode.Moved, respone.StatusCode);
            Assert.True(content.Contains("This is Error Test!"));
        }
    }
}
