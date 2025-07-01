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

  public async consultRpsLot(protocol: string): Promise<any> {
    const client = await this.getClient();
    const result = await client.consultarLoteRpsAsync({ protocol });
    return result;
  }

  public async consultNfseByRps(rpsIdentifier: any): Promise<any> {
    const client = await this.getClient();
    const result = await client.consultarNfsePorRpsAsync({ rpsIdentifier });
    return result;
  }

  public async cancelNfse(cancelRequest: any): Promise<any> {
    const client = await this.getClient();
    // Assinatura pode ser necessária aqui também
    const result = await client.cancelarNfseAsync({ cancelRequest });
    return result;
  }
}
