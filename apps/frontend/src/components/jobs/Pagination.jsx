export default function Pagination({
  pagination,
  onPageChange,
}) {
  if (!pagination) return null;

  return (
    <div
      style={{
        marginTop: "20px",
      }}
    >
      <button
        disabled={pagination.page === 1}
        onClick={() =>
          onPageChange(pagination.page - 1)
        }
      >
        Previous
      </button>

      <span
        style={{
          margin: "0 15px",
        }}
      >
        Page {pagination.page} of {pagination.totalPages}
      </span>

      <button
        disabled={
          pagination.page === pagination.totalPages
        }
        onClick={() =>
          onPageChange(pagination.page + 1)
        }
      >
        Next
      </button>
    </div>
  );
}