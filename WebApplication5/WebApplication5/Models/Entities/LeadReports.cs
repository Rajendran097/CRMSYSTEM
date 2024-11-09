namespace WebApplication5.Models.Entities
{
    public class LeadReports
    {
        public int Id { get; set; }
        public string? LeadId { get; set; }
        public string? LeadName { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public DateTime DOB { get; set; }
        public string? Gender { get; set; }
        public string? SchemeName { get; set; }
        public int LoanAmount { get; set; }
        public DateTime Date { get; set; }
        public string? SalesOfficer { get; set; }
        public string? SalesOfficerRemarks { get; set; }
        public string? SalesHead { get; set; }
        public string? SalesHeadRemarks { get; set; }
        public string? Admin { get; set; }
        public string? AdminRemarks { get; set; }
        public string? LeadStatus { get; set; }
    }
}
