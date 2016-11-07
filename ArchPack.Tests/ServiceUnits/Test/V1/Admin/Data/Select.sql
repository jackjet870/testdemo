Select * from Users 
	Where UserName like @Name/*nvarchar(MAX)*/ and IsAnonymous = @IsAnonymous/*bit*/ 