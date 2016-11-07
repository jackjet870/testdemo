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

namespace ArchPack.ServiceUnits.Membership.V1.Users.Api
{
    public class RolesController : ApiController
    {
        private AuthSampleEntities context;
        private ServiceUnitContext serviceUnitContext;

        public RolesController(ServiceUnitContext context)
        {
            this.serviceUnitContext = context;
        }

        /// <summary>
        /// 指定された条件でロールテーブルを検索した結果を返します
        /// </summary>
        /// <param name="options">検索条件</param>
        /// <returns>ロール検索結果</returns>
        public PageResult<Roles> Get(ODataQueryOptions<Roles> options)
        {
            context = AuthSampleEntities.CreateContext();

            IQueryable results = options.ApplyTo(context.Roles.AsQueryable());

            return new PageResult<Roles>(results as IEnumerable<Roles>,
                                            Request.ODataProperties().NextLink,
                                            Request.ODataProperties().TotalCount);
        }

        /// <summary>
        /// 画面入力されたロールデータをロールテーブルに更新します
        /// </summary>
        /// <param name="changeSet"></param>
        /// <returns></returns>
        public HttpResponseMessage Post([FromBody]ChangeSet<Roles> changeSet)
        {
            RolesResponse response = new RolesResponse();
            //TODO: 必要に応じて渡されたパラメータの検証を実装します
            context = AuthSampleEntities.CreateContext();

            var validationResult = ValidateDetail(changeSet);
            if (!validationResult.IsValid)
            {
                return this.Request.CreateResponse(HttpStatusCode.BadRequest, validationResult.CreateWebApiErrorResponse());
            }

            HttpResponseMessage saveStatus = SaveData(context, changeSet, response);
            if (saveStatus.StatusCode == HttpStatusCode.BadRequest)
            {
                return saveStatus;
            }

            using(var interceptor = context.EnableAuditLog(serviceUnitContext.LogContext))
            {
                context.SaveChanges();
            }
            

            return Request.CreateResponse(HttpStatusCode.OK, response);
        }

        /// <summary>
        /// ロール情報を保存します。
        /// </summary>
        /// <param name="context"></param>
        /// <param name="changeSet"></param>
        /// <param name="response"></param>
        private HttpResponseMessage SaveData(AuthSampleEntities context, ChangeSet<Roles> changeSet, RolesResponse response)
        {
            foreach (var created in changeSet.Created)
            {
                if (created.RoleName == string.Empty)
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, response);
                }
                created.ApplicationId = Settings.Default.ApplicationId;
                created.RoleId = Guid.NewGuid();
                created.LastUpdatedDate = DateTimeOffset.Now;
                context.Roles.Add(created);
                response.Roles.Add(created);
            }

            foreach (var updated in changeSet.Updated)
            {
                if (updated.RoleName == string.Empty)
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, response);
                }
                updated.LastUpdatedDate = DateTimeOffset.Now;
                context.Roles.Attach(updated);
                context.Entry<Roles>(updated).State = EntityState.Modified;

                response.Roles.Add(updated);
            }

            foreach (var deleted in changeSet.Deleted)
            {

                if (deleted.RoleId == Guid.Empty)
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, response);
                }
                context.Roles.Attach(deleted);
                context.Roles.Remove(deleted);
            }

            return Request.CreateResponse(HttpStatusCode.OK, response);
        }

        private ValidationResult ValidateDetail(ChangeSet<Roles> changeSet)
        {
            var objectId = typeof(UsersInRoles).Name;
            var rules = new ValidationRules<Roles>();
            var rulesguid = new ValidationRules<Guid>();
            var result = new ValidationResult();
            //TODO: バリデーションを定義します。
            rules.Add((t) => { return t.ValidateDataAnnotations(); });
            rules.Add((t) => { return t.ValidateRequired("RoleName", "RoleName", false); });
            rulesguid.Add((t) => { return t.ValidateRequired(false); });

            foreach (var created in changeSet.Created)
            {
                result.Chain(rules.Validate(created));
            }

            foreach (var updated in changeSet.Updated)
            {
                result.Chain(rules.Validate(updated).Chain(rulesguid.Validate(updated.RoleId)));
            }

            return result;
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

    public class RolesResponse
    {
        public RolesResponse()
        {
            this.Roles = new List<Roles>();
        }

        public List<Roles> Roles { get; set; }
    }
}
