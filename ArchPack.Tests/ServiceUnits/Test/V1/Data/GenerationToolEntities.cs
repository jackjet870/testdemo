namespace ArchPack.Tests.ServiceUnits.Test.V1.Data
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class GenerationToolEntities : DbContext
    {
        public GenerationToolEntities()
            : base("name=GenerationToolEntities")
        {
        }

        public virtual DbSet<ProjectItem> ProjectItems { get; set; }
        public virtual DbSet<Project> Projects { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ProjectItem>()
                .Property(e => e.ts)
                .IsFixedLength();

            modelBuilder.Entity<Project>()
                .Property(e => e.ts)
                .IsFixedLength();
        }
    }
}
