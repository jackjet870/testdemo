using System;
using Xunit;
using ArchPack.ArchUnits.Path.V1;
using ArchPack.Tests.TestUnits.Helpers.V1;

namespace ArchPack.Tests.ArchUnits.Path.V1
{
    
    public class PathInfoBuilderTest
    {   
        public PathInfoBuilderTest()
        {
            ContainerHelper.InitializeDefault();
        }

        [Fact]        
        public void BuidWithPathNullTest()
        {            
            Assert.Throws<ArgumentNullException>(() => PathInfoBuilder.Build(null)); 
        }

        [Fact]        
        public void BuidWithPathIsEmptyTest() 
        {          
            Assert.Throws<ArgumentNullException>(() => PathInfoBuilder.Build(""));
        }

        [Fact]
        public void BuidWithPathHaveWhitespaceAtFirstTest()
        {
            string path = " /Membership/V1/general/MixedAuthentication";
            var result = PathInfoBuilder.Build(path);
            Assert.Equal("Membership", result.ServiceUnitName);
            Assert.Equal("V1", result.Version);
            Assert.Equal("/MixedAuthentication", result.ProcessPath);
            Assert.Equal("general", result.ProcessType);
            Assert.Null(result.SpecificProcessPath);
            Assert.Null(result.Role);
        }

        [Fact]
        public void BuidWithPathHaveWhitespaceAtLastTest()
        {
            string path = "/Membership/V1/general/MixedAuthentication ";
            var result = PathInfoBuilder.Build(path);
            Assert.Equal("Membership", result.ServiceUnitName);
            Assert.Equal("V1", result.Version);
            Assert.Equal("/MixedAuthentication", result.ProcessPath);
            Assert.Equal("general", result.ProcessType);
            Assert.Null(result.SpecificProcessPath);
            Assert.Null(result.Role);
        }

        [Fact]
        public void BuidWithPathHaveWhitespaceTest()
        {
            string path = " /Membership/V1/general/MixedAuthentication ";
            var result = PathInfoBuilder.Build(path);
            Assert.Equal("Membership", result.ServiceUnitName);
            Assert.Equal("V1", result.Version);
            Assert.Equal("/MixedAuthentication", result.ProcessPath);
            Assert.Equal("general", result.ProcessType);
            Assert.Null(result.SpecificProcessPath);
            Assert.Null(result.Role);
        }

        [Fact]
        public void BuidWithPathHaveLineButNoRemainPathTest()
        {
            string path = "/Membership/V1/general/MixedAuthentication/_";
            var result = PathInfoBuilder.Build(path);
            Assert.Null(result);
        }

        [Fact]
        public void BuidWithPathHaveLineButRemainPathTest()
        {
            string path = "/Membership/V1/general/MixedAuthentication/_/Extend";
            var result = PathInfoBuilder.Build(path);
            Assert.NotNull(result);
            Assert.Equal("Membership", result.ServiceUnitName);
            Assert.Equal("V1", result.Version);
            Assert.Equal("/MixedAuthentication", result.ProcessPath);
            Assert.Equal("general", result.ProcessType);
            Assert.Equal("/Extend", result.SpecificProcessPath);
        }

       
        [Fact]
        public void BuidWithPathHaveNotServiceUnitNameTest()
        {
            string path = "/general/MixedAuthentication/_/Extend";
            var result = PathInfoBuilder.Build(path);
            Assert.Null(result);
        }
    }
}
