using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication5.Data;
using WebApplication5.Models.Entities;

namespace WebApplication5.Controllers
{
    public class LeadReportsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public LeadReportsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("LeadReports")]
        public async Task<ActionResult<IEnumerable<LeadReports>>> GetLeadReports()
        {
            //var leadReports = await _context.Leads.Select(lead => new LeadReports
            //{
            //    LeadId = lead.LeadId,
            //    LeadName = lead.LeadName,
            //    Phone = lead.Phone,
            //    Address = lead.Address,
            //    DOB = lead.DOB,
            //    Gender = lead.Gender,
            //    SchemeName = lead.SchemeName,
            //    LoanAmount = lead.LoanAmount,
            //    Date = lead.Date,
            //    SalesOfficer = lead.SalesOfficer,
            //    SalesOfficerRemarks = lead.Remarks,
            //    SalesHead = lead.SalesHead,
            //    SalesHeadRemarks = lead.SalesHeadRemarks,
            //    Admin = lead.Admin,
            //    AdminRemarks = lead.AdminRemarks,
            //    LeadStatus = lead.LeadStatus,
            //});

            //return Ok(leadReports);

            return await _context.LeadsReports.ToListAsync();
        }
    }
}
