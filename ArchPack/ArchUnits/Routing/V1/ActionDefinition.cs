using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;

namespace ArchPack.ArchUnits.Routing.V1
{
    public class ActionDefinition
    {
        public MethodInfo Method { get; set; }

        public object Instance { get; set; }
    }
}