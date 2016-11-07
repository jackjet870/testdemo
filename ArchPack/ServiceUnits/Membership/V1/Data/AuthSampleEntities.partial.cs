using ArchPack.ArchUnits.Configuration.V1;
using ArchPack.ArchUnits.Data.Entity.V1;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Web;

namespace ArchPack.ServiceUnits.Membership.V1.Data
{
    public partial class AuthSampleEntities
    {
        private AuthSampleEntities(DbConnection connection)
            : base(connection, true)
        {
        }

        public static AuthSampleEntities CreateContext()
        {
            var config = ServiceConfigurationLoader.Load("Membership", "V1");
            var context = new AuthSampleEntities(ConnectionFactory.Create(config.ConnectionStrings[typeof(AuthSampleEntities).Name]));
            return context;
        }
    }
}