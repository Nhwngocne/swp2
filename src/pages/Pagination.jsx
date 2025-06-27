import React from "react";
import '../assets/css/pages/Pagination.css'; // Ensure you have this CSS file for styling
import { FaAngleDoubleLeft, FaAngleLeft, FaAngleRight, FaAngleDoubleRight } from "react-icons/fa";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const MAX_PAGE_DISPLAY = 5;

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= MAX_PAGE_DISPLAY) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="pagination-container">
    <button onClick={() => onPageChange(1)} disabled={currentPage === 1}>
  <FaAngleDoubleLeft />
</button>
<button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
  <FaAngleLeft />
</button>

      {pages.map((page, index) =>
        page === "..." ? (
          <span key={index} className="ellipsis">...</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={currentPage === page ? "active" : ""}
          >
            {page}
          </button>
        )
      )}

      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
  <FaAngleRight />
</button>
<button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages}>
  <FaAngleDoubleRight />
</button>
    </div>
  );
};

export default Pagination;
