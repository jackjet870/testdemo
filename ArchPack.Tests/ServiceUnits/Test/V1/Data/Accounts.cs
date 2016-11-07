namespace ArchPack.Test.ServiceUnits.Test.V1.Data
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Accounts")]
    public partial class Accounts
    {
        [Key]
        public int AccountId { get; set; }

        [Required]
        [StringLength(1024)]
        public string AccountName { get; set; }

        [StringLength(50)]
        public string ZipCode { get; set; }

        [StringLength(1024)]
        public string Address { get; set; }

        [StringLength(50)]
        public string Tel { get; set; }

        [StringLength(1024)]
        public string BussinessDescription { get; set; }

        public int EmployeesNumber { get; set; }

        [StringLength(1024)]
        public string Url { get; set; }

        [StringLength(50)]
        public string LastUpdate { get; set; }

        public DateTimeOffset Created { get; set; }

        public DateTimeOffset Updated { get; set; }

        [Column(TypeName = "timestamp")]
        [MaxLength(8)]
        [Timestamp]
        public byte[] Ts { get; set; }

        //[StringLength(50)]
        //public string SecurityCode { get; set; }
    }
}
