using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication5.Data;
using WebApplication5.DTO;
using WebApplication5.Models.Entities;

namespace WebApplication5.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IPasswordHasher<Employee> _passwordHasher;

        public EmployeeController(ApplicationDbContext context)
        {
            _context = context;
            _passwordHasher = new PasswordHasher<Employee>();
        }

        // POST: api/employee/register
        [HttpPost("register")]
        public async Task<ActionResult<Employee>> Register([FromBody] Employee employee)
        {
            if (employee == null ||
                string.IsNullOrEmpty(employee.EmpName) ||
                string.IsNullOrEmpty(employee.Email) ||
                string.IsNullOrEmpty(employee.Phone) ||
                string.IsNullOrEmpty(employee.Passwordhash))
            {
                return BadRequest("Employee details cannot be null.");
            }

            // Check if the email is already in use
            if (await _context.Employees.AnyAsync(e => e.Email == employee.Email))
            {
                return BadRequest("Email is already in use.");
            }

            // Generate EmpCode
            var employeeCount = await _context.Employees.CountAsync();
            employee.EmpCode = $"CRM{employeeCount + 1:00000}";

            // Hash the password before saving
            employee.Passwordhash = _passwordHasher.HashPassword(employee, employee.Passwordhash);

            await _context.Employees.AddAsync(employee);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEmployeeById), new { id = employee.Id }, employee);
        }

        // GET: api/employee/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetEmployeeById(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
            {
                return NotFound();
            }

            return Ok(employee);
        }

        // GET: api/employee
        [HttpGet]
        public async Task<ActionResult<List<Employee>>> GetAllEmployees()
        {
            var employees = await _context.Employees.ToListAsync();
            return Ok(employees);
        }

        // PUT: api/employee/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<string>> UpdateEmployee(int id, [FromBody] Employee updatedEmployee)
        {
            if (updatedEmployee == null)
            {
                return BadRequest("Updated employee cannot be null.");
            }

            if (id != updatedEmployee.Id)
            {
                return BadRequest("Employee ID mismatch.");
            }

            // Find and verify the existing employee
            var existingEmployee = await _context.Employees.FindAsync(id);
            if (existingEmployee == null)
            {
                return NotFound();
            }

            // Update properties
            existingEmployee.EmpName = updatedEmployee.EmpName;
            existingEmployee.Phone = updatedEmployee.Phone;
            existingEmployee.Email = updatedEmployee.Email;
            existingEmployee.EmployeeStatus = updatedEmployee.EmployeeStatus;

            await _context.SaveChangesAsync();

            // Return a success message
            return Ok("Employee details updated successfully");
        }

        // GET: api/employee/status
        [HttpGet("status")]
        public async Task<ActionResult<List<Employee>>> GetEmployeesByStatus(int status)
        {
            // Retrieve employees that have the specified status
            var employees = await _context.Employees
                                           .Where(e => e.EmployeeStatus == status)
                                           .ToListAsync();

            if (!employees.Any())
            {
                return NotFound("No employees found with the specified status.");
            }

            return Ok(employees);
        }

        // DELETE: api/employee/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
            {
                return NotFound();
            }

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpGet("statuses")]
        public async Task<ActionResult<List<int>>> GetDistinctEmployeeStatuses()
        {
            // Retrieve distinct employee statuses
            var statuses = await _context.Employees
                                          .Select(e => e.EmployeeStatus)
                                          .Distinct()
                                          .ToListAsync();

            if (!statuses.Any())
            {
                return NotFound("No employee statuses found.");
            }

            return Ok(statuses);
        }

        // POST: api/employee/login
        [HttpPost("login")]
        public async Task<ActionResult<object>> Login([FromBody] EmployeeLoginDto loginDto)
        {
            if (loginDto == null ||
                string.IsNullOrEmpty(loginDto.EmpCode) ||
                string.IsNullOrEmpty(loginDto.Password))
            {
                return BadRequest("EmpCode and password must be provided.");
            }

            var employee = await _context.Employees.FirstOrDefaultAsync(e => e.EmpCode == loginDto.EmpCode);
            if (employee == null)
            {
                return Unauthorized("Invalid EmpCode.");
            }

            var result = _passwordHasher.VerifyHashedPassword(employee, employee.Passwordhash, loginDto.Password);
            if (result != PasswordVerificationResult.Success)
            {
                return Unauthorized("Invalid password.");
            }

            // Successful login; log the action
            employee.LastLogin = DateTime.Now; // Assuming a LastLogin property exists
            await _context.SaveChangesAsync(); // Save the last login time

            // Return employee information
            var responseEmployee = new
            {
                Message = "You have successfully logged in.",
                Employee = new
                {
                    employee.Id,
                    employee.EmpCode,
                    employee.EmpName,
                    employee.Phone,
                    employee.Email,
                    employee.EmployeeStatus
                }
            };

            return Ok(responseEmployee);
        }
    }

}