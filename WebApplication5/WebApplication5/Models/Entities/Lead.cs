using System.ComponentModel.DataAnnotations;

public class Lead
{
    public int Id { get; set; }
    [Required]
    public string LeadId { get; set; }
    [Required]
    public string LeadName { get; set; } = string.Empty;
    [Required]
    public string Phone { get; set; } = string.Empty;
    [Required]
    public string Address { get; set; } = string.Empty;
    [Required]
    public DateTime DOB { get; set; }
    public string? Gender { get; set; }
    [Required]
    public string SchemeName { get; set; } = string.Empty;
    [Required]
    public int LoanAmount { get; set; }
    public DateTime Date { get; set; }
    public string? SalesOfficer { get; set; }
    public string? Remarks { get; set; }
    public string? SalesHead { get; set; }
    public string? SalesHeadRemarks { get; set; }
    public string? Admin { get; set; }
    public string? AdminRemarks { get; set; }
    public string? LeadStatus { get; set; }
    public bool IsApproved { get; set; } = true;
}