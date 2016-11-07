using ArchPack.ArchUnits.Routing.Owin.V1;
using ArchPack.ArchUnits.Routing.WebApi.Owin.V1;
using Microsoft.Owin.Testing;
using Owin;
using Xunit;
using ArchPack.ArchUnits.Routing.V1;
using Microsoft.Owin;
using ArchPack.Tests.TestUnits.Helpers.V1;

namespace ArchPack.Tests.ArchUnits.Routing.WebApi.Owin.V1
{
    public class ServiceUnitWebApiTest
    {

        public ServiceUnitWebApiTest()
        {

            ContainerHelper.InitializeDefault();
        }

        private class Startup
        {
            public void Configuration(IAppBuilder app)
            {
              

                app.UseServiceUnit(new ServiceUnitApi());

                var owinContext = new OwinContext(app.Properties);

                var suContext = new ServiceUnitContext("/Test/V1/Users/api/Units");

                owinContext.Request.SetServiceUnitContext(suContext);

                Assert.Equal(suContext, owinContext.Request.GetServiceUnitContext());
                               
                app.Run(async context =>
                {
                    context.Request.SetServiceUnitContext(suContext);

                    Assert.Equal(suContext, context.Request.GetServiceUnitContext());

                    await context.Response.WriteAsync("Owin testing");
                });
            }
        }

        [Fact]
        public async void WebApiOwinTest()
        {
            using (var server = TestServer.Create<Startup>())
            {                
                var request = server.CreateRequest("/");                              

                var response = await request.GetAsync();

                Assert.Equal("Owin testing", await response.Content.ReadAsStringAsync());
            }
        }
    }   
}
