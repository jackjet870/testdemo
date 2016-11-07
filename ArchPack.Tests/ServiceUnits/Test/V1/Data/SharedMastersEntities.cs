namespace ArchPack.Test.ServiceUnits.Test.V1.Data
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class SharedMastersEntities : DbContext
    {
        public SharedMastersEntities()
            : base("name=SharedMastersEntities")
        {
        }

        public virtual DbSet<Employees> Employees { get; set; }
        public virtual DbSet<Accounts> Accounts { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
 
            modelBuilder.Entity<Employees>()
                .Property(e => e.Ts)
                .IsFixedLength();

            modelBuilder.Entity<Accounts>()
                .Property(e => e.Ts)
                .IsFixedLength();
        }
    }
}
