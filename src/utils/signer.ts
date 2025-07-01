import { SignedXml } from "xml-crypto";
import * as fs from "fs";

export function signXml(
  xml: string,
  certPath: string,
  certPassword?: string
): string {
  const privateKey = fs.readFileSync(certPath);
  const sig = new SignedXml({ privateKey });
  sig.addReference({ xpath: "//*[@local-name(.)='Rps']" });
  sig.computeSignature(xml, {
    prefix: "ds",
    attrs: {
      Id: "signature",
    },
  });
  sig.signatureAlgorithm = "http://www.w3.org/2000/09/xmldsig#rsa-sha1";

  return sig.getSignedXml();
}
