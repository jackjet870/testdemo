namespace ArchPack.Tests.ServiceUnits.Test.V1.Data
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("RolesInUsersView")]
    public partial class RolesInUsersView
    {
        [Key]
        [Column(Order = 0)]
        public Guid UserId { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(50)]
        public string UserName { get; set; }

        [Key]
        [Column(Order = 2)]
        public Guid RoleId { get; set; }

        [Key]
        [Column(Order = 3)]
        [StringLength(256)]
        public string RoleName { get; set; }

        public bool? RoleInUser { get; set; }

        [Column(TypeName = "timestamp")]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        [MaxLength(8)]
        public byte[] UsersInRolesTimestamp { get; set; }
    }
}
