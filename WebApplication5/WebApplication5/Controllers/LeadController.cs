using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication5.Data;
using WebApplication5.DTO;

[ApiController]
[Route("api/[controller]")]
public class LeadController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public LeadController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Lead>>> GetAllLeads()
    {
        var leads = await _context.Leads.ToListAsync();
        return Ok(leads);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Lead>> GetLead(string id)
        {
        var lead = await _context.Leads.FirstOrDefaultAsync(l => l.LeadId == id);
        if (lead == null)
        {
            return NotFound($"Lead with LeadId: {id} not found.");
        }
        return Ok(lead);
    }

    [HttpPost]
    public async Task<ActionResult<Lead>> CreateLead([FromBody] Lead lead)
    {
        if (lead == null ||
            string.IsNullOrWhiteSpace(lead.LeadName) ||
            string.IsNullOrWhiteSpace(lead.Phone) ||
            string.IsNullOrWhiteSpace(lead.Address) ||
            lead.DOB == default ||
            string.IsNullOrWhiteSpace(lead.SchemeName) ||
            lead.LoanAmount <= 0)
        {
            return BadRequest("All required fields must be filled.");
        }

        lead.Date = DateTime.Now; // Set the current date for the new lead

        // Generate unique lead ID in the format "LDNxxxxx"
        int nextId = _context.Leads.Count() + 1; // Incremental count
        lead.LeadId = $"LDN{nextId:D5}"; // Format ID as "LDN00001", "LDN00002", etc.

        _context.Leads.Add(lead);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetLead), new { id = lead.LeadId }, lead);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateLead(string id, [FromBody] UpdateLeadDto updatedLeadDto)
    {
        if (updatedLeadDto == null)
        {
            return BadRequest("Invalid data.");
        }

        // Check if the lead exists
        var lead = await _context.Leads.FirstOrDefaultAsync(l => l.LeadId == id);
        if (lead == null)
        {
            return NotFound($"Lead with LeadId: {id} not found.");
        }

        // Map the fields from the DTO to the existing lead
        lead.LeadName = updatedLeadDto.LeadName;
        lead.Phone = updatedLeadDto.Phone;
        lead.Address = updatedLeadDto.Address;
        lead.DOB = updatedLeadDto.DOB;
        lead.Gender = updatedLeadDto.Gender;
        lead.SchemeName = updatedLeadDto.SchemeName;
        lead.LoanAmount = updatedLeadDto.LoanAmount;
        lead.LeadStatus = updatedLeadDto.LeadStatus;

        // Validate the updated lead
        if (string.IsNullOrWhiteSpace(lead.LeadName) ||
            string.IsNullOrWhiteSpace(lead.Phone) ||
            string.IsNullOrWhiteSpace(lead.Address) ||
            lead.DOB == default ||
            string.IsNullOrWhiteSpace(lead.SchemeName) ||
            lead.LoanAmount <= 0)
        {
            return BadRequest("All required fields must be filled.");
        }

        _context.Entry(lead).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!LeadExists(id))
            {
                return NotFound();
            }
            throw; // Throw exception if it was not found
        }

        // Return successful response with message and updated lead
        return Ok(new
        {
            Message = $"Lead with LeadId: {id} updated successfully.",
            UpdatedLead = lead
        });
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<string>> DeleteLead(string id)
    {
        var lead = await _context.Leads.FirstOrDefaultAsync(l => l.LeadId == id);
        if (lead == null)
        {
            return NotFound($"Lead with LeadId: {id} not found.");
        }

        _context.Leads.Remove(lead);
        await _context.SaveChangesAsync();

        return Ok($"Lead {lead.LeadId} deleted successfully.");
    }

    private bool LeadExists(string id)
    {
        return _context.Leads.Any(e => e.LeadId == id);
    }
}