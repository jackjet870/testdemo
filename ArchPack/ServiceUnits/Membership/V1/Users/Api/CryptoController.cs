using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.OData;
using System.Web.OData.Extensions;
using System.Web.OData.Query;

using ArchPack.ServiceUnits.Membership.V1.Data;
using ArchPack.ArchUnits.Data.Entity.V1;
using ArchPack.Properties;
using ArchPack.ArchUnits.WebApiModels.V1;
using ArchPack.ArchUnits.Validations.V1;
using ArchPack.ArchUnits.Logging.Entities.V1;
using ArchPack.ArchUnits.Routing.V1;
using ArchPack.ArchUnits.Cryptography.V1;
using ArchPack.ArchUnits.Routing.WebApi.V1;
using ArchPack.ArchUnits.Logging.V1;

namespace ArchPack.ServiceUnits.Membership.V1.Users.Api
{
    /// <summary>
    /// 指定されたパラメーターを暗号化・複合化
    /// </summary>
    public class CryptoController : ApiController
    {        
        /// <summary>
        /// 指定されたパラメーターを暗号化します
        /// </summary>
        /// <param name="parameters"></param>
        /// <returns></returns>
        [HttpPost]
        public string[] Encrypt(string[] parameters)
        {
            List<string> result = new List<string>();
            foreach (string parameter in parameters)
            {
                result.Add(TripleDESCryptData.Encrypt(parameter));
            }

            var suContext = this.Request.GetServiceUnitContext();
            suContext.LogContext.Logger.Info(new LogData() { LogName = "trace" });


            return result.ToArray<string>();
        }

        /// <summary>
        /// 指定されたパラメーターを複合化します
        /// </summary>
        /// <param name="parameters"></param>
        /// <returns></returns>
        [HttpPost]
        public string[] Decrypt(string[] parameters)
        {
            List<string> result = new List<string>();
            foreach (string parameter in parameters)
            {
                result.Add(TripleDESCryptData.Decrypt(parameter));
            }
            return result.ToArray<string>();

        }
    }

}
