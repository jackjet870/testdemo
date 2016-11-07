using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

using Xunit;
using ArchPack.ArchUnits.Pipeline.V1;
using ArchValidations = ArchPack.ArchUnits.Validations.V1;
using ArchPack.ArchUnits.Container.Ninject.V1;
using ArchPack.ArchUnits.Container.V1;
using System.Net;
using ArchPack.Tests.TestUnits.Helpers.V1;

namespace ArchPack.Tests.ArchUnits.Pipeline.V1
{
    public class ValidationPipeActionTest
    {
        /// <summary>
        /// 分類  　　　　　　　 : ValidationPipeAction 
        /// テスト項目　　　　　 : Constructor
        /// テスト内容　　　　   : パラメータチェック、エラーハンドル
        /// 確認内容　　　　　　 : デフォルトコンストラクタで初期化される
        /// 確認内容　　　　　　 : OnStart プロパティに NULL が設定される
        /// 確認内容　　　　　　 : OnEnd プロパティに NULL が設定される
        /// 確認内容　　　　　　 : OnError プロパティに NULL が設定される
        /// 確認内容　　　　　　 : IsResumePipe プロパティ に false が設定される
        /// </summary>
        [Fact]
        public void Test_Constructor_Initialization()
        {
            ValidationPipeAction<ValidationTarget> target = new ValidationPipeAction<ValidationTarget>();

            Assert.False(target.IsResumePipe);
            Assert.Null(target.OnStart);
            Assert.Null(target.OnEnd);
            Assert.Null(target.OnError);
        }
        
        /// <summary>
        /// 分類  　　　　　　　 : ValidationPipeAction 
        /// テスト項目　　　　　 : Execute
        /// テスト内容　　　　   : 受け渡されたパラメータオブジェクトのエラーチェックを行う
        /// 確認内容　　　　　　 : Pipe クラスに ValidationPipeAction を登録してパラメータチェック処理が実行できる
        /// </summary>
        [Fact]
        public void Test_Execute_Validation_Success()
        {
            Pipe pipe = new Pipe(new NinjectContainer());

            pipe.ValidateParameters<ValidationTarget>();

            var valid = new ValidationTarget() { ID = "0001" };
            var request = pipe.CreateRequest(valid);
            var response = pipe.Execute(request);
            
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            Assert.Equal(valid, response.Data);
        }

        /// <summary>
        /// 分類  　　　　　　　 : ValidationPipeAction 
        /// テスト項目　　　　　 : Execute
        /// テスト内容　　　　   : 入力検証の結果がエラーの場合、パイプライン処理を中断しエラー情報を返却する。
        /// 確認内容　　　　　　 : 入力検証の結果がエラーとなる場合、戻り値のData プロパティにエラー情報が返却される
        /// 確認内容　　　　　　 : 戻り値の Status が BadRequest となる
        /// 確認内容　　　　　　 : Pipe クラスに ValidationPipeAction を登録してパラメータチェックを実行し、エラーとなった場合、後続のアクションが実行されずに、戻り値のData プロパティにエラー情報が返却される
        /// </summary>
        [Fact]
        public void Test_Execute_Validation_Error()
        {
            Pipe pipe = new Pipe(new NinjectContainer());

            pipe.ValidateParameters<ValidationTarget>();

            var invalid = new ValidationTarget();
            var request = pipe.CreateRequest(invalid);
            var response = pipe.Execute(request);

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

            Assert.IsType<ArchValidations.ValidationResult>(response.Data);

            var result = response.Data as ArchValidations.ValidationResult;

            Assert.False(result.IsValid);
            Assert.Equal(1, result.Errors.Count);
        }
        
        /// <summary>
        /// 分類  　　　　　　　 : ValidationPipeAction 
        /// テスト項目　　　　　 : Execute
        /// テスト内容　　　　   : 入力検証の結果がエラーでない場合、後続のアクションにパラメータを引き継ぐ
        /// 確認内容　　　　　　 : 入力検証の結果がエラーでない場合、、戻り値のData プロパティに引数の Data プロパティが設定される
        /// 確認内容　　　　　　 : 戻り値の Status が OK となる
        /// 確認内容　　　　　　 : Pipe クラスに ValidationPipeAction を登録してパラメータチェックを実行し、成功した場合、後続のアクションが実行される
        /// </summary>
        [Fact]
        public void Test_Execute_Validation_Success_with_next_action()
        {
            Pipe pipe = new Pipe(new NinjectContainer());

            var valid = new ValidationTarget() { ID = "0001" };
            var request = pipe.CreateRequest(valid);

            pipe.ValidateParameters<ValidationTarget>()
                .UseDefaultAction(true, (req) =>
                {
                    Assert.True(true);
                    Assert.Equal(valid, request.Data);
                    return req.CreateResponse(HttpStatusCode.OK, true);
                }); ;

            var response = pipe.Execute(request);

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            Assert.IsType<bool>(response.Data);

            var result = (bool)response.Data;
            Assert.True(result);
        }
        
        /// <summary>
        /// 分類  　　　　　　　 : ValidationPipeAction 
        /// テスト項目　　　　　 : Execute
        /// テスト内容　　　　   : 入力検証の結果がエラーの場合、パイプライン処理を中断しエラー情報を返却する。
        /// 確認内容　　　　　　 : 入力検証の結果がエラーとなる場合、戻り値のData プロパティにエラー情報が返却される
        /// 確認内容　　　　　　 : 戻り値の Status が BadRequest となる
        /// 確認内容　　　　　　 : Pipe クラスに ValidationPipeAction を登録してパラメータチェックを実行し、エラーとなった場合、後続のアクションが実行されずに、戻り値のData プロパティにエラー情報が返却される
        /// </summary>
        [Fact]
        public void Test_Execute_Validation_Fail_with_next_action()
        {
            Pipe pipe = new Pipe(new NinjectContainer());

            var valid = new ValidationTarget();
            var request = pipe.CreateRequest(valid);

            pipe.ValidateParameters<ValidationTarget>()
                .UseDefaultAction(true, (req) =>
                {
                    Assert.True(false, "this action should be cancel.");
                    return req.CreateResponse(HttpStatusCode.OK, false);
                }); ;

            var response = pipe.Execute(request);

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            Assert.IsType<ArchValidations.ValidationResult>(response.Data);

            var result = response.Data as ArchValidations.ValidationResult;

            Assert.False(result.IsValid);
            Assert.Equal(1, result.Errors.Count);
        }
    }

    public class ValidationTarget
    {

        [Required]
        public string ID { get; set; }
    }
}
