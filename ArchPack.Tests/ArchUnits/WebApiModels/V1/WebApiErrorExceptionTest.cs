using Xunit;
using ArchPack.ArchUnits.WebApiModels.V1;
namespace ArchPack.Tests.ArchUnits.WebApiModels.V1
{

    public class WebApiErrorExceptionTest
    {
        [Fact]
        public void ConstractorTest()
        {
            WebApiErrorResponse webApiErrorResponse = new WebApiErrorResponse();
            webApiErrorResponse.ErrorType = WebApiErrorTypes.InputError;
            webApiErrorResponse.Description = "Input Error";
            webApiErrorResponse.Message = "Can not empty";
            webApiErrorResponse.Errors.Add(new WebApiErrorDetail() { Message = "Can not empty", Value = "" });

            WebApiErrorException target = new WebApiErrorException(webApiErrorResponse);
            Assert.NotNull(target);
            Assert.Equal(WebApiErrorTypes.InputError, target.ErrorResponseData.ErrorType);
            Assert.Equal("Input Error", target.ErrorResponseData.Description);
            Assert.Equal("Can not empty", target.ErrorResponseData.Message);
            Assert.Equal("Can not empty", target.ErrorResponseData.Errors[0].Message);
            Assert.Equal("", target.ErrorResponseData.Errors[0].Value);
        }
    }
}
