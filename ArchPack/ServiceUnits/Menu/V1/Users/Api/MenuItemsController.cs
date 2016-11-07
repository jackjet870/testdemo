using ArchPack.ArchUnits.Configuration.V1;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ArchPack.ServiceUnits.Menu.V1.Users.Api
{
    public class MenuItemsController : ApiController
    {
        public HttpResponseMessage Get()
        {
            string[] roles = System.Web.Security.Roles.GetRolesForUser(this.RequestContext.Principal.Identity.Name);
            var tree = ServiceConfigurationLoader.LoadTreeJson(roles);
            return Request.CreateResponse(HttpStatusCode.OK, tree);
        }

    }
}
