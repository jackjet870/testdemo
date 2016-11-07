using ArchPack.ArchUnits.Container.Ninject.V1;
using ArchPack.ArchUnits.Container.V1;
using ArchPack.ArchUnits.Environment.V1;
using ArchPack.ArchUnits.Routing.V1;
using ArchPack.Tests.TestUnits.Shim.V1;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace ArchPack.Tests.TestUnits.Helpers.V1
{
    public static class ContainerHelper
    {
        public static void InitializeDefault()
        {
            if (GlobalContainer.IsInitialzied())
            {
                GlobalContainer.Release();
            }
            GlobalContainer.Initialize(new NinjectContainer());
            GlobalContainer.AddInstance(typeof(IApplicationEnvironment), new TestEnvironment());
            GlobalContainer.AddInstance(typeof(ITypePath), new AutoDetectTypePath(Root.GetRootNamespace(), Assembly.GetExecutingAssembly()));
        }

        public static void InitializeWeb()
        {
            if (GlobalContainer.IsInitialzied())
            {
                GlobalContainer.Release();
            }
            GlobalContainer.Initialize(new NinjectContainer());
            GlobalContainer.AddInstance(typeof(IApplicationEnvironment), new WebApplicationEnvironment("Test"));
            GlobalContainer.AddInstance(typeof(ITypePath), new AutoDetectTypePath(Root.GetProductionRootNamepace(), typeof(GlobalContainer).Assembly));
        }
    }
}
