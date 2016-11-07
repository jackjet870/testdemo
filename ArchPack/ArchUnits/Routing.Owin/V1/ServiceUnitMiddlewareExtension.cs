using Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Dispatcher;
using System.Web.Http.ExceptionHandling;
using System.Web.Http.Owin;

namespace ArchPack.ArchUnits.Routing.Owin.V1
{
    public static class ServiceUnitMiddlewareExtension
    {
        public static IAppBuilder UseServiceUnit(this IAppBuilder builder, params IMiddlewareRegisterSetting[] middlewares)
        {
            //service unit request context の生成と保持
            builder = builder.Use<ServiceUnitRequestMiddleware>();

            foreach (var middleware in middlewares)
            {
                middleware.Use(builder);
            }

            return builder;
        }
    }
}