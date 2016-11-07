USE [master]
GO
/****** Object:  Database [AuthSample]    Script Date: 2015/04/17 13:57:50 ******/
CREATE DATABASE [AuthSample]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'AuthSample', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL11.MSSQLSERVER\MSSQL\DATA\AuthSample.mdf' , SIZE = 5120KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'AuthSample_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL11.MSSQLSERVER\MSSQL\DATA\AuthSample.ldf' , SIZE = 1024KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO
ALTER DATABASE [AuthSample] SET COMPATIBILITY_LEVEL = 110
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [AuthSample].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [AuthSample] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [AuthSample] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [AuthSample] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [AuthSample] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [AuthSample] SET ARITHABORT OFF 
GO
ALTER DATABASE [AuthSample] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [AuthSample] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [AuthSample] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [AuthSample] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [AuthSample] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [AuthSample] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [AuthSample] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [AuthSample] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [AuthSample] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [AuthSample] SET  ENABLE_BROKER 
GO
ALTER DATABASE [AuthSample] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [AuthSample] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [AuthSample] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [AuthSample] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [AuthSample] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [AuthSample] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [AuthSample] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [AuthSample] SET RECOVERY FULL 
GO
ALTER DATABASE [AuthSample] SET  MULTI_USER 
GO
ALTER DATABASE [AuthSample] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [AuthSample] SET DB_CHAINING OFF 
GO
ALTER DATABASE [AuthSample] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [AuthSample] SET TARGET_RECOVERY_TIME = 0 SECONDS 
GO
EXEC sys.sp_db_vardecimal_storage_format N'AuthSample', N'ON'
GO
USE [AuthSample]
GO
/****** Object:  User [ARCHWAY\SQLAdmin]    Script Date: 2015/04/17 13:57:51 ******/
CREATE USER [ARCHWAY\SQLAdmin] FOR LOGIN [ARCHWAY\SQLAdmin] WITH DEFAULT_SCHEMA=[dbo]
GO
ALTER ROLE [db_owner] ADD MEMBER [ARCHWAY\SQLAdmin]
GO
/****** Object:  Table [dbo].[Applications]    Script Date: 2015/04/17 13:57:52 ******/
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
/****** Object:  Table [dbo].[Memberships]    Script Date: 2015/04/17 13:57:52 ******/
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
/****** Object:  Table [dbo].[Profiles]    Script Date: 2015/04/17 13:57:52 ******/
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
/****** Object:  Table [dbo].[Roles]    Script Date: 2015/04/17 13:57:52 ******/
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
/****** Object:  Table [dbo].[Units]    Script Date: 2015/04/17 13:57:52 ******/
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
/****** Object:  Table [dbo].[Users]    Script Date: 2015/04/17 13:57:52 ******/
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
/****** Object:  Table [dbo].[UsersInRoles]    Script Date: 2015/04/17 13:57:52 ******/
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
/****** Object:  View [dbo].[RolesInUsersView]    Script Date: 2015/04/17 13:57:52 ******/
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
/****** Object:  View [dbo].[UsersInRolesView]    Script Date: 2015/04/17 13:57:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[UsersInRolesView]
AS
SELECT            
	dbo.UsersInRoles.RoleId, 
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
/****** Object:  View [dbo].[UsersView]    Script Date: 2015/04/17 13:57:52 ******/
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
INSERT [dbo].[Applications] ([ApplicationName], [ApplicationId], [Description]) VALUES (N'/', N'4fb08201-795b-4a09-9111-43bab1a5c399', NULL)
INSERT [dbo].[Memberships] ([ApplicationId], [UserId], [Password], [PasswordFormat], [PasswordSalt], [Email], [PasswordQuestion], [PasswordAnswer], [IsApproved], [IsLockedOut], [CreateDate], [LastLoginDate], [LastPasswordChangedDate], [LastLockoutDate], [FailedPasswordAttemptCount], [FailedPasswordAttemptWindowStart], [FailedPasswordAnswerAttemptCount], [FailedPasswordAnswerAttemptWindowsStart], [Comment]) VALUES (N'4fb08201-795b-4a09-9111-43bab1a5c399', N'b02f3854-9170-43e8-a14d-14f4309cdc6a', N'ImUwIw1sMlnG99+R5RBHZ1lNCvI/4JhvJGvQ+WPGv3+ebJ9xa8TvtixSpXiM1oXh', 2, N'zj5JVC+VkDO1ie3EW0JZ8A==', N'sae@archway.co.jp', NULL, NULL, 1, 0, CAST(N'2015-02-26 01:01:23.337' AS DateTime), CAST(N'2015-02-26 01:01:23.337' AS DateTime), CAST(N'2015-02-26 01:01:23.337' AS DateTime), CAST(N'1754-01-01 00:00:00.000' AS DateTime), 0, CAST(N'1754-01-01 00:00:00.000' AS DateTime), 0, CAST(N'1754-01-01 00:00:00.000' AS DateTime), NULL)
INSERT [dbo].[Memberships] ([ApplicationId], [UserId], [Password], [PasswordFormat], [PasswordSalt], [Email], [PasswordQuestion], [PasswordAnswer], [IsApproved], [IsLockedOut], [CreateDate], [LastLoginDate], [LastPasswordChangedDate], [LastLockoutDate], [FailedPasswordAttemptCount], [FailedPasswordAttemptWindowStart], [FailedPasswordAnswerAttemptCount], [FailedPasswordAnswerAttemptWindowsStart], [Comment]) VALUES (N'4fb08201-795b-4a09-9111-43bab1a5c399', N'6714612d-01c1-422b-b49c-1c470dacc634', N'NsmioOqzCPsjyybCPTU5gErCdzUccW+3m9M6vF3Gx2s4DMedCCF8WheeCjQL3Mkb', 2, N'BAD9SmiQoMK2VsBm6dMdPg==', N'admin@aspnet15.co.jp', NULL, NULL, 1, 0, CAST(N'2014-12-09 09:10:51.553' AS DateTime), CAST(N'2015-04-17 04:55:50.430' AS DateTime), CAST(N'2014-12-09 09:11:41.710' AS DateTime), CAST(N'1754-01-01 00:00:00.000' AS DateTime), 0, CAST(N'1754-01-01 00:00:00.000' AS DateTime), 0, CAST(N'1754-01-01 00:00:00.000' AS DateTime), NULL)
INSERT [dbo].[Memberships] ([ApplicationId], [UserId], [Password], [PasswordFormat], [PasswordSalt], [Email], [PasswordQuestion], [PasswordAnswer], [IsApproved], [IsLockedOut], [CreateDate], [LastLoginDate], [LastPasswordChangedDate], [LastLockoutDate], [FailedPasswordAttemptCount], [FailedPasswordAttemptWindowStart], [FailedPasswordAnswerAttemptCount], [FailedPasswordAnswerAttemptWindowsStart], [Comment]) VALUES (N'4fb08201-795b-4a09-9111-43bab1a5c399', N'7c57c6a4-1e9f-4f58-83fd-4556a7a1d9b4', N'/cU8rSiDWzX68V2bUoMdNr7GWIq4g5y6hESSozrnY/wO/JURdaTy9AuCAtTry5e0', 2, N'p11VAxoP09Nt34B1n0JtTA==', N'nokuda@archway.co.jp', NULL, NULL, 1, 0, CAST(N'2015-02-26 00:59:59.413' AS DateTime), CAST(N'2015-04-17 02:27:24.530' AS DateTime), CAST(N'2015-02-26 00:59:59.413' AS DateTime), CAST(N'1754-01-01 00:00:00.000' AS DateTime), 0, CAST(N'1754-01-01 00:00:00.000' AS DateTime), 0, CAST(N'1754-01-01 00:00:00.000' AS DateTime), NULL)
INSERT [dbo].[Memberships] ([ApplicationId], [UserId], [Password], [PasswordFormat], [PasswordSalt], [Email], [PasswordQuestion], [PasswordAnswer], [IsApproved], [IsLockedOut], [CreateDate], [LastLoginDate], [LastPasswordChangedDate], [LastLockoutDate], [FailedPasswordAttemptCount], [FailedPasswordAttemptWindowStart], [FailedPasswordAnswerAttemptCount], [FailedPasswordAnswerAttemptWindowsStart], [Comment]) VALUES (N'4fb08201-795b-4a09-9111-43bab1a5c399', N'7e2a27ad-83a9-4725-952c-6abb531f2f19', N'dzKsOHe9GPNz/rR11vnKydFssQEWVGEDD4bQg36yke5acAbAkvU8rBXl1I1bLS6O', 2, N'hDT02UmH4BxR0dCDtTPuKA==', N'k-maru@archway.co.jp', NULL, NULL, 1, 0, CAST(N'2015-02-27 02:15:18.143' AS DateTime), CAST(N'2015-02-27 12:11:05.713' AS DateTime), CAST(N'2015-02-27 02:15:18.143' AS DateTime), CAST(N'1754-01-01 00:00:00.000' AS DateTime), 0, CAST(N'1754-01-01 00:00:00.000' AS DateTime), 0, CAST(N'1754-01-01 00:00:00.000' AS DateTime), NULL)
INSERT [dbo].[Memberships] ([ApplicationId], [UserId], [Password], [PasswordFormat], [PasswordSalt], [Email], [PasswordQuestion], [PasswordAnswer], [IsApproved], [IsLockedOut], [CreateDate], [LastLoginDate], [LastPasswordChangedDate], [LastLockoutDate], [FailedPasswordAttemptCount], [FailedPasswordAttemptWindowStart], [FailedPasswordAnswerAttemptCount], [FailedPasswordAnswerAttemptWindowsStart], [Comment]) VALUES (N'4fb08201-795b-4a09-9111-43bab1a5c399', N'c09a972d-4edd-43fe-b063-83a26bf085c1', N'Aazj+6kC6UGi3we42blDvROc9lp9t+kolWcGmD50/RXSopuGlVHKLgVXodK48F3A', 2, N'iJHIipTLrMx0zRzKy4qytQ==', N'arcs@archway.co.jp', NULL, NULL, 1, 0, CAST(N'2015-04-08 23:52:32.053' AS DateTime), CAST(N'2015-04-09 11:47:35.993' AS DateTime), CAST(N'2015-04-08 23:52:32.053' AS DateTime), CAST(N'1754-01-01 00:00:00.000' AS DateTime), 0, CAST(N'1754-01-01 00:00:00.000' AS DateTime), 0, CAST(N'1754-01-01 00:00:00.000' AS DateTime), NULL)
INSERT [dbo].[Memberships] ([ApplicationId], [UserId], [Password], [PasswordFormat], [PasswordSalt], [Email], [PasswordQuestion], [PasswordAnswer], [IsApproved], [IsLockedOut], [CreateDate], [LastLoginDate], [LastPasswordChangedDate], [LastLockoutDate], [FailedPasswordAttemptCount], [FailedPasswordAttemptWindowStart], [FailedPasswordAnswerAttemptCount], [FailedPasswordAnswerAttemptWindowsStart], [Comment]) VALUES (N'4fb08201-795b-4a09-9111-43bab1a5c399', N'4c67d75a-3356-446b-9b96-8b404bbeca66', N'EaFLzMyKbbtybbLGKZOVV1tXSjn1CoUMWACvG8RBkieQAxfNU3Lq527cv07w8wgL', 2, N'1PtqZy6DOGEg6dGxwTnSuQ==', N'guest@aspnet15.co.jp', NULL, NULL, 1, 0, CAST(N'2014-12-09 09:12:49.893' AS DateTime), CAST(N'2014-12-09 09:12:59.617' AS DateTime), CAST(N'2014-12-10 01:04:21.130' AS DateTime), CAST(N'1754-01-01 00:00:00.000' AS DateTime), 0, CAST(N'1754-01-01 00:00:00.000' AS DateTime), 0, CAST(N'1754-01-01 00:00:00.000' AS DateTime), NULL)
INSERT [dbo].[Memberships] ([ApplicationId], [UserId], [Password], [PasswordFormat], [PasswordSalt], [Email], [PasswordQuestion], [PasswordAnswer], [IsApproved], [IsLockedOut], [CreateDate], [LastLoginDate], [LastPasswordChangedDate], [LastLockoutDate], [FailedPasswordAttemptCount], [FailedPasswordAttemptWindowStart], [FailedPasswordAnswerAttemptCount], [FailedPasswordAnswerAttemptWindowsStart], [Comment]) VALUES (N'4fb08201-795b-4a09-9111-43bab1a5c399', N'c0af8434-2b63-4c7a-a8a0-8b66fb6960d8', N'Htc4GGeVzc8peE4dP7oFoAMPOYInCRRrU3yILzIvN+gbyAlnXCJct57lqjPkcT33', 2, N'Ech7IBvJRMrBsn02uTLUug==', N'tsune@archway.co.j', NULL, NULL, 1, 0, CAST(N'2015-02-27 02:13:01.970' AS DateTime), CAST(N'2015-03-04 21:01:48.837' AS DateTime), CAST(N'2015-02-27 02:13:01.970' AS DateTime), CAST(N'1754-01-01 00:00:00.000' AS DateTime), 0, CAST(N'1754-01-01 00:00:00.000' AS DateTime), 0, CAST(N'1754-01-01 00:00:00.000' AS DateTime), NULL)
INSERT [dbo].[Memberships] ([ApplicationId], [UserId], [Password], [PasswordFormat], [PasswordSalt], [Email], [PasswordQuestion], [PasswordAnswer], [IsApproved], [IsLockedOut], [CreateDate], [LastLoginDate], [LastPasswordChangedDate], [LastLockoutDate], [FailedPasswordAttemptCount], [FailedPasswordAttemptWindowStart], [FailedPasswordAnswerAttemptCount], [FailedPasswordAnswerAttemptWindowsStart], [Comment]) VALUES (N'4fb08201-795b-4a09-9111-43bab1a5c399', N'a387e13c-d37b-4da0-a9a0-c8160d538462', N'0uHDNTf3q0iWqdpLK7HgpTmBrkAOY/+MvKPfPlYdg9y3SvXcY5aSlQ5VgzhmlQ4V', 2, N'SLlTUCqhbsSvrUNok5DnVg==', N'hmoriya@archway.co.jp', NULL, NULL, 1, 0, CAST(N'2015-02-26 01:00:58.350' AS DateTime), CAST(N'2015-02-26 01:00:58.350' AS DateTime), CAST(N'2015-02-26 01:00:58.350' AS DateTime), CAST(N'1754-01-01 00:00:00.000' AS DateTime), 0, CAST(N'1754-01-01 00:00:00.000' AS DateTime), 0, CAST(N'1754-01-01 00:00:00.000' AS DateTime), NULL)
INSERT [dbo].[Memberships] ([ApplicationId], [UserId], [Password], [PasswordFormat], [PasswordSalt], [Email], [PasswordQuestion], [PasswordAnswer], [IsApproved], [IsLockedOut], [CreateDate], [LastLoginDate], [LastPasswordChangedDate], [LastLockoutDate], [FailedPasswordAttemptCount], [FailedPasswordAttemptWindowStart], [FailedPasswordAnswerAttemptCount], [FailedPasswordAnswerAttemptWindowsStart], [Comment]) VALUES (N'4fb08201-795b-4a09-9111-43bab1a5c399', N'211bb5cf-878d-4f68-8f13-f24a61d3e1aa', N'qsC6L6k3GhM1LVeiaaxMeAJikL0rI54cTBYV4pT8eldg2mMklfB8aYeZV4Lv51pP', 2, N'oAqvrD2CukUEkDktqErNiw==', N'amimata@archway.co.jp', NULL, NULL, 1, 0, CAST(N'2015-02-26 00:59:40.790' AS DateTime), CAST(N'2015-04-16 07:36:08.137' AS DateTime), CAST(N'2015-02-26 00:59:40.790' AS DateTime), CAST(N'1754-01-01 00:00:00.000' AS DateTime), 0, CAST(N'1754-01-01 00:00:00.000' AS DateTime), 0, CAST(N'1754-01-01 00:00:00.000' AS DateTime), NULL)
INSERT [dbo].[Memberships] ([ApplicationId], [UserId], [Password], [PasswordFormat], [PasswordSalt], [Email], [PasswordQuestion], [PasswordAnswer], [IsApproved], [IsLockedOut], [CreateDate], [LastLoginDate], [LastPasswordChangedDate], [LastLockoutDate], [FailedPasswordAttemptCount], [FailedPasswordAttemptWindowStart], [FailedPasswordAnswerAttemptCount], [FailedPasswordAnswerAttemptWindowsStart], [Comment]) VALUES (N'4fb08201-795b-4a09-9111-43bab1a5c399', N'c184ebdf-8f20-4a03-9aa1-f80413b1e10f', N'2YNePgb2GJOxkv/R1e7FhZbrFiJb46ZPdjXTEjfUFslL7BVjcuEQ71324MVNCEvr', 2, N'NSvtdS546Q2j2oCRyeWTdw==', N'kasuya@archway.co.jp', NULL, NULL, 1, 0, CAST(N'2015-02-26 01:00:32.270' AS DateTime), CAST(N'2015-02-26 01:00:32.270' AS DateTime), CAST(N'2015-02-26 01:00:32.270' AS DateTime), CAST(N'1754-01-01 00:00:00.000' AS DateTime), 0, CAST(N'1754-01-01 00:00:00.000' AS DateTime), 0, CAST(N'1754-01-01 00:00:00.000' AS DateTime), NULL)
INSERT [dbo].[Profiles] ([UserId], [FirstName], [LastName], [UnitId], [LastUpdatedDate]) VALUES (N'b02f3854-9170-43e8-a14d-14f4309cdc6a', N'Sae', N'Wakamatsu', NULL, CAST(N'2015-02-26T10:01:23.5093791+09:00' AS DateTimeOffset))
INSERT [dbo].[Profiles] ([UserId], [FirstName], [LastName], [UnitId], [LastUpdatedDate]) VALUES (N'6714612d-01c1-422b-b49c-1c470dacc634', N'管理者', N'システム', N'c3ba8900-7331-4f7a-b508-3880f69e7ee3', CAST(N'2014-12-09T18:11:41.8889383+09:00' AS DateTimeOffset))
INSERT [dbo].[Profiles] ([UserId], [FirstName], [LastName], [UnitId], [LastUpdatedDate]) VALUES (N'7c57c6a4-1e9f-4f58-83fd-4556a7a1d9b4', N'Naoto', N'Okuda', NULL, CAST(N'2015-02-26T09:59:59.5531759+09:00' AS DateTimeOffset))
INSERT [dbo].[Profiles] ([UserId], [FirstName], [LastName], [UnitId], [LastUpdatedDate]) VALUES (N'7e2a27ad-83a9-4725-952c-6abb531f2f19', N'Kazuhide', N'Maruyama', NULL, CAST(N'2015-02-27T11:15:18.2220784+09:00' AS DateTimeOffset))
INSERT [dbo].[Profiles] ([UserId], [FirstName], [LastName], [UnitId], [LastUpdatedDate]) VALUES (N'c09a972d-4edd-43fe-b063-83a26bf085c1', N'デモユーザー', N'ARCS', NULL, CAST(N'2015-04-09T08:52:32.8968819+09:00' AS DateTimeOffset))
INSERT [dbo].[Profiles] ([UserId], [FirstName], [LastName], [UnitId], [LastUpdatedDate]) VALUES (N'4c67d75a-3356-446b-9b96-8b404bbeca66', N'ユーザー', N'ゲスト', N'c3ba8900-7331-4f7a-b508-3880f69e7ee3', CAST(N'2014-12-09T18:13:41.5529818+09:00' AS DateTimeOffset))
INSERT [dbo].[Profiles] ([UserId], [FirstName], [LastName], [UnitId], [LastUpdatedDate]) VALUES (N'c0af8434-2b63-4c7a-a8a0-8b66fb6960d8', N'Tsunefumi', N'Nakanishi', NULL, CAST(N'2015-02-27T11:13:03.5648180+09:00' AS DateTimeOffset))
INSERT [dbo].[Profiles] ([UserId], [FirstName], [LastName], [UnitId], [LastUpdatedDate]) VALUES (N'a387e13c-d37b-4da0-a9a0-c8160d538462', N'Hideharu', N'Moriya', NULL, CAST(N'2015-02-26T10:00:58.5205036+09:00' AS DateTimeOffset))
INSERT [dbo].[Profiles] ([UserId], [FirstName], [LastName], [UnitId], [LastUpdatedDate]) VALUES (N'211bb5cf-878d-4f68-8f13-f24a61d3e1aa', N'Aya', N'Mimata', NULL, CAST(N'2015-02-26T09:59:41.6025232+09:00' AS DateTimeOffset))
INSERT [dbo].[Profiles] ([UserId], [FirstName], [LastName], [UnitId], [LastUpdatedDate]) VALUES (N'c184ebdf-8f20-4a03-9aa1-f80413b1e10f', N'Kasuya', N'Yoko', NULL, CAST(N'2015-02-26T10:00:32.4726144+09:00' AS DateTimeOffset))
INSERT [dbo].[Roles] ([ApplicationId], [RoleId], [RoleName], [Description], [LastUpdatedDate]) VALUES (N'4fb08201-795b-4a09-9111-43bab1a5c399', N'adeae4e9-0a5c-4a16-af59-35804012be5b', N'Admin', N'アプリケーションに完全なアクセス権があります。', CAST(N'2014-12-09T18:42:07.4390742+09:00' AS DateTimeOffset))
INSERT [dbo].[Roles] ([ApplicationId], [RoleId], [RoleName], [Description], [LastUpdatedDate]) VALUES (N'4fb08201-795b-4a09-9111-43bab1a5c399', N'aade0cf6-4ef9-4464-9d50-e58786166d8e', N'Users', N'ユーザーが、システム全体に及ぶ変更を間違ってまたは故意に行うことを防ぎます。', CAST(N'2014-12-09T18:42:07.5270402+09:00' AS DateTimeOffset))
INSERT [dbo].[Units] ([UnitId], [UnitName], [LastUpdatedDate]) VALUES (N'c3ba8900-7331-4f7a-b508-3880f69e7ee3', N'情報システム部', CAST(N'2014-12-05T00:00:00.0000000+09:00' AS DateTimeOffset))
INSERT [dbo].[Users] ([ApplicationId], [UserId], [UserName], [IsAnonymous], [LastActivityDate]) VALUES (N'4fb08201-795b-4a09-9111-43bab1a5c399', N'b02f3854-9170-43e8-a14d-14f4309cdc6a', N'sae', 0, CAST(N'2015-02-26 01:01:23.400' AS DateTime))
INSERT [dbo].[Users] ([ApplicationId], [UserId], [UserName], [IsAnonymous], [LastActivityDate]) VALUES (N'4fb08201-795b-4a09-9111-43bab1a5c399', N'6714612d-01c1-422b-b49c-1c470dacc634', N'Admin', 0, CAST(N'2015-04-17 04:55:50.430' AS DateTime))
INSERT [dbo].[Users] ([ApplicationId], [UserId], [UserName], [IsAnonymous], [LastActivityDate]) VALUES (N'4fb08201-795b-4a09-9111-43bab1a5c399', N'7c57c6a4-1e9f-4f58-83fd-4556a7a1d9b4', N'nokuda', 0, CAST(N'2015-04-17 02:27:24.530' AS DateTime))
INSERT [dbo].[Users] ([ApplicationId], [UserId], [UserName], [IsAnonymous], [LastActivityDate]) VALUES (N'4fb08201-795b-4a09-9111-43bab1a5c399', N'7e2a27ad-83a9-4725-952c-6abb531f2f19', N'k-maru', 0, CAST(N'2015-02-27 12:11:05.713' AS DateTime))
INSERT [dbo].[Users] ([ApplicationId], [UserId], [UserName], [IsAnonymous], [LastActivityDate]) VALUES (N'4fb08201-795b-4a09-9111-43bab1a5c399', N'c09a972d-4edd-43fe-b063-83a26bf085c1', N'arcs', 0, CAST(N'2015-04-09 11:47:35.993' AS DateTime))
INSERT [dbo].[Users] ([ApplicationId], [UserId], [UserName], [IsAnonymous], [LastActivityDate]) VALUES (N'4fb08201-795b-4a09-9111-43bab1a5c399', N'4c67d75a-3356-446b-9b96-8b404bbeca66', N'Guest', 0, CAST(N'2014-12-09 09:12:59.000' AS DateTime))
INSERT [dbo].[Users] ([ApplicationId], [UserId], [UserName], [IsAnonymous], [LastActivityDate]) VALUES (N'4fb08201-795b-4a09-9111-43bab1a5c399', N'c0af8434-2b63-4c7a-a8a0-8b66fb6960d8', N'tsune', 0, CAST(N'2015-03-04 21:01:48.837' AS DateTime))
INSERT [dbo].[Users] ([ApplicationId], [UserId], [UserName], [IsAnonymous], [LastActivityDate]) VALUES (N'4fb08201-795b-4a09-9111-43bab1a5c399', N'a387e13c-d37b-4da0-a9a0-c8160d538462', N'hmoriya', 0, CAST(N'2015-02-26 01:00:58.443' AS DateTime))
INSERT [dbo].[Users] ([ApplicationId], [UserId], [UserName], [IsAnonymous], [LastActivityDate]) VALUES (N'4fb08201-795b-4a09-9111-43bab1a5c399', N'211bb5cf-878d-4f68-8f13-f24a61d3e1aa', N'amimata', 0, CAST(N'2015-04-16 07:36:08.137' AS DateTime))
INSERT [dbo].[Users] ([ApplicationId], [UserId], [UserName], [IsAnonymous], [LastActivityDate]) VALUES (N'4fb08201-795b-4a09-9111-43bab1a5c399', N'c184ebdf-8f20-4a03-9aa1-f80413b1e10f', N'kasuya', 0, CAST(N'2015-02-26 01:00:32.347' AS DateTime))
INSERT [dbo].[UsersInRoles] ([UserId], [RoleId], [LastUpdatedDate]) VALUES (N'b02f3854-9170-43e8-a14d-14f4309cdc6a', N'aade0cf6-4ef9-4464-9d50-e58786166d8e', CAST(N'2015-02-26T10:14:12.9861918+09:00' AS DateTimeOffset))
INSERT [dbo].[UsersInRoles] ([UserId], [RoleId], [LastUpdatedDate]) VALUES (N'6714612d-01c1-422b-b49c-1c470dacc634', N'adeae4e9-0a5c-4a16-af59-35804012be5b', CAST(N'2014-12-09T18:52:12.3299478+09:00' AS DateTimeOffset))
INSERT [dbo].[UsersInRoles] ([UserId], [RoleId], [LastUpdatedDate]) VALUES (N'6714612d-01c1-422b-b49c-1c470dacc634', N'aade0cf6-4ef9-4464-9d50-e58786166d8e', CAST(N'2014-12-09T18:52:12.3299478+09:00' AS DateTimeOffset))
INSERT [dbo].[UsersInRoles] ([UserId], [RoleId], [LastUpdatedDate]) VALUES (N'7c57c6a4-1e9f-4f58-83fd-4556a7a1d9b4', N'aade0cf6-4ef9-4464-9d50-e58786166d8e', CAST(N'2015-02-26T10:12:34.1601037+09:00' AS DateTimeOffset))
INSERT [dbo].[UsersInRoles] ([UserId], [RoleId], [LastUpdatedDate]) VALUES (N'7e2a27ad-83a9-4725-952c-6abb531f2f19', N'aade0cf6-4ef9-4464-9d50-e58786166d8e', CAST(N'2015-02-27T11:15:41.7536144+09:00' AS DateTimeOffset))
INSERT [dbo].[UsersInRoles] ([UserId], [RoleId], [LastUpdatedDate]) VALUES (N'c09a972d-4edd-43fe-b063-83a26bf085c1', N'aade0cf6-4ef9-4464-9d50-e58786166d8e', CAST(N'2015-04-09T08:54:17.3219687+09:00' AS DateTimeOffset))
INSERT [dbo].[UsersInRoles] ([UserId], [RoleId], [LastUpdatedDate]) VALUES (N'4c67d75a-3356-446b-9b96-8b404bbeca66', N'aade0cf6-4ef9-4464-9d50-e58786166d8e', CAST(N'2014-12-09T18:52:28.4788582+09:00' AS DateTimeOffset))
INSERT [dbo].[UsersInRoles] ([UserId], [RoleId], [LastUpdatedDate]) VALUES (N'c0af8434-2b63-4c7a-a8a0-8b66fb6960d8', N'aade0cf6-4ef9-4464-9d50-e58786166d8e', CAST(N'2015-02-27T11:14:00.1123647+09:00' AS DateTimeOffset))
INSERT [dbo].[UsersInRoles] ([UserId], [RoleId], [LastUpdatedDate]) VALUES (N'a387e13c-d37b-4da0-a9a0-c8160d538462', N'aade0cf6-4ef9-4464-9d50-e58786166d8e', CAST(N'2015-02-26T10:12:51.8797190+09:00' AS DateTimeOffset))
INSERT [dbo].[UsersInRoles] ([UserId], [RoleId], [LastUpdatedDate]) VALUES (N'211bb5cf-878d-4f68-8f13-f24a61d3e1aa', N'adeae4e9-0a5c-4a16-af59-35804012be5b', CAST(N'2015-02-26T10:14:12.9861918+09:00' AS DateTimeOffset))
INSERT [dbo].[UsersInRoles] ([UserId], [RoleId], [LastUpdatedDate]) VALUES (N'211bb5cf-878d-4f68-8f13-f24a61d3e1aa', N'aade0cf6-4ef9-4464-9d50-e58786166d8e', CAST(N'2015-02-26T10:14:12.9861918+09:00' AS DateTimeOffset))
INSERT [dbo].[UsersInRoles] ([UserId], [RoleId], [LastUpdatedDate]) VALUES (N'c184ebdf-8f20-4a03-9aa1-f80413b1e10f', N'aade0cf6-4ef9-4464-9d50-e58786166d8e', CAST(N'2015-02-26T10:14:12.9861918+09:00' AS DateTimeOffset))
SET ANSI_PADDING ON

GO
/****** Object:  Index [IDX_UserName]    Script Date: 2015/04/17 13:57:53 ******/
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
