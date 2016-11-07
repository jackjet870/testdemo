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

if exists (select name from sys.databases where name = 'AuthSample')
    drop database [AuthSample]
 
declare @device_directory nvarchar(520)
select @device_directory = substring(filename, 1, charindex(N'master.mdf', lower(filename)) - 1)
from master.dbo.sysaltfiles 
where dbid = 1 AND fileid = 1

execute ('create database [AuthSample] on primary
( name = ''AuthSample'', filename = ''' + @device_directory + 'AuthSample.mdf'', size = 5120KB, maxsize = unlimited, filegrowth = 1024KB)
log on
( name = ''AuthSample_log'', filename = ''' + @device_directory + 'AuthSample.ldf'' , size = 1024KB , maxsize = 2048GB , filegrowth = 10%)')
GO

USE [AuthSample]
GO
/****** Object:  Table [dbo].[Applications]    Script Date: 2014/12/05 18:48:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Applications](
	[ApplicationName] [nvarchar](235) NOT NULL,
	[ApplicationId] [uniqueidentifier] NOT NULL,
	[Description] [nvarchar](256) NULL,
PRIMARY KEY CLUSTERED 
(
	[ApplicationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Memberships]    Script Date: 2014/12/05 18:48:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Memberships](
	[ApplicationId] [uniqueidentifier] NOT NULL,
	[UserId] [uniqueidentifier] NOT NULL,
	[Password] [nvarchar](128) NOT NULL,
	[PasswordFormat] [int] NOT NULL,
	[PasswordSalt] [nvarchar](128) NOT NULL,
	[Email] [nvarchar](256) NULL,
	[PasswordQuestion] [nvarchar](256) NULL,
	[PasswordAnswer] [nvarchar](128) NULL,
	[IsApproved] [bit] NOT NULL,
	[IsLockedOut] [bit] NOT NULL,
	[CreateDate] [datetime] NOT NULL,
	[LastLoginDate] [datetime] NOT NULL,
	[LastPasswordChangedDate] [datetime] NOT NULL,
	[LastLockoutDate] [datetime] NOT NULL,
	[FailedPasswordAttemptCount] [int] NOT NULL,
	[FailedPasswordAttemptWindowStart] [datetime] NOT NULL,
	[FailedPasswordAnswerAttemptCount] [int] NOT NULL,
	[FailedPasswordAnswerAttemptWindowsStart] [datetime] NOT NULL,
	[Comment] [nvarchar](256) NULL,
 CONSTRAINT [PK__Membersh__1788CC4C671BA1E7] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Profiles]    Script Date: 2014/12/05 18:48:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Profiles](
	[UserId] [uniqueidentifier] NOT NULL,
	[FirstName] [nvarchar](50) NOT NULL,
	[LastName] [nvarchar](50) NOT NULL,
	[UnitId] [uniqueidentifier] NULL,
	[LastUpdatedDate] [datetimeoffset](7) NOT NULL,
	[Ts] [timestamp] NOT NULL,
 CONSTRAINT [PK__Profiles__1788CC4C50F91CAD] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Roles]    Script Date: 2014/12/05 18:48:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Roles](
	[ApplicationId] [uniqueidentifier] NOT NULL,
	[RoleId] [uniqueidentifier] NOT NULL,
	[RoleName] [nvarchar](256) NOT NULL,
	[Description] [nvarchar](256) NULL,
	[LastUpdatedDate] [datetimeoffset](7) NOT NULL,
	[Ts] [timestamp] NOT NULL,
 CONSTRAINT [PK__Roles__8AFACE1AD3EBF6D8] PRIMARY KEY CLUSTERED 
(
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Units]    Script Date: 2014/12/05 18:48:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Units](
	[UnitId] [uniqueidentifier] NOT NULL,
	[UnitName] [nvarchar](50) NOT NULL,
	[LastUpdatedDate] [datetimeoffset](7) NOT NULL,
	[Ts] [timestamp] NOT NULL,
 CONSTRAINT [PK_Units] PRIMARY KEY CLUSTERED 
(
	[UnitId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Users]    Script Date: 2014/12/05 18:48:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[ApplicationId] [uniqueidentifier] NOT NULL,
	[UserId] [uniqueidentifier] NOT NULL,
	[UserName] [nvarchar](50) NOT NULL,
	[IsAnonymous] [bit] NOT NULL,
	[LastActivityDate] [datetime] NOT NULL,
	[Ts] [timestamp] NOT NULL,
 CONSTRAINT [PK__Users__1788CC4C28D2DD59] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[UsersInRoles]    Script Date: 2014/12/05 18:48:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UsersInRoles](
	[UserId] [uniqueidentifier] NOT NULL,
	[RoleId] [uniqueidentifier] NOT NULL,
	[LastUpdatedDate] [datetimeoffset](7) NOT NULL,
	[Ts] [timestamp] NOT NULL,
 CONSTRAINT [PK__UsersInR__AF2760AD997349EB] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC,
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  View [dbo].[RolesInUsersView]    Script Date: 2014/12/05 18:48:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[RolesInUsersView]
AS
SELECT            
	dbo.Users.UserId, 
	dbo.Users.UserName, 
	dbo.Roles.RoleId, 
	dbo.Roles.RoleName, 
	CASE 
		WHEN dbo.UsersInRoles.UserId IS NULL 
		THEN CAST(0 AS bit) 
		ELSE CAST(1 AS bit) 
	END AS RoleInUser, 
    dbo.UsersInRoles.Ts as UsersInRolesTimestamp
FROM dbo.Users 
CROSS JOIN dbo.Roles 
LEFT OUTER JOIN dbo.UsersInRoles ON dbo.Roles.RoleId = dbo.UsersInRoles.RoleId AND dbo.Users.UserId = dbo.UsersInRoles.UserId


GO
/****** Object:  View [dbo].[UsersInRolesView]    Script Date: 2014/12/05 18:48:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[UsersInRolesView]
AS
SELECT            
	dbo.UsersInRoles.RoleId, 
	dbo.Users.ApplicationId, 
	dbo.Users.UserId, 
	dbo.Users.UserName, 
	dbo.Memberships.Email,
	dbo.Profiles.FirstName, 
	dbo.Profiles.LastName, 
	dbo.Units.UnitId, 
	dbo.Units.UnitName, 
	dbo.UsersInRoles.Ts AS UsersInRolesTimestamp
FROM              
	dbo.Profiles 
INNER JOIN dbo.Users ON dbo.Profiles.UserId = dbo.Users.UserId
INNER JOIN dbo.Memberships ON dbo.Users.UserId = dbo.Memberships.UserId
RIGHT OUTER JOIN dbo.UsersInRoles ON dbo.Users.UserId = dbo.UsersInRoles.UserId 
LEFT OUTER JOIN dbo.Units ON dbo.Profiles.UnitId = dbo.Units.UnitId
GO
/****** Object:  View [dbo].[UsersView]    Script Date: 2014/12/05 18:48:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[UsersView]
AS
SELECT
	dbo.Users.UserId,
	dbo.Users.UserName,
	dbo.Users.Ts AS UsersTimestamp, 
	dbo.Memberships.Email,
	dbo.Profiles.FirstName, 
	dbo.Profiles.LastName, 
	dbo.Profiles.LastUpdatedDate AS ProfilesLastUpdatedDate, 
	dbo.Profiles.Ts AS ProfilesTimestamp, 
	dbo.Units.UnitId, 
	dbo.Units.UnitName, 
	dbo.Units.LastUpdatedDate AS UnitsLastUpdatedDate, 
	dbo.Units.Ts AS UnitsTimestamp, 
	dbo.Memberships.Password
FROM
	dbo.Users 
INNER JOIN dbo.Memberships ON dbo.Users.ApplicationId = dbo.Memberships.ApplicationId AND dbo.Users.UserId = dbo.Memberships.UserId
LEFT OUTER JOIN dbo.Profiles ON dbo.Users.UserId = dbo.Profiles.UserId
LEFT OUTER JOIN dbo.Units ON dbo.Profiles.UnitId = dbo.Units.UnitId

GO
/****** Object:  Index [IDX_UserName]    Script Date: 2014/12/05 18:48:46 ******/
CREATE NONCLUSTERED INDEX [IDX_UserName] ON [dbo].[Users]
(
	[UserName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Memberships]  WITH CHECK ADD  CONSTRAINT [MembershipApplication] FOREIGN KEY([ApplicationId])
REFERENCES [dbo].[Applications] ([ApplicationId])
GO
ALTER TABLE [dbo].[Memberships] CHECK CONSTRAINT [MembershipApplication]
GO
ALTER TABLE [dbo].[Memberships]  WITH CHECK ADD  CONSTRAINT [MembershipUser] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[Memberships] CHECK CONSTRAINT [MembershipUser]
GO
ALTER TABLE [dbo].[Profiles]  WITH CHECK ADD  CONSTRAINT [UserProfile] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[Profiles] CHECK CONSTRAINT [UserProfile]
GO
ALTER TABLE [dbo].[Roles]  WITH CHECK ADD  CONSTRAINT [RoleApplication] FOREIGN KEY([ApplicationId])
REFERENCES [dbo].[Applications] ([ApplicationId])
GO
ALTER TABLE [dbo].[Roles] CHECK CONSTRAINT [RoleApplication]
GO
ALTER TABLE [dbo].[Users]  WITH CHECK ADD  CONSTRAINT [UserApplication] FOREIGN KEY([ApplicationId])
REFERENCES [dbo].[Applications] ([ApplicationId])
GO
ALTER TABLE [dbo].[Users] CHECK CONSTRAINT [UserApplication]
GO
ALTER TABLE [dbo].[UsersInRoles]  WITH CHECK ADD  CONSTRAINT [UsersInRoleRole] FOREIGN KEY([RoleId])
REFERENCES [dbo].[Roles] ([RoleId])
GO
ALTER TABLE [dbo].[UsersInRoles] CHECK CONSTRAINT [UsersInRoleRole]
GO
ALTER TABLE [dbo].[UsersInRoles]  WITH CHECK ADD  CONSTRAINT [UsersInRoleUser] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[UsersInRoles] CHECK CONSTRAINT [UsersInRoleUser]
GO
USE [master]
GO
ALTER DATABASE [AuthSample] SET  READ_WRITE 
GO