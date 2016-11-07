using Xunit;
using ArchPack.ArchUnits.WebApiModels.V1;
using ArchPack.Test.ServiceUnits.Test.V1.Data;

namespace ArchPack.Tests.ArchUnits.WebApiModels.V1
{
    public class HeaderDetailChangeRequestTest
    {
        [Fact]
        public void ConstractorTest()
        {
            HeaderDetailChangeRequest<Employees, Accounts> target = new HeaderDetailChangeRequest<Employees, Accounts>();
            target.Header = new ChangeSet<Employees>();
            target.Header.Created.Add(new Employees() { EmployeeId = 1, FirstName = "Test Contacts" });
            target.Detail = new ChangeSet<Accounts>();
            target.Detail.Created.Add(new Accounts() { AccountId = 1, AccountName = "Add" });
            Assert.NotNull(target.Header);
            Assert.Equal(1, target.Header.Created[0].EmployeeId);
            Assert.Equal("Test Contacts", target.Header.Created[0].FirstName);
            Assert.NotNull(target.Detail);
            Assert.Equal(1, target.Detail.Created[0].AccountId);
            Assert.Equal("Add", target.Detail.Created[0].AccountName);
        }
    }
}
