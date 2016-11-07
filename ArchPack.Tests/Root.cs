using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArchPack.Tests
{
    public static class Root
    {
        public static string GetRootNamespace()
        {
            return typeof(Root).Namespace;
        }

        public static string GetProductionRootNamepace()
        {
            var ns = Root.GetRootNamespace();
            if (ns.EndsWith(".Tests"))
            {
                return ns.Substring(0, ns.Length - 6);
            }
            return ns;
        }
    }
}
