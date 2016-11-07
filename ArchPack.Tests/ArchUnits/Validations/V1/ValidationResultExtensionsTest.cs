using ArchPack.ArchUnits.Validations.V1;
using ArchPack.ArchUnits.WebApiModels.V1;
using Xunit;


namespace ArchPack.Tests.ArchUnits.Validations.V1
{
    public class ValidationResultExtensionsTest2
    {
        private WebApiErrorResponse target = new WebApiErrorResponse();
        [Fact]
        public void CreateWebApiErrorResponseTest()
        {
            ValidationResult result = "123A".ValidateNumber("Error", string.Empty);
            target = result.CreateWebApiErrorResponse();
            Assert.Equal(WebApiErrorTypes.InputError, target.ErrorType);
            Assert.Equal("サービスで入力検証エラーが発生しました。", target.Message);
            Assert.Equal(1, target.Errors.Count);
            Assert.Equal(typeof(WebApiErrorDetail), target.Errors[0].GetType());
        }
    }
}
