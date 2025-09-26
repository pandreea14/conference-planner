using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Charisma.Common.Domain.Entities.Conferences
{
    public class Speaker
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Nationality { get; set; }
        public decimal Rating { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public byte[]? Image { get; set; }
    }
}
