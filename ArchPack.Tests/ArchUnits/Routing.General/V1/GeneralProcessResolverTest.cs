using System;
using ArchPack.ArchUnits.Routing.General.V1;
using ArchPack.ArchUnits.Routing.V1;
using Xunit;
using ArchPack.ArchUnits.Container.V1;
using ArchPack.ArchUnits.Container.Ninject.V1;
using ArchPack.Tests.TestUnits.Helpers.V1;
using ArchPack.Tests.ServiceUnits.Test.V1.Lib;
using System.Net;

namespace ArchPack.Tests.ArchUnits.Routing.General.V1
{
    
    public class GeneralProcessResolverTest
    {
        private GeneralProcessResolver target;
        private ServiceUnitContext context;
                
        public GeneralProcessResolverTest()
        {
            ContainerHelper.InitializeDefault();
           
            context = new ServiceUnitContext("/Test/V1/general/GeneralMethods/Execute");           
            target = new GeneralProcessResolver();
        }

        [Fact]
        public void GetExecutionTypeTest()
        {
            var executionType = target.GetExecutionType(context);
            Assert.NotNull(executionType);
            Assert.Equal(typeof(GeneralMethods), executionType);
        }

        [Fact]
        public void CreateInstanceTest()
        {
            var executionType = target.GetExecutionType(context);
            var instance = target.CreateInstance(context, executionType);
            Assert.NotNull(instance);
        }

        [Fact]
        public void GetActionTest()
        {
            Type executionType = target.GetExecutionType(context);
            object instance = target.CreateInstance(context, executionType);
            ActionDefinition action = target.GetAction(context, instance);
            Assert.NotNull(action);
            Assert.Equal("Execute", action.Method.Name);           
        }

        [Fact]
        public void InvokeActionTest()
        {
            var executionType = target.GetExecutionType(context);
            
            Assert.NotNull(executionType);
            
            var instance = target.CreateInstance(context, executionType);
            
            Assert.NotNull(instance);
            
            var action = target.GetAction(context, instance);
            
            Assert.NotNull(action);
            
            var response = target.InvokeAction(context, action);

            Assert.NotNull(response);

            Assert.Equal("General Method", response.Data);
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            
        }
    }
}
