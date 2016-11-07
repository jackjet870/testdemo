using ArchPack.ArchUnits.Path.V1;
using Xunit;

namespace ArchPack.Tests.ArchUnits.Path.V1
{
    public class PathDataTest
    {
        [Fact]
        public void エイリアスに変換できる_先頭にスラッシュありTest()
        {
            PathMapResult result = PathMapper.Convert(
                "/ServiceUnits/Membership/V1/Users/Pages/UserInput.aspx",
                "/ServiceUnits/{ServiceUnitName}/{Version}/{RoleName}/Pages/{PageName}.aspx",
                "/{ServiceUnitName}/{Version}/{RoleName}/page/{PageName}");
            Assert.NotNull(result);
            Assert.Equal(true, result.Success);
            Assert.Equal("/Membership/V1/Users/page/UserInput", result.MappedPath);
        }

        [Fact]
        public void エイリアスに変換できる_先頭にスラッシュなしTest()
        {
            PathMapResult result = PathMapper.Convert(
                "ServiceUnits/Membership/V1/Users/Pages/UserInput.aspx",
                "ServiceUnits/{ServiceUnitName}/{Version}/{RoleName}/Pages/{PageName}.aspx",
                "{ServiceUnitName}/{Version}/{RoleName}/page/{PageName}");
            Assert.NotNull(result);
            Assert.Equal(true, result.Success);
            Assert.Equal("Membership/V1/Users/page/UserInput", result.MappedPath);
        }

        [Fact]
        public void エイリアスから変換できる_先頭にスラッシュありTest()
        {
            PathMapResult result = PathMapper.Convert(
                "/Membership/V1/Users/page/UserInput",
                "/{ServiceUnitName}/{Version}/{RoleName}/page/{PageName}",
                "/ServiceUnits/{ServiceUnitName}/{Version}/{RoleName}/Pages/{PageName}.aspx");
            Assert.NotNull(result);
            Assert.Equal(true, result.Success);
            Assert.Equal("/ServiceUnits/Membership/V1/Users/Pages/UserInput.aspx", result.MappedPath);
        }

        [Fact]
        public void エイリアスから変換できる_先頭にスラッシュなしTest()
        {
            PathMapResult result = PathMapper.Convert(
                "Membership/V1/Users/page/UserInput",
                "{ServiceUnitName}/{Version}/{RoleName}/page/{PageName}",
                "ServiceUnits/{ServiceUnitName}/{Version}/{RoleName}/Pages/{PageName}.aspx");
            Assert.NotNull(result);
            Assert.Equal(true, result.Success);
            Assert.Equal("ServiceUnits/Membership/V1/Users/Pages/UserInput.aspx", result.MappedPath);
        }

        [Fact]
        public void 変換元パターンにワイルドカード文字が１つ含まれる場合に変換ができるTest()
        {
            PathMapResult result = PathMapper.Convert(
                "/ServiceUnits/Membership/V1/Users/Pages/UserInput.aspx",
                "/ServiceUnits/{ServiceUnitNameAndVersion:*}/Users/{TypeName}/{PageName}.aspx",
                "/{ServiceUnitNameAndVersion}/Users/page/{PageName}");
            Assert.NotNull(result);
            Assert.Equal(true, result.Success);
            Assert.Equal("/Membership/V1/Users/page/UserInput", result.MappedPath);
        }

        [Fact]
        public void MapFailTest()
        {
            PathMapResult result = PathMapper.Convert(
                "/ServiceUnits/Membership/V1/Users/Pages/UserInput.aspx",
                "/ServiceUnits/{ServiceUnitNameAndVersion:*}/Users/{TypeName}/{PageName}.aspx",
                "/{ServiceUnitNameAndVersion}/Users/page/{PageName}.{Extension}");
            Assert.NotNull(result);
            Assert.Equal(false, result.Success);
        }

        [Fact]
        public void 変換元パターンにワイルドカード文字が１つ含まれる場合に変換ができる_ワイルドカードの連続なしTest()
        {
            PathMapResult result = PathMapper.Convert(
                "/ServiceUnits/Membership/V1/Users/Pages/UserInput.aspx",
                "/ServiceUnits/{ServiceUnitNameAndVersion:*}/Users/{TypeNameAndPageName:*}.aspx",
                "/{ServiceUnitNameAndVersion}/Users/{TypeNameAndPageName}");
            Assert.NotNull(result);
            Assert.Equal(true, result.Success);
            Assert.Equal("/Membership/V1/Users/Pages/UserInput", result.MappedPath);
        }

        [Fact]
        public void ワイルドカード文字が１つ以上含まれるURIを変換できる_ドット区切りTest()
        {
            PathMapResult result = PathMapper.Convert(
                "/ServiceUnits/Membership/V1/Users/Pages/UserInput.aspx",
                "/ServiceUnits/{ServiceUnitNameAndVersion:*}/Users/{TypeNameAndPageName:*}.{Extention:*}",
                "/{ServiceUnitNameAndVersion}/Users/{TypeNameAndPageName}");
            Assert.NotNull(result);
            Assert.Equal(true, result.Success);
            Assert.Equal("/Membership/V1/Users/Pages/UserInput", result.MappedPath);
        }

        [Fact]
        public void ワイルドカード文字が１つ以上含まれるURIを変換できる_ドット区切りドット複数Test()
        {
            PathMapResult result = PathMapper.Convert(
                "/ServiceUnits/Membership/V1/Users/Pages/UserInput.Detail.aspx",
                "/ServiceUnits/{ServiceUnitNameAndVersion:*}/Users/{TypeNameAndPageName:*}.{Extention:*}",
                "/{ServiceUnitNameAndVersion}/Users/{TypeNameAndPageName}.{Extention}");
            Assert.NotNull(result);
            Assert.Equal(true, result.Success);
            Assert.Equal("/Membership/V1/Users/Pages/UserInput.Detail", result.MappedPath);
        }

        //Number 10
        //[Fact]
        //public void 変換元パターンにワイルドカード文字が１つ含まれる場合に変換が失敗する_ワイルドカードの連続ありTest()
        //{
        //    PathMapResult result = PathData.Parse(
        //        "/ServiceUnits/Membership/V1/Users/Pages/UserInput.aspx",
        //        "/ServiceUnits/{ServiceUnitNameAndVersion: *} /{RoleNameAndType: *}/{PageName}.aspx");
        //    Assert.NotNull(result);
        //    Assert.Equal(false, result.Success);
        //}

        [Fact]
        public void 変換元パターンにワイルドカード文字が１つ含まれる場合に変換が失敗する_パラメータを挟んでのワイルドカード文字Test()
        {
            PathMapResult result = PathMapper.Parse(
                "/Membership/V1/Users/page/UserInput",
                "/ServiceUnits/{ServiceUnitNameAndVersion: *} /{RoleName}/{TypeAndPageName: *}.aspx");
            Assert.NotNull(result);
            Assert.Equal(false, result.Success);
        }

        [Fact]
        public void 変換元のパターンにワイルドカード文字が含まれていない場合に変換後パターンのパラメータに変換元パターンのパラメータにないパラメータがある場合は変換結果が失敗となるTest()
        {
            PathMapResult result = PathMapper.Convert(
                "/Membership/V1/Users/page/UserInput",
                "/{ServiceUnitName}/{Version}/{RoleName}/page/{PageName}",
                "/ServiceUnits/{ServiceUnitName}/{Version}/{RoleName}/Pages/{PageName}.{Extention}");
            Assert.NotNull(result);
            Assert.Equal(false, result.Success);
        }

        [Fact]
        public void 変換元のパターンにワイルドカード文字が含まれていない場合に変換元のURI文字列のセグメント数が変換元パターンのセグメント数と異なる場合は変換結果が失敗となるTest()
        {
            PathMapResult result = PathMapper.Parse(
                "/ServiceUnits/Membership/V1/Users/Pages/UserInput.aspx",
                "/ServiceUnits/{ServiceUnitName}/{RoleName}/Pages/{PageName}.aspx");
            Assert.NotNull(result);
            Assert.Equal(false, result.Success);
        }

        [Fact]
        public void 変換元のパターンにワイルドカード文字が含まれている場合に変換前のURI文字列のセグメント数が変換元パターンのセグメント数より小さい場合は変換結果が失敗となるTest()
        {
            PathMapResult result = PathMapper.Parse(
                "/ServiceUnits/Membership/V1/Users/Pages/UserInput.aspx",
                "/ServiceUnits/{ServiceUnitName}/{RoleName}/Pages/{PageName}.aspx");
            Assert.NotNull(result);
            Assert.Equal(false, result.Success);
        }
    }
}
