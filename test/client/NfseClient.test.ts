import "dotenv/config";
import { NfseClient } from "../../src/client/NfseClient";
import * as soap from "soap";
import { signXml } from "../../src/utils/signer";

jest.mock("soap");
jest.mock("../../src/utils/signer");

describe("NfseClient", () => {
  let client: NfseClient;
  const mockSoapClient = {
    enviarLoteRpsSincronoAsync: jest.fn(),
    consultarLoteRpsAsync: jest.fn(),
    consultarNfsePorRpsAsync: jest.fn(),
    cancelarNfseAsync: jest.fn(),
  };

  beforeEach(() => {
    client = new NfseClient("development");
    (soap.createClientAsync as jest.Mock).mockResolvedValue(mockSoapClient);
    (signXml as jest.Mock).mockImplementation(
      (xml) => `<signed>${xml}</signed>`
    );
  });

  it("should send RPS and return the result", async () => {
    const rpsXml = "<rps></rps>";
    const certPath = process.env.CERT_PATH!;
    const certPassword = process.env.CERT_PASSWORD!;
    const expectedResult = { success: true };
    mockSoapClient.enviarLoteRpsSincronoAsync.mockResolvedValue(expectedResult);

    const result = await client.sendRps(rpsXml, certPath, certPassword);

    expect(signXml).toHaveBeenCalledWith(rpsXml, certPath, certPassword);
    expect(mockSoapClient.enviarLoteRpsSincronoAsync).toHaveBeenCalledWith({
      lote: `<signed>${rpsXml}</signed>`,
    });
    expect(result).toEqual(expectedResult);
  });

  it("should consult RPS lot and return the result", async () => {
    const protocol = "12345";
    const expectedResult = { success: true };
    mockSoapClient.consultarLoteRpsAsync.mockResolvedValue(expectedResult);

    const result = await client.consultRpsLot(protocol);

    expect(mockSoapClient.consultarLoteRpsAsync).toHaveBeenCalledWith({
      protocol,
    });
    expect(result).toEqual(expectedResult);
  });

  it("should consult NFSe by RPS and return the result", async () => {
    const rpsIdentifier = { rps: "1" };
    const expectedResult = { success: true };
    mockSoapClient.consultarNfsePorRpsAsync.mockResolvedValue(expectedResult);

    const result = await client.consultNfseByRps(rpsIdentifier);

    expect(mockSoapClient.consultarNfsePorRpsAsync).toHaveBeenCalledWith({
      rpsIdentifier,
    });
    expect(result).toEqual(expectedResult);
  });

  it("should cancel NFSe and return the result", async () => {
    const cancelRequest = { nfse: "1" };
    const expectedResult = { success: true };
    mockSoapClient.cancelarNfseAsync.mockResolvedValue(expectedResult);

    const result = await client.cancelNfse(cancelRequest);

    expect(mockSoapClient.cancelarNfseAsync).toHaveBeenCalledWith({
      cancelRequest,
    });
    expect(result).toEqual(expectedResult);
  });
});
