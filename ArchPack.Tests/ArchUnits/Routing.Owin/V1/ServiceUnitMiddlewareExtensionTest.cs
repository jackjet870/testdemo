using Microsoft.Owin.Testing;
using Owin;
using Xunit;
using ArchPack.ArchUnits.Routing.Owin.V1;
using ArchPack.ArchUnits.Routing.WebApi.Owin.V1;
using ArchPack.ArchUnits.Container.V1;
using ArchPack.ArchUnits.Container.Ninject.V1;
using ArchPack.ArchUnits.Routing.V1;
using ArchPack.Tests.TestUnits.Helpers.V1;

namespace ArchPack.Tests.ArchUnits.Routing.Owin.V1
{
    public class ServiceUnitMiddlewareExtensionTest
    {
        public ServiceUnitMiddlewareExtensionTest()
        {

            ContainerHelper.InitializeDefault();
        }

        private class Startup
        {
            public void Configuration(IAppBuilder app)
            {                

                app.UseServiceUnit(new ServiceUnitApi());
              
                app.Run(async context =>
                {
                    var suContext = new ServiceUnitContext("/Membership/V1/Users/api/Units");
                    
                    context.Request.SetServiceUnitContext(suContext);

                    Assert.Equal(suContext, context.Request.GetServiceUnitContext());

                    await context.Response.WriteAsync("Owin testing");
                });
            }
        }

       
        [Fact]
        public async void StartupWithServiceUnitMiddlewareExtensionTest()
        {
            using (var server = TestServer.Create<Startup>())
            {
                var response = await server.CreateRequest("/").GetAsync();

                Assert.Equal("Owin testing", await response.Content.ReadAsStringAsync());

            }
        }
    }
}