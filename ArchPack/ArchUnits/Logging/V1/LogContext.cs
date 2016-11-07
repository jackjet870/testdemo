using ArchPack.ArchUnits.Contracts.V1;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ArchPack.ArchUnits.Logging.V1
{
    /// <summary>
    /// 一連のログ出力で一意なIDを保持するためのコンテキストを定義します。
    /// </summary>
    public class LogContext
    {
        /// <summary>
        /// 指定された <see cref="Logger"/> 、一意なIDおよび <see cref="IIdentity"/> を利用してインスタンスを初期化します。
        /// </summary>
        /// <param name="logger">ログ出力を行う <see cref="Logger"/> インスタンス</param>
        /// <param name="id">コンテキスト内で保持される一意なID</param>
        /// <param name="identity">ユーザー情報を保持する <see cref="IIdentity"/></param>
        public LogContext(Logger logger, Guid id, IIdentity identity)
        {
            Contract.NotNull(logger, "logger");

            this.Id = id;
            this.Identity = identity;
            this.Logger = logger;        
        }
        /// <summary>
        /// このコンテキストに紐づけられたIDを取得します。
        /// </summary>
        public Guid Id { get; private set; }
        /// <summary>
        /// ユーザー情報を保持する <see cref="IIdentity"/> を取得します。
        /// </summary>
        public IIdentity Identity { get; private set; }
        /// <summary>
        /// ログ出力を行う <see cref="Logger"/> インスタンスを取得します。
        /// </summary>
        public Logger Logger { get; private set; }
    }
}