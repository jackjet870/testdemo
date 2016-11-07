using ArchPack.ArchUnits.Routing.V1;
using ArchPack.Tests.ServiceUnits;
using ArchPack.Tests.ServiceUnits.ServiceUnitName;
using System.Reflection;
using Xunit;

namespace ArchPack.Tests.ArchUnits.Routing.V1
{
    public class TypePathTest
    {
        [Fact]
        public void GetTypeTest()
        {
            var typePath = new AutoDetectTypePath(Root.GetRootNamespace(), Assembly.GetExecutingAssembly());
            var type = typePath.GetType("/AutoDetectTypePathTest1");
            Assert.Equal(typeof(AutoDetectTypePathTest1), type);
            type = typePath.GetType("/ServiceUnitName/AutoDetectTypePathTest2");
            Assert.Equal(typeof(AutoDetectTypePathTest2), type);
            type = typePath.GetType("Not found");
            Assert.Null(type);
        }

        [Fact]
        public void GetPathTest()
        {
            var typePath = new AutoDetectTypePath(Root.GetRootNamespace(), Assembly.GetExecutingAssembly());
            var path = typePath.GetPath(typeof(AutoDetectTypePathTest1));
            Assert.Equal("/AutoDetectTypePathTest1", path);
            path = typePath.GetPath(typeof(AutoDetectTypePathTest2));
            Assert.Equal("/ServiceUnitName/AutoDetectTypePathTest2", path);
            path = typePath.GetPath(typeof(TypePathTest));
            Assert.Null(path);
        }
    }
}

namespace ArchPack.Tests.ServiceUnits
{
    public class AutoDetectTypePathTest1
    {

    }

    namespace ServiceUnitName
    {
        public class AutoDetectTypePathTest2
        {

        }
    }
}
