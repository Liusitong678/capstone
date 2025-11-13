import { Button, Badge } from "react-bootstrap";

export default function Pager({ page, totalPages, totalItems, start, end, onPrev, onNext }) {
  return (
    <div className="d-flex align-items-center justify-content-between rb-pager my-3">
      <div className="text-muted small">
        Showing <strong>{totalItems ? start + 1 : 0}-{end}</strong> of{" "}
        <strong>{totalItems}</strong>
      </div>
      <div className="d-flex align-items-center gap-2">
        <Button
          size="sm"
          variant="outline-primary"
          disabled={page <= 1}
          onClick={onPrev}
        >
          Previous
        </Button>
        <span className="small">
          <Badge bg="light" text="dark">
            Page {page} / {totalPages}
          </Badge>
        </span>
        <Button
          size="sm"
          variant="primary"
          disabled={page >= totalPages}
          onClick={onNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
