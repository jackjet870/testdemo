using System;
using ArchPack.ArchUnits.Validations.V1;
using Xunit;

namespace ArchPack.Tests.ArchUnits.Validations.V1
{

    public class ValidationExtensionsTest
    {

        //MinLength
        [Fact]
        public void ValidateMinLengthWithTrueResultTest()
        {
            string input = "Abc";
            ValidationResult result = input.ValidateMinLength(3, "Error", string.Empty);
            Assert.Equal(0, result.Errors.Count);
            Assert.True(result.IsValid);
        }
        [Fact]
        public void ValidateMinLengthWithFalseResultTest()
        {
            string input = "abc";
            ValidationResult result = input.ValidateMinLength(5, "Error", string.Empty);
            Assert.NotEqual(0, result.Errors.Count);
            Assert.False(result.IsValid);
        }

        [Fact]
        public void ValidateMinLengthWithExceptionTest()
        {
            string input = "abc";
            Assert.Throws<ArgumentException>(() => input.ValidateMinLength(-5, "Error", string.Empty));
        }

        [Fact]
        public void ValidateMaxLengthWithTrueResultTest()
        {
            string input = "abc";
            ValidationResult result = input.ValidateMaxLength(3, "Error", string.Empty);
            Assert.Equal(0, result.Errors.Count);
            Assert.True(result.IsValid);
        }
        [Fact]
        public void ValidateMaxLengthWithFalseResultTest()
        {
            string input = "abcde";
            ValidationResult result = input.ValidateMaxLength(3, "Error", string.Empty);
            Assert.NotEqual(0, result.Errors.Count);
            Assert.False(result.IsValid);
        }

        [Fact]
        public void ValidateMaxLengthWithExceptionTest()
        {
            string input = "abc";
            Assert.Throws<ArgumentException>(() => input.ValidateMaxLength(-3, "Error", string.Empty));

        }
        [Fact]
        public void ValidateMaximumWithTrueResultTest()
        {
            decimal input = 10;
            ValidationResult result = input.ValidateMaximum(15, "Error", string.Empty);
            Assert.Equal(0, result.Errors.Count);
            Assert.True(result.IsValid);
        }
        [Fact]
        public void ValidateMaximumWithFalseResultTest()
        {
            decimal input = 10;
            ValidationResult result = input.ValidateMaximum(5, "Error", string.Empty);
            Assert.NotEqual(0, result.Errors.Count);
            Assert.False(result.IsValid);
        }
        [Fact]
        public void ValidateMinimumWithTrueResultTest()
        {
            decimal input = 10;
            ValidationResult result = input.ValidateMinimum(2, "Error", string.Empty);
            Assert.Equal(0, result.Errors.Count);
            Assert.True(result.IsValid);
        }
        [Fact]
        public void ValidateMinimumWithFalseResultTest()
        {
            decimal input = 10;
            ValidationResult result = input.ValidateMinimum(15, "Error", string.Empty);
            Assert.NotEqual(0, result.Errors.Count);
            Assert.False(result.IsValid);
        }
        [Fact]
        public void ValidateNarrowStringWithTrueResultTest()
        {
            string input = "abc";
            ValidationResult result = input.ValidateNarrowString("Error", string.Empty);
            Assert.Equal(0, result.Errors.Count);
            Assert.True(result.IsValid);
        }
        [Fact]
        public void ValidateNarrowStringWithFalseResultTest()
        {
            string input = "田中さんは真面目です";
            ValidationResult result = input.ValidateNarrowString("Error", string.Empty);
            Assert.NotEqual(0, result.Errors.Count);
            Assert.False(result.IsValid);
        }
        [Fact]
        public void ValidateWideStringWithTrueResultTest()
        {
            string input = "田中さんは真面目です";
            ValidationResult result = input.ValidateWideString("Error", string.Empty);
            Assert.Equal(0, result.Errors.Count);
            Assert.True(result.IsValid);
        }
        [Fact]
        public void ValidateWideStringWithFalseResultTest()
        {
            string input = "abc";
            ValidationResult result = input.ValidateWideString("Error", string.Empty);
            Assert.NotEqual(0, result.Errors.Count);
            Assert.False(result.IsValid);
        }

        [Fact]
        public void ValidateEmailAddressWithTrueResultTest()
        {
            string input = "abc@gmail.com";
            ValidationResult result = input.ValidateEmailAddress("Error", string.Empty);
            Assert.Equal(0, result.Errors.Count);
            Assert.True(result.IsValid);
        }
        [Fact]
        public void ValidateEmailAddressWithFalseResultTest()
        {
            string input = "abc@@gmail.com";
            ValidationResult result = input.ValidateEmailAddress("Error", string.Empty);
            Assert.NotEqual(0, result.Errors.Count);
            Assert.False(result.IsValid);
        }
        [Fact]
        public void ValidateAlphaNumericSymbolWithTrueResultTest()
        {
            string input = "abc@@gmail.com";
            ValidationResult result = input.ValidateAlphaNumericSymbol("Error", string.Empty);
            Assert.Equal(0, result.Errors.Count);
            Assert.True(result.IsValid);
        }
        [Fact]
        public void ValidateAlphaNumericSymbolWithFalseResultTest()
        {
            string input = "#$@";
            ValidationResult result = input.ValidateAlphaNumericSymbol("Error", string.Empty);
            Assert.NotEqual(0, result.Errors.Count);
            Assert.False(result.IsValid);
        }
        [Fact]
        public void ValidateAlphaNumericWithTrueResultTest()
        {
            string input = "abc123";
            ValidationResult result = input.ValidateAlphabetOrNumeric("Error", string.Empty);
            Assert.Equal(0, result.Errors.Count);
            Assert.True(result.IsValid);
        }
        [Fact]
        public void ValidateAlphaNumericWithFalseResultTest()
        {
            string input = "#$@";
            ValidationResult result = input.ValidateAlphabetOrNumeric("Error", string.Empty);
            Assert.NotEqual(0, result.Errors.Count);
            Assert.False(result.IsValid);
        }
        [Fact]
        public void ValidateAlphaWithTrueResultTest()
        {
            string input = "-123";
            ValidationResult result = input.ValidateNumber("Error", string.Empty);
            Assert.Equal(0, result.Errors.Count);
            Assert.True(result.IsValid);
        }
        [Fact]
        public void ValidateAlphaWithFalseResultTest()
        {
            string input = "abc";
            ValidationResult result = input.ValidateNumber("Error", string.Empty);
            Assert.NotEqual(0, result.Errors.Count);
            Assert.False(result.IsValid);
        }
        [Fact]
        public void ValidateRequiredWithTrueResultTest()
        {
            string input = "123";
            ValidationResult result = input.ValidateRequired("Error", string.Empty);
            Assert.Equal(0, result.Errors.Count);
            Assert.True(result.IsValid);
        }
        [Fact]
        public void ValidateRequiredWithFalseResultTest()
        {
            string input = "";
            ValidationResult result = input.ValidateRequired("Error", string.Empty);
            Assert.NotEqual(0, result.Errors.Count);
            Assert.False(result.IsValid);
        }
        [Fact]
        public void ValidateDateFormatWithTrueResultTest()
        {
            string input = "900806";
            ValidationResult result = input.ValidateDateFormat("yymmdd", "Error", string.Empty);
            Assert.Equal(0, result.Errors.Count);
            Assert.True(result.IsValid);
        }
        [Fact]
        public void ValidateDateFormatWithFalseResultTest()
        {
            string input = "1234/12/12";
            ValidationResult result = input.ValidateDateFormat("yyyy/mm/dd", "Error", string.Empty);
            Assert.NotEqual(0, result.Errors.Count);
            Assert.False(result.IsValid);
        }
        [Fact]
        public void ValidateDateFormatWithWrongFormatTest()
        {
            string input = "08061990";
            ValidationResult result = input.ValidateDateFormat("yyyy/mm/dd", "Error", string.Empty);
            Assert.NotEqual(0, result.Errors.Count);
            Assert.False(result.IsValid);
        }
        [Fact]
        public void ValidateDateFormatWithWrongDateTest()
        {
            string input = "1990/12/32";
            ValidationResult result = input.ValidateDateFormat("yyyy/mm/dd", "Error", string.Empty);
            Assert.NotEqual(0, result.Errors.Count);
            Assert.False(result.IsValid);
        }

        public void ValidateMinLengthWithObjectTest()
        {
            string input = "Abc";
            ValidationResult result = input.ValidateMinLength(3, "Error", string.Empty, string.Empty);
            Assert.Equal(0, result.Errors.Count);
            Assert.True(result.IsValid);
        }

        [Fact]
        public void ValidateMaxLengthWithObjectTest()
        {
            string input = "abc";
            ValidationResult result = input.ValidateMaxLength(3, "Error", string.Empty, string.Empty);
            Assert.Equal(0, result.Errors.Count);
            Assert.True(result.IsValid);
        }

        [Fact]
        public void ValidateMaximumWithObjectTest()
        {
            decimal input = 10;
            ValidationResult result = input.ValidateMaximum(15, "Error", string.Empty, string.Empty);
            Assert.Equal(0, result.Errors.Count);
            Assert.True(result.IsValid);
        }

        [Fact]
        public void ValidateMinimumWithObjectTest()
        {
            decimal input = 10;
            ValidationResult result = input.ValidateMinimum(2, "Error", string.Empty, string.Empty);
            Assert.Equal(0, result.Errors.Count);
            Assert.True(result.IsValid);
        }

        [Fact]
        public void ValidateNarrowStringWithObjectTest()
        {
            string input = "abc";
            ValidationResult result = input.ValidateNarrowString("Error", string.Empty, string.Empty);
            Assert.Equal(0, result.Errors.Count);
            Assert.True(result.IsValid);
        }

        [Fact]
        public void ValidateWideStringWithObjectTest()
        {
            string input = "田中さんは真面目です";
            ValidationResult result = input.ValidateWideString("Error", string.Empty, string.Empty);
            Assert.Equal(0, result.Errors.Count);
            Assert.True(result.IsValid);
        }

        [Fact]
        public void ValidateEmailAddressWithObjectTest()
        {
            string input = "abc@gmail.com";
            ValidationResult result = input.ValidateEmailAddress("Error", string.Empty, string.Empty);
            Assert.Equal(0, result.Errors.Count);
            Assert.True(result.IsValid);
        }

        [Fact]
        public void ValidateAlphaNumericSymbolWithObjectTest()
        {
            string input = "abc@@gmail.com";
            ValidationResult result = input.ValidateAlphaNumericSymbol("Error", string.Empty, string.Empty);
            Assert.Equal(0, result.Errors.Count);
            Assert.True(result.IsValid);
        }

        [Fact]
        public void ValidateAlphaNumericWithObjectTest()
        {
            string input = "abc123";
            ValidationResult result = input.ValidateAlphabetOrNumeric("Error", string.Empty, string.Empty);
            Assert.Equal(0, result.Errors.Count);
            Assert.True(result.IsValid);
        }

        [Fact]
        public void ValidateAlphaWithObjectTest()
        {
            string input = "-123";
            ValidationResult result = input.ValidateNumber("Error", string.Empty, string.Empty);
            Assert.Equal(0, result.Errors.Count);
            Assert.True(result.IsValid);
        }

        [Fact]
        public void ValidateRequiredWithObjectTest()
        {
            string input = "123";
            ValidationResult result = input.ValidateRequired("Error", string.Empty, string.Empty);
            Assert.Equal(0, result.Errors.Count);
            Assert.True(result.IsValid);
        }

        [Fact]
        public void ValidateDateFormatWithObjectTest()
        {
            string input = "900806";
            ValidationResult result = input.ValidateDateFormat("yymmdd", "Error", string.Empty, string.Empty);
            Assert.Equal(0, result.Errors.Count);
            Assert.True(result.IsValid);
        }

        [Fact]
        public void ValidateMaxSJisByteLengthTest()
        {
            string input = "1234567890-=qwertyuiop[]\\asdfghjkl;'zxcvbnm,./!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:\"ZXCVBNM<>?･ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝﾞﾟ~ " + "\r\n";
            ValidationResult result = input.ValidateMaxSJisByteLength(145, string.Empty, string.Empty, string.Empty);
            Assert.Equal(0, result.Errors.Count);
            Assert.True(result.IsValid);

            input = "あ1234567890-=qwertyuiop[]\\asdfghjkl;'zxcvbnm,./!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:\"ZXCVBNM<>?･ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝﾞﾟ~ " + "\r\n";
            result = input.ValidateMaxSJisByteLength(145, string.Empty, string.Empty, string.Empty);
            Assert.Equal(1, result.Errors.Count);
            Assert.False(result.IsValid);

            input = "あ1234567890-=qwertyuiop[]\\asdfghjkl;'zxcvbnm,./!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:\"ZXCVBNM<>?･ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝﾞﾟ~ " + "\r\n";
            result = input.ValidateMaxSJisByteLength(147, string.Empty, string.Empty, string.Empty);
            Assert.Equal(0, result.Errors.Count);
            Assert.True(result.IsValid);

            input = "𩸽あ1234567890-=qwertyuiop[]\\asdfghjkl;'zxcvbnm,./!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:\"ZXCVBNM<>?･ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝﾞﾟ~ " + "\r\n";
            result = input.ValidateMaxSJisByteLength(151, string.Empty, string.Empty, string.Empty);
            Assert.Equal(0, result.Errors.Count);
            Assert.True(result.IsValid);
        }
    }

}
