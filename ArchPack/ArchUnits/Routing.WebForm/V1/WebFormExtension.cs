using ArchPack.ArchUnits.Container.V1;
using ArchPack.ArchUnits.Environment.V1;
using ArchPack.ArchUnits.Path.V1;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Hosting;
using System.Web.UI;
using NPath = System.IO.Path;

namespace ArchPack.ArchUnits.Routing.WebForm.V1
{
    public static class WebFormExtension
    {
        public static string ResolveSuitableFileUrl(this Control source, string path)
        {
            var resolvedPath = source.ResolveUrl(path);
            var resolver = GlobalContainer.GetService<ISuitablePathResolver>();
            if (resolver == null)
            {
                return resolvedPath;
            }
            return resolver.Resolve(resolvedPath);
        }
    }
}