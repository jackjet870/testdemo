namespace ArchPack.Tests.ServiceUnits.Test.V1.Data
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class AuthSampleEntities : DbContext
    {
        public AuthSampleEntities()
            : base("name=AuthSampleEntities")
        {
        }

        public virtual DbSet<Profiles> Profiles { get; set; }
        public virtual DbSet<Roles> Roles { get; set; }
        public virtual DbSet<Units> Units { get; set; }
        public virtual DbSet<UsersInRoles> UsersInRoles { get; set; }
        public virtual DbSet<RolesInUsersView> RolesInUsersView { get; set; }
        public virtual DbSet<UsersInRolesView> UsersInRolesView { get; set; }
        public virtual DbSet<UsersView> UsersView { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Profiles>()
                .Property(e => e.Ts)
                .IsFixedLength();

            modelBuilder.Entity<Roles>()
                .Property(e => e.Ts)
                .IsFixedLength();

            modelBuilder.Entity<Units>()
                .Property(e => e.Ts)
                .IsFixedLength();

            modelBuilder.Entity<UsersInRoles>()
                .Property(e => e.Ts)
                .IsFixedLength();

            modelBuilder.Entity<RolesInUsersView>()
                .Property(e => e.UsersInRolesTimestamp)
                .IsFixedLength();

            modelBuilder.Entity<UsersInRolesView>()
                .Property(e => e.UsersInRolesTimestamp)
                .IsFixedLength();

            modelBuilder.Entity<UsersView>()
                .Property(e => e.UsersTimestamp)
                .IsFixedLength();

            modelBuilder.Entity<UsersView>()
                .Property(e => e.ProfilesTimestamp)
                .IsFixedLength();

            modelBuilder.Entity<UsersView>()
                .Property(e => e.UnitsTimestamp)
                .IsFixedLength();
        }
    }
}