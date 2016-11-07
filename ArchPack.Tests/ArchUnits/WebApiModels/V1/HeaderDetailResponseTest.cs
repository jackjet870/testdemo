using Xunit;
using ArchPack.ArchUnits.WebApiModels.V1;
using System.Collections.Generic;
using ArchPack.Test.ServiceUnits.Test.V1.Data;

namespace ArchPack.Tests.ArchUnits.WebApiModels.V1
{
    public class HeaderDetailResponseTest
    {
        [Fact]
        public void ConstractorTest()
        {
            HeaderDetailResponse<Accounts, Employees> target = new HeaderDetailResponse<Accounts, Employees>();
            target.Header = new Accounts() { AccountId = 1, AccountName = "Test Contacts" };
            IEnumerable<Employees> details = new Employees[] { new Employees() { EmployeeId = 1, FirstName = "Add" } };
            target.Details = details;
            Assert.NotNull(target.Header);
            Assert.Equal(1, target.Header.AccountId);
            Assert.Equal("Test Contacts", target.Header.AccountName);
            Assert.NotNull(target.Details);   
            var enumerator = target.Details.GetEnumerator();
            while (enumerator.MoveNext())
            {
                Employees contactProfiles = enumerator.Current;
                Assert.Equal(1, contactProfiles.EmployeeId);
                Assert.Equal("Add", contactProfiles.FirstName);
            }
            
            
        }
    }
}
