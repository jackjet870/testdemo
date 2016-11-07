@echo off
REM setting parameters
SET SERVER=localhost\SQLEXPRESS
SET ACCOUNT=%COMPUTERNAME%\ASPNET

ver | find "6.0" > nul
if %ERRORLEVEL% == 0 SET ACCOUNT=NT AUTHORITY\Network Service

ver | find "6.1" > nul
if %ERRORLEVEL% == 0 (
  SET ACCOUNT=IIS APPPOOL\ASP.NET v4.0
) else (
  SET ACCOUNT=IIS APPPOOL\ASP.NET v4.5
)

echo %1 IIS ���s���[�U�[�� %ACCOUNT% �ɐݒ肵�܂����B
PAUSE

REM �f�[�^�x�[�X�̍쐬
sqlcmd -S %SERVER% -E -i create_databse_Membership.sql

REM �f�[�^�̍쐬
sqlcmd -S %SERVER% -E -i init_data_Membership.sql

PAUSE
