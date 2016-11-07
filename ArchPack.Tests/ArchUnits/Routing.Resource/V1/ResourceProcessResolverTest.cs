using ArchPack.ArchUnits.Container.Ninject.V1;
using ArchPack.ArchUnits.Container.V1;
using ArchPack.ArchUnits.Routing.Resource.V1;
using ArchPack.ArchUnits.Routing.V1;
using ArchPack.Tests.TestUnits.Helpers.V1;
using System;
using System.Net;
using Xunit;

namespace ArchPack.Tests.ArchUnits.Routing.Resource.V1
{
   public class ResourceProcessResolverTest
    {
       private ResourceProcessResolver target;

       public ResourceProcessResolverTest()
       {
           ContainerHelper.InitializeDefault();
           target = new ResourceProcessResolver();
       }

       [Fact]
       public void GetExecutionTypeTest()
       {
           var serviceUnitContext = new ServiceUnitContext("/Test/V1/Resources/StringContents");

           var type = target.GetExecutionType(serviceUnitContext);

           Assert.Equal("ResourceHolder", type.Name);
       }

       [Fact]
       public void CreateInstanceTest()
       {
           var serviceUnitContext = new ServiceUnitContext("/Test/V1/Resources/StringContents");

           var type = target.GetExecutionType(serviceUnitContext);

           Assert.NotNull(type);

           var instance = target.CreateInstance(serviceUnitContext, type);
           
           Assert.NotNull(instance);
       }

       [Fact]
       public void GetActionTest()
       {
           var serviceUnitContext = new ServiceUnitContext("/Test/V1/Resources/StringContents");

           var type = target.GetExecutionType(serviceUnitContext);

           Assert.NotNull(type);

           var instance = target.CreateInstance(serviceUnitContext, type);

           Assert.NotNull(instance);

           var action = target.GetAction(serviceUnitContext, instance);

           Assert.Equal(instance, action.Instance);
       }

       [Fact]
       public void InvokeAction()
       {
           var serviceUnitContext = new ServiceUnitContext("/Test/V1/Resources/StringContents");

           var type = target.GetExecutionType(serviceUnitContext);

           Assert.NotNull(type);

           var instance = target.CreateInstance(serviceUnitContext, type);

           Assert.NotNull(instance);

           var action = target.GetAction(serviceUnitContext, instance);

           Assert.NotNull(action);

           var invokeAction = target.InvokeAction(serviceUnitContext, action);
           
           Assert.Equal(HttpStatusCode.OK, invokeAction.StatusCode);

           var dataProperties = invokeAction.Data.GetType()
               .GetProperty("Resources").GetValue(invokeAction.Data, null);

           var resources = dataProperties as System.Collections.IEnumerable;
           
           Assert.NotEmpty(resources);         
       }


       [Fact]
       public void CreateResourcesProcessResolverTest()
       {
           var serviceUnitContext = new ServiceUnitContext("/Test/V1/Resources/StringContents");

           var resolver = new UriResolver();
           var response = resolver.Execute(serviceUnitContext, new ResourceProcessResolver());
           
           Assert.Equal(HttpStatusCode.OK, response.StatusCode);           
       }

      
       [Fact]
       public void CreateResourcesProcessResolverWithPathNullTest()
       {         
           var serviceUnitContext = new ServiceUnitContext("/Test/V1/Resources/foo");

           var resolver = new UriResolver();          

           Assert.Throws<NullReferenceException>(() => resolver.Execute(serviceUnitContext, new ResourceProcessResolver()));
       }
    }
}
