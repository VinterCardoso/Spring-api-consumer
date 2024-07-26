import { Box, TextField } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridInputRowSelectionModel,
  GridRowSelectionModel,
} from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import api from '../../services/api';
import { Pessoa } from '../../services/endpoints/PessoaEndpoint';
import ButtonIcon from '../../components/Button';
import PessoaModal from './components/PessoaModal';
import RenderActions from './components/RenderActions';
import { useDebounce } from 'use-debounce';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'nome', headerName: 'Nome', width: 150 },
  { field: 'cpf', headerName: 'CPF', width: 120 },
  { field: 'email', headerName: 'E-mail', width: 230 },
  { field: 'dataNascimento', headerName: 'Data de Nascimento', width: 150 },
  {
    field: 'action',
    headerName: '',
    sortable: false,
    renderCell: RenderActions,
    width: 100,
  },
];

function ListPessoa() {
  const [rows, setRows] = useState<Pessoa[]>([]);
  const [shouldReload, setShouldReload] = useState(0);
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [isOpen, setIsOpen] = useState(false);

  function reload() {
    setShouldReload((prev) => prev + 1);
  }

  function handleClose() {
    setIsOpen(false);
    reload();
  }

  useEffect(() => {
    async function getPessoas() {
      try {
        if (!debouncedSearch) {
          const res = await api.pessoa.getAll();
          setRows(res.data || []);
          return;
        }
        const res = await api.pessoa.getByNome(debouncedSearch);
        setRows(res.data || []);
      } catch (error) {
        enqueueSnackbar('Erro ao buscar pessoas', { variant: 'error' });
      }
    }

    getPessoas();
  }, [shouldReload, debouncedSearch]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        overflow: 'hidden',
        backgroundColor: 'white',
        padding: '64px',
        margin: '1px solid #000',
        borderRadius: '8px',
      }}
    >
      <Box
        sx={{
          width: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          paddingBottom: '32px',
        }}
      >
        <ButtonIcon
          label="Atualizar"
          leftIcon="reload"
          onClick={() => {
            reload();
          }}
        />
        <ButtonIcon
          label="Novo registro"
          leftIcon="plus"
          onClick={() => {
            setIsOpen(true);
          }}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: '64px',
        }}
      >
        <PessoaModal isOpen={isOpen} handleClose={() => handleClose()} />
        <Box width="100%" height="100%">
          <TextField
            fullWidth
            placeholder="Buscar"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ marginBottom: '16px' }}
          />
          <Box sx={{height: '550px'}}>
            <DataGrid
              rows={rows}
              columns={columns}
              checkboxSelection
              onRowSelectionModelChange={(newselectedRows) => {
                setSelectedRows(newselectedRows);
              }}
              disableColumnFilter
              disableColumnMenu
              disableSelectionOnClick
              disableRowSelectionOnClick
              disableColumnResize
              hideFooter
              initialState={{ pinnedColumns: { right: ['actions'] } }}
              rowSelectionModel={selectedRows as GridInputRowSelectionModel}
              sx={{ maxHeight: '700px', height: '100%' }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default ListPessoa;
