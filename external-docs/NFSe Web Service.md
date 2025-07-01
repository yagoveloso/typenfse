# Manual NFSe - Web Service Niterói

**Nota Fiscal de Serviços Eletrônica (NFS-e)**  
_Modelo Nacional - Versão 2.0.3_

## Índice

1. [Introdução](#1-introdução)
2. [Serviços Disponíveis](#2-serviços-disponíveis)
3. [Especificações Técnicas](#3-especificações-técnicas)
4. [Códigos de Cancelamento, Erros e Alertas](#4-códigos-de-cancelamento-erros-e-alertas)
5. [Link para NFS-e Emitida](#5-link-para-nfs-e-emitida)

## 1. Introdução

Este manual apresenta as especificações técnicas para utilização do Web Service de Nota Fiscal de Serviços Eletrônica (NFS-e) da Prefeitura de Niterói, permitindo a integração de sistemas de informação para automatizar a emissão, consulta e cancelamento de NFS-e.

**Base Legal:** Modelo nacional ABRASF/RFB  
**Autenticação:** Certificado digital ICP-Brasil obrigatório  
**Manual Completo:** https://nfse.niteroi.rj.gov.br/files/manuais/nfse_abrasf.pdf

## 2. Serviços Disponíveis

Todos os serviços exigem certificado digital ICP-Brasil para autenticação.

### 2.1. Enviar Lote de RPS Síncrono

Recepção e processamento imediato do lote de RPS com validações e geração das NFS-e.

### 2.2. Recepção e Processamento de Lote de RPS

Recepção do lote com retorno do protocolo para processamento posterior em fila.

### 2.3. Consulta de Lote de RPS

Obtenção das NFS-e geradas ou lista de erros/inconsistências do lote processado.

### 2.4. Consulta de NFS-e por RPS

Consulta de NFS-e específica através do número do RPS que a gerou.

### 2.5. Consulta de NFS-e por Faixa

Obtenção de NFS-e dentro de uma faixa específica.

### 2.6. Consulta de NFS-e - Serviços Tomados/Intermediados

Consulta para tomadores/intermediários de serviços.

### 2.7. Consulta de NFS-e - Serviços Prestados

Consulta para prestadores de serviços.

### 2.8. Geração de NFS-e

Recepção de RPS individual com validações e geração da NFS-e.

### 2.9. Cancelamento de NFS-e

Cancelamento direto sem substituição (códigos no item 4.1).

### 2.10. Substituição de NFS-e

Cancelamento com substituição por nova NFS-e.

## 3. Especificações Técnicas

### 3.1. URLs do WebService

**Produção:**  
https://nfse.niteroi.rj.gov.br/nfse/WSNacional2/nfse.asmx

**Homologação:**  
https://niteroihomologacao.nfe.com.br/nfse/WSNacional2/nfse.asmx

**WSDL:**  
https://nfse.niteroi.rj.gov.br/nfse/WSNacional2/nfse.asmx?wsdl

### 3.2. Recursos Técnicos

- **Certificação:** ICP-Brasil obrigatória
- **Tamanho máximo XML:** 512 KB
- **Assinatura digital:** Opcional (RPS, Lote de RPS, Cancelamento)
- **Schemas XML:** https://nfse.niteroi.rj.gov.br/App_Themes/Niteroi/WSNacional/schemas.zip
- **Exemplos:** https://nfse.niteroi.rj.gov.br/App_Themes/Niteroi/WSNacional/exemplos.zip

### 3.3. Exemplo de Assinatura Digital (VB.NET)

```vbnet
Private Function Assinar(ByVal mensagemXML As String, _
    ByVal certificado As X509Certificate2) As XmlDocument

    Dim xmlDoc As New XmlDocument()
    Dim Key As New RSACryptoServiceProvider()
    Dim SignedDocument As SignedXml
    Dim keyInfo As New KeyInfo()

    xmlDoc.LoadXml(mensagemXML)
    Key = CType(certificado.PrivateKey, RSACryptoServiceProvider)
    keyInfo.AddClause(New KeyInfoX509Data(certificado))

    SignedDocument = New SignedXml(xmlDoc)
    SignedDocument.SigningKey = Key
    SignedDocument.KeyInfo = keyInfo

    Dim reference As New Reference()
    reference.Uri = String.Empty
    reference.AddTransform(New XmlDsigEnvelopedSignatureTransform())
    reference.AddTransform(New XmlDsigC14NTransform(False))

    SignedDocument.AddReference(reference)
    SignedDocument.ComputeSignature()

    Dim xmlDigitalSignature As XmlElement = SignedDocument.GetXml()
    xmlDoc.DocumentElement.AppendChild(xmlDoc.ImportNode(xmlDigitalSignature, True))

    Return xmlDoc
End Function
```

## 4. Códigos de Cancelamento, Erros e Alertas

> **Referência completa:** https://nfse.niteroi.rj.gov.br/files/manuais/nfse_abrasf.pdf

### 4.1. Códigos de Cancelamento

| Código | Descrição                                                  |
| ------ | ---------------------------------------------------------- |
| 1      | Erro na emissão (Uso exclusivo para substituição de NFS-e) |
| 2      | Serviço não prestado                                       |
| 4      | Duplicidade da nota                                        |

### 4.2. Principais Códigos de Erro

| Código  | Erro                                  | Solução                              |
| ------- | ------------------------------------- | ------------------------------------ |
| 902     | CPF/CNPJ do Tomador inválido          | Verificar dígitos verificadores      |
| 903     | Valor dos serviços deve ser > R$ 0,00 | Preencher valor superior a zero      |
| 906-907 | Atividade não disponível/cadastrada   | Verificar atividade do prestador     |
| 908     | Dedução não permitida para atividade  | Ajustar dedução ou alterar atividade |
| 916     | Retenção federal só para CNPJ         | Zerar tributos federais para CPF     |
| 917-918 | Endereço/Cidade obrigatório para CNPJ | Preencher dados do tomador           |
| 927-928 | Alíquota incorreta                    | Ajustar alíquota conforme atividade  |
| 929-931 | Retenção ISS incorreta                | Ajustar retenção conforme regras     |
| 947-949 | MEI/Autônomo não pode reter           | Definir retenção = 2 (Não)           |
| 970     | CPF/CNPJ não autorizado               | Usar usuário autorizado              |
| 971     | XML excede 512KB                      | Dividir em arquivos menores          |
| 978     | Simples Nacional divergente           | Alinhar XML com perfil               |
| 1037    | Dados do perfil incompletos           | Configurar perfil do contribuinte    |
| 1044    | Exportação - dados incorretos         | CodigoMunicipio = 9999999            |

### 4.3. Códigos de Alerta

| Código | Alerta                               | Ação                                           |
| ------ | ------------------------------------ | ---------------------------------------------- |
| 941    | Substituição requer aprovação fiscal | Aguardar aprovação                             |
| 942    | Cidade/UF não encontrada             | Verificar dados ou deixar em branco (exterior) |
| 957    | Alíquota ignorada (Simples Nacional) | Informativo - sem ação necessária              |

## 5. Link para NFS-e Emitida

Para envio de e-mail personalizado com link de acesso à NFS-e, utilize a estrutura:

```
https://nfse.niteroi.rj.gov.br/nfse/nfse.aspx?ccm={CCM}&nf={NUMERO}&cod={CODIGO}
```

**Parâmetros:**

- `ccm`: Inscrição do Prestador (sem formato)
- `nf`: Número da NFS-e (sem formato)
- `cod`: Código de Verificação (sem traço)

---

_Sistema desenvolvido por Tiplan Tecnologia - http://www.tiplan.com.br_
