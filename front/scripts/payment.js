// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', () => {
    // Recupera os dados do localStorage com valores padrão se null
    const subtotal = parseFloat(localStorage.getItem('subtotal')) || 0;
    const frete = parseFloat(localStorage.getItem('frete')) || 0;
    const totalCarrinho = parseFloat(localStorage.getItem('totalCarrinho')) || subtotal;
 
    // Atualiza a interface apenas se os elementos existirem
    const subtotalElement = document.getElementById('subtotal');
    const freteElement = document.getElementById('frete');
    const totalCarrinhoElement = document.getElementById('totalCarrinho');
 
    if (subtotalElement) subtotalElement.innerText = `R$ ${subtotal.toFixed(2)}`;
    if (freteElement) freteElement.innerText = `R$ ${frete.toFixed(2)}`;
    if (totalCarrinhoElement) totalCarrinhoElement.innerText = `R$ ${(subtotal + frete).toFixed(2)}`;
 
    let pedidos = JSON.parse(localStorage.getItem("pedidos")) || []; // Lista de pedidos vazia, se não existir
 
    const shopBtn = document.querySelector("button.checkout_btn");
    if (shopBtn) {
      shopBtn.addEventListener("click", () => {
        shop(pedidos);
      });
    }
  });