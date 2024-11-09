using Microsoft.EntityFrameworkCore;
using WebApplication5.Models.Entities;

namespace WebApplication5.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Lead> Leads { get; set; }
        public DbSet<TaskEntity> Tasks { get; set; }

        public DbSet<LeadReports> LeadsReports { get; set; }

        public DbSet<TaskReports> TaskReports { get; set; }
    }

}
