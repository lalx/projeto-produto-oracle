document.addEventListener('DOMContentLoaded', function() {

 
    var btnAddCarrinho = document.querySelectorAll('.btnAddCarrinho');
    for(var i = 0; i < btnAddCarrinho.length; i++){
        btnAddCarrinho[i].addEventListener('click', adicionarAoCarrinho);
    }


    //atualizar contador
    let listaCarrinho = localStorage.getItem("carrinho");
    if(listaCarrinho != null && listaCarrinho != ""){
        listaCarrinho = JSON.parse(listaCarrinho);
        document.getElementById("contadorCarrinho").innerText = listaCarrinho.length;
    }

    let modalCarrinho = document.getElementById("carrinhoModal");
    modalCarrinho.addEventListener("show.bs.modal", carregarCarrinho);

    var btnGravarPedido = document.getElementById("btnGravarPedido");
    btnGravarPedido.addEventListener("click", gravarPedido);
})

function gravarPedido() {
    let carrinho = localStorage.getItem('carrinho');

    if(carrinho != null && carrinho != ''){

        fetch('/gravar-pedido', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: carrinho
        })
        .then(r => {
            return r.json();
        })
        .then(function(r) {
            if(r.ok){
                alert("Pedido gravado com sucesso");
                //remove tudo do localStorage
                //localStorage.clear();
                //remove apenas uma chave com seu valor do local
                localStorage.removeItem('carrinho');
                document.getElementById("valorTotalCarrinho").innerHTML = "";
                document.getElementById("corpoTabelaCarrinho").innerHTML = "";
                document.getElementById("contadorCarrinho").innerText = 0;
            }
            else{
                alert(r.msg);
            }
        })
        .catch(function(e) {

        })
    }
    else{
        alert("Carrinho vazio!!!");
    }
}

function calculaTotalCarrinho() {

    let carrinho = localStorage.getItem('carrinho');
    let valorTotal = 0;
    if(carrinho != null && carrinho != ''){
        let listaCarrinho = JSON.parse(carrinho);

        for(let i = 0; i<listaCarrinho.length; i++){
            valorTotal += listaCarrinho[i].preco * listaCarrinho[i].quantidade;
        }
    }

    return valorTotal.toFixed(2).toString().replace('.', ',');
}

function mudaInputValue(id){
    let qtde = document.getElementById("inputQtde-" + id).value;

    if(qtde <= 0 || qtde > 1000) {
        qtde = 1;
    }

    let carrinho = localStorage.getItem('carrinho');
    if(carrinho != null && carrinho != ''){
        let listaCarrinho = JSON.parse(carrinho);

        for(let i = 0; i < listaCarrinho.length; i++){
            if(id == listaCarrinho[i].id){
                listaCarrinho[i].quantidade = parseInt(qtde);
            }
        }

        document.getElementById("inputQtde-" + id).value = parseInt(qtde);
        localStorage.setItem('carrinho', JSON.stringify(listaCarrinho));
        let valorTotal = calculaTotalCarrinho();
        document.getElementById("valorTotalCarrinho").innerHTML = "<h3>Valor total: R$ "+ valorTotal +"</h3>";
    }

}

function aumentarQtde(id) {

    let carrinho = localStorage.getItem('carrinho');
    if(carrinho != null && carrinho != ''){
        let listaCarrinho = JSON.parse(carrinho);
        let qtdeAtual = 0;

        for(let i = 0; i<listaCarrinho.length; i++){
            if(id == listaCarrinho[i].id){
                listaCarrinho[i].quantidade += 1;
                qtdeAtual = listaCarrinho[i].quantidade;
            }
        }
        
        localStorage.setItem('carrinho', JSON.stringify(listaCarrinho));
        //carregarCarrinho();
        document.getElementById("inputQtde-" + id).value = parseInt(qtdeAtual);
        let valorTotal = calculaTotalCarrinho();
        document.getElementById("valorTotalCarrinho").innerHTML = "<h3>Valor total: R$ "+ valorTotal +"</h3>";
    }
}

function diminuirQtde(id) {
    let carrinho = localStorage.getItem('carrinho');
    if(carrinho != null && carrinho != ''){
        let listaCarrinho = JSON.parse(carrinho);
        let qtdeAtual = 0;

        for(let i = 0; i<listaCarrinho.length; i++){
            if(id == listaCarrinho[i].id) {
                
                if(listaCarrinho[i].quantidade > 1){
                    listaCarrinho[i].quantidade -= 1;
                }
                
                qtdeAtual = listaCarrinho[i].quantidade;
            }
        }
        
        localStorage.setItem('carrinho', JSON.stringify(listaCarrinho));
        //carregarCarrinho();
        document.getElementById("inputQtde-" + id).value = parseInt(qtdeAtual);
        let valorTotal = calculaTotalCarrinho();
        document.getElementById("valorTotalCarrinho").innerHTML = "<h3>Valor total: R$ "+ valorTotal +"</h3>";
    }
}

function excluirItem(id) {

    if(confirm("Tem certeza que deseja excluir?")){
        let carrinho = localStorage.getItem('carrinho');
        if(carrinho != "" && carrinho != null) {
            let listaCarrinho = JSON.parse(carrinho);
    
            listaCarrinho = listaCarrinho.filter(produto => produto.id != id);
            document.getElementById("contadorCarrinho").innerText = listaCarrinho.length;
            localStorage.setItem("carrinho", JSON.stringify(listaCarrinho));
        }
    
        carregarCarrinho();
        let valorTotal = calculaTotalCarrinho();
        document.getElementById("valorTotalCarrinho").innerHTML = "<h3>Valor total: R$ "+ valorTotal +"</h2>";
    }
}

function carregarCarrinho() {
    
    let carrinho  = localStorage.getItem('carrinho');
    if(carrinho != null && carrinho != "") {
        let listaCarrinho = JSON.parse(carrinho);

        let htmlCorpoModal = "";
        for(let i = 0; i< listaCarrinho.length; i++) {
            var obj = listaCarrinho[i];
            htmlCorpoModal += `<tr>
                                    <td>
                                        <div class="itemCarrinho">
                                            <div>
                                                <img width='100' alt='Imagem produto' src='${obj.imagem}' />
                                            </div> 
                                            <div class='descricaoItem'>
                                                <div> ${obj.nome} </div>
                                                <div> ${obj.marcaNome} </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div>R$ ${obj.preco.replace(".", ",")}</div>
                                    </td>
                                    <td>
                                        <div class='divBotoesCarrinho'>
                                            <button class='btn btn-secondary aumentarQtde' onclick='aumentarQtde(${obj.id})'>+</button>
                                            <input id='inputQtde-${obj.id}' onchange='mudaInputValue(${obj.id})' style='width:50px;' class='form-control' value='${obj.quantidade}'/>
                                            <button class='btn btn-secondary diminuirQtde' onclick='diminuirQtde(${obj.id})'>-</button>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <button class='btn btn-danger excluirItem' onclick='excluirItem(${obj.id})' >Excluir</button>
                                        </div>
                                    </td>
                                </tr>`;
        }

        document.getElementById("corpoTabelaCarrinho").innerHTML = htmlCorpoModal;
        let valorTotal = calculaTotalCarrinho();
        document.getElementById("valorTotalCarrinho").innerHTML = "<h3>Valor total: R$ "+ valorTotal +"</h3>";
    }
    else {
        document.getElementById("corpoModal").innerHTML = 'Carrinho vazio!';
    }
}

function adicionarAoCarrinho() {

    var produtoId = this.dataset.produto;

    if(produtoId != null && produtoId != ""){

        fetch('/admin/produto/buscar', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: produtoId})
        })
        .then(r=> {
            return r.json();
        })
        .then(r=> {
            if(r.ok) {
                console.log(r.retorno);
                let listaCarrinho = [];
                let carrinho = localStorage.getItem("carrinho");
                if(carrinho != null && carrinho != "") {

                    //recupera
                    listaCarrinho = JSON.parse(carrinho);

                    //buscar produto igual;
                    let adiciona = true;
                    for(let i = 0; i<listaCarrinho.length; i++){
                        if(r.retorno.id == listaCarrinho[i].id) {
                            listaCarrinho[i].quantidade += 1;
                            adiciona = false;
                        }
                    }

                    //adiciona apenas se nao tiver outro igual
                    if(adiciona == true) {
                        r.retorno.quantidade = 1;
                        listaCarrinho.push(r.retorno);
                    }
                        
                    //atualiza o localstorage
                    localStorage.setItem("carrinho", JSON.stringify(listaCarrinho));
                }
                else {
                    //somente adiciona no localstorage
                    r.retorno.quantidade = 1;
                    listaCarrinho.push(r.retorno);
                    localStorage.setItem('carrinho', JSON.stringify(listaCarrinho));
                }

                document.getElementById("contadorCarrinho").innerText = listaCarrinho.length;
                alert("Produto adicionado ao carrinho!");
            }
            else {
                alert(r.msg);
            }
                
        })
        .catch(e => {
            console.log(e);
        })
    }
}