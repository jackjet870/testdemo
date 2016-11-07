using System;
using Xunit;
using ArchPack.ArchUnits.Pipeline.V1;
using ArchPack.ArchUnits.Container.Ninject.V1;
using System.Net;
using ArchPack.Tests.TestUnits.Helpers.V1;

namespace ArchPack.Tests.ArchUnits.Pipeline.V1
{
    public class PipeTest
    {
        private Pipe target;

        public PipeTest()
        {
            target = new Pipe(new NinjectContainer());
        }

        /// <summary>
        /// クラス　　　         : Pipe
        /// メソッド / プロパティ: Pipe()
        /// テスト内容　　　　   : パイプラインにアクションを登録します。
        /// 確認内容　　　　　　 : Pipeクラスが初期化できること
        /// </summary>
        [Fact]
        public void ContructorTest()
        {
            Assert.NotNull(target);
        }

        /// <summary>
        /// クラス　　　         : Pipe
        /// メソッド / プロパティ: Use<T>()
        /// テスト内容　　　　   : パイプラインにアクションを登録します。
        /// 確認内容　　　　　　 : 指定されたアクションが登録されたパイプライン情報が返されること
        /// </summary>
        [Fact]
        public void Use_WithNoParameterTest()
        {
            SamplePipeAction samplepipeaction = new SamplePipeAction();
            PipeRequest prequest = target.CreateRequest(0);
            target.Use<SamplePipeAction>();
            PipeResponse prespone = target.Execute(prequest);
            Assert.Equal(1, prespone.Data);
        }

        /// <summary>
        /// クラス　　　         : Pipe
        /// メソッド / プロパティ: Use(IPipeAction action)
        /// テスト内容　　　　   : パイプラインにアクションを登録します。
        /// 確認内容　　　　　　 : 指定されたアクションが登録されたパイプライン情報が返されること
        /// </summary>
        [Fact]
        public void Use_WithIPipeAction_ParameterTest()
        {
            PipeRequest prequest = target.CreateRequest(0);
            target.Use(new SamplePipeAction());
            PipeResponse prespone = target.Execute(prequest);
            Assert.Equal(1, prespone.Data);
        }

        /// <summary>
        /// クラス　　　         : Pipe
        /// メソッド / プロパティ: Use(IPipeAction action)
        /// テスト内容　　　　   : パイプラインにアクションを登録します。
        /// 確認内容　　　　　　 : 指定されたアクションがnullの場合は、ArgumentNullExceptionが発生すること
        /// </summary>
        [Fact]
        public void Use_WithNullIPipeAction_ParameterTest()
        {
            Assert.Throws<ArgumentNullException>(() => target.Use(null));
        }

        /// <summary>
        /// クラス　　　         : Pipe
        /// メソッド / プロパティ: Use(IPipeAction action)
        /// テスト内容　　　　   : パイプラインにアクションを登録します。
        /// 確認内容　　　　　　 : 指定されたアクションがnullの場合エラーメッセージが「actionにnullを指定することはできません。」となっていること
        /// </summary>
        [Fact]
        public void Use_WithNullIPipeAction_Parameter_RaiseMessageTest()
        {
            ArgumentNullException exception = Assert.Throws<ArgumentNullException>(() => target.Use(null));
            Assert.Equal(UnitTestHelper.GetAugementNullMessage("actionにnullを指定できません。", "action"), exception.Message);
        }

        /// <summary>
        /// クラス　　　         : Pipe
        /// メソッド / プロパティ: Execute(PipeRequest request)
        /// テスト内容　　　　   : 登録された順序でアクションを実行します
        /// 確認内容　　　　　　 : 指定されたリクエスト情報が null の場合は、ArgumentNullException が発生すること
        /// </summary>
        [Fact]
        public void Execute_WithNullParameterTest()
        {
            Assert.Throws<ArgumentNullException>(() => target.Execute(null));
        }

        /// <summary>
        /// クラス　　　         : Pipe
        /// メソッド / プロパティ: Execute(PipeRequest request)
        /// テスト内容　　　　   : 登録された順序でアクションを実行します
        /// 確認内容　　　　　　 : 指定されたリクエスト情報が null の場合のエラーメッセージが「requestにnullを指定することはできません。」となっていること
        /// </summary>
        [Fact]
        public void Execute_WithNullParameter_RaiseMessageTest()
        {
            ArgumentNullException exception = Assert.Throws<ArgumentNullException>(() => target.Execute(null));
            Assert.Equal(UnitTestHelper.GetAugementNullMessage("requestにnullを指定できません。", "request"), exception.Message);
        }

        /// <summary>
        /// クラス　　　         : Pipe
        /// メソッド / プロパティ: Execute(PipeRequest request)
        /// テスト内容　　　　   : 登録された順序でアクションを実行します
        /// 確認内容　　　　　　 : 登録されたアクションが0件の場合は、InvalidOperationExceptionが発生すること
        /// </summary>
        [Fact]
        public void Execute_WithNullActionsTest()
        {
            PipeRequest prequest = target.CreateRequest(0);
            Assert.Throws<InvalidOperationException>(() => target.Execute(prequest));
        }

        /// <summary>
        /// クラス　　　         : Pipe
        /// メソッド / プロパティ: Execute(PipeRequest request)
        /// テスト内容　　　　   : 登録された順序でアクションを実行します
        /// 確認内容　　　　　　 : 登録されたアクションが0件の場合のエラーメッセージは「アクションの登録がありません。」となっていること
        /// </summary>
        [Fact]
        public void Execute_WithNullActions_RaiseErrorMessageTest()
        {
            PipeRequest prequest = target.CreateRequest(0);
            InvalidOperationException exception = Assert.Throws<InvalidOperationException>(() => target.Execute(prequest));
            Assert.Equal("アクションの登録がありません。", exception.Message);
        }

        /// <summary>
        /// クラス　　　         : Pipe
        /// メソッド / プロパティ: Execute(PipeRequest request)
        /// テスト内容　　　　   : 登録された順序でアクションを実行します
        /// 確認内容　　　　　　 : 登録されたアクションが1件の場合は、登録した処理が実行されアクションの結果がPipeResponseクラスのインスタンスとして返却されること  
        /// </summary>
        [Fact]
        public void Execute_ReturnPipeResponseTest()
        {
            SamplePipeAction samplepipeaction = new SamplePipeAction();
            PipeRequest prequest = target.CreateRequest(0);
            target.Use(samplepipeaction);
            Assert.Equal(typeof(PipeResponse), target.Execute(prequest).GetType());
        }

        /// <summary>
        /// クラス　　　         : Pipe
        /// メソッド / プロパティ: Execute(PipeRequest request)
        /// テスト内容　　　　   : 登録された順序でアクションを実行します
        /// 確認内容　　　　　　 : 登録されたアクションが複数件の場合は、登録した順序にしたがって処理が実行され、最後のアクションの結果がPipeResponseクラスのインスタンスとして返却されること  
        /// </summary>
        [Fact]
        public void Execute_ReturnLastActionTest()
        {
            PipeRequest prequest = target.CreateRequest(0);
            target.Use(new SamplePipeAction());
            target.Use(new SamplePipeAction());
            target.Use(new SamplePipeAction());
            PipeResponse prespone = target.Execute(prequest);
            Assert.Equal(3, prespone.Data);
        }

        /// <summary>
        /// クラス　　　         : Pipe
        /// メソッド / プロパティ: Execute(PipeRequest request)
        /// テスト内容　　　　   : 登録された順序でアクションを実行します
        /// 確認内容　　　　　　 : 登録されたアクションで開始処理が登録されている場合は、開始処理が実行された後、本処理が実行され、本処理のアクションの結果がPipeResponseクラスのインスタンスとして返却されること  
        /// </summary>
        [Fact]
        public void Execute_WithOnStartProperty_Test()
        {
            SamplePipeAction samplepipeaction= new SamplePipeAction();
            PipeRequest prequest = target.CreateRequest(0);
            samplepipeaction.OnStart = delegate { prequest.Data = 5; };
            target.Use(samplepipeaction);
            var prespone = target.Execute(prequest);
            Assert.Equal(6, prespone.Data);
            Assert.Equal(typeof(PipeResponse), prespone.GetType());
        }

        /// <summary>
        /// クラス　　　         : Pipe
        /// メソッド / プロパティ: Execute(PipeRequest request)
        /// テスト内容　　　　   : アクションごとの実行結果を判定し、エラーの場合にはエラーの応答を返却します
        /// 確認内容　　　　　　 : アクションの中断フラグが true の場合は、アクションの処理がエラーの場合(StatusCode が200以外の場合)、中断フラグが trueのアクションの結果がPipeResponseクラスのインスタンスとして返却されること 
        /// </summary>
        [Fact]
        public void Execute_ReturnStatusCodeNot200Test()
        {
            SamplePipeAction samplepipeaction = new SamplePipeAction();
            samplepipeaction.IsResumePipe = true;
            PipeRequest prequest = target.CreateRequest("A");
            target.Use(samplepipeaction);
            target.Use(new SamplePipeAction());
            target.Use(new SamplePipeAction());
            PipeResponse prespone = target.Execute(prequest);
            Assert.Equal("AAAA", prespone.Data);
        }

        /// <summary>
        /// クラス　　　         : Pipe
        /// メソッド / プロパティ: Execute(PipeRequest request)
        /// テスト内容　　　　   : アクションごとの実行結果を判定し、エラーの場合にはエラーの応答を返却します
        /// 確認内容　　　　　　 : アクションの中断フラグが true の場合は、アクションの処理がエラーの場合(StatusCode が200以外の場合)、中断フラグが trueのアクションの結果がPipeResponseクラスのインスタンスとして返却されること 
        /// </summary>
        [Fact]
        public void Execute_ReturnPipeResponse_With_StatusCodeNot200Test()
        {
            SamplePipeAction samplepipeaction = new SamplePipeAction();
            samplepipeaction.IsResumePipe = true;
            PipeRequest prequest = target.CreateRequest("A");
            target.Use(samplepipeaction);
            target.Use(new SamplePipeAction());
            target.Use(new SamplePipeAction());
            PipeResponse prespone = target.Execute(prequest);
            Assert.NotEqual(HttpStatusCode.OK, prespone.StatusCode);
        }

        /// <summary>
        /// クラス　　　         : Pipe
        /// メソッド / プロパティ: Execute(PipeRequest request)
        /// テスト内容　　　　   : アクションごとの実行結果を判定し、エラーの場合にはエラーの応答を返却します
        /// 確認内容　　　　　　 : 登録されたアクションで開始処理が登録されている場合で、かつ開始処理で例外が発生した場合は、本処理が実行されないこと
        /// </summary>
        [Fact]
        public void Execute_WithOnStartThrownExceptionTest()
        {
            SamplePipeAction samplepipeaction = new SamplePipeAction();
            PipeRequest prequest = target.CreateRequest(0);
            samplepipeaction.OnStart = delegate { throw new Exception("Test Exception"); };
            target.Use(samplepipeaction);
            Assert.Throws<Exception>(() => target.Execute(prequest));
        }

        /// <summary>
        /// クラス　　　         : Pipe
        /// メソッド / プロパティ: Execute(PipeRequest request)
        /// テスト内容　　　　   : アクションごとの実行結果を判定し、エラーの場合にはエラーの応答を返却します
        /// 確認内容　　　　　　 : 登録されたアクションで終了処理が登録されている場合で、かつ本処理実行で例外が発生した場合は、終了処理が実行されないこと
        /// </summary>
        [Fact]
        public void Execute_WithOnEndThrownExceptionTest()
        {
            SamplePipeAction samplepipeaction = new SamplePipeAction();
            PipeRequest prequest = target.CreateRequest(0);
            samplepipeaction.OnEnd = delegate { throw new Exception("Test Exception"); };
            target.Use(samplepipeaction);
            Assert.Throws<Exception>(() => target.Execute(prequest));
        }

        /// <summary>
        /// クラス　　　         : Pipe
        /// メソッド / プロパティ: Execute(PipeRequest request)
        /// テスト内容　　　　   : アクションごとの実行結果を判定し、エラーの場合にはエラーの応答を返却します
        /// 確認内容　　　　　　 : 登録されたアクションで終了処理が登録されている場合で、かつ本処理実行で例外が発生した場合は、終了処理が実行されないこと
        /// </summary>
        [Fact]
        public void Execute_WithActionThrownExceptionTest()
        {
            PipeRequest prequest = target.CreateRequest(8);
            target.Use(new SamplePipeAction());
            target.Use(new SamplePipeAction());
            target.Use(new SamplePipeAction());
            Assert.Throws<Exception>(() => target.Execute(prequest));
        }

        /// <summary>
        /// クラス　　　         : Pipe
        /// メソッド / プロパティ: CreateRequestFromResponse(PipeResponse response)
        /// 確認内容　　　　　　 : responseのContextプロパティが設定されたPipeRequestクラスのインスタンスが返却されること
        /// </summary>
        [Fact]
        public void CreateRequestFromResponse_ReturnPipeRequestTest()
        {
            PipeContext pcontext = new PipeContext(new NinjectContainer());
            PipeResponse presponse = new PipeResponse(pcontext, HttpStatusCode.OK);
            presponse.Data = 2;
            PipeRequest prequest = target.CreateRequestFromResponse(presponse);
            Assert.NotNull(prequest);
        }

        /// <summary>
        /// クラス　　　         : Pipe
        /// メソッド / プロパティ: CreateRequestFromResponse(PipeResponse response)
        /// 確認内容　　　　　　 : responseのDataプロパティが設定されたPipeRequestクラスのインスタンスが返却されること
        /// </summary>
        [Fact]
        public void CreateRequestFromResponse_ReturnPipeRequestWithDataTest()
        {
            PipeContext pcontext = new PipeContext(new NinjectContainer());
            PipeResponse presponse = new PipeResponse(pcontext, HttpStatusCode.OK);
            presponse.Data = 5;
            PipeRequest prequest = target.CreateRequestFromResponse(presponse);
            Assert.NotNull(prequest);
            Assert.Equal(5,prequest.Data);
        }

        /// <summary>
        /// クラス　　　         : Pipe
        /// メソッド / プロパティ: CreateRequestFromResponse(PipeResponse response)
        /// 確認内容　　　　　　 : responseのDataプロパティがnullの場合はDataプロパティにnullが設定されたPipeRequestクラスのインスタンスが返却されること
        /// </summary>
        [Fact]
        public void CreateRequestFromResponse_Return_NullDataTest()
        {
            PipeContext pcontext = new PipeContext(new NinjectContainer());
            PipeResponse presponse = new PipeResponse(pcontext, HttpStatusCode.OK);
            PipeRequest prequest = target.CreateRequestFromResponse(presponse);
            Assert.NotNull(prequest);
            Assert.Null(prequest.Data);
        }

        /// <summary>
        /// クラス　　　         : Pipe
        /// メソッド / プロパティ: CreateRequestFromResponse(PipeResponse response)
        /// 確認内容　　　　　　 : 指定したresponseが null の場合は ArgumentNullException が発生すること
        /// </summary>
        [Fact]
        public void CreateRequestFromResponse_WithNullParameter_RaiseErrorTest()
        {
            Assert.Throws<ArgumentNullException>(() => target.CreateRequestFromResponse(null));
        }

        /// <summary>
        /// クラス　　　         : Pipe
        /// メソッド / プロパティ: CreateRequestFromResponse(PipeResponse response)
        /// 確認内容　　　　　　 : 定されたresponseがNULLの場合のエラーメッセージは「responseにnullを指定することはできません。」となっていること
        /// </summary>
        [Fact]
        public void CreateRequestFromResponse_WithNullParameter_RaiseErrorMessageTest()
        {
            ArgumentNullException exception = Assert.Throws<ArgumentNullException>(() => target.CreateRequestFromResponse(null));
            Assert.Equal(UnitTestHelper.GetAugementNullMessage("responseにnullを指定できません。", "response"), exception.Message);
        }
    }

    public class SamplePipeAction:IPipeAction
    {
        public bool IsResumePipe { get; set; }

        public Action OnStart { get; set; }
        public Action OnEnd { get; set; }
        public Action OnError { get; set; }

        public PipeResponse Execute(PipeRequest request)
        {
            PipeResponse presponse = null;
            int actioncount;
            bool isInt = Int32.TryParse(request.Data.ToString(),out actioncount);
            if (isInt)
            {
                presponse = new PipeResponse(request.Context, HttpStatusCode.OK);
                actioncount++;
                presponse.Data = actioncount;
                if(actioncount > 10)
                {
                    throw new Exception();
                }
            }
            else //exception case to return StatusCode != 200
            {
                presponse = new PipeResponse(request.Context, HttpStatusCode.InternalServerError);
                if (request.Data != null)
                {
                    string temp = request.Data.ToString();
                    temp += temp;
                    presponse.Data += temp;
                }
            }
            return presponse;
        }
    }
}
