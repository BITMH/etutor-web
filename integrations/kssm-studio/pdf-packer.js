/**
 * public-web/integrations/kssm-studio/pdf-packer.js
 * Pembina PDF 1.4 binari tulen tanpa kebergantungan luar (memuatkan halaman imej JPEG berbilang muka surat bersaiz A4).
 */

const enc = new TextEncoder();

function concatChunks(chunks) {
  let total = 0;
  for (const c of chunks) total += c.length;
  const out = new Uint8Array(total);
  let pos = 0;
  for (const c of chunks) {
    out.set(c, pos);
    pos += c.length;
  }
  return out;
}

export function buildA4PdfBytesFromJpegs(pages) {
  const list = Array.isArray(pages) ? pages : [];
  if (!list.length) throw new Error("Tiada halaman untuk dijana ke PDF.");

  const n = list.length;
  const totalObjs = 2 + n * 3;
  const offsets = new Array(totalObjs + 1).fill(0);
  const parts = [];
  let cursor = 0;

  const pushBytes = (u8) => {
    parts.push(u8);
    cursor += u8.length;
  };
  const pushStr = (s) => pushBytes(enc.encode(s));
  const beginObj = (id) => {
    offsets[id] = cursor;
    pushStr(`${id} 0 obj\n`);
  };

  pushStr("%PDF-1.4\n%\xFF\xFF\xFF\xFF\n");

  beginObj(1);
  pushStr("<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");

  const kids = [];
  for (let i = 0; i < n; i++) kids.push(`${3 + i * 3} 0 R`);
  beginObj(2);
  pushStr(`<< /Type /Pages /Kids [${kids.join(" ")}] /Count ${n} >>\nendobj\n`);

  for (let i = 0; i < n; i++) {
    const pg = list[i];
    const pId = 3 + i * 3;
    const cId = pId + 1;
    const imId = pId + 2;
    const w = Math.max(1, Math.round(Number(pg.width) || 1240));
    const h = Math.max(1, Math.round(Number(pg.height) || 1754));
    const imgBytes = pg.bytes instanceof Uint8Array ? pg.bytes : new Uint8Array(pg.bytes || []);

    beginObj(pId);
    pushStr(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Im1 ${imId} 0 R >> >> /Contents ${cId} 0 R >>\nendobj\n`
    );

    const drawCmd = "q 595.28 0 0 841.89 0 0 cm /Im1 Do Q";
    beginObj(cId);
    pushStr(`<< /Length ${drawCmd.length} >>\nstream\n${drawCmd}\nendstream\nendobj\n`);

    beginObj(imId);
    pushStr(
      `<< /Type /XObject /Subtype /Image /Width ${w} /Height ${h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imgBytes.length} >>\nstream\n`
    );
    pushBytes(imgBytes);
    pushStr("\nendstream\nendobj\n");
  }

  const xrefPos = cursor;
  pushStr(`xref\n0 ${totalObjs + 1}\n`);
  pushStr("0000000000 65535 f \n");
  for (let id = 1; id <= totalObjs; id++) {
    pushStr(`${String(offsets[id]).padStart(10, "0")} 00000 n \n`);
  }
  pushStr(`trailer\n<< /Size ${totalObjs + 1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF\n`);

  return concatChunks(parts);
}

function dataUrlToBytes(dataUrl) {
  const idx = String(dataUrl || "").indexOf(",");
  const b64 = idx >= 0 ? dataUrl.slice(idx + 1) : String(dataUrl || "");
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export function buildA4PdfBlobFromJpegDataUrls(items) {
  const pages = (Array.isArray(items) ? items : []).map((it) => {
    if (typeof it === "string") return { bytes: dataUrlToBytes(it), width: 1240, height: 1754 };
    return { bytes: dataUrlToBytes(it.dataUrl), width: it.width || 1240, height: it.height || 1754 };
  });
  return new Blob([buildA4PdfBytesFromJpegs(pages)], { type: "application/pdf" });
}
