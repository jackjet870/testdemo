﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.34209
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

// 
// This source code was auto-generated by Microsoft.VSDesigner, Version 4.0.30319.34209.
// 
#pragma warning disable 1591

namespace ArchPack.ArchUnits.Arcs.PdfDocuments.V1
{
    using System;
    using System.Web.Services;
    using System.Diagnostics;
    using System.Web.Services.Protocols;
    using System.Xml.Serialization;
    using System.ComponentModel;
    using System.Collections.Generic;
    using Contracts.V1;


    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.0.30319.34209")]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    [System.Web.Services.WebServiceBindingAttribute(Name = "PdfServiceExSoap", Namespace = "/PdfServiceEx")]
    [System.Xml.Serialization.XmlIncludeAttribute(typeof(Parameter[]))]
    [System.Xml.Serialization.XmlIncludeAttribute(typeof(DataGroup[]))]
    [System.Xml.Serialization.XmlIncludeAttribute(typeof(DataItem[]))]
    public partial class PdfServiceEx : SoapHttpClientProtocol, IPdfService
    {
        private System.Threading.SendOrPostCallback createPDFOperationCompleted;


        public PdfServiceEx()
        {
            //this.Url = global::ArchPack.Properties.Settings.Default.ArchPack_Intelligence_PdfServiceEx;
            //if ((this.IsLocalFileSystemWebService(this.Url) == true)) {
            //    this.UseDefaultCredentials = true;
            //    this.useDefaultCredentialsSetExplicitly = false;
            //}
            //else {
            //    this.useDefaultCredentialsSetExplicitly = true;
            //}
        }

        public new string Url
        {
            get
            {
                return base.Url;
            }
            set
            {
                //if ((((this.IsLocalFileSystemWebService(base.Url) == true) 
                //            && (this.useDefaultCredentialsSetExplicitly == false)) 
                //            && (this.IsLocalFileSystemWebService(value) == false))) {
                //    base.UseDefaultCredentials = false;
                //}
                base.Url = value;
            }
        }

        public new bool UseDefaultCredentials
        {
            get
            {
                return base.UseDefaultCredentials;
            }
            set
            {
                base.UseDefaultCredentials = value;
            }
        }


        public event createPDFCompletedEventHandler createPDFCompleted;


        [System.Web.Services.Protocols.SoapDocumentMethodAttribute("/PdfServiceEx/createPDF", RequestNamespace = "/PdfServiceEx", ResponseNamespace = "/PdfServiceEx", Use = System.Web.Services.Description.SoapBindingUse.Literal, ParameterStyle = System.Web.Services.Protocols.SoapParameterStyle.Wrapped)]
        [return: System.Xml.Serialization.XmlElementAttribute(DataType = "base64Binary")]
        public byte[] createPDF(Parameter[] soapParameters)
        {
            object[] results = this.Invoke("createPDF", new object[] {
                        soapParameters});
            return ((byte[])(results[0]));
        }


        public void createPDFAsync(Parameter[] soapParameters)
        {
            this.createPDFAsync(soapParameters, null);
        }


        public void createPDFAsync(Parameter[] soapParameters, object userState)
        {
            if ((this.createPDFOperationCompleted == null))
            {
                this.createPDFOperationCompleted = new System.Threading.SendOrPostCallback(this.OncreatePDFOperationCompleted);
            }
            this.InvokeAsync("createPDF", new object[] {
                        soapParameters}, this.createPDFOperationCompleted, userState);
        }

        private void OncreatePDFOperationCompleted(object arg)
        {
            if ((this.createPDFCompleted != null))
            {
                System.Web.Services.Protocols.InvokeCompletedEventArgs invokeArgs = ((System.Web.Services.Protocols.InvokeCompletedEventArgs)(arg));
                this.createPDFCompleted(this, new createPDFCompletedEventArgs(invokeArgs.Results, invokeArgs.Error, invokeArgs.Cancelled, invokeArgs.UserState));
            }
        }


        public new void CancelAsync(object userState)
        {
            base.CancelAsync(userState);
        }

        private bool IsLocalFileSystemWebService(string url)
        {
            if (((url == null)
                        || (url == string.Empty)))
            {
                return false;
            }
            System.Uri wsUri = new System.Uri(url);
            if (((wsUri.Port >= 1024)
                        && (string.Compare(wsUri.Host, "localHost", System.StringComparison.OrdinalIgnoreCase) == 0)))
            {
                return true;
            }
            return false;
        }
    }


    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Xml", "4.0.30319.34230")]
    [System.SerializableAttribute()]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    [System.Xml.Serialization.XmlTypeAttribute(Namespace = "/PdfServiceEx")]
    public partial class Parameter
    {

        private string documentIdField;

        private DataGroupMap[] dataGroupMaps;

        public Parameter()
        {

        }

        public string DocumentId
        {
            get
            {
                return this.documentIdField;
            }
            set
            {
                this.documentIdField = value;
            }
        }

        public DataGroupMap[] DataGroupMaps
        {
            get
            {
                return this.dataGroupMaps;
            }
            set
            {
                this.dataGroupMaps = value;
            }
        }
    }

    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Xml", "4.0.30319.34230")]
    [System.SerializableAttribute()]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    [System.Xml.Serialization.XmlTypeAttribute(Namespace = "/PdfServiceEx")]
    public partial class DataGroupMap
    {

        private string groupNameField;

        private ItemData[] itemDataListField;

        /// <remarks/>
        public string GroupName
        {
            get
            {
                return this.groupNameField;
            }
            set
            {
                this.groupNameField = value;
            }
        }

        /// <remarks/>
        public ItemData[] ItemDataList
        {
            get
            {
                return this.itemDataListField;
            }
            set
            {
                this.itemDataListField = value;
            }
        }
    }

    //[System.CodeDom.Compiler.GeneratedCodeAttribute("System.Xml", "4.0.30319.34230")]
    //[System.SerializableAttribute()]
    //[System.Diagnostics.DebuggerStepThroughAttribute()]
    //[System.ComponentModel.DesignerCategoryAttribute("code")]
    //[System.Xml.Serialization.XmlTypeAttribute(Namespace = "/PdfServiceEx")]
    public partial class ItemData
    {

        private string itemNameField;

        private object valueField;

        /// <remarks/>
        public string ItemName
        {
            get
            {
                return this.itemNameField;
            }
            set
            {
                this.itemNameField = value;
            }
        }

        /// <remarks/>
        public object Value
        {
            get
            {
                return this.valueField;
            }
            set
            {
                this.valueField = value;
            }
        }
    }


    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.0.30319.34209")]
    public delegate void createPDFCompletedEventHandler(object sender, createPDFCompletedEventArgs e);


    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.0.30319.34209")]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    public partial class createPDFCompletedEventArgs : System.ComponentModel.AsyncCompletedEventArgs
    {

        private object[] results;

        internal createPDFCompletedEventArgs(object[] results, System.Exception exception, bool cancelled, object userState) :
            base(exception, cancelled, userState)
        {
            this.results = results;
        }


        public byte[] Result
        {
            get
            {
                this.RaiseExceptionIfNecessary();
                return ((byte[])(this.results[0]));
            }
        }
    }
}

#pragma warning restore 1591