using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ArchPack.ServiceUnits.Membership.V1.Data;
using ArchPack.ArchUnits.Data.Entity.V1;
using ArchPack.Properties;
using ArchPack.ArchUnits.WebApiModels.V1;
using ArchPack.ArchUnits.Validations.V1;

namespace ArchPack.ServiceUnits.Membership.V1.Users.Api
{
    public class UsersInRolesController : ApiController
    {
        AuthSampleEntities context;

        /// <summary>
        /// ロールIDで所属ユーザー一覧ビューを検索した結果を返します
        /// </summary>
        /// <param name="roleId"></param>
        /// <returns></returns>
        public HttpResponseMessage Get(Guid roleId)
        {
            context = AuthSampleEntities.CreateContext();
            var result = (from u in context.UsersInRolesView
                          where u.RoleId == roleId
                          orderby u.UserName ascending
                          select u);

            return Request.CreateResponse(HttpStatusCode.OK, result.ToArray());
        }

        /// <summary>
        /// 画面入力された所属ユーザーデータをユーザーロール管理テーブルに更新します
        /// </summary>
        /// <param name="changeSet"></param>
        /// <returns></returns>
        public HttpResponseMessage Post(UserInRoleRequest param)
        {

            string mode = param.mode;
            UsersInRolesResponse response = new UsersInRolesResponse();

            //TODO: 必要に応じて渡されたパラメータの検証を実装します

            context = AuthSampleEntities.CreateContext();
            IObjectContextAdapter adapter = context as IObjectContextAdapter;
            DbConnection connection = adapter.ObjectContext.Connection;
            connection.Open();

            using (DbTransaction transaction = connection.BeginTransaction())
            {
                Roles role = new Roles();
                if (mode == "new")
                {
                    role.ApplicationId = Settings.Default.ApplicationId;
                    role.RoleId = Guid.NewGuid();
                    role.RoleName = param.RoleName;
                    role.Description = param.Description;
                    role.LastUpdatedDate = DateTimeOffset.Now;
                   

                    var validationResult = ValidateHeader(role);

                    if (!validationResult.IsValid)
                    {
                        return this.Request.CreateResponse(HttpStatusCode.BadRequest, validationResult.CreateWebApiErrorResponse());
                    }
                    context.Roles.Add(role);
                    context.SaveChanges();
                }
                else
                {
                    role = context.Roles.Find(param.RoleID);
                    role.RoleName = param.RoleName;
                    role.Description = param.Description;
                    role.LastUpdatedDate = DateTimeOffset.Now;
                    
                    var validationResult = ValidateHeader(role).Chain(ValidateDetail(param.changeSet));
                    if (!validationResult.IsValid)
                    {
                        return this.Request.CreateResponse(HttpStatusCode.BadRequest, validationResult.CreateWebApiErrorResponse());
                    }
                }

                SaveData(context, response, param, role);

                context.SaveChanges();

                transaction.Commit();
            }

            return Request.CreateResponse(HttpStatusCode.OK, response);
        }

        [HttpDelete]
        public HttpResponseMessage Delete(Guid roleId)
        {
            context = AuthSampleEntities.CreateContext();

            IObjectContextAdapter adapter = context as IObjectContextAdapter;
            DbConnection connection = adapter.ObjectContext.Connection;
            connection.Open();

            //TODO: 削除するデータを取得します。
            var header = context.Roles.Where(x => x.RoleId == roleId).FirstOrDefault();
            var details = context.UsersInRoles.Where(x => x.RoleId == roleId).ToList();

            using (DbTransaction transaction = connection.BeginTransaction())
            {
                if (details != null && details.Count != 0)
                {
                    context.UsersInRoles.RemoveRange(details);
                    context.SaveChanges();
                }

                if (header != null)
                {
                    context.Roles.Remove(header);
                    context.SaveChanges();
                }

                transaction.Commit();
            }

            //削除したデータを呼び出し元に戻します。
            return Request.CreateResponse(HttpStatusCode.OK, new UsersInRolesResponse()
            {
                UsersInRoles = details
            });
        }

        /// <summary>
        /// ユーザーロール情報を保存します。
        /// </summary>
        /// <param name="context"></param>
        /// <param name="changeSet"></param>
        /// <param name="response"></param>
        private void SaveData(AuthSampleEntities context, UsersInRolesResponse response, UserInRoleRequest param, Roles role)
        {
            ChangeSet<UsersInRoles> changeSet = param.changeSet;
            foreach (var created in changeSet.Created)
            {
                if (param.mode == "new")
                {
                    created.RoleId = role.RoleId;
                }
                created.LastUpdatedDate = DateTimeOffset.Now;
                context.UsersInRoles.Add(created);
                response.UsersInRoles.Add(created);
            }

            foreach (var updated in changeSet.Updated)
            {
                if (param.mode == "new")
                {
                    updated.RoleId = role.RoleId;
                }
                updated.LastUpdatedDate = DateTimeOffset.Now;
                context.UsersInRoles.Attach(updated);
                context.Entry<UsersInRoles>(updated).State = EntityState.Modified;
                var a = context.Entry<UsersInRoles>(updated);
                response.UsersInRoles.Add(updated);
            }

            foreach (var deleted in changeSet.Deleted)
            {
                var result = (from uir in context.UsersInRoles
                              where uir.UserId == deleted.UserId && uir.RoleId == deleted.RoleId
                              select uir).FirstOrDefault();
                if (result != null)
                    context.UsersInRoles.Remove(result);
            }

            if (param.mode == "new")
            {
                response.RoleID = role.RoleId;
            }
        }

        /// <summary>
        /// ヘッダーのバリデーションを行います。
        /// </summary>
        private ValidationResult ValidateHeader(Roles role)
        {
            var objectId = typeof(Roles).Name;

            var rulesguid = new ValidationRules<Guid>();
            var rules = new ValidationRules<Roles>();

            //TODO: バリデーションを定義します。
            rules.Add((t) => { return t.ValidateDataAnnotations(); });
            rules.Add((t) => { return t.ValidateRequired("RoleName", "RoleName", false); });
            rulesguid.Add((t) => { return t.ValidateRequired(false); });

            return rules.Validate(role).Chain(rulesguid.Validate(role.ApplicationId));
        }

        /// <summary>
        /// 明細のバリデーションを行います。
        /// </summary>
        private ValidationResult ValidateDetail(ChangeSet<UsersInRoles> changeSet)
        {
            var objectId = typeof(UsersInRoles).Name;
            var rules = new ValidationRules<UsersInRoles>();
            var rulesguid = new ValidationRules<Guid>();
            var result = new ValidationResult();
            //TODO: バリデーションを定義します。
            rules.Add((t) => { return t.ValidateDataAnnotations(); });
            rulesguid.Add((t) => { return t.ValidateRequired(false); });

            foreach (var created in changeSet.Created)
            {
                result.Chain(rules.Validate(created).Chain(rulesguid.Validate(created.RoleId)));
            }

            foreach(var updated in changeSet.Updated)
            {
                result.Chain(rules.Validate(updated).Chain(rulesguid.Validate(updated.RoleId)));
            }

            return result;
        }


        //Dispose で context を解放するように変更
        protected override void Dispose(bool disposing)
        {
            if (context != null)
            {
                context.Dispose();
            }
            base.Dispose(disposing);
        }
    }

    public class UsersInRolesResponse
    {
        public UsersInRolesResponse()
        {
            this.UsersInRoles = new List<UsersInRoles>();
        }

        public List<UsersInRoles> UsersInRoles { get; set; }
        public Guid RoleID { get; set; }
    }

    public class UserInRoleRequest
    {
        public ChangeSet<UsersInRoles> changeSet { get; set; }
        public string mode { get; set; }
        public Guid RoleID { get; set; }
        public string RoleName { get; set; }
        public string Description { get; set; }
    }
}
