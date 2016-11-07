using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.OData;
using System.Web.OData.Extensions;
using System.Web.OData.Query;
using System.Web.Providers;
using System.Web.Security;
using ArchPack.ServiceUnits.Membership.V1.Data;
using ArchPack.ArchUnits.Data.Entity.V1;
using ArchPack.ArchUnits.WebApiExtensions.V1;
using System.IO;
using ArchPack.ArchUnits.WebApiModels.V1;
using ArchPack.ArchUnits.Validations.V1;
using ArchPack.ArchUnits.Cryptography.V1;

namespace ArchPack.ServiceUnits.Membership.V1.Users.Api
{
    public class UsersController : ApiController
    {
        AuthSampleEntities context;
        bool IsNew = false;

        /// <summary>
        /// 指定された条件でユーザー一覧ビューを検索した結果を返します
        /// </summary>
        /// <param name="options">検索条件</param>
        /// <returns>ユーザー一覧ビュー検索結果</returns>
        public PageResult<UsersView> Get(ODataQueryOptions<UsersView> options)
        {
            context = AuthSampleEntities.CreateContext();

            IQueryable results = options.ApplyTo(context.UsersView.AsQueryable());

            return new PageResult<UsersView>(results as IEnumerable<UsersView>,
                                            Request.ODataProperties().NextLink,
                                            Request.ODataProperties().TotalCount);
        }


        [HttpPost]
        public HttpResponseMessage Download(ODataQueryOptions<UsersView> options)
        {
            context = AuthSampleEntities.CreateContext();
            IEnumerable<UsersView> results = options.ApplyTo(context.UsersView.AsQueryable()).Cast<UsersView>();

            if (results.Count() > 0)
            {
                string csvtext = "";
                csvtext += "ユーザー名,メール,名,姓\n";
                foreach (var x in results)
                {
                    csvtext += x.UserName + "," + x.Email + "," + x.FirstName + "," + x.LastName;
                    csvtext += "\n";
                }
                MemoryStream stream = new MemoryStream(System.Text.Encoding.UTF8.GetBytes(csvtext));
                string fileName = string.Format("UserSearchList_{0}.csv", DateTimeOffset.Now.ToString());

                return Request.CreateFileDownloadResponse(HttpStatusCode.OK, stream, fileName);
            }
            else
            {
                return Request.CreateFileDownloadErrorResponse(HttpStatusCode.Moved, "Not Found", "");
            }
        }       
        
        /// <summary>
        /// 画面入力されたユーザーデータをユーザーテーブルとユーザーロール管理テーブルに更新します
        /// </summary>
        /// <param name="changeSet"></param>
        /// <returns></returns>
        public HttpResponseMessage Post([FromBody]ChangeSet<UsersView> request)
        {
            UsersResponse response = new UsersResponse();

            //TODO: 必要に応じて渡されたパラメータの検証を実装します

            context = AuthSampleEntities.CreateContext();

            IObjectContextAdapter adapter = context as IObjectContextAdapter;
            DbConnection connection = adapter.ObjectContext.Connection;
            connection.Open();

            var validationResult = ValidateDetail(request);
            if (!validationResult.IsValid)
            {
                return this.Request.CreateResponse(HttpStatusCode.BadRequest, validationResult.CreateWebApiErrorResponse());
            }

            using (DbTransaction transaction = connection.BeginTransaction())
            {
                SaveData(context, request, response);
                context.SaveChanges();

                transaction.Commit();             
            }

            if (this.IsNew) { 
                //TODO: パスワード変更依頼メール送信
                this.SendMail(response);
            }

            return Request.CreateResponse(HttpStatusCode.OK, response);
        }

        // TODO: Web.Config もしくは Json ファイルから取得するようにする
        private readonly string DefaultPassword = "P@ssw0rd";
      
        /// <summary>
        /// ユーザー情報を保存します。
        /// </summary>
        /// <param name="context"></param>
        /// <param name="changeSet"></param>
        /// <param name="response"></param>
        private void SaveData(AuthSampleEntities context, ChangeSet<UsersView> changeSet, UsersResponse response)
        {
            Profiles profiles = null;
            

            if (changeSet.Created.Count > 0)
            {
                this.IsNew = true;

                var created = changeSet.Created[0];

                //TODO: Users および Memberships 新規登録は Membership の機能を利用する
                MembershipUser user = System.Web.Security.Membership.CreateUser(created.UserName, DefaultPassword, created.Email);
                profiles = context.Profiles.Create();
                profiles.UserId = (Guid)user.ProviderUserKey;
                profiles.FirstName = created.FirstName;
                profiles.LastName = created.LastName;
                profiles.UnitId = created.UnitId;
                profiles.LastUpdatedDate = DateTimeOffset.Now;
                context.Profiles.Add(profiles);

                created.UserId = (Guid)user.ProviderUserKey;
                response.Users.Add(created);
            }

            if (changeSet.Updated.Count > 0)
            {
                var updated = changeSet.Updated[0];

                //TODO: Users および Memberships 更新は Membership の機能を利用する
                MembershipUser user = System.Web.Security.Membership.GetUser(updated.UserId);
                
                // TODO: パスワードの変更がある場合には有効にします。
                //user.ChangePassword(user.GetPassword(), updated.Password);
                user.Email = updated.Email;
                //user.UserName = updated.UserName;

                System.Web.Security.Membership.UpdateUser(user);

                profiles = context.Profiles.Find(updated.UserId);
                if (profiles == null)
                {
                    profiles = context.Profiles.Create();
                    context.Profiles.Add(profiles);                    
                }

                profiles.UserId = updated.UserId;
                profiles.FirstName = updated.FirstName;
                profiles.LastName = updated.LastName;
                profiles.UnitId = updated.UnitId;
                profiles.LastUpdatedDate = DateTimeOffset.Now;
                profiles.Ts = updated.ProfilesTimestamp;

                if (context.Entry<Profiles>(profiles).State != EntityState.Added) 
                {
                    context.Profiles.Attach(profiles);
                    context.Entry<Profiles>(profiles).State = EntityState.Modified;
                }

                response.Users.Add(updated);
            }
        }

        public HttpResponseMessage Delete(Guid UserId)
        {
            context = AuthSampleEntities.CreateContext();

            //delete user in membership
            MembershipUser m = System.Web.Security.Membership.GetUser(UserId);
            System.Web.Security.Membership.DeleteUser(m.UserName, false);

            IObjectContextAdapter adapter = context as IObjectContextAdapter;
            DbConnection connection = adapter.ObjectContext.Connection;
            connection.Open();

            using (DbTransaction transaction = connection.BeginTransaction())
            {
                Profiles profile = (from p in context.Profiles
                                    where p.UserId == UserId
                                    select p).FirstOrDefault();
                if (profile != null)
                {
                    context.Profiles.Remove(profile);
                    context.SaveChanges();
                }

                UsersInRoles[] userinroles = (from uir in context.UsersInRoles
                                              where uir.UserId == UserId
                                              select uir).ToArray();

                foreach (UsersInRoles userinrole in userinroles)
                {
                    context.UsersInRoles.Remove(userinrole);
                    context.SaveChanges();
                }                
                
                ServiceUnits.Membership.V1.Data.Users user = context.Users.Find(UserId);

                if (user != null)
                {
                    context.Users.Remove(user);
                    context.SaveChanges();
                }
                transaction.Commit();
            }
            
            return Request.CreateResponse(HttpStatusCode.OK,"OK");
        }
        /// <summary>
        /// 登録された電子メールアドレスにメールを送信します
        /// </summary>
        private void SendMail(UsersResponse users)
        {

        }

        private ValidationResult ValidateDetail(ChangeSet<UsersView> changeSet)
        {
            var objectId = typeof(UsersInRoles).Name;
            var rules = new ValidationRules<UsersView>();
            var result = new ValidationResult();
            //TODO: バリデーションを定義します。
            rules.Add((t) => { return t.ValidateDataAnnotations(); });
            rules.Add((t) => { return t.ValidateRequired("UserName", "UserName", false); });
            rules.Add((t) => { return t.ValidateRequired("Email", "Email", false); });
            rules.Add((t) => { return t.Email.ValidateEmailAddress("Email", "Email", false); });

            foreach (var created in changeSet.Created)
            {
                result.Chain(rules.Validate(created));
            }

            foreach (var updated in changeSet.Updated)
            {
                result.Chain(rules.Validate(updated));
            }

            return result;
        }

        //[FromBody]string oldpassword, string newpassword, Guid id
        [HttpPut]
        public HttpResponseMessage ChangePassword([FromBody]dynamic info)
        {
            MembershipUser user = System.Web.Security.Membership.GetUser((Guid)info.id);
           
            bool result = user.ChangePassword((string)info.oldpass,(string)info.newpass);
            if (result == true)
                return Request.CreateResponse(HttpStatusCode.OK, "OK");
            else
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Error when Updated!Please check your old password");
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


    public class UsersResponse
    {
        public UsersResponse()
        {
            this.Users = new List<UsersView>();
        }

        public List<UsersView> Users { get; set; }
    }
}
