import { Box, Button } from '@mui/material';
import PlusIcon from '../images/addIcon.svg';
import DeleteIcon from '../images/deleteIcon.svg'
import ReloadIcon from '../images/reloadIcon.svg'

export type ButtonProps = {
  onClick: () => void;
  label: string;
  leftIcon: 'plus' | 'trash' | 'reload';
};

const iconMap = {
  plus: PlusIcon,
  reload: ReloadIcon,
  trash: DeleteIcon
};

function ButtonIcon(props: ButtonProps) {
  const { onClick, label, leftIcon } = props;
  return (
    <Box>
      <Button
        style={{ textTransform: 'none' }}
        variant="contained"
        color="primary"
        onClick={() => {
          onClick();
        }}
      >
        <img
          src={iconMap[leftIcon]}
          alt="icon"
          style={{ width: '16px', height: '16px', marginRight: '8px' }}
        />
        {label}
      </Button>
    </Box>
  );
}

export default ButtonIcon;
