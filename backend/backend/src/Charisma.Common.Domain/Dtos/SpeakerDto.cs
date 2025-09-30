namespace Charisma.Common.Domain.Dtos
{
    public record SpeakerDto
    {
        public int Id { get; init; }
        public string Name { get; init; }
        public string Nationality { get; init; }
        public decimal? Rating { get; init; }
        public byte[] Image { get; init; }
    }
}