using ArchPack.ArchUnits.Configuration.V1;
using ArchPack.ArchUnits.Data.Entity.V1;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArchPack.Tests.ServiceUnits.Test.V1.Data
{
    public partial class TestEntities : DbContext
    {
        public TestEntities(DbConnection connection)
            : base(connection, true)
        {
        }

        public static TestEntities CreateContext()
        {
            var config = ServiceConfigurationLoader.Load("Test", "V1");
            var context = new TestEntities(ConnectionFactory.Create(config.ConnectionStrings[typeof(TestEntities).Name]));
            return context;
        }

        public virtual DbSet<Users> Users { get; set; }
        
    }
}
