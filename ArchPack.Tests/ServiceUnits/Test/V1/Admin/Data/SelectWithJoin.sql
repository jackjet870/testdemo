select * from Profiles p
	left join Users u on p.UserId = u.UserId
	Where LastName like @Name/*nvarchar(MAX)*/ and IsAnonymous = @IsAnonymous/*bit*/ 