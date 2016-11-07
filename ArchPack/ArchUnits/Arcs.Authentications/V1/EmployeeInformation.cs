using ArchPack.ArchUnits.Configuration.V1;
using ArchPack.ArchUnits.Data.Sql.V1;
using ArchPack.Properties;
using Microsoft.Owin;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Security.Principal;
using System.Web;
using System.Web.Configuration;
using System.Web.Security;

namespace ArchPack.ArchUnits.Arcs.Authentications.V1
{
    /// <summary>
    /// ユーザー情報を取得します。
    /// </summary>
    public static class EmployeeInformation
    {
        private static string sql = 
@"SELECT 
    TUSR001.AEMPID as EmployeeID,
    TUSR001.AEMPNO as EmployeeNO,
    TUSR001.AFNM as FirstName,
    TUSR001.ALNM as LastName,
    TUSR001.AFKN as FirstKanaName,
    TUSR001.ALKN as LastKanaName,
    TUSR001.AML as Mail,
    TUSR001.AMOBTEL as MobilePhone,
    TUSR001.AFAX as FAX,
    TUSR001.AGAISEN as ExtensionPhone,
    TUSR001.ANAISEN as InternalPhone,
    TUSR002.AGRPID as GroupID,
    TUSR002.AGRPNO as GroupNo,
    TUSR002.AGRPNM as GroupName,
    TUSR002.ALGRPRYAK as GroupShortName,
    TUSR004.ARLID as RoleID,
    TUSR004.ARLNM as RoleName
FROM 
    TUSR001 INNER JOIN TUSR010 ON 
    TUSR001.AEMPID = TUSR010.AEMPID
    INNER JOIN TUSR002 ON 
    TUSR010.AGRPID = TUSR002.AGRPID
    INNER JOIN TUSR005 ON 
    TUSR005.AEMPID = TUSR001.AEMPID
    INNER JOIN TUSR004 ON
    TUSR004.ARLID = TUSR005.ARLID
WHERE
    (
    LOWER(TUSR001.AML) = LOWER(CONCAT(:UserID/*VARCHAR2(500)*/,'@intelligence.local'))
        OR LOWER(TUSR001.AML) = LOWER(CONCAT(:UserID/*VARCHAR2(500)*/, '@inte.co.jp'))
        OR LOWER(TUSR001.AML) = LOWER(CONCAT(:UserID/*VARCHAR2(500)*/, '@exe.inte.co.jp'))
    )
    AND 
    TUSR010.AMAINGRPFL = '1'
    AND TUSR002.ADLFL = '0'
    AND TUSR010.ADLFL = '0'
    AND TUSR004.ADLFL = '0'
    AND TUSR005.ADLFL = '0'
ORDER BY
    TUSR001.AEMPID";

        /// <summary>
        /// ログインしているユーザーの情報を取得します。
        /// </summary>
        public static Employee GetUserInfo(IIdentity identity)
        {
            //ログインしているユーザーのユーザーIDを取得する。
            string userID = GetAuthenticatedUserID(identity);
            //ログインしているユーザーの情報を取得します。
            return GetAuthenticatedUserInfo(userID);            
        }

        /// <summary>
        /// ログインしているユーザーのユーザーIDを取得する。
        /// </summary>
        /// <returns>ユーザーID</returns>
        private static string GetAuthenticatedUserID(IIdentity identity)
        {            

            if (!identity.IsAuthenticated)
            {
                throw new InvalidOperationException(Resources.UserNotAuthenticated);
            }
            
            string userID = identity.Name;
            if (identity is WindowsIdentity)
            {
                userID = userID.Split('\\').Last();
            }
            
            return userID;
        }

        /// <summary>
        /// ログインしているユーザーの情報を取得します。
        /// </summary>
        /// <returns>ユーザーの情報</returns>
        private static Employee GetAuthenticatedUserInfo(string userID)
        {
            using (EmployeeInformationEntities context = EmployeeInformationEntities.CreateContext())
            {
                FileSqlDefinitionFactory factory = new FileSqlDefinitionFactory("ArchUnits/Authentications/Inteligence/V1/");
                DataQuery query = new DataQuery(context, factory).AppendQuery(sql);

                query.SetParameter("UserID", userID);

                Employee userInfo = query.GetList<Employee>().FirstOrDefault();

                if (userInfo == null)
                {                    
                    throw new InvalidOperationException(Resources.UserNotExist);
                }

                return userInfo;
            }
        }
    }
}