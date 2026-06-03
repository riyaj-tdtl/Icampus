import { useMemo, useState } from 'react';

export const useTablePagination = (rows, initialRowsPerPage = 10) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const totalRows = rows?.length || 0;
  const maxPage = Math.max(0, Math.ceil(totalRows / rowsPerPage) - 1);
  const safePage = Math.min(page, maxPage);

  const paginatedRows = useMemo(() => {
    const start = safePage * rowsPerPage;
    return (rows || []).slice(start, start + rowsPerPage);
  }, [rows, rowsPerPage, safePage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return {
    page: safePage,
    rowsPerPage,
    paginatedRows,
    handleChangePage,
    handleChangeRowsPerPage,
  };
};
