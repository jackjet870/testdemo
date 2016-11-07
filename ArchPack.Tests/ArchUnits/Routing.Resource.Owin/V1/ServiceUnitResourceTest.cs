using ArchPack.ArchUnits.Container.Ninject.V1;
using ArchPack.ArchUnits.Container.V1;
using ArchPack.ArchUnits.Routing.Owin.V1;
using ArchPack.ArchUnits.Routing.Resource.Owin.V1;
using ArchPack.Tests.TestUnits.Helpers.V1;
using Microsoft.Owin.Testing;
using Owin;
using Xunit;

namespace ArchPack.Tests.ArchUnits.Routing.Resource.Owin.V1
{
   public class ServiceUnitResourceTest
    {

       private class Startup
       {
           public void Configuration(IAppBuilder app)
           {

               ContainerHelper.InitializeDefault();

               app.UseServiceUnit(new ServiceUnitResource()
               {
                   JavaScriptFormatter = (text, culture, resourceName) =>
                   {
                       return ";(function(){ App.culture(\"" + culture.Name +
                           "\",{ \"text\": { " + resourceName + ":" + text + "}} );})();";
                   }
               });               
           }
       }

       [Fact]
       public async void RoutingResourceOwinTest()
       {
           using (var server = TestServer.Create<Startup>())
           {
               var response = await server.CreateRequest("/Test/V1/resource/StringContents").GetAsync();

               var resource = await response.Content.ReadAsStringAsync();

               Assert.Contains(";(function()", resource);
               Assert.Contains("新規登録", resource);
           }           
       }
    }
}
