const CategoriaModel = require("../models/categoriaModel");
const MarcaModel = require("../models/marcaModel");
const ProdutoModel = require("../models/produtoModel");
const { basename } = require("path");
const { randomUUID } = require('crypto');
const StorageService = require("../services/storage");

class ProdutoController {

    async listarView(req, res) {
        let prod = new ProdutoModel();
        let lista = await prod.listarProdutos();
        res.render('produto/listar', { lista: lista });
    }

    async buscaProduto(req, res) {
        var ok = true;
        var msg = ""
        var retorno = null;
        if (req.body.id != null && req.body.id != "") {
            let prod = new ProdutoModel();
            prod = await prod.buscarProduto(req.body.id);

            retorno = {
                nome: prod.produtoNome,
                preco: prod.produtoPreco,
                id: prod.produtoId,
                marcaNome: prod.marcaNome,
                categoriaNome: prod.categoriaNome,
                imagem: prod.produtoImagem
            };
        }
        else {
            ok = false;
            msg = "Parâmetro inválido!";
        }

        res.send({ ok: ok, msg: msg, retorno: retorno })
    }

    async excluirProduto(req, res) {
        try {
            var ok = true;
        if (req.body.codigo != "") {
            let produto = new ProdutoModel();
            produto = await produto.buscarProduto(req.body.codigo);
            ok = await produto.excluir(req.body.codigo);
            
            const storageService = new StorageService();

            storageService.deleteObject(basename(produto.produtoImagem));
        }
        else {
            ok = false;
        }

        res.send({ ok: ok });
        } catch (error) {
            console.log(error);
            return res.send({ ok: false });
        }
    }
    async cadastrarProduto(req, res) {
        try {
            var ok = true;
            if (req.body.codigo != "" && req.body.nome != "" && req.body.quantidade != "" && req.body.quantidade != '0' && req.body.marca != '0' && req.body.categoria != '0' && req.file != null && (req.file.originalname.includes(".jpg") || req.file.originalname.includes(".png")) && req.body.preco != '' && req.body.preco > '0') {
                const storageService = new StorageService();
                const fileUrl = await storageService.sendObject(`${randomUUID()}.${basename(req.file.originalname).split(".")[1]}`, req.file.buffer);
                let produto = new ProdutoModel(0, req.body.codigo, req.body.nome, req.body.quantidade, req.body.categoria, req.body.marca, "", "", fileUrl, req.body.preco);
    
                ok = await produto.gravar();
            }
            else {
                ok = false;
            }
    
            res.send({ ok: ok })
        } catch (error) {
            console.log(error);
            return res.send({ ok: false });
        }
    }

    async alterarView(req, res) {
        let produto = new ProdutoModel();
        let marca = new MarcaModel();

        let categoria = new CategoriaModel();
        if (req.params.id != undefined && req.params.id != "") {
            produto = await produto.buscarProduto(req.params.id);
        }

        let listaMarca = await marca.listarMarcas();
        let listaCategoria = await categoria.listarCategorias();
        res.render("produto/alterar", { produtoAlter: produto, listaMarcas: listaMarca, listaCategorias: listaCategoria });
    }

    async alterarProduto(req, res) {
        var ok = true;
        if (req.body.codigo != "" && req.body.nome != "" && req.body.quantidade != "" && req.body.quantidade != '0' && req.body.marca != '0' && req.body.categoria != '0' && req.file != null && (req.file.originalname.includes(".jpg") || req.file.originalname.includes(".png")) && req.body.preco != '' && req.body.preco > '0') {
            const storageService = new StorageService();
            const fileUrl = await storageService.sendObject(`${randomUUID()}.${basename(req.file.originalname).split(".")[1]}`, req.file.buffer);
                let produto = new ProdutoModel(req.body.id, req.body.codigo, req.body.nome, req.body.quantidade, req.body.categoria, req.body.marca, "", "", fileUrl, req.body.preco);

            let produtoOld = await produto.buscarProduto(req.body.id);

            if (produtoOld.produtoImagem != null && produtoOld.produtoImagem != "") {
                if (produtoOld.produtoImagem) {
                    storageService.deleteObject(produtoOld.produtoImagem)
                }
            }

            ok = await produto.gravar();
        }
        else {
            ok = false;
        }

        res.send({ ok: ok })
    }

    async cadastroView(req, res) {

        let listaMarcas = [];
        let listaCategorias = [];

        let marca = new MarcaModel();
        listaMarcas = await marca.listarMarcas();

        let categoria = new CategoriaModel();
        listaCategorias = await categoria.listarCategorias();

        res.render('produto/cadastro', { listaMarcas: listaMarcas, listaCategorias: listaCategorias });
    }
}

module.exports = ProdutoController;

/*const CategoriaModel = require("../models/categoriaModel");
const MarcaModel = require("../models/marcaModel");
const ProdutoModel = require("../models/produtoModel");
const { basename } = require("path");
const { randomUUID } = require('crypto');
const StorageService = require("../services/storage");

class ProdutoController {

    async listarView(req, res) {
        let prod = new ProdutoModel();
        let lista = await prod.listarProdutos();
        res.render('produto/listar', {lista: lista});
    }

    async buscaProduto(req, res) {
        var ok = true;
        var msg = ""
        var retorno = null;
        if(req.body.id != null && req.body.id != ""){
            let prod = new ProdutoModel();
            prod = await prod.buscarProduto(req.body.id);

            retorno = {
                nome: prod.produtoNome,
                preco: prod.produtoPreco,
                id: prod.produtoId,
                marcaNome: prod.marcaNome,
                categoriaNome: prod.categoriaNome,
                imagem: prod.produtoImagem
            };
        }
        else {
            ok = false;
            msg = "Parâmetro inválido!";
        }

        res.send({ ok: ok, msg: msg, retorno: retorno })
    }

    async excluirProduto(req, res){
        var ok = true;
        if(req.body.codigo != "") {
            let produto = new ProdutoModel();
            produtoEncontrado = await produto.buscarProduto(req.body.codigo);
            ok = await produtoEncontrado.excluir(req.body.codigo);

            const storageService = new StorageService();

            storageService.deleteObject(basename(produtoEncontrado.produtoImagem));

        }
        else{
            ok = false;
        }

        res.send({ok: ok});
    }
    async cadastrarProduto(req, res){
        var ok = true;
        if(req.body.codigo != "" && req.body.nome != "" && req.body.quantidade != "" && req.body.quantidade  != '0' && req.body.marca != '0' && req.body.categoria  != '0' && req.file != null && (req.file.filename.includes(".jpg") || req.file.filename.includes(".png")) && req.body.preco != '' && req.body.preco > '0' ) {
            
            let produto = new ProdutoModel(0, req.body.codigo, req.body.nome, req.body.quantidade, req.body.categoria, req.body.marca, "", "", req.file.filename, req.body.preco);

            ok = await produto.gravar();
        }
        else{
            ok = false;
        }

        res.send({ ok: ok })
    }

    async alterarView(req, res){
        let produto = new ProdutoModel();
        let marca = new MarcaModel();
        
        let categoria = new CategoriaModel();
        if(req.params.id != undefined && req.params.id != ""){
            produto = await produto.buscarProduto(req.params.id);
        }

        let listaMarca = await marca.listarMarcas();
        let listaCategoria = await categoria.listarCategorias();
        res.render("produto/alterar", {produtoAlter: produto, listaMarcas: listaMarca, listaCategorias: listaCategoria});
    }

    async alterarProduto(req, res) {
        var ok = true;
        if(req.body.codigo != "" && req.body.nome != "" && req.body.quantidade != "" && req.body.quantidade  != '0' && req.body.marca != '0' && req.body.categoria  != '0' && req.file != null && (req.file.filename.includes(".jpg") || req.file.filename.includes(".png"))  && req.body.preco != '' && req.body.preco > '0' ) {

            let produto = new ProdutoModel(req.body.id, req.body.codigo, req.body.nome, req.body.quantidade, req.body.categoria, req.body.marca, "", "", req.file.filename, req.body.preco);
            
            let produtoOld = await produto.buscarProduto(req.body.id);

            if(produtoOld.produtoImagem != null && produtoOld.produtoImagem != "") {

                if(fs.existsSync(global.RAIZ_PROJETO + "/public" + global.PRODUTO_IMG_CAMINHO + produtoOld.produtoImagem)){
                    fs.unlinkSync(global.RAIZ_PROJETO + "/public" + global.PRODUTO_IMG_CAMINHO + produtoOld.produtoImagem)   
                }     
            }
            
            ok = await produto.gravar();
        }
        else{
            ok = false;
        }

        res.send({ ok: ok })
    }

    async cadastroView(req, res) {

        let listaMarcas = [];
        let listaCategorias = [];

        let marca = new MarcaModel();
        listaMarcas = await marca.listarMarcas();

        let categoria = new CategoriaModel();
        listaCategorias = await categoria.listarCategorias();

        res.render('produto/cadastro', { listaMarcas: listaMarcas, listaCategorias: listaCategorias });
    }
}

module.exports = ProdutoController;*/