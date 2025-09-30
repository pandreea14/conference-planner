namespace Charisma.Common.Domain.Entities.Conferences
{
    public class Speaker
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Nationality { get; set; }
        public decimal? Rating { get; set; }
        public byte[] Image { get; set; }
    }
}