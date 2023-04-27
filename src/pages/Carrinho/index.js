import { Button, Snackbar, InputLabel, Select, MenuItem } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { useState } from 'react';
import { Container, Voltar, TotalContainer, PagamentoContainer } from './styles';
import { useCarrinhoContext } from 'common/context/Carrinho';
import Produto from 'components/Produto';
import { useHistory } from 'react-router-dom'
import { usePagamentoContext } from 'common/context/Pagamento';
import { useContext } from 'react';
import { UsuarioContext } from 'common/context/Usuario';
import { useMemo } from 'react';
function Carrinho() {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { carrinho, valorTot, realizarCompra } = useCarrinhoContext()
  const { saldo = 0 } = useContext(UsuarioContext)
  const { tiposPagamento, mudaFormaPagamento, formaPagamento } = usePagamentoContext()
  const history = useHistory()
  const total = useMemo(()=> saldo - valorTot, [saldo, valorTot])
  return (
    <Container>
      <Voltar onClick={() => history.goBack()} />
      <h2>
        Carrinho
      </h2>
      {carrinho.map((produto) => (
        <Produto {...produto} key={produto.id} />
      ))}
      <PagamentoContainer>
        <InputLabel> Forma de Pagamento: {formaPagamento.nome}</InputLabel>
        <Select
          value={formaPagamento.id}
          onChange={(e) => mudaFormaPagamento(e.target.value)}
        >
          {tiposPagamento.map(item => (
            <MenuItem key={item.id} value={item.id}> {item.nome} </MenuItem>
          ))}
        </Select>
      </PagamentoContainer>
      <TotalContainer>
        <div>
          <h2>Total no Carrinho: </h2>
          <span>R$ {valorTot.toFixed(2)}</span>
        </div>
        <div>
          <h2> Saldo: </h2>
          <span> R$ {Number(saldo).toFixed(2)}</span>
        </div>
        <div>
          <h2> Saldo Total: </h2>
          <span> R$ {total.toFixed(2)}</span>
        </div>
      </TotalContainer>
      <Button
        onClick={() => {
          realizarCompra()
          setOpenSnackbar(true);
        }}
        disabled = {total < 0 || carrinho.length < 1}
        color="primary"
        variant="contained"
      >
        Comprar
      </Button>
      <Snackbar
        anchorOrigin={
          {
            vertical: 'top',
            horizontal: 'right'
          }
        }
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
      >
        <MuiAlert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
        >
          Compra feita com sucesso!
        </MuiAlert>
      </Snackbar>
    </Container>
  )
}

export default Carrinho;