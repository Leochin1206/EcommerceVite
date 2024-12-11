// Função para carregar todos os produtos
export function loadProducts(products, section) {
 
  // Fazer uma requisição para a API Django para pegar os produtos
  fetch('http://127.0.0.1:8000/api/produtos/')  // Ajuste para o URL da sua API Django
    .then(response => response.json())
    .then(products => {
      console.log(products);
      // Filtro Novidade
      const produtosNovidades = products.filter(produto => produto.classProduto === "Novidades");
 
      // Filtro Mais Vendidos
      const produtosMaisVendidos = products.filter(produto => produto.classProduto === "Mais_Vendidos");
 
      const produtosPromoções = products.filter(produto => produto.classProduto === "Promocoes");
     
 
      function createProductCard(produto, targetSection) {
        const precoNumerico = parseFloat(produto.preco);
        if (isNaN(precoNumerico)) {
          console.error('Preço inválido:', produto.preco);
          return;
        }
        const valParcela = (precoNumerico / 10).toFixed(2);
        const card = document.createElement("div");
        card.classList.add("product-card", "idprod");
        card.id = produto.id;
     
        card.innerHTML = `
          <div>
            <img id="${produto.id}" src="${produto.imgProduto}" alt="${produto.tituloProduto}" width="168px" />
          </div>
          <div class="product-card-info-container">
            <h2 class="product-card-title" title="${produto.tituloProduto}">${produto.tituloProduto}</h2>
            <h4 class="product-card-reference">Cod. ${produto.id}</h4>
            <h3 class="product-card-price">R$ ${precoNumerico.toFixed(2)}</h3>
            <h4 class="product-card-installment">10x of R$${valParcela} interest-free</h4>
          </div>
          <div class="cart-e-compra">
            <button id="${produto.id}" class="product-card-btn">PURCHASE</button>
            <button class="product-card-btn-cart" data-id="${produto.id}"><i class="bi bi-cart"></i></button>
          </div>`;
       
        card.querySelector('.product-card-btn').addEventListener('click', () => {
          const productData = {
            id: produto.id,
            titulo: produto.tituloProduto,
            preco: precoNumerico.toFixed(2),
            descricao: produto.descricao,
            categoria: produto.catProduto,
            imagens: produto.imgProduto,
          };
          console.log(productData);    
          localStorage.setItem('selectedProduct', JSON.stringify(productData));
          window.location.href = '../product.html';
        });
     
        document.querySelector(targetSection).appendChild(card);
      }
 
      produtosNovidades.forEach(produto => createProductCard(produto, "#section-1 .carrousel"));
      produtosMaisVendidos.forEach(produto => createProductCard(produto, "#section-2 .carrousel"));
      produtosPromoções.forEach(produto => createProductCard(produto, "#section-3 .carrousel"));

    })
    .catch(error => {
      console.error('Erro ao carregar produtos:', error);
    });
}
 
 
// ----------- LOAD PRODUCTS GERAL ----------------
 
 
document.addEventListener("DOMContentLoaded", () => {
  // Carrega os produtos
  loadProducts();
 
  // Adiciona evento nos botões PURCHASE após carregar os produtos
  document.addEventListener("click", (event) => {
    if (event.target && event.target.classList.contains("product-card-btn")) {
      const productId = event.target.id; // Obtém o ID do produto
      fetch(`http://127.0.0.1:8000/api/produtos/${productId}/`) // Busca os dados do produto
        .then((response) => response.json())
        .then((product) => {
          // Salva os dados no Local Storage
          localStorage.setItem("selectedProduct", JSON.stringify(product));
          // Redireciona para a página product.html
          window.location.href = "../product.html";
        })
        .catch((error) => console.error("Erro ao carregar produto:", error));
    }
  });
});
 
 
 
 
// ------- carrousel de imagens home -------------------
 
  // Seleciona todas as seções com a classe "section-product"
  document.querySelectorAll('.section-product-carrousel').forEach(carouselSection => {
    const productCarousel = carouselSection.querySelector('.carrousel');
    const prevBtn = carouselSection.querySelector('.prev');
    const nextBtn = carouselSection.querySelector('.next');
 
    let scrollAmount = 0;
 
    nextBtn.addEventListener('click', () => {
      scrollAmount += 340; // Largura do produto + margem
      if (scrollAmount > productCarousel.scrollWidth - carouselSection.offsetWidth) {
        scrollAmount = productCarousel.scrollWidth - carouselSection.offsetWidth;
      }
      productCarousel.style.transform = `translateX(-${scrollAmount}px)`;
    });
 
    prevBtn.addEventListener('click', () => {
      scrollAmount -= 340; // Largura do produto + margem
      if (scrollAmount < 0) {
        scrollAmount = 0;
      }
      productCarousel.style.transform = `translateX(-${scrollAmount}px)`;
    });
  });
 
 
 
 
 
  function cartTotal(cartItens) {
    return cartItens.reduce((total, item) => total + item.preco * item.quantity, 0);
  }
 
 
  export function loadCartItem(cartItens,cartItensHTML){
 
    if(cartItens.length == [] || cartItens.length == [] ){
      cartItensHTML.innerHTML = `Seu carrinho está vazio`
    } else {
      cartItens.forEach(item => {  
        let html = `
        <div class="cart_item" id="${item.codigoProduto}">
                    <div class="cart_item_main_img">
                        <img src="${item.imagemProduto.img1}" alt="">
                    </div>
                    <div class="cart_item_info">
                        <p>${item.tituloProduto}</p>
                        <p>
                            R$ ${item.preco}
                            <span>Un.</span>
                        </p>
   
                        <h3>R$ ${(item.preco)*(item.quantity)}</h3>
                       <div class="cart_item_qtd_selector">
                        <div class="cart_item_qtd_selector_container">
                            <i class="bi bi-dash"></i>
                            <span>${item.quantity}</span>
                            <i class="bi bi-plus"></i>
                            </div>
                            <button id="${item.codigoProduto}" class="remove">remover</button>
                            </div>
                        </div>
                </div>
    `
    cartItensHTML.innerHTML += html
    })
    const total = cartTotal(cartItens);
    localStorage.setItem('totalValue', total);
    const price = document.querySelector('.total.container-flex:nth-child(1) h3:nth-child(2)');
    price.innerHTML = `R$ ${total.toFixed(2)}`}
 
    }
   
 
 
    export function removeCartItem(sacolaCompras) {
      let botaoDel = document.querySelectorAll("button.remove") /* remover produto do carrinho */
      let cartItens = document.querySelector(".grid_col_1")
      botaoDel.forEach(botao => botao.addEventListener('click', (event) => {
        let item = event.target.parentElement.parentElement.parentElement
        console.log(item)
        cartItens.removeChild(item)
        console.log(item.id)
        let index = sacolaCompras.findIndex(i => i.codigoProduto == item.id)
        console.log(index)
        sacolaCompras.splice(index, 1)
        console.log(sacolaCompras)
        localStorage.setItem('listaCompras', JSON.stringify(sacolaCompras))
   
        // Update the price element here
        const total = cartTotal(sacolaCompras);
        localStorage.setItem('totalValue', total);
        const price = document.querySelector('.total.container-flex:nth-child(1) h3:nth-child(2)');
        price.innerHTML = `R$ ${total.toFixed(2)}`;
       
      }));
    }
 
 
  export function shop(pedidos){
 
  const form = document.querySelector('#billing form');
  const inputs = form.querySelectorAll('input,select');
  const inputValues = {};
  inputs.forEach((input) => {
    if (input.type!== 'submit' && input.type!== 'button') {
      inputValues[input.name] = input.value;
    }
  });
  console.log(inputValues);
  const order = {
     id: pedidos.length > 0? pedidos[pedidos.length - 1].id + 1 : 1,
     address:{...inputValues},
     items: JSON.parse(localStorage.getItem("listaCompras")),
     totalValue: parseFloat(localStorage.getItem("totalValue"))
  };
 
  pedidos.push(order);
  localStorage.setItem("pedidos", JSON.stringify(pedidos));;
  alert("pedido realizado com sucesso")
  localStorage.removeItem("listaCompras");
  localStorage.removeItem("totalValue");
  window.location = "./index.html"
  }


// // Importação da base de dados e das funções
// import { database } from "./database.js";
// import { getProdId, loadProducts } from "./functions.js";

// // -------- Variáveis do projeto ------------------------
// const sectionNovidades = document.querySelector("#section-1 .carrousel");
// const sectionMaisVendidos = document.querySelector("#section-2 .carrousel");
// const sectionPromocoes = document.querySelector("#section-3 .carrousel");

// // Filtros
// let filtroCategoriaNovidades = database.filter(produto => produto.classificacaoProduto === "Novidades" && produto.exibirHome == true);
// let filtroMaisVendidos = database.filter(produto => produto.classificacaoProduto === "Mais_Vendidos" && produto.exibirHome == true);
// let filtroPromocoes = database.filter(produto => produto.classificacaoProduto === "Promocoes" && produto.exibirHome == true);

// // Funções com parâmetros
// loadProducts(filtroCategoriaNovidades, sectionNovidades);
// loadProducts(filtroMaisVendidos, sectionMaisVendidos);
// loadProducts(filtroPromocoes, sectionPromocoes);
// getProdId();

// // ------- Carrousel de produtos (Seção Novidades) -------------------
// const productCarousel1 = document.querySelector('#section-1 .carrousel');
// const prevBtn1 = document.querySelector('#section-1 .prev');
// const nextBtn1 = document.querySelector('#section-1 .next');

// let scrollAmount1 = 0;
// const cardWidth = 270; // Ajuste para a largura do card

// nextBtn1.addEventListener('click', () => {
//   scrollAmount1 += cardWidth; // Avança um card
//   if (scrollAmount1 > productCarousel1.scrollWidth - productCarousel1.parentElement.offsetWidth) {
//     scrollAmount1 = productCarousel1.scrollWidth - productCarousel1.parentElement.offsetWidth;
//   }
//   productCarousel1.style.transform = `translateX(-${scrollAmount1}px)`;
// });

// prevBtn1.addEventListener('click', () => {
//   scrollAmount1 -= cardWidth; // Retrocede um card bn 
//   if (scrollAmount1 < 0) {
//     scrollAmount1 = 0;
//   }
//   productCarousel1.style.transform = `translateX(-${scrollAmount1}px)`;
// });

// // ------- Carrousel de produtos (Seção Mais Vendidos) -------------------
// const productCarousel2 = document.querySelector('#section-2 .carrousel');
// const prevBtn2 = document.querySelector('#section-2 .prev');
// const nextBtn2 = document.querySelector('#section-2 .next');

// let scrollAmount2 = 0;

// nextBtn2.addEventListener('click', () => {
//   scrollAmount2 += cardWidth; // Avança um card
//   if (scrollAmount2 > productCarousel2.scrollWidth - productCarousel2.parentElement.offsetWidth) {
//     scrollAmount2 = productCarousel2.scrollWidth - productCarousel2.parentElement.offsetWidth;
//   }
//   productCarousel2.style.transform = `translateX(-${scrollAmount2}px)`;
// });

// prevBtn2.addEventListener('click', () => {
//   scrollAmount2 -= cardWidth; // Retrocede um card
//   if (scrollAmount2 < 0) {
//     scrollAmount2 = 0;
//   }
//   productCarousel2.style.transform = `translateX(-${scrollAmount2}px)`;
// });

// // ------- Carrousel de produtos (Seção Mais Vendidos) -------------------
// const productCarousel3 = document.querySelector('#section-3 .carrousel');
// const prevBtn3 = document.querySelector('#section-3 .prev');
// const nextBtn3 = document.querySelector('#section-3 .next');

// let scrollAmount3 = 0;

// nextBtn3.addEventListener('click', () => {
//   scrollAmount3 += cardWidth; // Avança um card
//   if (scrollAmount3 > productCarousel3.scrollWidth - productCarousel3.parentElement.offsetWidth) {
//     scrollAmount3 = productCarousel3.scrollWidth - productCarousel3.parentElement.offsetWidth;
//   }
//   productCarousel3.style.transform = `translateX(-${scrollAmount3}px)`;
// });

// prevBtn3.addEventListener('click', () => {
//   scrollAmount3 -= cardWidth; // Retrocede um card
//   if (scrollAmount3 < 0) {
//     scrollAmount3 = 0;
//   }
//   productCarousel3.style.transform = `translateX(-${scrollAmount3}px)`;
// });

// // Slide automático (caso ainda queira usar)
// let currentSlide = 0;
// const slides = document.querySelectorAll('.banner img');
// const totalSlides = slides.length;

// function showSlide(index) {
//   currentSlide = (index + totalSlides) % totalSlides;
//   const offset = -currentSlide * 100;
//   document.querySelector('.banner').style.transform = `translateX(${offset}%)`;
// }

// function moveSlide(direction) {
//   showSlide(currentSlide + direction);
// }

// // Slide automático a cada 3 segundos
// setInterval(() => {
//   moveSlide(1);
// }, 3000);
