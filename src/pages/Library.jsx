import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useMediaQuery, useTheme, Chip, IconButton, Tooltip } from '@mui/material';
import { Plus, Trash2, Book, Pencil } from 'lucide-react';
import { bookService } from '../services/apiService';
import { showComplexForm, showSuccess, confirmDelete } from '../utils/swalUtils';
import TableSkeleton from '../components/TableSkeleton';

const Library = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isStudent = user.role === 'STUDENT';

  useEffect(() => { fetchBooks(); }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await bookService.getAll();
      setBooks(data.results || []);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleDelete = (id) => {
    confirmDelete('Remove Book?', 'This book will be removed from the library catalog.').then(res => {
      if (res.isConfirmed) {
        showSuccess('Removed!', 'Book has been deleted.');
      }
    });
  };

  const handleEdit = (book) => {
    showComplexForm(`Update: ${book.title}`, [
      { id: 'title', label: 'Book Title', placeholder: book.title },
      { id: 'author', label: 'Author', placeholder: book.author },
      { id: 'isbn', label: 'ISBN Number', placeholder: book.isbn }
    ]).then(res => {
      if (res.isConfirmed && res.value) {
        showSuccess('Catalog Updated!', `"${res.value.title}" details have been saved.`);
      }
    });
  };

  return (
    <Box sx={{ pb: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        mb: 4,
        gap: 2
      }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
            {isStudent ? 'Library' : 'Library Catalog'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isStudent ? 'Browse available books and view your issued items.' : 'Manage books, inventory, and circulation records.'}
          </Typography>
        </Box>
        {!isStudent && (
          <Button 
            variant="contained" 
            fullWidth={isMobile}
            startIcon={<Plus size={18} />} 
            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, py: 1 }}
            onClick={() => {
              showComplexForm('Add New Book', [
                { id: 'title', label: 'Book Title', placeholder: 'e.g. Clean Code' },
                { id: 'author', label: 'Author', placeholder: 'e.g. Robert C. Martin' },
                { id: 'isbn', label: 'ISBN Number', placeholder: 'e.g. 978-0132350884' },
                { id: 'category', label: 'Category', placeholder: 'e.g. Programming' }
              ]).then(res => {
                if (res.isConfirmed && res.value) {
                  showSuccess('Book Added!', `"${res.value.title}" is now in the catalog.`);
                }
              })
            }}
          >
            Add Book
          </Button>
        )}
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: 'background.default' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Author</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Availability</TableCell>
              {!isStudent && <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }} align="center">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableSkeleton cols={6} rows={5} />
            ) : books.length > 0 ? (
              books.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>{b.id}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{b.title}</TableCell>
                  <TableCell>{b.author}</TableCell>
                  <TableCell>{b.category || 'General'}</TableCell>
                  <TableCell><Chip label="Available" size="small" color="success" variant="outlined" /></TableCell>
                  {!isStudent && (
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                        <Tooltip title="Edit Book">
                          <IconButton 
                            size="small" 
                            sx={{ 
                              bgcolor: '#f1f5f9', 
                              color: '#475569', 
                              '&:hover': { bgcolor: '#e2e8f0', color: '#1e293b' }
                            }}
                            onClick={() => handleEdit(b)}
                          >
                            <Pencil size={16} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Book">
                          <IconButton 
                            size="small" 
                            color="error" 
                            sx={{ bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' } }}
                            onClick={() => handleDelete(b.id)}
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6 }}>No books found in catalog.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Library;
