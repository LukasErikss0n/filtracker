export default function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="modal modal-open" onClick={onClose}>
      <div
        className="modal-box max-w-md max-h-[90vh] rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
