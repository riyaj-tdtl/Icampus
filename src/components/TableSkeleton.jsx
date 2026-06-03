import { TableRow, TableCell, Skeleton, Box } from '@mui/material';

const TableSkeleton = ({ cols = 6, rows = 5 }) => {
  return Array.from(new Array(rows)).map((_, rIndex) => (
    <TableRow key={`skeleton-row-${rIndex}`}>
      {Array.from(new Array(cols)).map((_, cIndex) => (
        <TableCell key={`skeleton-cell-${rIndex}-${cIndex}`} sx={{ py: 2.5 }}>
          {cIndex === 0 ? (
            <Skeleton 
              animation="wave" 
              variant="text" 
              width={20} 
              height={20} 
            />
          ) : cIndex === cols - 1 ? (
            <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
              <Skeleton animation="wave" variant="circular" width={32} height={32} />
              <Skeleton animation="wave" variant="circular" width={32} height={32} />
            </Box>
          ) : (
            <Skeleton 
              animation="wave" 
              variant="text" 
              width={cIndex === 1 ? "75%" : "50%"} 
              height={20} 
            />
          )}
        </TableCell>
      ))}
    </TableRow>
  ));
};

export default TableSkeleton;
