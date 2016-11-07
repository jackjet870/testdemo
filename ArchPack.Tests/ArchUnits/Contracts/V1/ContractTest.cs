using ArchPack.ArchUnits.Contracts.V1;
using System;
using Xunit;

namespace ArchPack.Tests.ArchUnits.Contracts.V1
{
    public class ContractTest
    {
        private class TestEntity
        {
            public int Id { get; set; }
            public string Name { get; set; }
        }

        [Fact]
        public void AssertConditonIsFalseTest()
        {            
            Assert.Throws<ArgumentException>(()=>Contract.Assert(false, string.Empty));
        }

        [Fact]
        public void AssertConditonIsTrueTest()
        {            
            Contract.Assert(true, string.Empty);
        }

        [Fact]
        public void NotNullWithParameterIsNullTest()
        {
            TestEntity value = null;
            Assert.Throws<ArgumentNullException>(() => Contract.NotNull(value, "Berlitz International Inc."));
        }
        [Fact]
        public void NotNullWithParameterIsNotNullTest()
        {
            TestEntity value = new TestEntity() { Id = 1, Name = "Berlitz International Inc." };
            Contract.NotNull(value, "Berlitz International Inc.");
        }

        [Fact]
        public void NotEmptyWithValueIsNullTest()
        {
            Assert.Throws<ArgumentNullException>(() => Contract.NotEmpty(null, "ParameterName"));
        }

        [Fact]
        public void NotEmptyWithValueIsEmptyTest()
        {
            Assert.Throws<ArgumentException>(() => Contract.NotEmpty(string.Empty, "ParameterName"));
        }

        [Fact]
        public void NotEmptyTest()
        {
            Contract.NotEmpty("Berlitz International Inc.", "ParameterName");
        }
    }
}
