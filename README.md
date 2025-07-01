# typenfse

Uma biblioteca TypeScript para integração com o web service de Nota Fiscal de Serviço Eletrônica (NFSe) do Brasil.

## Instalação

```bash
npm install typenf
```

## Configuração

Crie um arquivo `.env` na raiz do seu projeto e adicione as seguintes variáveis de ambiente:

```
# Caminho para o seu certificado digital .pfx ou .p12
CERT_PATH=caminho/para/seu/certificado.pfx

# Senha do certificado digital
CERT_PASSWORD=sua-senha-do-certificado
```

### Configuração do Web Service (Opcional)

A biblioteca vem pré-configurada com os endpoints para a cidade de Niterói/RJ. Caso precise utilizar os serviços de outra cidade, você pode alterar o arquivo `src/config/nfse.ts`:

```typescript
export const nfseConfig = {
  production: {
    url: "URL_DE_PRODUCAO_DA_SUA_CIDADE",
    wsdl: "URL_DO_WSDL_DE_PRODUCAO_DA_SUA_CIDADE",
  },
  development: {
    url: "URL_DE_HOMOLOGACAO_DA_SUA_CIDADE",
    wsdl: "URL_DO_WSDL_DE_HOMOLOGACAO_DA_SUA_CIDADE",
  },
};
```

## Uso

Primeiro, importe e instancie o `NfseClient`.

```typescript
import { NfseClient } from "typenf";

// O ambiente pode ser 'production' or 'development'
const client = new NfseClient(process.env.NODE_ENV || "development");
```

### Enviar um Lote de RPS

```typescript
async function enviarRps() {
  const rpsXml = `<seu-xml-de-rps-aqui />`; // XML do RPS
  const certPath = process.env.CERT_PATH!;
  const certPassword = process.env.CERT_PASSWORD!;

  try {
    const resultado = await client.sendRps(rpsXml, certPath, certPassword);
    console.log("RPS enviado com sucesso:", resultado);
  } catch (error) {
    console.error("Erro ao enviar RPS:", error);
  }
}

enviarRps();
```

### Consultar um Lote de RPS

```typescript
async function consultarLote() {
  const protocolo = "numero-do-protocolo";

  try {
    const resultado = await client.consultRpsLot(protocolo);
    console.log("Consulta de lote realizada com sucesso:", resultado);
  } catch (error) {
    console.error("Erro ao consultar lote:", error);
  }
}

consultarLote();
```

### Consultar NFSe por RPS

```typescript
async function consultarNfse() {
  const identificadorRps = { rps: "12345" }; // Objeto com os dados do RPS

  try {
    const resultado = await client.consultNfseByRps(identificadorRps);
    console.log("NFSe consultada com sucesso:", resultado);
  } catch (error) {
    console.error("Erro ao consultar NFSe:", error);
  }
}

consultarNfse();
```

### Cancelar NFSe

```typescript
async function cancelar() {
  const dadosCancelamento = { nfse: "54321" }; // Objeto com os dados para cancelamento

  try {
    const resultado = await client.cancelNfse(dadosCancelamento);
    console.log("NFSe cancelada com sucesso:", resultado);
  } catch (error) {
    console.error("Erro ao cancelar NFSe:", error);
  }
}

cancelar();
```

## Executando os Testes

Para rodar os testes, primeiro instale as dependências de desenvolvimento:

```bash
npm install
```

Em seguida, execute o comando de teste:

```bash
npm test
```
