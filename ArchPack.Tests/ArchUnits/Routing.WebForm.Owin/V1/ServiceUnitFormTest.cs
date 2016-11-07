using ArchPack.ArchUnits.Routing.Owin.V1;
using ArchPack.ArchUnits.Routing.V1;
using ArchPack.ArchUnits.Routing.WebForm.Owin.V1;
using ArchPack.Tests.TestUnits.Helpers.V1;
using Microsoft.Owin.Testing;
using Owin;
using Xunit;

namespace ArchPack.Tests.ArchUnits.Routing.WebForm.Owin.V1
{
   public class ServiceUnitFormTest
    {

       private class Startup
       {
           public void Configuration(IAppBuilder app)
           {

               ContainerHelper.InitializeDefault();

               app.UseServiceUnit(new ServiceUnitForm());
              
               app.Run(async context =>
               {
                   var suContext = new ServiceUnitContext("/Test/V1/Users/page/UserSearchList");

                   context.Request.SetServiceUnitContext(suContext);

                   Assert.Equal(suContext, context.Request.GetServiceUnitContext());
           
                   await context.Response.WriteAsync("Owin testing");
               });
           }
       }

       [Fact]
       public async void WebFormOwinTest()
       {
           using (var server = TestServer.Create<Startup>())
           {
               var response = await server.CreateRequest("/").GetAsync();

               Assert.Equal("Owin testing", await response.Content.ReadAsStringAsync());
           }
       }      
    }

  
}
