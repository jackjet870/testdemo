using System;
using Xunit;
using ArchPack.ArchUnits.WebApiModels.V1;
using System.Security.Authentication;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Core;
using System.Data.Entity.Validation;
using ArchPack.Tests.TestUnits.Helpers.V1;

namespace ArchPack.Tests.ArchUnits.WebApiModels.V1
{
    public class WebApiErrorResponseTest
    {
        [Fact]
        public void Constractor_Test()
        {
            WebApiErrorResponse target = new WebApiErrorResponse();
            UserInfo userInfo = new UserInfo() { UserName = "quang@archway.co.jp", Name = "Quang Vo" };
            target.Description = "Test Desc";
            target.ErrorType = "Null Value";
            target.Message = "Can not empty";
            target.Errors.Add(new WebApiErrorDetail() {Data=userInfo, Message = "Can not empty", Value = ""});
            Assert.NotNull(target);
            Assert.Equal("Test Desc", target.Description);
            Assert.Equal("Null Value", target.ErrorType);
            Assert.Equal("Can not empty", target.Message);
            Assert.Equal("Can not empty", target.Errors[0].Message);
            Assert.Equal("", target.Errors[0].Value);
            Assert.Equal("quang@archway.co.jp", ((UserInfo)target.Errors[0].Data).UserName);
        }

        [Fact]
        public void Create_RetrieveTargetExceptionWithoutAggregateException_Test()
        {
            WebApiErrorResponse target = WebApiErrorResponse.Create(new Exception());
            Assert.Equal("system_error", target.ErrorType);
        }

        [Fact]
        public void Create_RetrieveTargetExceptionWithAggregateExceptionWithoutInnerExceptionTest()
        {
            WebApiErrorResponse target = WebApiErrorResponse.Create(new AggregateException());
            Assert.Equal("system_error", target.ErrorType);
        }

        [Fact]
        public void Create_RetrieveTargetExceptionWithAggregateExceptionWithInnerExceptionTest()
        {
            WebApiErrorResponse target = WebApiErrorResponse.Create(new AggregateException("Exception",new AuthenticationException("inner exception")));
            Assert.Equal("authentication_error", target.ErrorType);
        }
        
        [Fact]
        public void Create_HandleAuthenticationErrorWithAuthenticationException_Test()
        {
            WebApiErrorResponse target = WebApiErrorResponse.Create(new AuthenticationException());
            Assert.Equal("authentication_error", target.ErrorType);
        }
        
        [Fact]
        public void Create_HandleAuthenticationErrorWithoutAuthenticationExceptionWithoutInnerExceptionTest()
        {
            WebApiErrorResponse target = WebApiErrorResponse.Create(new Exception());
            Assert.Equal("system_error", target.ErrorType);
        }

        [Fact]
        public void Create_HandleAuthenticationErrorWithoutAuthenticationExceptionWithInnerExceptionTest()
        {
            Exception ex = new Exception("Exception", new AuthenticationException("inner exception"));
            WebApiErrorResponse target = WebApiErrorResponse.Create(ex);
            Assert.Equal("authentication_error", target.ErrorType);
        }


        [Fact]
        public void Create_HandleAuthorizeErrorWithUnauthorizedAccessExceptionTest()
        {
            WebApiErrorResponse target = WebApiErrorResponse.Create(new UnauthorizedAccessException());
            Assert.Equal("authorization_error", target.ErrorType);
        }

        [Fact]
        public void Create_HandleAuthorizeErrorWithoutUnauthorizedAccessExceptionWithoutInnerExceptionTest()
        {
            WebApiErrorResponse target = WebApiErrorResponse.Create(new Exception());
            Assert.Equal("system_error", target.ErrorType);
        }

        [Fact]
        public void Create_HandleAuthorizeErrorWithoutUnauthorizedAccessExceptionWithInnerException_Test()
        {
            Exception ex = new Exception("Exception", new UnauthorizedAccessException("inner exception"));
            WebApiErrorResponse target = WebApiErrorResponse.Create(ex);
            Assert.Equal("authorization_error", target.ErrorType);
        }
        

        [Fact]
        public void CreateHandleDbUpdateConcurrencyErrorWithDbUpdateConcurrencyExceptionTest()
        {
            WebApiErrorResponse target = WebApiErrorResponse.Create(new DbUpdateConcurrencyException());
            Assert.Equal("conflict_error", target.ErrorType);
        }

        [Fact]
        public void CreateHandleDbUpdateConcurrencyErrorWithoutDbUpdateConcurrencyExceptionWithoutInnerExceptionTest()
        {
            WebApiErrorResponse target = WebApiErrorResponse.Create(new Exception());
            Assert.Equal("system_error", target.ErrorType);
        }

        [Fact]
        public void CreateHandleDbUpdateConcurrencyErrorWithoutDbUpdateConcurrencyExceptionWithInnerExceptionTest()
        {
            Exception ex = new Exception("Exception", new DbUpdateConcurrencyException("inner exception"));
            WebApiErrorResponse target = WebApiErrorResponse.Create(ex);
            Assert.Equal("conflict_error", target.ErrorType);
        }

        [Fact]
        public void CreateHandleDbUpdateErrorWithoutDbUpdateExceptionWithoutInnerExceptionTest()
        {
            WebApiErrorResponse target = WebApiErrorResponse.Create(new Exception());
            Assert.Equal("system_error", target.ErrorType);
        }

        [Fact]
        public void CreateHandleDbUpdateErrorWithDbUpdateExceptionWithoutInnerExceptionTest()
        {
            WebApiErrorResponse target = WebApiErrorResponse.Create(new DbUpdateException());
            Assert.Equal("system_error", target.ErrorType);
        }

        [Fact]
        public void CreateHandleDbUpdateErrorWithDbUpdateExceptionWithSqlExceptionTest()
        {
            DbUpdateException ex = new DbUpdateException("Exception", SqlExceptionHelper.Create(515));
            WebApiErrorResponse target = WebApiErrorResponse.Create(ex);
            Assert.Equal("db_error", target.ErrorType);
        }

        [Fact]
        public void CreateHandleDbUpdateErrorWithDbUpdateExceptionWithUpdateExceptionTest()
        {
            DbUpdateException ex = new DbUpdateException("Exception", new UpdateException("inner exception"));
            WebApiErrorResponse target = WebApiErrorResponse.Create(ex);
            Assert.Equal("db_error", target.ErrorType);
        }
        
        [Fact]
        public void CreateHandleDbEntityValidationErrorWithDbEntityValidationExceptionTest()
        {
            WebApiErrorResponse target = WebApiErrorResponse.Create(new DbEntityValidationException());
            Assert.Equal("db_error", target.ErrorType);
        }

        [Fact]
        public void CreateHandleDbEntityValidationErrorWithoutDbEntityValidationExceptionTest()
        {
            WebApiErrorResponse target = WebApiErrorResponse.Create(new Exception());
            Assert.Equal("system_error", target.ErrorType);
        }

        [Fact]
        public void CreateHandleWebApiErrorWithWebApiErrorExceptionTest()
        {
            WebApiErrorResponse webApiErrorResponse = new WebApiErrorResponse();
            webApiErrorResponse.Errors.Add(new WebApiErrorDetail() { Message = "Can not empty", Value = "" });
            WebApiErrorResponse target = WebApiErrorResponse.Create(new WebApiErrorException(webApiErrorResponse));
            Assert.Equal(1, target.Errors.Count);
        }

        [Fact]
        public void CreateHandleWebApiErrorWithoutWebApiErrorExceptionTest()
        {
            WebApiErrorResponse target = WebApiErrorResponse.Create(new Exception());
            Assert.Equal("system_error", target.ErrorType);
        }

        [Fact]
        public void CreateHandleArgumentErrorWithoutArgumentExceptionTest()
        {
            WebApiErrorResponse target = WebApiErrorResponse.Create(new Exception());
            Assert.Equal("system_error", target.ErrorType);
        }
    }

    public class UserInfo
    {
        public string UserName { get; set; }
        public string Name { get; set; }
    }
}
