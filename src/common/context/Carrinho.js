import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import { usePagamentoContext } from "./Pagamento";
import { UsuarioContext } from "./Usuario";


export const CarrinhoContext = createContext();
CarrinhoContext.displayName = "Carrinho"

export const CarrinhoProvider = ({ children }) => {
    const [carrinho, setCarrinho] = useState([])
    const [qntProd, setQntProd] = useState(0)
    const [valorTot, setValorTot] = useState(0)
    return (
        <CarrinhoContext.Provider value={{ carrinho, setCarrinho, qntProd, setQntProd, valorTot, setValorTot }}>
            {children}
        </CarrinhoContext.Provider>
    )
}

export const useCarrinhoContext = () => {
    const { carrinho, setCarrinho, qntProd, setQntProd, valorTot, setValorTot } = useContext(CarrinhoContext)
    const { formaPagamento } = usePagamentoContext()
    const {setSaldo, saldo} = useContext(UsuarioContext)
    function mudarQuant(id, quantidade) {
        return carrinho.map(item => {
            if (item.id === id) item.quantidade += quantidade
            return item
        })
    }

    function addProd(prod) {
        const temProd = carrinho.some(item => item.id === prod.id)
        if (!temProd) {
            prod.quantidade = 1
            return setCarrinho(carrinhoAnt => [...carrinhoAnt, prod])
        }

        setCarrinho(mudarQuant(prod.id, 1))

    }

    function removeProd(id) {
        const prod = carrinho.find((item) => item.id === id)
        const ehUltimo = prod.quantidade === 1
        if (ehUltimo) {
            return setCarrinho(carrinhoAnterior => carrinhoAnterior.filter(item => item.id !== id))
        }

        setCarrinho(mudarQuant(prod.id, -1))

    }

    function realizarCompra(){
        setCarrinho([])
        setSaldo(saldo - valorTot)
    }

    useEffect(()=>{
        const {novaQnt, novoTot} = carrinho.reduce((c, prod) => ({
            novaQnt: c.novaQnt + prod.quantidade,
            novoTot: c.novoTot + (prod.valor * prod.quantidade)
        }), {novaQnt: 0, novoTot: 0})
        setQntProd(novaQnt)
        setValorTot(novoTot * formaPagamento.juros)
    }, [carrinho, setQntProd ,setValorTot, formaPagamento])

    return {
        carrinho, setCarrinho, addProd, removeProd, qntProd, setQntProd, valorTot, realizarCompra
    }
}