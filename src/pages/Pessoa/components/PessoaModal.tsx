import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import { Pessoa } from '../../../services/endpoints/PessoaEndpoint';
import { validateCPF } from '../../../helpers/Validators';
import { enqueueSnackbar } from 'notistack';
import api from '../../../services/api';

export type ModalProps = {
  isOpen: boolean;
  handleClose: () => void;
  pessoaEdit?: Pessoa;
};

const validStyle = {
  '& label.Mui-focused': {
    color: '#1976d2',
  },
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: '#1976d2',
    },
  },
};

const invalidStyle = {
  '& label.Mui-focused': {
    color: '#f44336',
  },
  '& label': {
    color: '#f44336',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#f44336',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#f44336',
    },
  },
};

function PessoaModal(props: ModalProps) {
  const { isOpen, handleClose: closeModal, pessoaEdit } = props;
  const [pessoa, setPessoa] = useState<Pessoa>({...pessoaEdit, cpf: pessoaEdit?.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')} || new Pessoa());
  const [cpfValid, setCpfValid] = useState(true);
  const [emailValid, setEmailValid] = useState(true);
  const [blockSave, setBlockSave] = useState(false);

  function setPessoaValue(value: string, field: string) {
    setPessoa({ ...pessoa, [field]: value });
  }

  async function handleSave() {
    try {
      const formattedCpf = pessoa.cpf.replace(/\D/g, '');
      await api.pessoa.create({ ...pessoa, cpf: formattedCpf });
      enqueueSnackbar('Pessoa criada com sucesso', { variant: 'success' });
      handleClose();
    } catch (error) {
      const rawMessage = error.response.data.message;
      let message = rawMessage;
      console.log(rawMessage);
      if (rawMessage.includes('pessoa.cpf')) message = 'CPF já cadastrado';
      enqueueSnackbar(`Erro ao criar pessoa: ${message}`, { variant: 'error' });
    }
  }

  async function handleUpdate() {
    try {
      const diff = pessoaEdit ? Object.keys(pessoa).filter((key) => pessoa[key] !== pessoaEdit[key]) : [];
      if (diff.length === 0) return enqueueSnackbar('Nenhuma alteração realizada', { variant: 'warning' });
      const fieldsToUpdate = diff.reduce((acc, key) => ({ ...acc, [key]: pessoa[key] }), {});
      await api.pessoa.update(pessoa.id, { ...fieldsToUpdate });
      enqueueSnackbar('Pessoa atualizada com sucesso', { variant: 'success' });
      handleClose();
    } catch (error) {
      const rawMessage = error.response.data.message;
      let message = rawMessage;
      console.log(rawMessage);
      if (rawMessage.includes('pessoa.cpf')) message = 'CPF já cadastrado';
      enqueueSnackbar(`Erro ao atualizar pessoa: ${message}`, {
        variant: 'error',
      });
    }
  }

  function clearFields() {
    setPessoa(new Pessoa());
    setCpfValid(true);
    setEmailValid(true);
  }

  function handleClose() {
    clearFields();
    closeModal();
  }

  function setAndValidateCPF(cpf: string) {
    const isValid = validateCPF(cpf);
    setCpfValid(isValid);
    const maskedValue = cpf
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    if (maskedValue.length <= 14) setPessoaValue(maskedValue, 'cpf');
  }

  function setAndValidateEmail(email: string) {
    const isValid = email.includes('@') && email.includes('.');
    setEmailValid(isValid);
    if (email.length < 100) setPessoaValue(email, 'email');
  }

  function anyEmptyFields() {
    return (
      !pessoa.nome?.length || !pessoa.email?.length || !pessoa.dataNascimento
    );
  }

  useEffect(() => {
    setBlockSave(!cpfValid || !emailValid || anyEmptyFields());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pessoa]);

  return (
    <Dialog open={isOpen} onClose={handleClose} sx={{}}>
      <DialogTitle>{pessoaEdit ? 'Editar Pessoa' : 'Nova Pessoa'}</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Box style={{ backgroundColor: 'white' }}>
          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              maxWidth: '600px',
              alignItems: 'center',
              justifyContent: 'justify-content',
              gap: '24px',
              padding: '0px 16px',
            }}
          >
            <TextField
              type="text"
              label="Nome"
              placeholder="Digite o nome"
              value={pessoa.nome}
              onChange={(e) => setPessoaValue(e.target.value, 'nome')}
            />
            <TextField
              type="text"
              label="CPF"
              placeholder="Digite o CPF"
              disabled={!!pessoaEdit}
              value={pessoa.cpf}
              sx={cpfValid ? validStyle : invalidStyle}
              onChange={(e) => setAndValidateCPF(e.target.value)}
            />
            <TextField
              type="text"
              label="E-mail"
              placeholder="Digite o e-mail"
              value={pessoa.email}
              sx={emailValid ? validStyle : invalidStyle}
              onChange={(e) => setAndValidateEmail(e.target.value)}
            />
            <TextField
              type="date"
              label="Data de Nascimento"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={pessoa.dataNascimento}
              onChange={(e) => setPessoaValue(e.target.value, 'dataNascimento')}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Box
          sx={{
            padding: '8px 14px 8px 0px',
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '16px',
          }}
        >
          <Button
            variant="outlined"
            onClick={() => handleClose()}
            style={{ width: '120px' }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={() => pessoaEdit ? handleUpdate() : handleSave()}
            style={{ width: '120px' }}
            disabled={blockSave}
          >
            Salvar
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default PessoaModal;
