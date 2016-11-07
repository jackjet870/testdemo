namespace ArchPack.ServiceUnits.Membership.V1.Data
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("UsersView")]
    public partial class UsersView
    {
        [Key]
        [Column(Order = 0)]
        public Guid UserId { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(50)]
        public string UserName { get; set; }

        [Key]
        [Column(Order = 2, TypeName = "timestamp")]
        [MaxLength(8)]
        [Timestamp]
        public byte[] UsersTimestamp { get; set; }

        [StringLength(256)]
        public string Email { get; set; }

        [StringLength(50)]
        public string FirstName { get; set; }

        [StringLength(50)]
        public string LastName { get; set; }

        public DateTimeOffset? ProfilesLastUpdatedDate { get; set; }

        [Column(TypeName = "timestamp")]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        [MaxLength(8)]
        public byte[] ProfilesTimestamp { get; set; }

        public Guid? UnitId { get; set; }

        [StringLength(50)]
        public string UnitName { get; set; }

        public DateTimeOffset? UnitsLastUpdatedDate { get; set; }

        [Column(TypeName = "timestamp")]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        [MaxLength(8)]
        public byte[] UnitsTimestamp { get; set; }

        [Key]
        [Column(Order = 3)]
        public string Password { get; set; }
    }
}
