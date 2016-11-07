using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ArchPack.ArchUnits.Validations.V1;
using Newtonsoft.Json.Linq;
using ArchPack.ArchUnits.Arcs.PdfDocuments.V1;

namespace ArchPack.ArchUnits.Arcs.PdfDocuments.V1
{
    public interface IPdfDocumentAction
    {
        
        ValidationResult ValidateParamters(JObject data);

        IEnumerable<DocumentData> ConvertToDocumentData(JObject data);
    }
}