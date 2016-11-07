using ArchPack.ArchUnits.Routing.Owin.V1;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArchPack.ArchUnits.Routing.WebForm.Owin.V1
{
    public sealed class ServiceUnitForm : IMiddlewareRegisterSetting
    {
        void IMiddlewareRegisterSetting.Use(global::Owin.IAppBuilder bulder)
        {
            bulder.Use(typeof(ServiceUnitFormMiddleware));
        }
    }
}