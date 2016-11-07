using ArchPack.ArchUnits.Validations.V1;
using Xunit;

namespace ArchPack.Tests.ArchUnits.Validations.V1
{
    public class ValidationRulesTest2
    {
        private ValidationRules target;

        public ValidationRulesTest2()
        {
            target = new ValidationRules();
        }

        [Fact]
        public void AddSuccessValidationTest()
        {
            target.Add(() => "abc".ValidateMinLength(3, "String", string.Empty, false));
            target.Add(() => "abc".ValidateRequired("String", string.Empty));
            target.Add(() => "123".ValidateNumber("String", string.Empty));

            ValidationResult result = target.Validate();
            Assert.Equal(0, result.Errors.Count);
            Assert.True(result.IsValid);
            Assert.True(result.ResumeEvaluation);

        }
        [Fact]
        public void AddFailValidationWithoutResumeTest()
        {
            target.Add(() => "abc".ValidateMinLength(5, "String", string.Empty, false));
            target.Add(() => "123A".ValidateNumber("String", string.Empty));

            ValidationResult result = target.Validate();
            Assert.Equal(1, result.Errors.Count);
            Assert.NotNull(result.Errors[0].Message);
            Assert.False(result.IsValid);
            Assert.False(result.ResumeEvaluation);

        }
        [Fact]
        public void AddFailValidationWithResumeTest()
        {
            target.Add(() => "abc".ValidateMinLength(5, "Error1", string.Empty));
            target.Add(() => "123".ValidateNumber("Error2", string.Empty));
            target.Add(() => "123A".ValidateNumber("Error3", string.Empty));

            ValidationResult result = target.Validate();
            Assert.Equal(2, result.Errors.Count);
            Assert.NotNull(result.Errors[0].Message);
            Assert.NotNull(result.Errors[1].Message);
            Assert.False(result.IsValid);
            Assert.True(result.ResumeEvaluation);

        }
    }
}
