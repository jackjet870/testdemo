using ArchPack.ArchUnits.Routing.V1;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace ArchPack.ArchUnits.Pipeline.V1
{
    /// <summary>
    /// パイプアクションのインターフェース。
    /// </summary>
    public interface IPipeAction
    {
        /// <summary>
        /// 指定されたアクション（メソッド）をパイプライン処理として実行します。
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        PipeResponse Execute(PipeRequest request);

        bool IsResumePipe { get; }

        Action OnStart { get; set; }

        Action OnEnd { get; set; }

        Action OnError { get; set; }
    }
}