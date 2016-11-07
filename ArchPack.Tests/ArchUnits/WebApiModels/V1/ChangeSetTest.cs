using Xunit;
using ArchPack.ArchUnits.WebApiModels.V1;
using System.Data.Entity;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;
using System.Linq;
using ArchPack.Tests.TestUnits.Helpers.V1;
using ArchPack.Tests.ServiceUnits.Test.V1.Data;
using System;

namespace ArchPack.Tests.ArchUnits.WebApiModels.V1
{

    public class ChangeSetTest
    {
        private ChangeSet<Users> target;

        public ChangeSetTest()
        {
            ContainerHelper.InitializeDefault();
            target = new ChangeSet<Users>();
        }
        [Fact]
        public void ConstructorTest()
        {
            Assert.Equal(0, target.Created.Count);
            Assert.Equal(0, target.Updated.Count);
            Assert.Equal(0, target.Deleted.Count);
        }

        [Fact]
        public void GetItemsTest()
        {
            Users created = new Users() { UserName = "created" };
            Users updated = new Users() { UserName = "updated" };
            Users deleted = new Users() { UserName = "deleted" };
            target.Created.Add(created);
            target.Updated.Add(updated);
            target.Deleted.Add(deleted);
            List<Users> items = target.GetValues().ToList();
            Assert.Equal("created", items[0].UserName);
            Assert.Equal("updated", items[1].UserName);
            Assert.Equal("deleted", items[2].UserName);
        }

        [Fact]
        public void AttachToWithCreateTest()
        {
            var context = TestEntities.CreateContext();
            var id = Guid.NewGuid();
            Users created = new Users() { UserName = "test created", UserId = id };
            target.Created.Add(created);

            List<Users> result = target.AttachTo(context, (item, state) => {
                Assert.Equal(EntityState.Added, state);
            }).ToList();

            Assert.Equal(1, result.Count);
            Assert.Equal("test created", result[0].UserName);
            Assert.Equal(id, result[0].UserId);
            Assert.Equal(EntityState.Added, context.Entry(created).State);
        }
        [Fact]
        public void AttachToWithUpdateTest()
        {
            var context = TestEntities.CreateContext();
            var id = Guid.NewGuid();
            Users updated = new Users() { UserName = "test created", UserId = id };
            target.Updated.Add(updated);
            List<Users> result = target.AttachTo(context, (item, state) =>
            {
                Assert.Equal(EntityState.Modified, state);
            }).ToList();
            Assert.Equal(1, result.Count);
            Assert.Equal("test created", result[0].UserName);
            Assert.Equal(id, result[0].UserId);
            Assert.Equal(EntityState.Modified, context.Entry(updated).State);
        }
        [Fact]
        public void AttachToWithDeleteTest()
        {
            var context = TestEntities.CreateContext();
            var id = Guid.NewGuid();
            Users deleted = new Users() { UserName = "test created", UserId = id };
            target.Deleted.Add(deleted);
            List<Users> result = target.AttachTo(context, (item, state) =>
            {
                Assert.Equal(EntityState.Deleted, state);
            }).ToList();
            Assert.Equal(0, result.Count);
            //Assert.Equal("test created", result[0].UserName);
            //Assert.Equal(id, result[0].UserId);
        }
    }
}
