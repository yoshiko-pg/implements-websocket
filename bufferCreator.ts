export default (text: string) => {
  const bufferList: Buffer[] = [];

  /**
   * Fin Write (1bit)
   * RSV Write (3bit)
   * Opcode Write (4bit)
   */
  const firstByte = Buffer.alloc(1);
  const fin = "1";
  const rsv = "000";
  const opcode = "0001"; // text
  firstByte[0] = parseInt(fin + rsv + opcode, 2);
  bufferList.push(firstByte);

  /**
   * Mask (1bit) - serverから送るときは0
   * Payload Length (7bit + additional: 0byte or 2byte or 8byte)
   */
  const secondByte = Buffer.alloc(1);
  const mask = "0";
  const payloadLength = Buffer.byteLength(text, "utf-8");

  bufferList.push(secondByte);

  let payloadBinary = "";
  if (payloadLength > 2 ** (8 ** 2) - 1) {
    payloadBinary = (127).toString(2).padStart(7, "0");
    secondByte[0] = parseInt(mask + payloadBinary, 2);
    const additionalBuffer = Buffer.alloc(8);
    additionalBuffer.writeUInt32BE(payloadLength);
    bufferList.push(additionalBuffer);
  } else if (payloadLength > 125) {
    payloadBinary = (126).toString(2).padStart(7, "0");
    secondByte[0] = parseInt(mask + payloadBinary, 2);
    const additionalBuffer = Buffer.alloc(2);
    additionalBuffer.writeUInt16BE(payloadLength);
    bufferList.push(additionalBuffer);
  } else {
    payloadBinary = payloadLength.toString(2).padStart(7, "0");
    secondByte[0] = parseInt(mask + payloadBinary, 2);
  }

  /**
   * Payload
   */
  const payloadBuffer = Buffer.from(text);
  bufferList.push(payloadBuffer);

  return Buffer.concat(bufferList);
};
