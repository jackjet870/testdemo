using System;
using Xunit;
using ArchPack.ArchUnits.WebApiExtensions.V1;

namespace ArchPack.Tests.ArchUnits.WebApiExtensions.V1
{    
    public class DateTimeExtensionsTest
    {
        private DateTime time = new DateTime(2016, 6, 22, 8, 00, 59, 999);
        private DateTime? timenotdef = null;
        private DateTimeOffset timeoffset = new DateTimeOffset(2016, 6, 23, 9, 25, 30, 550, new TimeSpan());
        private DateTimeOffset? timeoffsetnotdef = null;

        [Fact]
        public void TruncateMillisecondsDateTimeTest()
        {
            DateTimeOffset result = time.TruncateMilliseconds();
            Assert.Equal(28859000, result.TimeOfDay.TotalMilliseconds);
        }

        [Fact]
        public void TruncateTimeDateTimeTest()
        {
            DateTimeOffset result = time.TruncateTime();
            Assert.Equal(0, result.TimeOfDay.Hours);
            Assert.Equal(0, result.TimeOfDay.Minutes);
            Assert.Equal(0, result.TimeOfDay.Seconds);
            Assert.Equal(0, result.TimeOfDay.TotalMilliseconds);
        }

        [Fact]
        public void TruncateMillisecondsDateTimeWithNullTest()
        {
            var result = timenotdef.TruncateMilliseconds();
            Assert.Null(result);
        }

        [Fact]
        public void TruncateMillisecondsDateTimeWithInitializeTest()
        {
            timenotdef = new DateTime(2016, 6, 22, 8, 00, 59, 999);
            var result = timenotdef.TruncateMilliseconds().Value;
            Assert.Equal(28859000, result.TimeOfDay.TotalMilliseconds);
        }

        [Fact]
        public void TruncateTimeDateTimeWithNullTest()
        {
            var result = timenotdef.TruncateTime();
            Assert.Null(result);
        }

        [Fact]
        public void TruncateTimeDateTimeWithInitializeTest()
        {
            timenotdef = new DateTime(2016, 6, 22, 8, 00, 59, 999);
            var result = timenotdef.TruncateTime().Value;
            Assert.Equal(0, result.TimeOfDay.Hours);
            Assert.Equal(0, result.TimeOfDay.Minutes);
            Assert.Equal(0, result.TimeOfDay.Seconds);
            Assert.Equal(0, result.TimeOfDay.TotalMilliseconds);
        }

        [Fact]
        public void TruncateMillisecondsTimeOffSetWithNullTest()
        {
            var result = timeoffsetnotdef.TruncateMilliseconds();
            Assert.Null(result);
        }

        [Fact]
        public void TruncateMillisecondsTimeOffSetWithInitializeTest()
        {
            timeoffsetnotdef = new DateTimeOffset(2016, 6, 23, 9, 25, 30, 550, new TimeSpan());
            var result = timeoffsetnotdef.TruncateMilliseconds().Value;
            Assert.Equal(33930000, result.TimeOfDay.TotalMilliseconds);
        }

        [Fact]
        public void TruncateTimesTimeOffSetWithNullTest()
        {
            var result = timeoffsetnotdef.TruncateTime();
            Assert.Null(result);
        }

        [Fact]
        public void TruncateTimeOffSetWithInitializeTest()
        {
            timeoffsetnotdef = new DateTimeOffset(2016, 6, 23, 9, 25, 30, 550, new TimeSpan());
            var result = timeoffsetnotdef.TruncateTime().Value;
            Assert.Equal(0, result.TimeOfDay.Hours);
            Assert.Equal(0, result.TimeOfDay.Minutes);
            Assert.Equal(0, result.TimeOfDay.Seconds);
            Assert.Equal(0, result.TimeOfDay.TotalMilliseconds);
        }
    }
}
