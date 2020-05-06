export default (data: Buffer) => {
  const firstByte = data[0];
  const secondByte = data[1];

  /**
   * Fin Check (1bit)
   */
  const isFin = (firstByte & parseInt("10000000", 2)) !== 0;
  if (!isFin) {
    throw new Error("データが長すぎます");
  }

  /**
   * RSV Check (3bit)
   */
  const isRsvEmpty = (firstByte & parseInt("01110000", 2)) === 0;
  if (!isRsvEmpty) {
    throw new Error("拡張には対応していません");
  }

  /**
   * Opcode Check (4bit)
   */
  const opcode = firstByte & parseInt("00001111", 2);
  if (opcode !== 0x1) {
    throw new Error("opcodeはtextしか対応していません");
  }

  /**
   * Mask Check (1bit)
   */
  const isMasked = (secondByte & parseInt("10000000", 2)) !== 0;
  if (!isMasked) {
    throw new Error("clientからのdataは必ずmaskされている必要があります");
  }

  /**
   * Payload Length (7bit + additional: 0byte or 2byte or 8byte)
   */
  let payloadLength = secondByte & parseInt("01111111", 2);
  let additionalPayloadByteLength = 0;
  if (payloadLength === 126) {
    // 2byte目の7bitの値が126のときは2~3番目の2byteにlengthが入る
    // 符号なし = U, BigEndian = BE, 2番目から2byte
    additionalPayloadByteLength = 2;
    payloadLength = data.readUIntBE(2, additionalPayloadByteLength);
  } else if (payloadLength === 127) {
    // 2byte目の7bitの値が127のときは2~7番目の8byteにlengthが入る
    // 符号なし = U, BigEndian = BE, 2番目から8byte
    additionalPayloadByteLength = 8;
    payloadLength = data.readUIntBE(2, additionalPayloadByteLength);
  }

  /**
   * Mask Key (4byte)
   */
  let offset = 2 + additionalPayloadByteLength;
  const maskKeyByteLength = 4;
  const maskKey = data.slice(offset, offset + maskKeyByteLength);

  /**
   * Payload
   */
  offset += maskKeyByteLength;
  const payload = data.slice(offset, offset + payloadLength);

  for (let i = 0; i <= payload.length; i++) {
    payload[i] = payload[i] ^ maskKey[i % maskKeyByteLength];
  }

  return payload.toString();
};
