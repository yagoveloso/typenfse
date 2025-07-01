# typenfse

Uma biblioteca TypeScript para integração com o web service de Nota Fiscal de Serviço Eletrônica (NFSe) do Brasil.

## Instalação

```bash
npm install typenfse
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

A biblioteca vem pré-configurada com os endpoints para a cidade de Niterói/RJ. Caso precise utilizar os serviços de outra cidade, você pode passar sua própria configuração ao instanciar o `NfseClient`:

```typescript
const customConfig = {
  production: {
    url: "URL_DE_PRODUCAO_DA_SUA_CIDADE",
    wsdl: "URL_DO_WSDL_DE_PRODUCAO_DA_SUA_CIDADE",
  },
  development: {
    url: "URL_DE_HOMOLOGACAO_DA_SUA_CIDADE",
    wsdl: "URL_DO_WSDL_DE_HOMOLOGACAO_DA_SUA_CIDADE",
  },
};
const client = new NfseClient("production", customConfig);
```

## Uso

Primeiro, importe e instancie o `NfseClient`.

```typescript
import { NfseClient } from "typenfse";

// Por padrão, o ambiente é 'production'.
// Para usar 'development', basta passar explicitamente.
const client = new NfseClient(); // production
// ou
const clientDev = new NfseClient("development");

// Também é possível passar uma configuração personalizada:
import { nfseConfig } from "./src/config/nfse";
const customConfig = {
  production: { ... },
  development: { ... }
};
const clientCustom = new NfseClient("production", customConfig);
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


### Gerar NFS-e individual

```typescript
async function gerarNfse() {
  const rpsXml = `<seu-xml-de-rps-aqui />`; // XML do RPS individual
  const certPath = process.env.CERT_PATH!;
  const certPassword = process.env.CERT_PASSWORD!;

  try {
    const resultado = await client.gerarNfse(rpsXml, certPath, certPassword);
    console.log("NFS-e gerada com sucesso:", resultado);
  } catch (error) {
    console.error("Erro ao gerar NFS-e:", error);
  }
}

gerarNfse();
```

### Listar NFS-e emitidas (serviços prestados)

```typescript
async function listarNfsePrestadas() {
  const filtro = {
    // Exemplo de filtro: período, CNPJ, etc
    dataInicio: "2024-01-01",
    dataFim: "2024-01-31",
    cnpjPrestador: "12345678000199"
  };

  try {
    const resultado = await client.listarNfsePrestadas(filtro);
    console.log("NFS-e emitidas:", resultado);
  } catch (error) {
    console.error("Erro ao listar NFS-e prestadas:", error);
  }
}

listarNfsePrestadas();
```

### Listar NFS-e recebidas/tomadas

```typescript
async function listarNfseTomadas() {
  const filtro = {
    // Exemplo de filtro: período, CNPJ, etc
    dataInicio: "2024-01-01",
    dataFim: "2024-01-31",
    cnpjTomador: "98765432000188"
  };

  try {
    const resultado = await client.listarNfseTomadas(filtro);
    console.log("NFS-e recebidas/tomadas:", resultado);
  } catch (error) {
    console.error("Erro ao listar NFS-e tomadas:", error);
  }
}

listarNfseTomadas();
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

## Como Contribuir

Contribuições são bem-vindas! Para colaborar com este projeto:

1. Faça um fork do repositório.
2. Crie uma branch para sua feature ou correção:
   ```bash
   git checkout -b minha-feature
   ```
3. Faça suas alterações e adicione testes, se necessário.
4. Execute os testes para garantir que tudo está funcionando:
   ```bash
   npm test
   ```
5. Faça commit das suas alterações:
   ```bash
   git commit -m "Minha contribuição"
   ```
6. Envie um push para sua branch:
   ```bash
   git push origin minha-feature
   ```
7. Abra um Pull Request detalhando suas mudanças.

Sinta-se à vontade para abrir issues para relatar bugs, sugerir melhorias ou tirar dúvidas!
