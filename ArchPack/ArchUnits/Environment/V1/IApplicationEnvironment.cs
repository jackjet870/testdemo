using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArchPack.ArchUnits.Environment.V1
{
    public interface IApplicationEnvironment
    {
        string EnvironmentName { get; }

        string RootDir { get; }

        string MapPath(string virtualPath);

        string ApplicationRoot { get; }
    }
}