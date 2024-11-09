using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using WebApplication5.Data;
using WebApplication5.Models.Entities;

namespace WebApplication5.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaskController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TaskController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<TaskEntity>> CreateTask([FromBody] TaskEntity task)
        {
            if (task == null)
            {
                return BadRequest("Task details are required.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Log the Task Entity just to see what is being passed
            Console.WriteLine($"Task received: {JsonConvert.SerializeObject(task)}");

            // Generate Task ID based on the auto-incremented ID
            // Assuming that TaskId must also be unique
            var lastTask = await _context.Tasks.OrderByDescending(t => t.Id).FirstOrDefaultAsync();
            int newTaskId = (lastTask?.Id ?? 0) + 1; // Note: Ideally, let the database assign the Id

            task.TaskId = $"CRT{newTaskId:0000}";
            _context.Tasks.Add(task);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                // Log error details
                Console.WriteLine($"Error message: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
                }
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

            return CreatedAtAction(nameof(GetTaskById), new { id = task.Id }, task);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TaskEntity>> GetTaskById(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return NotFound();
            return Ok(task);
        }

        [HttpGet]
        public async Task<ActionResult<List<TaskEntity>>> GetAllTasks()
        {
            var tasks = await _context.Tasks.ToListAsync();
            return Ok(tasks);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<string>> UpdateTask(int id, [FromBody] TaskEntity updatedTask)
        {
            if (id != updatedTask.Id) return BadRequest("Task ID mismatch.");

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Entry(updatedTask).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await TaskExists(id)) return NotFound("Task not found.");
                throw; // Re-throw the exception for higher-level handling
            }

            return Ok("Task updated successfully."); // Return success message
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTask(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return NotFound();

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private async Task<bool> TaskExists(int id)
        {
            return await _context.Tasks.AnyAsync(e => e.Id == id);
        }
    }
}