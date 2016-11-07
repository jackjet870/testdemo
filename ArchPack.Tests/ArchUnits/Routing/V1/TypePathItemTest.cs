using Xunit;
using ArchPack.ArchUnits.Routing.V1;

namespace ArchPack.Tests.ArchUnits.Routing.V1
{    
    public class TypePathItemTest
    {
        [Fact]
        public void InitializeTest()
        {            
            var typePathItem = new TypePathItem("foo/bar/index.html", typeof(string));
            Assert.Equal(typePathItem.Path, "foo/bar/index.html");
            Assert.Same(typeof(string), typePathItem.TargetType);
        }
    }
}
