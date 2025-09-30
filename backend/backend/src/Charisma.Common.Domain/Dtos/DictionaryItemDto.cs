namespace Charisma.Common.Domain.Dtos
{
    public record DictionaryItemDto
    {
        public int Id { get; init; }
        public string Code { get; init; }
        public string Name { get; init; }
    }
}
