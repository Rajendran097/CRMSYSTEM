namespace WebApplication5.Models.Entities
{
    public class Employee
    {
        public int Id { get; set; }
        public string? EmpCode { get; set; }
        public string? EmpName { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? Passwordhash { get; set; }
        public int EmployeeStatus { get; set; }
        public DateTime? LastLogin { get; set; }
    }
}
