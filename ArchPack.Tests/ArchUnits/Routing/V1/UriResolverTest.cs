using ArchPack.ArchUnits.Routing.V1;
using System.Web.Http.Controllers;
using System.Net.Http;
using System.Security.Principal;
using System.Web.OData.Query;
using Xunit;
using ArchPack.Tests.TestUnits.Helpers.V1;
using ArchPack.Tests.ServiceUnits.Test.V1.Data;

namespace ArchPack.Tests.ArchUnits.Routing.V1
{
    
    public class UriResolverTest
    {
        public UriResolverTest()
        {
            ContainerHelper.InitializeDefault();
        }
    }
}
