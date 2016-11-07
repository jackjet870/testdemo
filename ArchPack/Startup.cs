using Microsoft.Owin;
using Owin;
using System;
using System.Web;
using System.Linq;
using ArchPack.ArchUnits.Routing.V1;
using ArchPack.ArchUnits.Routing.Owin.V1;
using ArchPack.ArchUnits.Routing.WebApi.Owin.V1;
using ArchPack.ArchUnits.Routing.WebForm.Owin.V1;
using ArchPack.ArchUnits.Authentications.V1;
using ArchPack.ArchUnits.Routing.Resource.Owin.V1;
using ArchPack.ArchUnits.Routing.SignalR.Owin.V1;
using ArchPack.ArchUnits.Container.V1;
using ArchPack.ArchUnits.Container.Ninject.V1;

using AppFunc = System.Func<System.Collections.Generic.IDictionary<string, object>, System.Threading.Tasks.Task>;
using ArchPack.ArchUnits.Configuration.V1;
using System.Reflection;
using System.Data.Entity;
using ArchPack.ArchUnits.Environment.V1;
using Microsoft.Owin.Cors;
using System.Data.Entity.Infrastructure.Interception;
using ArchPack.ArchUnits.Arcs.Data.V1;
using ArchPack.ArchUnits.Path.V1;

[assembly: OwinStartup(typeof(ArchPack.Startup))]
namespace ArchPack
{
    public class Startup
    {
        private const string AuthenticationSection = "system.web/authentication";
        private bool IsWindowsAuthentication()
        {
            var webConfig = System.Web.Configuration.WebConfigurationManager.OpenWebConfiguration("~/web.con‌​fig");
            var authSection = webConfig.GetSection(AuthenticationSection) as System.Web.Configuration.AuthenticationSection;

            if (authSection == null)
            {
                return false;
            }

            return (authSection.Mode == System.Web.Configuration.AuthenticationMode.Windows);
        }

        public void Configuration(IAppBuilder app)
        {
            InitialzieContainer();
            InitializeEFConfiguration();
            var env = GlobalContainer.GetService<IApplicationEnvironment>();
            if (env.IsProduction())
            {
                GlobalContainer.AddSingleton(typeof(ISuitablePathResolver), typeof(MinimizedPathResolver));
            }

            if (!IsWindowsAuthentication())
            {
                Authentication.ConfigureAuth(app);
            }

            UseRedirectWhenDirectAccess(app);

            app.UseCors(CorsOptions.AllowAll);

            app.UseServiceUnit(
                new ServiceUnitApi(),
                new ServiceUnitForm(),
                new ServiceUnitResource()
                {
                    JavaScriptFormatter = (text, culture, resourceName) =>
                    {
                        return ";(function(){ App.culture(\"" + culture.Name +
                            "\",{ \"text\": { " + resourceName + ":" + text + "}} );})();";
                    }
                });

            UseDefaultPage(app);
        }

        /// <summary>
        /// Container を初期化
        /// </summary>
        private void InitialzieContainer()
        {
            GlobalContainer.Initialize(new NinjectContainer());
            GlobalContainer.AddInstance(typeof(IApplicationEnvironment),
                new WebApplicationEnvironment()); //TODO Retrieve environment from file or else.
            GlobalContainer.AddInstance(typeof(ITypePath),
                new AutoDetectTypePath(typeof(Startup).Namespace, Assembly.GetExecutingAssembly()));
        }

        /// <summary>
        /// EntityFramework の コードファースト機能でデータベースが自動生成されないようにNullInitializerを全DbContextに設定
        /// </summary>
        private void InitializeEFConfiguration()
        {
            var assembly = Assembly.GetExecutingAssembly();
            var assemblyName = assembly.GetName().Name;

            foreach (var dbContextType in assembly.GetTypes()
                .Where(t => t.IsSubclassOf(typeof(DbContext))))
            {
                var nullDbInit = Activator.CreateInstance(typeof(NullDatabaseInitializer<>).MakeGenericType(dbContextType));
                var info = typeof(Database).GetMethod("SetInitializer").MakeGenericMethod(dbContextType);
                info.Invoke(null, new[] { nullDbInit });
            }

            DbInterception.Add(new BindByNameInterceptor());
        }
        /// <summary>
        /// ルートにアクセスされた際にデフォルトページにリダイレクトする設定
        /// </summary>
        /// <param name="app"><see cref="IAppBuilder"/></param>
        private void UseDefaultPage(IAppBuilder app)
        {
            var defaultPage = "~/";
            var configuration = ServiceConfigurationLoader.Load();
            if (configuration.Raw.ContainsKey("defaultPage"))
            {
                defaultPage = VirtualPathUtility.ToAbsolute(configuration.Raw["defaultPage"].ToString());
            }

            app.Use(new Func<AppFunc, AppFunc>(next => (async env =>
            {
                var owinContext = new OwinContext(env);

                if (owinContext.Request.Path.Value == "/")
                {
                    owinContext.Response.Redirect(defaultPage);
                    return;
                }
                await next.Invoke(env);
            })));
        }

        /// <summary>
        /// aspxへの直接アクセス時にリダイレクトを行います。
        /// </summary>
        /// <param name="app"></param>
        private void UseRedirectWhenDirectAccess(IAppBuilder app)
        {
            app.Use(new Func<AppFunc, AppFunc>(next => (async ev =>
            {
                var owinContext = new OwinContext(ev);
                if (owinContext.Request.Path.HasValue)
                {
                    var result = PathMapper.Convert(owinContext.Request.Path.Value,
                        "/ServiceUnits/{ServiceUnit}/{Version}/{Role}/Pages/{PageName}.aspx",
                        "~/{ServiceUnit}/{Version}/{Role}/page/{PageName}");
                    if (result.Success)
                    {
                        var redirectPath = result.MappedPath;
                        if (owinContext.Request.QueryString.HasValue)
                        {
                            redirectPath += owinContext.Request.QueryString.Value;
                        }
                        owinContext.Response.Redirect(VirtualPathUtility.ToAbsolute(redirectPath));
                        return;
                    }
                }

                await next.Invoke(ev);
            })));
        }
    }
}