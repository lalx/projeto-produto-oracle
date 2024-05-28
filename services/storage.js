const express = require('express');
const multer = require('multer');
const upload = multer()
const common = require("oci-common");
const os = require("oci-objectstorage");
const provider =
 new common.
 ConfigFileAuthenticationDetailsProvider
 (".oci//config", "DEFAULT");
const client = new os.ObjectStorageClient({
    authenticationDetailsProvider: provider
});
const namespaceName = "grvbbf1al9nf";
const bucketName = "bucket-novo";

class StorageService {
    async obterObjetosInfo() {

        let listObjectsRequest = {
            namespaceName,
            bucketName
        }
    
        const paginator = client.listObjectsRecordIterator(listObjectsRequest);
    
        let objetos = [];
    
        for await (const response of paginator) {
            let nome = response.name;
            let urlOCI = "https://objectstorage.sa-saopaulo-1.oraclecloud.com/p/rgmGaUvQUzh7BmdpMVPERYZPLZQG7fNPsyLlEueSX-4rCvXLX-xrPvk4m3b3PDZJ/n/grvbbf1al9nf/b/bucket-novo/o/" + nome;
            
    
            objetos.push({
                nome: nome,
                urlOCI: urlOCI
            });
        }
    
        return objetos;
    }
    
    /*async sendObject(nome, objeto) {
    
        const putObjectRequest = {
            namespaceName,
            bucketName,
            putObjectBody: objeto,
            objectName: nome
          };
    
          const putObjectResponse = await client.putObject(putObjectRequest);
          console.log("Put Object executed successfully" + putObjectResponse);
    
    }*/

    async sendObject(nome, objeto) {
        const putObjectRequest = {
            namespaceName,
            bucketName,
            putObjectBody: objeto,
            objectName: nome
        };
    
        const putObjectResponse = await client.putObject(putObjectRequest);
        console.log("Put Object executed successfully", putObjectResponse);
    
        // Retorna a URL do objeto
        const url = `https://objectstorage.us-phoenix-1.oraclecloud.com/n/${namespaceName}/b/${bucketName}/o/${nome}`;
        return url;
    }
    
    
    async deleteObject(nome){
    
        const deleteObjectRequest = {
            namespaceName,
            bucketName,
            objectName: nome
          };
          
          const deleteObjectResponse = await client.deleteObject(deleteObjectRequest);
            
    }
    
    async downloadObjeto(nome){
    
        const getObjectRequest = {
            namespaceName,
            bucketName,
            objectName: nome,
        };
    
        const getObjectResponse = await client.getObject(getObjectRequest);
    
        return getObjectResponse.value;
    }
    
}

 module.exports = StorageService;