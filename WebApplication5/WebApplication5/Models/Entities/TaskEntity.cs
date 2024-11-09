namespace WebApplication5.Models.Entities
{
    public class TaskEntity
    {
        public int Id { get; set; }
        public string? TaskId { get; set; }
        public string? TaskName { get; set; }
        public string? EmpCode { get; set; }
        public string? EmpName { get; set; }
        public DateTime TargetDate { get; set; }
        public string? Remarks { get; set; }
        public string? SalesOfficer { get; set; }
        public string? SalesOfficerRemarks { get; set; }

        public string? SalesHead { get; set; }

        public string? SalesHeadRemarks { get; set; }

        public string? Admin { get; set; }

        public string? AdminRemarks { get; set; }

        public string? TaskStatus { get; set; } // e.g., Pending, Completed
    }
}
