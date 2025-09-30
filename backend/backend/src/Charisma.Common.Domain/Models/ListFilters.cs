namespace Charisma.Common.Domain.Models
{
    public class ListFilters
    {
        public string Search { get; init; } = string.Empty;
        public int Page { get; init; } = 1;
        public int Size { get; init; } = 10;
        public string OrderBy { get; init; }
        public bool IsDescendingOrder { get; init; }
    }
}
