import { loadCartItem, removeCartItem } from "./functions.js";

// Carrega os itens do carrinho
let cartItens = JSON.parse(localStorage.getItem("listaCompras")) || [];

// Carrega os pedidos (caso existam)
let pedidos = JSON.parse(localStorage.getItem("pedidos"));
if (pedidos == null) {
    pedidos = []; // Criando uma lista de pedidos vazia
}

// Função para calcular o subtotal
function calculateSubtotal(cartItems) {
    let subtotal = 0;
    cartItems.forEach(item => {
        subtotal += item.preco * item.quantidade; // Supondo que cada item tenha os atributos "preco" e "quantidade"
    });
    return subtotal;
}

// Função para calcular o frete (simulação)
function calculateFrete(cep) {
    // Exemplo simples: valores de frete baseados no CEP (pode ser alterado conforme necessidade)
    let frete = 0;
    if (cep) {
        // Simulação de cálculo de frete
        frete = 20.0; // Exemplo de valor fixo de frete
    }
    return frete;
}

// Função para atualizar os valores na tela
function updateTotals() {
    let subtotal = calculateSubtotal(cartItens);
    let frete = parseFloat(document.querySelector("#cepInput").value) ? calculateFrete(document.querySelector("#cepInput").value) : 0;
    let total = subtotal + frete;

    // Atualiza os valores na tela
    document.getElementById("subtotal").innerText = `R$ ${subtotal.toFixed(2)}`;
    document.getElementById("frete").innerText = `R$ ${frete.toFixed(2)}`;
    document.getElementById("total").innerText = `R$ ${total.toFixed(2)}`;
}

// Carrega os itens no carrinho
let cartItensHTML = document.querySelector('#checkout .grid_col_1');
loadCartItem(cartItens, cartItensHTML);
removeCartItem(cartItens);

// Atualiza o total quando o CEP for inserido e o botão for clicado
document.querySelector(".freight_container button").addEventListener("click", function(event) {
    event.preventDefault();
    updateTotals(); // Atualiza o total quando o botão de frete for clicado
});
