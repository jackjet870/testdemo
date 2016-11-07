using Xunit;
using ArchPack.ArchUnits.Path.V1;

namespace ArchPack.Tests.ArchUnits.Path.V1
{
    public class PathMapResultTest
    {
        private PathMapResult target;

        [Fact]
        public void ContructorTest()
        {
            target = new PathMapResult();
            Assert.NotNull(target.Parameters);
        }
    }
}
