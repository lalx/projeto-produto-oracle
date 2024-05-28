const ociCommon = require('oci-common');
const ociStorage = require('oci-objectstorage');

module.exports = class StorageService {
  constructor() {
    this.#bucket = "bucket-novo";
    this.#client = new ociStorage.ObjectStorageClient({
      authenticationDetailsProvider: new ociCommon.ConfigFileAuthenticationDetailsProvider(".oci//config", "DEFAULT"),
    });
    this.#endpoint = "https://objectstorage.sa-saopaulo-1.oraclecloud.com";
    this.#namespace = "grvbbf1al9nf";
  }

  #bucket;
  #client;
  #endpoint;
  #namespace;

  async deleteObject(filename) {
    console.log("deletando arq", filename);
    await this.#client.deleteObject({
      bucketName: this.#bucket,
      namespaceName: this.#namespace,
      objectName: filename,
    });
  }

  async sendObject(filename, object) {
    console.log("enviando arq", filename);
    await this.#client.putObject({
      bucketName: this.#bucket,
      namespaceName: this.#namespace,
      objectName: filename,
      putObjectBody: object,
    });

    return `${this.#endpoint}/n/${this.#namespace}/b/${this.#bucket}/o/${filename}`;
  }
}