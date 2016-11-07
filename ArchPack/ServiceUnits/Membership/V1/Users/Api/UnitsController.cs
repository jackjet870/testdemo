using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

using ArchPack.ServiceUnits.Membership.V1.Data;
using ArchPack.ArchUnits.Data.Entity.V1;
using ArchPack.ArchUnits.Routing.V1;
using ArchPack.ArchUnits.Logging.V1;

namespace ArchPack.ServiceUnits.Membership.V1.Users.Api
{
    public class UnitsController : ApiController
    {
        AuthSampleEntities context;
        
        /// <summary>
        /// 部署マスターを全件検索した結果を返します
        /// </summary>
        /// <returns>部署マスター検索結果</returns>
        public HttpResponseMessage Get()
        {
            context = AuthSampleEntities.CreateContext();
            return Request.CreateResponse(HttpStatusCode.OK, context.Units.ToArray());
        }

        protected override void Dispose(bool disposing)
        {
            if (context != null)
            {
                context.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
