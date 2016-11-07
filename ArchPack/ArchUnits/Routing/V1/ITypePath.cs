using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArchPack.ArchUnits.Routing.V1
{
    public interface ITypePath
    {
        Type GetType(string path);

        string GetPath(Type type);

        IEnumerable<TypePathItem> Items { get; }

    }
}