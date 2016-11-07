using ArchPack.ArchUnits.Environment.V1;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArchPack.Tests.TestUnits.Shim.V1
{
    class TestEnvironment: IApplicationEnvironment
    {
        public TestEnvironment()
        {
            this.RootDir = Directory.GetCurrentDirectory();
        }

        public string EnvironmentName
        {
            get { return "Test"; }
        }

        public string RootDir { get; set; }

        public string MapPath(string virtualPath)
        {
            var value = virtualPath;
            if (value.StartsWith("~"))
            {
                value = value.Substring(1);
            }
            value = value.Replace('/', Path.DirectorySeparatorChar);
            if (value.StartsWith(Path.DirectorySeparatorChar.ToString()))
            {
                value = value.Substring(1);
            }
            return Path.Combine(this.RootDir, value);
        }

        public string ApplicationRoot
        {
            get { return "/"; }
        }
    }
}
