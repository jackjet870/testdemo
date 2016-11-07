using System;
using Xunit;
using ArchPack.ArchUnits.WebApiModels.V1;
using System.Data.Entity;
using ArchPack.Test.ServiceUnits.Test.V1.Data;
using ArchPack.Tests.ServiceUnits.Test.V1.Data;

namespace ArchPack.Tests.ArchUnits.WebApiModels.V1
{

    public class ChangeSetItemTest
    {
        private ChangeSetItem<Users> target;

        [Fact]
        public void ContructorTest()
        {
            Users acc = new Users();
            target = new ChangeSetItem<Users>(acc, EntityState.Unchanged);

            Assert.NotNull(target.Value);
            Assert.Equal(EntityState.Unchanged, target.State);
        }

        [Fact]
        public void ContructorNullValueTest()
        {
            Users acc = null;
            Assert.Throws<ArgumentNullException>(() => new ChangeSetItem<Users>(acc, EntityState.Unchanged));
        }
        [Fact]
        public void UpdateStateTest()
        {
            Users acc = new Users();
            target = new ChangeSetItem<Users>(acc, EntityState.Unchanged);
            target.UpdateState(EntityState.Added);
            Assert.Equal(EntityState.Added, target.State);
        }
    }
}
