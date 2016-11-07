namespace ArchPack.Tests.ServiceUnits.Test.V1.Data
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Project
    {
        public int ProjectId { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get; set; }

        public string Note { get; set; }

        [StringLength(50)]
        public string CreatedUser { get; set; }

        public DateTimeOffset? CreatedDate { get; set; }

        [StringLength(50)]
        public string UpdatedUser { get; set; }

        public DateTimeOffset? UpdatedDate { get; set; }

        [Column(TypeName = "timestamp")]
        [MaxLength(8)]
        [Timestamp]
        public byte[] ts { get; set; }
    }
}
