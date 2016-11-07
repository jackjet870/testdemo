using ArchPack.ArchUnits.Validations.V1;
using ArchPack.ArchUnits.WebApiModels.V1;
using Xunit;

namespace ArchPack.Tests.ArchUnits.Validations.V1
{

    public class ValidationResultTest2
    {
        private ValidationResult target;
        public ValidationResultTest2()
        {
            target = new ValidationResult();
        }
        [Fact]
        public void ChainTest()
        {
            ValidationResult result = "123A".ValidateNumber("Error", string.Empty);
            target.Chain(result);
            Assert.NotEqual(0, target.Errors.Count);
        }
        [Fact]
        public void AddChainTest()
        {
            ValidationResult result = "123A".ValidateNumber("Error", string.Empty);
            WebApiErrorResponse a = result.CreateWebApiErrorResponse();
            target.AddRange(result.Errors);
            Assert.NotEqual(0, target.Errors.Count);
        }
    }
}
