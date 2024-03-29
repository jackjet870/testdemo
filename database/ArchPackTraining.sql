USE [master]
GO
/****** Object:  Database [ArchPackTraining]    Script Date: 28/08/2015 7:11:34 CH ******/
CREATE DATABASE [ArchPackTraining]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'ArchPackTraining', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL11.SQLEXPRESS\MSSQL\DATA\ArchPackTraining.mdf' , SIZE = 10240KB , MAXSIZE = UNLIMITED, FILEGROWTH = 10240KB )
 LOG ON 
( NAME = N'ArchPackTraining_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL11.SQLEXPRESS\MSSQL\DATA\ArchPackTraining_log.ldf' , SIZE = 10240KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO
ALTER DATABASE [ArchPackTraining] SET COMPATIBILITY_LEVEL = 110
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [ArchPackTraining].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [ArchPackTraining] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [ArchPackTraining] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [ArchPackTraining] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [ArchPackTraining] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [ArchPackTraining] SET ARITHABORT OFF 
GO
ALTER DATABASE [ArchPackTraining] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [ArchPackTraining] SET AUTO_CREATE_STATISTICS ON 
GO
ALTER DATABASE [ArchPackTraining] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [ArchPackTraining] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [ArchPackTraining] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [ArchPackTraining] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [ArchPackTraining] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [ArchPackTraining] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [ArchPackTraining] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [ArchPackTraining] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [ArchPackTraining] SET  DISABLE_BROKER 
GO
ALTER DATABASE [ArchPackTraining] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [ArchPackTraining] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [ArchPackTraining] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [ArchPackTraining] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [ArchPackTraining] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [ArchPackTraining] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [ArchPackTraining] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [ArchPackTraining] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [ArchPackTraining] SET  MULTI_USER 
GO
ALTER DATABASE [ArchPackTraining] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [ArchPackTraining] SET DB_CHAINING OFF 
GO
ALTER DATABASE [ArchPackTraining] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [ArchPackTraining] SET TARGET_RECOVERY_TIME = 0 SECONDS 
GO
USE [ArchPackTraining]
GO
/****** Object:  Table [dbo].[AspNetRoles]    Script Date: 28/08/2015 7:11:34 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetRoles](
	[Id] [nvarchar](128) NOT NULL,
	[Name] [nvarchar](256) NOT NULL,
 CONSTRAINT [PK_dbo.AspNetRoles] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[AspNetUserClaims]    Script Date: 28/08/2015 7:11:34 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUserClaims](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [nvarchar](128) NOT NULL,
	[ClaimType] [nvarchar](max) NULL,
	[ClaimValue] [nvarchar](max) NULL,
 CONSTRAINT [PK_dbo.AspNetUserClaims] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[AspNetUserLogins]    Script Date: 28/08/2015 7:11:34 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUserLogins](
	[LoginProvider] [nvarchar](128) NOT NULL,
	[ProviderKey] [nvarchar](128) NOT NULL,
	[UserId] [nvarchar](128) NOT NULL,
 CONSTRAINT [PK_dbo.AspNetUserLogins] PRIMARY KEY CLUSTERED 
(
	[LoginProvider] ASC,
	[ProviderKey] ASC,
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[AspNetUserRoles]    Script Date: 28/08/2015 7:11:34 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUserRoles](
	[UserId] [nvarchar](128) NOT NULL,
	[RoleId] [nvarchar](128) NOT NULL,
 CONSTRAINT [PK_dbo.AspNetUserRoles] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC,
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[AspNetUsers]    Script Date: 28/08/2015 7:11:34 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUsers](
	[Id] [nvarchar](128) NOT NULL,
	[Email] [nvarchar](256) NULL,
	[EmailConfirmed] [bit] NOT NULL,
	[PasswordHash] [nvarchar](max) NULL,
	[SecurityStamp] [nvarchar](max) NULL,
	[PhoneNumber] [nvarchar](max) NULL,
	[PhoneNumberConfirmed] [bit] NOT NULL,
	[TwoFactorEnabled] [bit] NOT NULL,
	[LockoutEndDateUtc] [datetime] NULL,
	[LockoutEnabled] [bit] NOT NULL,
	[AccessFailedCount] [int] NOT NULL,
	[UserName] [nvarchar](256) NOT NULL,
	[AccessKey] [nvarchar](max) NULL,
	[ts] [timestamp] NOT NULL,
 CONSTRAINT [PK_dbo.AspNetUsers] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Expense]    Script Date: 28/08/2015 7:11:34 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Expense](
	[ExpenseNo] [int] IDENTITY(1,1) NOT NULL,
	[ApplyDate] [nvarchar](8) NULL,
	[ApplicantName] [nvarchar](255) NULL,
	[CreateDate] [datetimeoffset](7) NOT NULL,
	[CreateUser] [nvarchar](255) NOT NULL,
	[UpdateDate] [datetimeoffset](7) NOT NULL,
	[UpdateUser] [nvarchar](255) NOT NULL,
 CONSTRAINT [PK_Expense] PRIMARY KEY CLUSTERED 
(
	[ExpenseNo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[ExpenseDetails]    Script Date: 28/08/2015 7:11:34 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ExpenseDetails](
	[ExpenseDetailNo] [int] IDENTITY(1,1) NOT NULL,
	[ExpenseNo] [int] NOT NULL,
	[Subject] [nvarchar](255) NULL,
	[ExpenseDate] [datetimeoffset](7) NULL,
	[Amount] [money] NULL,
	[CreateDate] [datetimeoffset](7) NOT NULL,
	[CreateUser] [nvarchar](255) NOT NULL,
	[UpdateDate] [datetimeoffset](7) NOT NULL,
	[UpdateUser] [nvarchar](255) NOT NULL,
 CONSTRAINT [PK_ExpenseDetails] PRIMARY KEY CLUSTERED 
(
	[ExpenseDetailNo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
INSERT [dbo].[AspNetRoles] ([Id], [Name]) VALUES (N'b71ecef1-ea3d-4f73-82b6-ff22f2328854', N'担当者')
INSERT [dbo].[AspNetUserRoles] ([UserId], [RoleId]) VALUES (N'3107c6e6-0dd5-4efa-b66a-54056349e47d', N'b71ecef1-ea3d-4f73-82b6-ff22f2328854')
INSERT [dbo].[AspNetUsers] ([Id], [Email], [EmailConfirmed], [PasswordHash], [SecurityStamp], [PhoneNumber], [PhoneNumberConfirmed], [TwoFactorEnabled], [LockoutEndDateUtc], [LockoutEnabled], [AccessFailedCount], [UserName], [AccessKey]) VALUES (N'3107c6e6-0dd5-4efa-b66a-54056349e47d', N'Admin@admin.co.jp', 0, N'ADwECdYeYmTjdNt8BrbgaOm+UnV/Ol6yF5/Wn5WUstdaICbu0cGYENPVYZWGlRQEYQ==', N'2e5aa9cb-9f33-4eeb-a841-60481b5cf156', N'03-9999-9999', 0, 0, NULL, 1, 0, N'Admin', NULL)
SET IDENTITY_INSERT [dbo].[Expense] ON 

INSERT [dbo].[Expense] ([ExpenseNo], [ApplyDate], [ApplicantName], [CreateDate], [CreateUser], [UpdateDate], [UpdateUser]) VALUES (6, N'20150829', N'AbsenceForm', CAST(0x07001882BA7D5C3A0B1C02 AS DateTimeOffset), N'Admin', CAST(0x07001882BA7D5C3A0B1C02 AS DateTimeOffset), N'Admin')
INSERT [dbo].[Expense] ([ExpenseNo], [ApplyDate], [ApplicantName], [CreateDate], [CreateUser], [UpdateDate], [UpdateUser]) VALUES (9, N'20150829', N'SumerVacation', CAST(0x07001882BA7D5C3A0B1C02 AS DateTimeOffset), N'Admin', CAST(0x07001882BA7D5C3A0B1C02 AS DateTimeOffset), N'Admin')
INSERT [dbo].[Expense] ([ExpenseNo], [ApplyDate], [ApplicantName], [CreateDate], [CreateUser], [UpdateDate], [UpdateUser]) VALUES (10, N'20150829', N'WinterVacation', CAST(0x07001882BA7D5C3A0B1C02 AS DateTimeOffset), N'Admin', CAST(0x07001882BA7D5C3A0B1C02 AS DateTimeOffset), N'Admin')
INSERT [dbo].[Expense] ([ExpenseNo], [ApplyDate], [ApplicantName], [CreateDate], [CreateUser], [UpdateDate], [UpdateUser]) VALUES (11, N'20150829', N'SpringVacation', CAST(0x07001882BA7D5C3A0B1C02 AS DateTimeOffset), N'Admin', CAST(0x07001882BA7D5C3A0B1C02 AS DateTimeOffset), N'Admin')
INSERT [dbo].[Expense] ([ExpenseNo], [ApplyDate], [ApplicantName], [CreateDate], [CreateUser], [UpdateDate], [UpdateUser]) VALUES (12, N'20150829', N'Traveling', CAST(0x07001882BA7D5C3A0B1C02 AS DateTimeOffset), N'Admin', CAST(0x07001882BA7D5C3A0B1C02 AS DateTimeOffset), N'Admin')
INSERT [dbo].[Expense] ([ExpenseNo], [ApplyDate], [ApplicantName], [CreateDate], [CreateUser], [UpdateDate], [UpdateUser]) VALUES (13, N'20180829', N'Holiday', CAST(0x07001882BA7D5C3A0B1C02 AS DateTimeOffset), N'Admin', CAST(0x07001882BA7D5C3A0B1C02 AS DateTimeOffset), N'Admin')
SET IDENTITY_INSERT [dbo].[Expense] OFF
ALTER TABLE [dbo].[AspNetUserClaims]  WITH CHECK ADD  CONSTRAINT [FK_dbo.AspNetUserClaims_dbo.AspNetUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AspNetUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserClaims] CHECK CONSTRAINT [FK_dbo.AspNetUserClaims_dbo.AspNetUsers_UserId]
GO
ALTER TABLE [dbo].[AspNetUserLogins]  WITH CHECK ADD  CONSTRAINT [FK_dbo.AspNetUserLogins_dbo.AspNetUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AspNetUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserLogins] CHECK CONSTRAINT [FK_dbo.AspNetUserLogins_dbo.AspNetUsers_UserId]
GO
ALTER TABLE [dbo].[AspNetUserRoles]  WITH CHECK ADD  CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetRoles_RoleId] FOREIGN KEY([RoleId])
REFERENCES [dbo].[AspNetRoles] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserRoles] CHECK CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetRoles_RoleId]
GO
ALTER TABLE [dbo].[AspNetUserRoles]  WITH CHECK ADD  CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AspNetUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserRoles] CHECK CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetUsers_UserId]
GO
USE [master]
GO
ALTER DATABASE [ArchPackTraining] SET  READ_WRITE 
GO
