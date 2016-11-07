
using ArchPack.ArchUnits.Routing.V1;
using Xunit;
using ArchPack.ArchUnits.Container.V1;
using ArchPack.ArchUnits.Container.Ninject.V1;
using ArchPack.Tests.TestUnits.Helpers.V1;

namespace ArchPack.Tests.ArchUnits.Routing.V1
{
    
    public class ServiceUnitRequestTest
    {
        private ServiceUnitContext context;
        const string path = "/Test/V1/general/MixedAuthentication";


        public ServiceUnitRequestTest()
        {

            ContainerHelper.InitializeDefault();
            context = new ServiceUnitContext(path);
        }

        [Fact]
        public void InitializeTest()
        {
            var pathInfo = ArchPack.ArchUnits.Path.V1.PathInfoBuilder.Build(path);
            var request = new ServiceUnitRequest(context, pathInfo);
            Assert.Equal(context, request.Context);
            Assert.Equal("/Test/V1/general/MixedAuthentication", request.Path);
        }
    }
}
