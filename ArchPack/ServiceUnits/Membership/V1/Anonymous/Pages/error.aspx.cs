using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace ArchPack.ServiceUnits.Membership.V1.Anonymous.Pages
{
    public partial class error : System.Web.UI.Page
    {
        public string Message = "";
        public string StackTrace = "";
        protected void Page_Load(object sender, EventArgs e)
        {
            if (this.Page.IsPostBack)
            {
                Message = Request.QueryString["Message"];
                StackTrace = Request.QueryString["StackTrace"];
            }
        }
    }
}