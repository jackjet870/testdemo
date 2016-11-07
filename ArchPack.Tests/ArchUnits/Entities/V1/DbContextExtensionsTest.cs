using ArchPack.ArchUnits.Data.Entity.V1;
using ArchPack.Tests.TestUnits.Helpers.V1;
using Xunit;
using ArchPack.Tests.ServiceUnits.Test.V1.Data;

namespace ArchPack.Tests.ArchUnits.Entities.V1
{
    public class DbContextExtensionsTest
    {        
        [Fact]
        public void ReadOnlyContextText()
        {
            ContainerHelper.InitializeDefault();
            using (AuthSampleEntities context = AuthSampleEntities.CreateContext().ToReadOnly())
            {
                Assert.False(context.Configuration.ProxyCreationEnabled);
                Assert.False(context.Configuration.AutoDetectChangesEnabled);
            }
        }
    }
}
