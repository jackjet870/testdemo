using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Hosting;
using System.Web.Services.Protocols;
using System.IO;
using ArchPack.ArchUnits.Arcs.PdfDocuments.V1;
using ArchPack.ArchUnits.WebApiExtensions.V1;
using ArchPack.ArchUnits.WebApiModels.V1;
using System.ServiceModel;
using ArchPack.ArchUnits.Configuration.V1;


namespace ArchPack.ServiceUnits.Membership.V1.Users.Api
{
    public class PdfServiceController : ApiController
    {
        public HttpResponseMessage Post(string documentId, DataGroup[] dataGroups)
        {           
            try
            {                  
                PdfDocument pdfDocument = new PdfDocument();

                var data = new DocumentData(documentId);
                foreach (var group in dataGroups)
                {
                    data.DataGroups.Add(group);
                }

                Byte[] pdfByte = pdfDocument.CreatePdf(data);
               
                MemoryStream stream = new MemoryStream();

                stream.Write(pdfByte, 0, pdfByte.Length);

                stream.Flush();

                return Request.CreateFileDownloadResponse(HttpStatusCode.OK, stream, "SampleFile.pdf");
            }                    
            catch (Exception e)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, e.Message, e);
            }
            
        }        
    }
}
