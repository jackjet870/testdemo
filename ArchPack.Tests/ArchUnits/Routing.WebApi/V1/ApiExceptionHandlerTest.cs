using System;
using Xunit;
using System.IO;
using System.Web.Http.ExceptionHandling;
using System.Net.Http;
using System.Net;
using System.Web.Http.Results;
using System.Web.Http;
using System.Web.Http.Hosting;
using System.Web;
using System.Data.Entity.Infrastructure;
using System.Security.Principal;
using System.Collections.Generic;
using System.Data.Entity.Core;
using System.Data.Entity.Validation;
using ArchPack.ArchUnits.Routing.WebApi.V1;
using ArchPack.ArchUnits.WebApiModels.V1;
using Moq;
using ArchPack.ArchUnits.Container.V1;
using Owin;
using ArchPack.ArchUnits.Container.Ninject.V1;
using ArchPack.ArchUnits.Routing.Owin.V1;
using ArchPack.ArchUnits.Routing.WebApi.Owin.V1;
using Microsoft.Owin.Testing;
using ArchPack.Tests.TestUnits.Helpers.V1;
using ArchPack.ArchUnits.Routing.V1;
namespace ArchPack.Tests.ArchUnits.Routing.WebApi.V1
{
    
    public class ApiExceptionHandlerTest : IDisposable
    {
        private ApiExceptionHandler target;
        private string logPath;
        
        public ApiExceptionHandlerTest()
        {
            logPath = string.Format("ServiceUnits/Test/V1/log/trace-{0:yyyy-MM-dd}.log", DateTime.Now);
            ContainerHelper.InitializeDefault();
        }
       
        public void Dispose()
        {
            if (File.Exists(logPath))
            {
                File.Delete(logPath);
            }
        }

        private const string siteName = "http://localhost/";

        [Fact]
        public void 例外発生時にステータスコードでInternalServerErrorが返されるべき()
        {            

            target = new ApiExceptionHandler();

            Exception e = new Exception("Exception型のエラー発生");

            string requestUri = siteName + "Test/V1/Users/api/DataModel";

            ExceptionHandlerContext context = CreateExceptionHandlerContext(requestUri, e);

            target.Handle(context);
            
            Assert.IsType(typeof(ResponseMessageResult), context.Result);

            HttpResponseMessage message = (context.Result as ResponseMessageResult).Response;

            Assert.Equal(HttpStatusCode.InternalServerError, message.StatusCode);

            ObjectContent content = message.Content as ObjectContent;
            
            WebApiErrorResponse errorResponse = content.Value as WebApiErrorResponse;

            Assert.Equal(WebApiErrorTypes.SystemError, errorResponse.ErrorType);

            Assert.Equal("サービスでエラーが発生しました。", errorResponse.Message);

            Assert.Equal(e.ToString(), errorResponse.Description);
        }

        [Fact]
        public void DbUpdateConcurrencyException型の例外発生時にステータスコードでConflictが返されるべき()
        {
            target = new ApiExceptionHandler();

            DbUpdateConcurrencyException e = new DbUpdateConcurrencyException("DbUpdateConcurrencyException型のエラー発生");
            string requestUri = siteName + "Test/V1/Users/api/DataModel";

            ExceptionHandlerContext context = CreateExceptionHandlerContext(requestUri, e);

            target.Handle(context);

            HttpResponseMessage message = (context.Result as ResponseMessageResult).Response;

            Assert.Equal(HttpStatusCode.Conflict, message.StatusCode);

            ObjectContent content = message.Content as ObjectContent;
            WebApiErrorResponse errorResponse = content.Value as WebApiErrorResponse;

            Assert.Equal(WebApiErrorTypes.ConflictError, errorResponse.ErrorType);
            Assert.Equal("すでに他のユーザーがこのデータを変更しています。最新のデータを取得してください。", errorResponse.Message);
            Assert.Equal(e.ToString(), errorResponse.Description);
        }

        [Fact]
        public void InnerExcceptionにDbUpdateConcurrencyException型の例外が含まれる場合もステータスコードでConflictが返されるべき()
        {
            target = new ApiExceptionHandler();

            Exception e = new Exception(
                "Exception型のエラー発生",
                new DbUpdateConcurrencyException("DbUpdateConcurrencyException型のエラー発生"));

            string requestUri = siteName + "Test/V1/Users/api/DataModel";

            ExceptionHandlerContext context = CreateExceptionHandlerContext(requestUri, e);

            target.Handle(context);

            HttpResponseMessage message = (context.Result as ResponseMessageResult).Response;

            Assert.Equal(HttpStatusCode.Conflict, message.StatusCode);

            ObjectContent content = message.Content as ObjectContent;
            WebApiErrorResponse errorResponse = content.Value as WebApiErrorResponse;

            Assert.Equal(WebApiErrorTypes.ConflictError, errorResponse.ErrorType);
            Assert.Equal("すでに他のユーザーがこのデータを変更しています。最新のデータを取得してください。", errorResponse.Message);
            Assert.Equal(e.InnerException.ToString(), errorResponse.Description);
        }

        [Fact]
        public void DbUpdateException型の例外のInnerExcceptionにSqlException型の例外が含まれる場合はステータスコードでInternalServerErrorが返されるべき()
        {
            target = new ApiExceptionHandler();

            DbUpdateException e = new DbUpdateException(
                "DbUpdateException型のエラー発生",
                SqlExceptionHelper.Create(515));

            string requestUri = siteName + "Test/V1/Users/api/DataModel";

            ExceptionHandlerContext context = CreateExceptionHandlerContext(requestUri, e);

            target.Handle(context);

            HttpResponseMessage message = (context.Result as ResponseMessageResult).Response;

            Assert.Equal(HttpStatusCode.InternalServerError, message.StatusCode);

            ObjectContent content = message.Content as ObjectContent;
            WebApiErrorResponse errorResponse = content.Value as WebApiErrorResponse;

            Assert.Equal(WebApiErrorTypes.DatabaseError, errorResponse.ErrorType);
            Assert.Equal("データの保存に失敗しました。", errorResponse.Message);
            Assert.Equal(e.ToString(), errorResponse.Description);
        }

        [Fact]
        public void DbUpdateException型の例外のInnerExcceptionにUpdateException型の例外が含まれる場合もステータスコードでInternalServerErrorが返されるべき()
        {
            target = new ApiExceptionHandler();

            DbUpdateException e = new DbUpdateException(
                "DbUpdateException型のエラー発生",
                new UpdateException("UpdateException型のエラー発生"));

            string requestUri = siteName + "Test/V1/Users/api/DataModel";

            ExceptionHandlerContext context = CreateExceptionHandlerContext(requestUri, e);

            target.Handle(context);

            HttpResponseMessage message = (context.Result as ResponseMessageResult).Response;

            Assert.Equal(HttpStatusCode.InternalServerError, message.StatusCode);

            ObjectContent content = message.Content as ObjectContent;
            WebApiErrorResponse errorResponse = content.Value as WebApiErrorResponse;

            Assert.Equal(WebApiErrorTypes.DatabaseError, errorResponse.ErrorType);
            Assert.Equal("データの保存に失敗しました。", errorResponse.Message);
            Assert.Equal(e.ToString(), errorResponse.Description);
        }

        [Fact]
        public void DbEntityValidationException型の例外発生時にステータスコードでBadRequestが返されるべき()
        {
            target = new ApiExceptionHandler();

            DbEntityValidationException e = new DbEntityValidationException("DbEntityValidationException型のエラー発生");
            string requestUri = siteName + "Test/V1/Users/api/DataModel";

            ExceptionHandlerContext context = CreateExceptionHandlerContext(requestUri, e);

            target.Handle(context);

            HttpResponseMessage message = (context.Result as ResponseMessageResult).Response;

            Assert.Equal(HttpStatusCode.BadRequest, message.StatusCode);

            ObjectContent content = message.Content as ObjectContent;
            WebApiErrorResponse errorResponse = content.Value as WebApiErrorResponse;

            Assert.Equal(WebApiErrorTypes.DatabaseError, errorResponse.ErrorType);
            Assert.Equal("データの保存に失敗しました。", errorResponse.Message);
            Assert.Equal(e.ToString(), errorResponse.Description);
        }

        //[Fact]
        //public void 例外発生時にエラーログが出力されるべき()
        //{
        //    target = new ApiExceptionHandler();

        //    Exception e = new Exception("Exception型のエラー発生");

        //    string requestUri = siteName + "Test/V1/Users/api/DataModel";

        //    ExceptionHandlerContext context = CreateExceptionHandlerContext(requestUri, e);

        //    target.Handle(context);

        //    Assert.True(File.Exists(logPath));

        //    string logString = UnitTestHelper.Fist(logPath);

        //    Assert.True(logString.Contains("Uri:/Test/V1/Users/api/DataModel"));
        //}

        private ExceptionHandlerContext CreateExceptionHandlerContext(string requestUri, Exception exception)
        {
            var httpContext = new HttpContext(
                new HttpRequest(String.Empty, "http://localhost/", String.Empty),
                new HttpResponse(new StringWriter()));
            HttpContext.Current = httpContext;

            var config = new HttpConfiguration();
            
            var httpContextBaseMock = new Mock<HttpContextBase>(MockBehavior.Strict);

            var identity = new GenericIdentity("system");
            var principal = new GenericPrincipal(identity, null);

            httpContextBaseMock.SetupGet(x => x.User).Returns(principal);

            var httpContextBase = httpContextBaseMock.Object;

            var items = new Dictionary<object, object>();

            httpContextBaseMock.SetupGet(x => x.Items).Returns(items);

            var request = new HttpRequestMessage(HttpMethod.Post, requestUri);
            request.Properties[HttpPropertyKeys.HttpConfigurationKey] = config;
            request.Properties["MS_HttpContext"] = httpContextBase;            

            ExceptionHandlerContext context = new ExceptionHandlerContext(
                new ExceptionContext(exception, ExceptionCatchBlocks.HttpServer, request));

            request.SetUriProcessResolver(new WebApiProcessResolver());
            request.SetServiceUnitContext(new ServiceUnitContext("/" + requestUri.Substring(siteName.Length)));

            return context;
        }       
    }
}
