import { Box, TablePagination, useTheme } from '@mui/material';

const TablePaginationControls = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const theme = useTheme();

  if (!count) return null;

  return (
    <Box
      sx={{
        mt: 2,
        display: 'flex',
        justifyContent: 'flex-end',
        bgcolor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.grey[200]}`,
        borderRadius: '20px',
        boxShadow: '0 12px 28px rgba(15, 23, 42, 0.08)',
        overflow: 'hidden',
        '& .MuiTablePagination-root': {
          width: 'auto',
        },
        '& .MuiTablePagination-toolbar': {
          minHeight: 62,
          px: { xs: 1.5, sm: 2.5 },
          flexWrap: 'wrap',
          justifyContent: 'flex-end',
          gap: 1,
          alignItems: 'center',
        },
        '& .MuiTablePagination-spacer': {
          display: 'none',
        },
        '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
          color: theme.palette.text.secondary,
          fontWeight: 700,
          fontSize: '0.84rem',
          m: 0,
        },
        '& .MuiTablePagination-selectRoot': {
          borderRadius: '16px',
          bgcolor: '#eef2ff',
          border: `1px solid rgba(132, 86, 241, 0.18)`,
          overflow: 'hidden',
        },
        '& .MuiTablePagination-selectRoot .MuiSelect-select': {
          padding: '12px 14px',
          color: '#0f172a',
        },
        '& .MuiTablePagination-actions': {
          flexShrink: 0,
          display: 'flex',
          gap: 0.75,
        },
        '& .MuiTablePagination-actions .MuiIconButton-root': {
          borderRadius: '16px',
          background: '#ffffff',
          color: theme.palette.primary.main,
          width: 40,
          height: 40,
          boxShadow: '0 8px 20px rgba(132, 86, 241, 0.12)',
          transition: 'all 0.2s ease',
        },
        '& .MuiTablePagination-actions .MuiIconButton-root:hover': {
          bgcolor: 'rgba(132, 86, 241, 0.12)',
        },
        '& .MuiTablePagination-actions .Mui-disabled': {
          color: theme.palette.grey[400],
          opacity: 0.7,
          boxShadow: 'none',
          background: '#f3f4f6',
        },
      }}
    >
      <TablePagination
        component="div"
        sx={{ width: 'auto' }}
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </Box>
  );
};

export default TablePaginationControls;
