using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication5.Data;
using WebApplication5.Models.Entities;

namespace WebApplication5.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaskReportsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public TaskReportsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("task-reports")]
        public async Task<ActionResult<IEnumerable<TaskReports>>> GetTaskReport()
        {
            return await _context.TaskReports.ToListAsync();
        }

    }
}
