using System;
using ArchPack.ArchUnits.WebApiModels.V1;
using System.Data.Entity;
using Newtonsoft.Json.Linq;
using System.Linq;
using ArchPack.Test.ServiceUnits.Test.V1.Data;
using Xunit;
using ArchPack.Tests.TestUnits.Helpers.V1;
using ArchPack.Tests.ServiceUnits.Test.V1.Data;

namespace ArchPack.Tests.ArchUnits.WebApiModels.V1
{

    public class ChangeSetExtensionsTest
    {
        private ChangeSet<Users> target;


        public ChangeSetExtensionsTest()
        {
            ContainerHelper.InitializeDefault();
            target = new ChangeSet<Users>();
            TestEntities.CreateContext().Database.ExecuteSqlCommand("Truncate table users");
        }

        [Fact]
        public void AttachToWithCreatedTest()
        {
            var context = TestEntities.CreateContext();
            Users created = new Users() { UserName = "test created", UserId = Guid.NewGuid() };
            target.Created.Add(created);
            target.Items.AttachTo<Users>(context);
            Assert.Equal(EntityState.Added, context.Entry(created).State);
        }

        [Fact]
        public void AttachToWithUpdatdedTest()
        {
            var context = TestEntities.CreateContext();
            Users updated = new Users() { UserName = "test created", UserId = Guid.NewGuid() };
            target.Updated.Add(updated);
            target.Items.AttachTo<Users>(context);
            Assert.Equal(EntityState.Modified, context.Entry(updated).State);
        }
        [Fact]
        public void AttachToWithDeletedTest()
        {
            var context = TestEntities.CreateContext();
            Users deleted = new Users() { UserName = "test created", UserId = Guid.NewGuid() };
            target.Deleted.Add(deleted);
            target.Items.AttachTo<Users>(context);
            Assert.Equal(EntityState.Deleted, context.Entry(deleted).State);
        }

        [Fact]
        public void PrepareCreatedTest()
        {
            Users created = new Users() { UserName = "test created", UserId = Guid.NewGuid() };
            target.Created.Add(created);
            target.Prepare((item) => {
                Assert.Equal(EntityState.Added, item.State);
                Assert.Equal(created, item.Value);
                return item;
            });
        }

        [Fact]
        public void PrepareUpdatdedTest()
        {
            Users updated = new Users() { UserName = "test created", UserId = Guid.NewGuid() };
            target.Updated.Add(updated);
            target.Prepare((item) =>
            {
                Assert.Equal(EntityState.Modified, item.State);
                Assert.Equal(updated, item.Value);
                return item;
            });
        }
        [Fact]
        public void PrepareDeletedTest()
        {
            Users deleted = new Users() { UserName = "test created", UserId = Guid.NewGuid() };
            target.Deleted.Add(deleted);
            target.Prepare((item) =>
            {
                Assert.Equal(EntityState.Deleted, item.State);
                Assert.Equal(deleted, item.Value);
                return item;
            });
        }
        [Fact]
        public void PrepareChangeSetStateTest()
        {
            Users created = new Users() { UserName = "test created", UserId = Guid.NewGuid() };
            target.Created.Add(created);
            Assert.Throws<InvalidOperationException>(() => target.Prepare((item) => {
                return new ChangeSetItem<Users>(item.Value, EntityState.Modified);
            }));
        }
        [Fact]
        public void PrepareChangeSetNullTest()
        {
            Users created = new Users() { UserName = "test created", UserId = Guid.NewGuid() };
            target.Created.Add(created);
            target.Prepare((item) =>
            {
                return null;
            });
            Assert.Equal(0, target.Created.Count);
        }
    }
}
