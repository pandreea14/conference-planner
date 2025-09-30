namespace Charisma.Common.Domain.Dtos.Common
{
    public abstract class ListFiltersRequest
    {
        public string Search { get; init; } = string.Empty;
        public int Page { get; init; } = 1;
        public int Size { get; init; } = 10;
        public string OrderBy { get; init; }
        public bool IsDescendingOrder { get; init; }
    }
}
