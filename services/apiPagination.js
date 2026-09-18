// Keep Spring Page responses intact: content, number, totalPages, last, etc.
export function paginationParams({ page = 0, size = 20 } = {}) {
  return {
    page: Number.isInteger(page) ? Math.max(0, page) : 0,
    size: Number.isInteger(size) ? Math.min(100, Math.max(1, size)) : 20,
  };
}
