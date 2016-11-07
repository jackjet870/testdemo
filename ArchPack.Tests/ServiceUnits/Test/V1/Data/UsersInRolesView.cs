namespace ArchPack.Tests.ServiceUnits.Test.V1.Data
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("UsersInRolesView")]
    public partial class UsersInRolesView
    {
        [Key]
        [Column(Order = 0)]
        public Guid RoleId { get; set; }

        public Guid? UserId { get; set; }

        [StringLength(50)]
        public string UserName { get; set; }

        [StringLength(256)]
        public string Email { get; set; }

        [StringLength(50)]
        public string FirstName { get; set; }

        [StringLength(50)]
        public string LastName { get; set; }

        public Guid? UnitId { get; set; }

        [StringLength(50)]
        public string UnitName { get; set; }

        [Key]
        [Column(Order = 1, TypeName = "timestamp")]
        [MaxLength(8)]
        [Timestamp]
        public byte[] UsersInRolesTimestamp { get; set; }
    }
}
