using ArchPack.ArchUnits.Routing.V1;
using ArchPack.ArchUnits.Routing.WebApi.V1;
using ArchPack.Tests.TestUnits.Helpers.V1;
using System;
using Xunit;

namespace ArchPack.Tests.ArchUnits.Routing.WebApi.V1
{
    public class WebApiProcessResolverTest
    {
        private WebApiProcessResolver target;

        public WebApiProcessResolverTest()
        {
            ContainerHelper.InitializeDefault();
            target = new WebApiProcessResolver();
        }

        [Fact]
        public void GetExecutionTest()
        {
            var serviceUnitContext = new ServiceUnitContext("/Test/V1/Users/api/Units");

            var type = target.GetExecutionType(serviceUnitContext);
            Assert.NotNull(type);
            Assert.Equal("UnitsController", type.Name);
        }

        [Fact]
        public void CreateInstanceTest()
        {

            var serviceUnitContext = new ServiceUnitContext("/Test/V1/Users/api/Units");

            var type = target.GetExecutionType(serviceUnitContext);
            Assert.NotNull(type);
            var instance = target.CreateInstance(serviceUnitContext, type);
            Assert.NotNull(instance);
        }

        [Fact]
        public void GetActionTest()
        {

            var serviceUnitContext = new ServiceUnitContext("/Test/V1/Users/api/Units");

            var type = target.GetExecutionType(serviceUnitContext);
            Assert.NotNull(type);
            var instance = target.CreateInstance(serviceUnitContext, type);
            Assert.NotNull(instance);

            Assert.Throws<NotImplementedException>(() => target.GetAction(serviceUnitContext, instance));
        }


        [Fact]
        public void InvokeActionTest()
        {

            var serviceUnitContext = new ServiceUnitContext("/Test/V1/Users/api/Units");

            var type = target.GetExecutionType(serviceUnitContext);
            Assert.NotNull(type);
            var instance = target.CreateInstance(serviceUnitContext, type);
            Assert.NotNull(instance);

            Assert.Throws<NotImplementedException>(() => target.InvokeAction(serviceUnitContext, new ActionDefinition()));
        }
    }
}
