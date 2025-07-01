import * as soap from "soap";
import { nfseConfig as defaultNfseConfig } from "../config/nfse";
import { signXml } from "../utils/signer";

export class NfseClient {
  private soapClient: soap.Client | null = null;
  private config: typeof defaultNfseConfig.production;
  private environment: "production" | "development";

  constructor(
    environment: "production" | "development" = "production",
    nfseConfigArg?: typeof defaultNfseConfig
  ) {
    this.environment = environment;
    const configSource = nfseConfigArg || defaultNfseConfig;
    this.config = configSource[environment];
  }

  private async getClient(): Promise<soap.Client> {
    if (!this.soapClient) {
      this.soapClient = await soap.createClientAsync(this.config.wsdl);
    }
    return this.soapClient;
  }


  /**
   * Envia um lote de RPS de forma síncrona (serviço EnviarLoteRpsSincrono)
   * @param rpsXml XML do lote de RPS a ser enviado
   * @param certPath Caminho do certificado digital
   * @param certPassword Senha do certificado digital (opcional)
   */
  public async sendRps(
    rpsXml: string,
    certPath: string,
    certPassword?: string
  ): Promise<any> {
    const client = await this.getClient();
    const signedXml = signXml(rpsXml, certPath, certPassword);
    const result = await client.enviarLoteRpsSincronoAsync({ lote: signedXml });
    return result;
  }


  /**
   * Consulta um lote de RPS pelo protocolo (serviço ConsultarLoteRps)
   * @param protocol Protocolo do lote de RPS
   */
  public async consultRpsLot(protocol: string): Promise<any> {
    const client = await this.getClient();
    const result = await client.consultarLoteRpsAsync({ protocol });
    return result;
  }


  /**
   * Consulta uma NFS-e específica pelo identificador do RPS (serviço ConsultarNfsePorRps)
   * @param rpsIdentifier Identificador do RPS (objeto com número, série, tipo, etc)
   */
  public async consultNfseByRps(rpsIdentifier: any): Promise<any> {
    const client = await this.getClient();
    const result = await client.consultarNfsePorRpsAsync({ rpsIdentifier });
    return result;
  }


  /**
   * Cancela uma NFS-e (serviço CancelarNfse)
   * @param cancelRequest Objeto com dados do cancelamento (inclui motivo, identificação da nota, etc)
   */
  public async cancelNfse(cancelRequest: any): Promise<any> {
    const client = await this.getClient();
    // Assinatura pode ser necessária aqui também
    const result = await client.cancelarNfseAsync({ cancelRequest });
    return result;
  }

  /**
   * Gera uma NFS-e individual (serviço GerarNfse)
   * @param rpsXml XML do RPS a ser enviado
   * @param certPath Caminho do certificado digital
   * @param certPassword Senha do certificado digital (opcional)
   */
  public async gerarNfse(
    rpsXml: string,
    certPath: string,
    certPassword?: string
  ): Promise<any> {
    const client = await this.getClient();
    const signedXml = signXml(rpsXml, certPath, certPassword);
    // O método SOAP geralmente é gerarNfseAsync, mas pode variar conforme o WSDL
    const result = await client.gerarNfseAsync({ rps: signedXml });
    return result;
  }

  /**
   * Lista NFS-e emitidas (serviço ConsultarNfseServicoPrestado)
   * @param filtro Objeto com filtros de consulta (ex: período, cnpj, etc)
   */
  public async listarNfsePrestadas(filtro: any): Promise<any> {
    const client = await this.getClient();
    // O método SOAP geralmente é consultarNfseServicoPrestadoAsync
    const result = await client.consultarNfseServicoPrestadoAsync(filtro);
    return result;
  }

  /**
   * Lista NFS-e recebidas/tomadas (serviço ConsultarNfseServicoTomado)
   * @param filtro Objeto com filtros de consulta (ex: período, cnpj, etc)
   */
  public async listarNfseTomadas(filtro: any): Promise<any> {
    const client = await this.getClient();
    // O método SOAP geralmente é consultarNfseServicoTomadoAsync
    const result = await client.consultarNfseServicoTomadoAsync(filtro);
    return result;
  }
}
