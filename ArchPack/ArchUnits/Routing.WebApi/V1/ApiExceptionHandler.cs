using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.ExceptionHandling;
using ArchPack.ArchUnits.WebApiModels.V1;
using ArchPack.Properties;
using System.Net.Http;
using System.Net;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Validation;
using System.Web.Http.Results;
using ArchPack.ArchUnits.Routing.V1;
using ArchPack.ArchUnits.Logging.V1;

namespace ArchPack.ArchUnits.Routing.WebApi.V1
{
    public class ApiExceptionHandler: ExceptionHandler
    {
        public override void Handle(ExceptionHandlerContext context)
        {
            var resolver = context.Request.GetUriProcessResolver();
            var suContext = context.Request.GetServiceUnitContext();
            if (resolver == null || suContext == null)
            {
                base.Handle(context);
                return;
            }

            WriteErrorLog(suContext, context);

            var response = new ServiceUnitResponse(HttpStatusCode.InternalServerError)
            {
                Data = context.Exception
            };
            
            foreach (var handler in resolver.HandleErrorPipeline)
            {
                response = handler.Invoke(suContext, response);
            }
            
            context.Result = new ResponseMessageResult(context.Request.CreateResponse(response.StatusCode, response.Data));
        }

        private void WriteErrorLog(ServiceUnitContext serviceUnitContext, ExceptionHandlerContext context)
        {
            Exception exception = context.Exception;
            LogData data = new LogData()
            {
                Exception = exception,
                Uri = serviceUnitContext.Request.Path,
                User = serviceUnitContext.User == null ? null : serviceUnitContext.User.Identity.Name,
                LogName = "error",
                LogId = serviceUnitContext.Id
            };
            serviceUnitContext.LogContext.Logger.Error(data);
        }
    }
}