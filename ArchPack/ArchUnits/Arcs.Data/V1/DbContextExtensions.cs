﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using Oracle.ManagedDataAccess.Client;

namespace ArchPack.ArchUnits.Arcs.Data.V1
{
    public static class DbContextExtensions
    {
        /// <summary>
        /// 対象のシーケンスの次の値を取得します。
        /// </summary>
        /// <param name="context"><see cref="DbContext"/></param>
        /// <param name="sequenceName">シーケンス名</param>
        /// <returns>シーケンスの次の値</returns>
        public static int NextValFromSequence(this DbContext context, string sequenceName)
        {
            return context.Database.SqlQuery<int>("SELECT " + sequenceName + ".NEXTVAL FROM DUAL").SingleOrDefault();
        }
    }
}