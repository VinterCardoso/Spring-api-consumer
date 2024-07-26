import { GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box } from '@mui/material';
import PessoaModal from './PessoaModal';
import { useState } from 'react';
import api from '../../../services/api';
import { enqueueSnackbar } from 'notistack';

function RenderActions(params) {
    const { id } = params.row;
    const [isEditOpen, setIsEditOpen] = useState(false);

    function handleEditRow() {
        setIsEditOpen(true);
    }

    async function handleDeleteRow() {
        try {
            await api.pessoa.delete(id);
            enqueueSnackbar('Pessoa deletada com sucesso', { variant: 'success' });
            window.location.reload();
        } catch (error) {
            enqueueSnackbar('Erro ao deletar pessoa', { variant: 'error' });
        }
    }

  return (
    <Box sx={{display:'flex', justifyContent:'space-around', marginTop:'10px'}}>
    <PessoaModal isOpen={isEditOpen} handleClose={() => setIsEditOpen(false)} pessoaEdit={params.row} />
      <GridActionsCellItem
        icon={<EditIcon />}
        label="Edit"
        onClick={() => handleEditRow(id) }
      />
      <GridActionsCellItem icon={<DeleteIcon />} onClick={() => handleDeleteRow()} label="Delete" />
    </Box>
  );
}

export default RenderActions;
