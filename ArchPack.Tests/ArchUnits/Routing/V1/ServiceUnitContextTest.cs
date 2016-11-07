using ArchPack.ArchUnits.Routing.V1;
using ArchPack.ArchUnits.Container.V1;
using ArchPack.ArchUnits.Container.Ninject.V1;
using Xunit;
using ArchPack.Tests.TestUnits.Helpers.V1;

namespace ArchPack.Tests.ArchUnits.Routing.V1
{
    
    public class ServiceUnitContextTest
    {       
        
        public ServiceUnitContextTest()
        {

            ContainerHelper.InitializeDefault();
        }

        [Fact]
        public void InitializeTest()
        {
            string path = "/Membership/V1/general/MixedAuthentication";
            var context = new ServiceUnitContext(path);
            Assert.NotNull(context);
            Assert.Equal("Membership", context.ServiceUnitName);
            Assert.Equal("V1", context.Version);
            Assert.Equal("general", context.Request.ProcessType);
        }

        [Fact]
        public void InitializeWithoutServiceUnitTest()
        {
            string path = "/general/MixedAuthentication";
            var context = new ServiceUnitContext(path);
            Assert.Null(context.Configuration);
            Assert.Null(context.ServiceUnitName);
            Assert.Null(context.Version);
            Assert.Null(context.Request);
        }
    }
}
