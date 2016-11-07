using ArchPack.ArchUnits.Routing.V1;
using ArchPack.ArchUnits.Routing.WebForm.V1;
using ArchPack.Tests.TestUnits.Helpers.V1;
using Xunit;

namespace ArchPack.Tests.ArchUnits.Routing.WebForm.V1
{
   public class WebFormProcessResolverTest
    {

       private WebFormProcessResolver target;

       public WebFormProcessResolverTest()
       {
           ContainerHelper.InitializeDefault();
           target = new WebFormProcessResolver();
       }

       //[Fact] Because do not use BuildManager for ASP.NET WebForm.
       public void GetExecutionTest()
       {
           var serviceUnitContext = new ServiceUnitContext("Test/V1/Users/page/ProjectSearch");
         
           var type = target.GetExecutionType(serviceUnitContext);
           Assert.NotNull(type);
       }
    }
}
