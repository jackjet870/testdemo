using System;
using Xunit;
using ArchPack.ArchUnits.Pipeline.V1;
using ArchPack.ArchUnits.Container.Ninject.V1;
using ArchPack.ArchUnits.Container.V1;
using System.Net;
using ArchPack.Tests.TestUnits.Helpers.V1;

namespace ArchPack.Tests.ArchUnits.Pipeline.V1
{
    public class PipeContextTest
    {
        /// <summary>
        /// クラス : PipeContext
        /// メソッド / プロパティ : PipeContext(IServiceContainer container)
        /// テスト内容/（テストケース） : パイプラインにアクションを登録します。
        /// 確認内容 : DI コンテナーへの参照を指定して、PipeCcontext クラスが初期化できること
        /// </summary>
        [Fact]
        public void Contructor_With_DIcontainerParameterTest()
        {
            NinjectContainer container = new NinjectContainer();
            PipeContext pcontext = new PipeContext(container);
            Assert.NotNull(pcontext);
            Assert.Equal(container, pcontext.Container);
            Assert.True(typeof(IServiceContainer).IsAssignableFrom(pcontext.Container.GetType()));
        }

        /// <summary>
        /// クラス : PipeContext
        /// メソッド / プロパティ : PipeContext(IServiceContainer container)
        /// テスト内容/（テストケース） : パイプラインにアクションを登録します。
        /// 確認内容 : コンストラクタでDIコンテナーの参照にnullを指定した場合にArgumentNullExceptionが発生すること
        /// </summary>
        [Fact]
        public void Contructor_WithNull_RaiseErrorTest()
        {
            IServiceContainer container = null;
            Assert.Throws<ArgumentNullException>(() => new PipeContext(container));
        }

        /// <summary>
        /// クラス : PipeContext
        /// メソッド / プロパティ : PipeContext(IServiceContainer container)
        /// テスト内容/（テストケース） : パイプラインにアクションを登録します。
        /// 確認内容 : コンストラクタでDIコンテナーの参照にnullを指定した場合のエラーメッセージが「containerにnullを指定することはできません。」となっていること
        /// </summary>
        [Fact]
        public void Contructor_WithNull_RaiseErrorMessageTest()
        {
            IServiceContainer container = null;
            ArgumentNullException exception = Assert.Throws<ArgumentNullException>(() => new PipeContext(container));
            Assert.Equal(UnitTestHelper.GetAugementNullMessage("containerにnullを指定できません。", "container"), exception.Message);
        }

        /// <summary>
        /// クラス : PipeContext
        /// メソッド / プロパティ : PipeContext(IServiceContainer container)
        /// テスト内容/（テストケース） : パイプラインにアクションを登録します。
        /// 確認内容 : コンストラクタ実行後にItemsプロパティの件数が0件であること
        /// </summary>
        [Fact]
        public void Contructor_Return_ItemsEmptyTest()
        {
            NinjectContainer container = new NinjectContainer();
            PipeContext pcontext = new PipeContext(container);
            Assert.Equal(0, pcontext.Items.Count);
        }
    }

    public class PipeRequestTest
    {
        /// <summary>
        /// クラス : PipeRequest
        /// メソッド / プロパティ : PipeRequest(PipeContext context, object data)
        /// テスト内容/（テストケース） : パイプラインにアクションを登録します。
        /// 確認内容 : コンテキスト情報と格納データを指定して、PipeRequest クラスが初期化できること
        /// </summary>
        [Fact]
        public void Contructor_With_PipeContextAndObject_Parameter()
        {
            NinjectContainer container = new NinjectContainer();
            PipeContext pcontext = new PipeContext(container);
            PipeRequest prequest = new PipeRequest(pcontext,"ABC");
            Assert.NotNull(prequest);
            Assert.NotNull(prequest.Context);
            Assert.NotNull(prequest.Data);
        }

        /// <summary>
        /// クラス : PipeRequest
        /// メソッド / プロパティ : PipeRequest(PipeContext context, object data)
        /// テスト内容/（テストケース） : パイプラインにアクションを登録します。
        /// 確認内容 : コンストラクタでコンテキスト情報にnullを指定した場合にArgumentNullExceptionが発生すること
        /// </summary>
        [Fact]
        public void Contructor_With_NullPipeContext_Parameter_RaiseError()
        {
            Assert.Throws<ArgumentNullException>(() => new PipeRequest(null, "ABC"));
        }

        /// <summary>
        /// クラス : PipeRequest
        /// メソッド / プロパティ : PipeRequest(PipeContext context, object data)
        /// テスト内容/（テストケース） : パイプラインにアクションを登録します。
        /// 確認内容 : コンストラクタコでンテキスト情報にnullを指定した場合のエラーメッセージが「contextにnullを指定することはできません。」となっていること
        /// </summary>
        [Fact]
        public void Contructor_With_NullPipeContext_Parameter_RaiseErrorMessage()
        {
            ArgumentNullException exception = Assert.Throws<ArgumentNullException>(() => new PipeRequest(null, "ABC"));
            Assert.Equal(UnitTestHelper.GetAugementNullMessage("contextにnullを指定できません。", "context"), exception.Message);
        }

        /// <summary>
        /// クラス : PipeRequest
        /// メソッド / プロパティ : PipeRequest(PipeContext context, object data)
        /// テスト内容/（テストケース） : パイプラインにアクションを登録します。
        /// 確認内容 : コンストラクタで格納データにnullを指定した場合はDataプロパティの値がnullになっていること
        /// </summary>
        [Fact]
        public void Contructor_With_NullObject_Parameter()
        {
            NinjectContainer container = new NinjectContainer();
            PipeContext pcontext = new PipeContext(container);
            PipeRequest prequest = new PipeRequest(pcontext, null);
            Assert.Null(prequest.Data);
        }

        /// <summary>
        /// クラス : PipeRequest
        /// メソッド / プロパティ : CreateResponse(HttpStatusCode statusCode, object data)
        /// テスト内容/（テストケース） : アクションごとの実行結果を判定し、エラーの場合にはエラーの応答を返却します
        /// 確認内容 : ステータスコードと格納データを指定して、パイプラインレスポンスが生成されること
        /// </summary>
        [Fact]
        public void CreateResponse_With_Parameters()
        {
            NinjectContainer container = new NinjectContainer();
            PipeContext pcontext = new PipeContext(container);
            PipeRequest prequest = new PipeRequest(pcontext, "ABC");
            PipeResponse presponse = prequest.CreateResponse(HttpStatusCode.OK, "ABCD");
            Assert.NotNull(presponse);
            Assert.Equal(typeof(PipeResponse), presponse.GetType());
        }

        /// <summary>
        /// クラス : PipeRequest
        /// メソッド / プロパティ : CreateResponse(HttpStatusCode statusCode, object data)
        /// テスト内容/（テストケース） : アクションごとの実行結果を判定し、エラーの場合にはエラーの応答を返却します
        /// 確認内容 : レスポンス情報に指定したステータスコードの情報が含まれること
        /// </summary>
        [Fact]
        public void CreateResponse_Return_HTTPStatusCode_Parameter()
        {
            NinjectContainer container = new NinjectContainer();
            PipeContext pcontext = new PipeContext(container);
            PipeRequest prequest = new PipeRequest(pcontext, "ABC");
            PipeResponse presponse = prequest.CreateResponse(HttpStatusCode.OK, "ABCD");
            Assert.Equal(typeof(HttpStatusCode),presponse.StatusCode.GetType());
            Assert.Equal(HttpStatusCode.OK, presponse.StatusCode);
        }

        /// <summary>
        /// クラス : PipeRequest
        /// メソッド / プロパティ : CreateResponse(HttpStatusCode statusCode, object data)
        /// テスト内容/（テストケース） : アクションごとの実行結果を判定し、エラーの場合にはエラーの応答を返却します
        /// 確認内容 : レスポンス情報に指定した格納データが含まれること
        /// </summary>
        [Fact]
        public void CreateResponse_Return_Object_Parameter()
        {
            NinjectContainer container = new NinjectContainer();
            PipeContext pcontext = new PipeContext(container);
            PipeRequest prequest = new PipeRequest(pcontext, "ABC");
            PipeResponse presponse = prequest.CreateResponse(HttpStatusCode.OK, "ABCD");
            Assert.Equal("ABCD", presponse.Data);
        }

        /// <summary>
        /// クラス : PipeRequest
        /// メソッド / プロパティ : CreateResponse(HttpStatusCode statusCode, object data)
        /// テスト内容/（テストケース） : アクションごとの実行結果を判定し、エラーの場合にはエラーの応答を返却します
        /// 確認内容 : レスポンス情報の格納データがnullであること
        /// </summary>
        [Fact]
        public void CreateResponse_Return_NullObject_Parameter()
        {
            NinjectContainer container = new NinjectContainer();
            PipeContext pcontext = new PipeContext(container);
            PipeRequest prequest = new PipeRequest(pcontext, "ABC");
            PipeResponse presponse = prequest.CreateResponse(HttpStatusCode.OK, null);
            Assert.Null(presponse.Data);
        }
    }

    public class PipeResponseTest
    {
        /// <summary>
        /// クラス : PipeResponse
        /// メソッド / プロパティ : PipeResponse(PipeContext context, HttpStatusCode statusCode)
        /// テスト内容/（テストケース） : アクションごとの実行結果を判定し、エラーの場合にはエラーの応答を返却します
        /// 確認内容 : コンテキスト情報およびステータスコード、格納データを指定して、PipeResponse クラスが初期化できること
        /// </summary>
        [Fact]
        public void Contructor_With_ParametersTest()
        {
            NinjectContainer container = new NinjectContainer();
            PipeContext pcontext = new PipeContext(container);
            PipeResponse presponse = new PipeResponse(pcontext, HttpStatusCode.OK);
            Assert.NotNull(presponse);
            Assert.Equal(typeof(PipeResponse), presponse.GetType());
        }

        /// <summary>
        /// クラス : PipeResponse
        /// メソッド / プロパティ : PipeResponse(PipeContext context, HttpStatusCode statusCode)
        /// テスト内容/（テストケース） : アクションごとの実行結果を判定し、エラーの場合にはエラーの応答を返却します
        /// 確認内容 : コンストラクタでコンテキスト情報にnullを指定した場合にArgumentNullExceptionが発生すること
        /// </summary>
        [Fact]
        public void Contructor_With_NullContext_Parameter_RaiseErrorTest()
        {
            Assert.Throws<ArgumentNullException>(() => new PipeResponse(null, HttpStatusCode.OK));
        }

        /// <summary>
        /// クラス : PipeResponse
        /// メソッド / プロパティ : PipeResponse(PipeContext context, HttpStatusCode statusCode)
        /// テスト内容/（テストケース） : アクションごとの実行結果を判定し、エラーの場合にはエラーの応答を返却します
        /// 確認内容 : コンストラクタコでンテキスト情報にnullを指定した場合のエラーメッセージが「contextにnullを指定することはできません。」となっていること
        /// </summary>
        [Fact]
        public void Contructor_With_NullContext_Parameter_RaiseErrorMessageTest()
        {
            ArgumentNullException exception = Assert.Throws<ArgumentNullException>(() => new PipeResponse(null, HttpStatusCode.OK));
            Assert.Equal(UnitTestHelper.GetAugementNullMessage("contextにnullを指定できません。", "context"), exception.Message);
        }

        /// <summary>
        /// クラス : PipeResponse
        /// メソッド / プロパティ : PipeResponse(PipeContext context, HttpStatusCode statusCode)
        /// テスト内容/（テストケース） : アクションごとの実行結果を判定し、エラーの場合にはエラーの応答を返却します
        /// 確認内容 : コンストラクタで格納データにnullを指定した場合はDataプロパティの値がnullになっていること
        /// </summary>
        [Fact]
        public void Contructor_Return_DataNullTest()
        {
            NinjectContainer container = new NinjectContainer();
            PipeContext pcontext = new PipeContext(container);
            PipeResponse presponse = new PipeResponse(pcontext, HttpStatusCode.OK);
            Assert.Null(presponse.Data);
        }
    }
}
