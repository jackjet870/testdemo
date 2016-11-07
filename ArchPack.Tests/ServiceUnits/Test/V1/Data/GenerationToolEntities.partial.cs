using ArchPack.ArchUnits.Configuration.V1;
using ArchPack.ArchUnits.Data.Entity.V1;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Http.Controllers;

namespace ArchPack.Tests.ServiceUnits.Test.V1.Data
{
    public partial class GenerationToolEntities : DbContext
    {
        private GenerationToolEntities(DbConnection connection)
            : base(connection, true)
        {
        }

        public static GenerationToolEntities CreateContext()
        {
            var config = ServiceConfigurationLoader.Load();
            var context = new GenerationToolEntities(ConnectionFactory.Create(config.ConnectionStrings["GenerationToolEntities"]));
            return context;
        }
    }
}