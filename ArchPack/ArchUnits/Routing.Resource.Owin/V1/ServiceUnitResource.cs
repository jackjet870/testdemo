using ArchPack.ArchUnits.Routing.Owin.V1;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;

namespace ArchPack.ArchUnits.Routing.Resource.Owin.V1
{
    public sealed class ServiceUnitResource : IMiddlewareRegisterSetting
    {
        void IMiddlewareRegisterSetting.Use(global::Owin.IAppBuilder bulder)
        {
            bulder.Use(typeof(ServiceUnitResourceMiddleware), this.JavaScriptFormatter);
        }

        public Func<string, CultureInfo, string, string> JavaScriptFormatter { get; set; }
    }
}