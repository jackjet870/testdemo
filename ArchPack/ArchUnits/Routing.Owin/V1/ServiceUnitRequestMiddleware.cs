using ArchPack.ArchUnits.Routing.V1;
using Microsoft.Owin;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AppFunc = System.Func<System.Collections.Generic.IDictionary<string, object>, System.Threading.Tasks.Task>;

namespace ArchPack.ArchUnits.Routing.Owin.V1
{

    public class ServiceUnitRequestMiddleware
    {

        private AppFunc next;
        public ServiceUnitRequestMiddleware(AppFunc next)
        {
            this.next = next;
        }

        public async Task Invoke(IDictionary<string, object> environment)
        {
            var context = new OwinContext(environment);

            var url = context.Request.Path.Value;
            if (context.Request.QueryString.HasValue)
            {
                url = url + "?" + context.Request.QueryString.Value;
            }
            var suContext = new ServiceUnitContext(url, context.Request.User);
            if (suContext != null && suContext.Request != null)
            {
                context.Request.SetServiceUnitContext(suContext);
            }

            if (this.next != null)
            {
                await this.next.Invoke(environment);
            }
        }
    }

}