import { Nav } from './styles';
import { ReactComponent as Logo } from 'assets/logo.svg';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import { useCarrinhoContext } from 'common/context/Carrinho';
import { useHistory } from 'react-router-dom';

export default function NavBar() {
  const {qntProd} = useCarrinhoContext()
  const history = useHistory()
  return (
    <Nav>
      <Logo />
      <IconButton disabled = {qntProd === 0}>
        <Badge
          color="primary"
          badgeContent={qntProd}
          onClick = {() => history.push('/carrinho')}
        >
          <ShoppingCartIcon />
        </Badge>
      </IconButton>
    </Nav>
  )
}