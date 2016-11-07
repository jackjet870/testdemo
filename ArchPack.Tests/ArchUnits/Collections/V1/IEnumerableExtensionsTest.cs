using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ArchPack.ArchUnits.Collections.V1;
using Xunit;
using System.Globalization;

namespace ArchPack.Tests.ArchUnits.Collections.V1
{
    public class IEnumerableExtensionsTest
    {
        [Fact]
        public void ConcatWithで文字列連結ができる()
        {
            Assert.Equal("A,B,C", new[] { "A", "B", "C" }.ConcatWith(","));
            Assert.Equal("1,2,3", new[] { 1, 2, 3 }.ConcatWith(","));
            Assert.Equal("A AND B AND C", new[] { "A", "B", "C" }.ConcatWith(" AND "));
        }

        [Fact]
        public void ConcatWithでフォーマット指定ができる()
        {
            Assert.Equal("_A_,_B_,_C_", new[] { "A", "B", "C" }.ConcatWith(",", "_{0}_"));
            Assert.Equal("1.00,2.00,3.00", new[] { 1, 2, 3 }.ConcatWith(",", "{0:0.00}"));
        }

        [Fact]
        public void 連結文字列には空文字列も可能()
        {
            Assert.Equal("ABC", string.Join("", new[] { "A", "B", "C" }));
            Assert.Equal("ABC", new[] { "A", "B", "C" }.ConcatWith(""));
        }

        [Fact]
        public void 連結文字列にnullを指定できる()
        {
            Assert.Equal("ABC", string.Join(null, new[] { "A", "B", "C" }));
            Assert.Equal("ABC", new[] { "A", "B", "C" }.ConcatWith(null));
        }

        [Fact]
        public void フォーマットにnullは指定できない()
        {
            Assert.Throws<ArgumentNullException>(() => new[] { "A", "B", "C" }.ConcatWith(null, null));
        }

        [Fact]
        public void IFormatProviderにnullは指定できる()
        {
            Assert.Equal("!A!B!C", new[] { "A", "B", "C" }.ConcatWith(null, "!{0}", null));
        }

        [Fact]
        public void FormatProviderを指定できる()
        {
            var dateTimeInfo = new CultureInfo("ja-JP").DateTimeFormat;
            dateTimeInfo.Calendar = new JapaneseCalendar();
            
            Assert.Equal("平成昭和", new[] { new DateTime(2014, 1, 1), new DateTime(1980, 1, 1) }.ConcatWith(null, "{0:gg}", dateTimeInfo));
        }
    }
}
