﻿using ArchPack.ArchUnits.Configuration.V1;
using ArchPack.ArchUnits.Logging.NLog.V1;
using ArchPack.ArchUnits.Logging.V1;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace ArchPack.ServiceUnits.Shared.V1.Anonymous.Pages
{
    public partial class _404 : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {   
            if (!string.IsNullOrEmpty(Context.Request.RawUrl))
            {
                var serviceConfig = ServiceConfigurationLoader.Load();
                var logConfig = new LogConfiguration(serviceConfig.Raw);
                var target = new NLogAdapter(logConfig);
                var logData = new LogData();
                logData.LogId = Guid.NewGuid();
                logData.LogName = "trace";
                logData.User = HttpContext.Current.User.Identity.Name;
                logData.Message = "Not Found: " + Context.Request.RawUrl;

                target.Error(logData);
            }
            
            this.refresh.Content = "5;URL=" + RedirectUrl;
        }

        public string RedirectUrl
        {
            get
            {
                object url = Context.Items["RedirectUrl"];

                if (url != null)
                {
                    return url.ToString();
                }

                return VirtualPathUtility.GetDirectory("~/");
            }
        }

    }
}