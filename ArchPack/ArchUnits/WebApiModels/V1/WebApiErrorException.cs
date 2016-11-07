using ArchPack.ArchUnits.WebApiModels.V1;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ArchPack.ArchUnits.WebApiModels.V1
{
    public sealed class WebApiErrorException : Exception
    {
        /// <summary>
        /// 引数に指定された <see cref="WebApiErrorResponse"/> をもとにインスタンスを生成します。
        /// </summary>
        /// <param name="errorResponseData"></param>
        public WebApiErrorException(WebApiErrorResponse errorResponseData)
            : base(errorResponseData.Message)
        {

            this.ErrorResponseData = errorResponseData;

        }
        /// <summary>
        /// <see cref="WebApiErrorResponse"/> を取得します。
        /// </summary>
        public WebApiErrorResponse ErrorResponseData { get; private set; }

    }
}