USE [master]
GO

DECLARE @proc smallint
DECLARE sysproc_cur CURSOR FAST_FORWARD FOR
 SELECT spid FROM master..sysprocesses WITH(NOLOCK)
OPEN sysproc_cur
FETCH NEXT FROM sysproc_cur INTO @proc
WHILE (@@FETCH_STATUS <> -1)
BEGIN
   EXEC('KILL ' + @proc)
   FETCH NEXT FROM sysproc_cur INTO @proc
END
CLOSE sysproc_cur
DEALLOCATE sysproc_cur

declare @db_name varchar(255)
SET @db_name = 'GenerationToolTest'
 
IF exists (select name from sys.databases where name = @db_name)
BEGIN
    execute('drop database ' + @db_name)
END

declare @device_directory nvarchar(520)
select @device_directory = substring(filename, 1, charindex(N'master.mdf', lower(filename)) - 1)
from master.dbo.sysaltfiles 
where dbid = 1 AND fileid = 1
 
execute ('create database [' + @db_name + '] on primary
( name = ''' + @db_name + ''', filename = ''' + @device_directory + @db_name + '.mdf'', size = 5120KB, maxsize = unlimited, filegrowth = 1024KB)
log on
( name = ''' + @db_name + '_log'', filename = ''' + @device_directory + @db_name + '_log.ldf'' , size = 1024KB , maxsize = 2048GB , filegrowth = 10%)')
GO

ALTER DATABASE [GenerationToolTest] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [GenerationToolTest] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [GenerationToolTest] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [GenerationToolTest] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [GenerationToolTest] SET ARITHABORT OFF 
GO
ALTER DATABASE [GenerationToolTest] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [GenerationToolTest] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [GenerationToolTest] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [GenerationToolTest] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [GenerationToolTest] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [GenerationToolTest] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [GenerationToolTest] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [GenerationToolTest] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [GenerationToolTest] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [GenerationToolTest] SET  DISABLE_BROKER 
GO
ALTER DATABASE [GenerationToolTest] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [GenerationToolTest] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [GenerationToolTest] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [GenerationToolTest] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [GenerationToolTest] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [GenerationToolTest] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [GenerationToolTest] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [GenerationToolTest] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [GenerationToolTest] SET  MULTI_USER 
GO
ALTER DATABASE [GenerationToolTest] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [GenerationToolTest] SET DB_CHAINING OFF 
GO
ALTER DATABASE [GenerationToolTest] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [GenerationToolTest] SET TARGET_RECOVERY_TIME = 0 SECONDS 
GO

USE [GenerationToolTest]
GO
/****** Object:  Table [dbo].[ProjectItems]    Script Date: 2015/05/14 6:55:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProjectItems](
	[ProjectItemId] [int] IDENTITY(1,1) NOT NULL,
	[ProjectId] [int] NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[ProjectItemType] [nvarchar](50) NOT NULL,
	[Note] [nvarchar](max) NULL,
	[Detail] [nvarchar](max) NULL,
	[CreatedUser] [nvarchar](50) NULL,
	[CreatedDate] [datetimeoffset](7) NULL,
	[UpdatedUser] [nvarchar](50) NULL,
	[UpdatedDate] [datetimeoffset](7) NULL,
	[ts] [timestamp] NOT NULL,
 CONSTRAINT [PK_ProjectItems] PRIMARY KEY CLUSTERED 
(
	[ProjectItemId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET IDENTITY_INSERT [dbo].[ProjectItems] ON 

GO
INSERT [dbo].[ProjectItems] ([ProjectItemId], [ProjectId], [Name], [ProjectItemType], [Note], [Detail], [CreatedUser], [CreatedDate], [UpdatedUser], [UpdatedDate]) VALUES (1, 1, N'UIPattern', N'UIPattern', N'画面パターンです', N'{"Name":"UIPattern","Note":"Define ui patterns","ItemType":"UIPattern","Items":[{"Name":"SearchList","Note":"","DisplaySections":[{"Name":"Header","DisplayItemType":"SingleItems"},{"Name":"Detail","DisplayItemType":"Table"}],"HtmlTemplate":{"Files":["~/ServiceUnits/Develop/V1/Templates/SearchList/SearchList.aspx"]},"JsTemplate":{"Files":["~/ServiceUnits/Develop/V1/Templates/SearchList/SearchList.js"]},"TestCaseTemplate":{"Files":["~/ServiceUnits/Develop/V1/Templates/SearchList/testcase.json"]}},{"Name":"HeaderDetail","Note":"","DisplaySections":[{"Name":"Header","DisplayItemType":"SingleItems"},{"Name":"Detail","DisplayItemType":"Table"}],"HtmlTemplate":{"Files":["~/ServiceUnits/Develop/V1/Templates/HeaderDetail/HeaderDetail.aspx"]},"JsTemplate":{"Files":["~/ServiceUnits/Develop/V1/Templates/HeaderDetail/HeaderDetail.js"]},"TestCaseTemplate":{"Files":["~/ServiceUnits/Develop/V1/Templates/HeaderDetail/testcase.json"]}}]}', N'Admin', NULL, NULL, NULL)
GO
INSERT [dbo].[ProjectItems] ([ProjectItemId], [ProjectId], [Name], [ProjectItemType], [Note], [Detail], [CreatedUser], [CreatedDate], [UpdatedUser], [UpdatedDate]) VALUES (2, 2, N'UIPattern', N'UIPattern', N'画面パターンです', N'{"Name":"UIPattern","Note":"Define ui patterns","ItemType":"UIPattern","Items":[{"Name":"SearchList","Note":"","DisplaySections":[{"Name":"Header","DisplayItemType":"SingleItems"},{"Name":"Detail","DisplayItemType":"Table"}],"HtmlTemplate":{"Files":["~/ServiceUnits/Develop/V1/Templates/SearchList/SearchList.aspx"]},"JsTemplate":{"Files":["~/ServiceUnits/Develop/V1/Templates/SearchList/SearchList.js"]},"TestCaseTemplate":{"Files":["~/ServiceUnits/Develop/V1/Templates/SearchList/testcase.json"]}},{"Name":"HeaderDetail","Note":"","DisplaySections":[{"Name":"Header","DisplayItemType":"SingleItems"},{"Name":"Detail","DisplayItemType":"Table"}],"HtmlTemplate":{"Files":["~/ServiceUnits/Develop/V1/Templates/HeaderDetail/HeaderDetail.aspx"]},"JsTemplate":{"Files":["~/ServiceUnits/Develop/V1/Templates/HeaderDetail/HeaderDetail.js"]},"TestCaseTemplate":{"Files":["~/ServiceUnits/Develop/V1/Templates/HeaderDetail/testcase.json"]}}]}', N'Admin', NULL, NULL, NULL)
GO
INSERT [dbo].[ProjectItems] ([ProjectItemId], [ProjectId], [Name], [ProjectItemType], [Note], [Detail], [CreatedUser], [CreatedDate], [UpdatedUser], [UpdatedDate]) VALUES (3, 0, N'ControlTypes', N'MetaData.ControlTypes', N'UIで利用するコントロール型の定義です', N'[{"Name":"Text","Data":{}},{"Name":"MultiLineText","Data":{}},{"Name":"DropdownList","Data":{}},{"Name":"List","Data":{}},{"Name":"Label","Data":{}}]', N'Admin', NULL, NULL, NULL)
GO
INSERT [dbo].[ProjectItems] ([ProjectItemId], [ProjectId], [Name], [ProjectItemType], [Note], [Detail], [CreatedUser], [CreatedDate], [UpdatedUser], [UpdatedDate]) VALUES (4, 0, N'Validations', N'MetaData.Validations', N'バリデーションの定義です。', N'[{"Name":"Required","Data":{}},{"Name":"MaxLength","Data":{}},{"Name":"MinLength","Data":{}},{"Name":"Max","Data":{}},{"Name":"Min","Data":{}},{"Name":"Format","Data":{}},{"Name":"Regex","Data":{}}]', N'Admin', NULL, NULL, NULL)
GO
INSERT [dbo].[ProjectItems] ([ProjectItemId], [ProjectId], [Name], [ProjectItemType], [Note], [Detail], [CreatedUser], [CreatedDate], [UpdatedUser], [UpdatedDate]) VALUES (5, 0, N'DataTypes', N'MetaData.DataTypes', N'データ型の定義です。', N'[{"Name":"Number","Contraints":{}},{"Name":"String","Contraints":{}},{"Name":"DateTime","Contraints":{}},{"Name":"Boolean","Contraints":{}}]', N'Admin', NULL, NULL, NULL)
GO
INSERT [dbo].[ProjectItems] ([ProjectItemId], [ProjectId], [Name], [ProjectItemType], [Note], [Detail], [CreatedUser], [CreatedDate], [UpdatedUser], [UpdatedDate]) VALUES (6, 1, N'Company', N'DataModel', N'Company Information', N'{"Name":"Company","Note":"Company Information","ItemType":"DataModel","Items":[{"Name":"ID","DataType":"Integer","Require":"on"},{"Name":"Name","DataType":"String","Require":"on"},{"Name":"Address","DataType":"String","Require":null}]}', NULL, NULL, N'Admin', CAST(N'2015-05-21T13:45:42.0000000+09:00' AS DateTimeOffset))
GO
SET IDENTITY_INSERT [dbo].[ProjectItems] OFF
GO

/****** Object:  Table [dbo].[Projects]    Script Date: 2015/05/14 6:55:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Projects](
	[ProjectId] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Note] [nvarchar](max) NULL,
	[CreatedUser] [nvarchar](50) NULL,
	[CreatedDate] [datetimeoffset](7) NULL,
	[UpdatedUser] [nvarchar](50) NULL,
	[UpdatedDate] [datetimeoffset](7) NULL,
	[ts] [timestamp] NOT NULL,
 CONSTRAINT [PK_Projects] PRIMARY KEY CLUSTERED 
(
	[ProjectId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET IDENTITY_INSERT [dbo].[Projects] ON 

GO
INSERT [dbo].[Projects] ([ProjectId], [Name], [Note], [CreatedUser], [CreatedDate], [UpdatedUser], [UpdatedDate]) VALUES (1, N'アプリケーション生成プロジェクト', N'アプリケーションのメタデータを定義し、コードおよびドキュメントを生成するツールを開発します。', NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[Projects] ([ProjectId], [Name], [Note], [CreatedUser], [CreatedDate], [UpdatedUser], [UpdatedDate]) VALUES (2, N'サンプルプロジェクト', N'サンプルのプロジェクトです', NULL, NULL, NULL, NULL)
GO
SET IDENTITY_INSERT [dbo].[Projects] OFF
GO
USE [master]
GO
ALTER DATABASE [GenerationToolTest] SET  READ_WRITE 
GO
