using ArchPack.ArchUnits.Logging.V1;
using ArchPack.ArchUnits.RoleBaseAuth.V1.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ArchPack.Properties;
using ArchPack.ArchUnits.Contracts.V1;
using ArchPack.ArchUnits.Arcs.Data.V1;

namespace ArchPack.ArchUnits.Arcs.Logging.V1
{
    [LogAdapterTypes("ArcsAudit")]
    public class ArcsAuditLogAdapter : ILogAdapter
    {
        private LogConfiguration config;

        public ArcsAuditLogAdapter(LogConfiguration config)
        {
            this.config = config;
        }

        private void OutputLog(LogData data)
        {
            Contract.NotEmpty((string)data.Items[AuditLogData.ScreenIDPropertyKey], AuditLogData.ScreenIDPropertyKey);
            IEnumerable<int> ids = null;
            if (data.Items.ContainsKey(AuditLogData.TargetIDListPropertyKey))
            {
                ids = data.Items[AuditLogData.TargetIDListPropertyKey] as IEnumerable<int>;
            }
            if (ids == null)
            {
                ids = Enumerable.Empty<int>();
            }
            using (ArcsAuditLogEntities context = ArcsAuditLogEntities.CreateContext())
            {
                foreach (int targetID in ids)
                {
                    TSYS001 tSYS001 = new TSYS001()
                    {
                        AADTLOGID = context.NextValFromSequence("SSYS001"),
                        AEMPID = (int)data.Items[AuditLogData.EmpIDPropertyKey],
                        AEXEFLENM = (string)data.Items[AuditLogData.ScreenIDPropertyKey],
                        AOPEFL = (byte)(AuditDivision)data.Items[AuditLogData.DivisionPropertyKey],
                        AGETRSLID = targetID
                    };
                    context.TSYS001.Add(tSYS001);
                }
                context.SaveChanges();
            }
        }

        /// <summary>
        /// Info レベルのログを出力します。
        /// </summary>
        public void Info(LogData data)
        {
            this.OutputLog(data);
        }

        /// <summary>
        /// Debug レベルのログは監査ログでは出力されません。
        /// </summary>
        public void Debug(LogData data)
        {
        }

        /// <summary>
        /// Trace レベルのログは監査ログでは出力されません。
        /// </summary>
        public void Trace(LogData data)
        {
        }

        /// <summary>
        /// Warn レベルのログは監査ログでは出力されません。
        /// </summary>
        public void Warn(LogData data)
        {
        }

        /// <summary>
        /// Error レベルのログは監査ログでは出力されません。
        /// </summary>
        public void Error(LogData data)
        {
        }

        /// <summary>
        /// Fatal レベルのログは監査ログでは出力されません。
        /// </summary>
        public void Fatal(LogData data)
        {
        }
    }
}