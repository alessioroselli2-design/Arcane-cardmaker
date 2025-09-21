// /app/esportazione.js — Export PNG/PDF (con supporto Specchia retro)

import { jsPDF } from "jspdf";
import { frontPNG, backPNG, state } from "./card.js";

const $id = (x) => document.getElementById(x);

// funzione helper per specchiare il retro su un canvas temporaneo
function getMirroredBack() {
  const back = document.getElementById("cardBack");
  if (!back) return back;
  if (!$id("mirrorBack")?.checked) return back;

  const canvas = document.createElement("canvas");
  canvas.width = back.width;
  canvas.height = back.height;
  const ctx = canvas.getContext("2d");
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(back, 0, 0);
  return canvas;
}

// PNG singoli
$id("pngFront")?.addEventListener("click", () => {
  const a = document.createElement("a");
  a.href = frontPNG();
  a.download = (state.title || "card") + "-front.png";
  a.click();
});

$id("pngBack")?.addEventListener("click", () => {
  const backCanvas = getMirroredBack();
  const a = document.createElement("a");
  a.href = backCanvas.toDataURL("image/png");
  a.download = (state.title || "card") + "-back.png";
  a.click();
});

// PDF singoli
$id("pdfSingleFront")?.addEventListener("click", () => {
  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: [750, 1050] });
  pdf.addImage(frontPNG(), "PNG", 0, 0, 750, 1050);
  pdf.save((state.title || "card") + "-front.pdf");
});

$id("pdfSingleBack")?.addEventListener("click", () => {
  const backCanvas = getMirroredBack();
  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: [750, 1050] });
  pdf.addImage(backCanvas.toDataURL("image/png"), "PNG", 0, 0, 750, 1050);
  pdf.save((state.title || "card") + "-back.pdf");
});

// PDF A4 multipli (3×3 carte)
function pdfGrid(kind) {
  const pdf = new jsPDF("portrait", "pt", "a4");
  const W = 595.28, H = 841.89; // A4 in pt
  const cardW = 180, cardH = 252; // proporzione ~ 750×1050 ridotta
  const marginX = 18, marginY = 18;
  let x = marginX, y = marginY;

  const add = (img) => {
    pdf.addImage(img, "PNG", x, y, cardW, cardH);
    x += cardW + marginX;
    if (x + cardW > W) { x = marginX; y += cardH + marginY; }
    if (y + cardH > H) {
      pdf.addPage(); x = marginX; y = marginY;
    }
  };

  if (kind === "fronts" || kind === "both") {
    for (let i = 0; i < 9; i++) add(frontPNG());
    if (kind === "both") pdf.addPage();
  }
  if (kind === "backs" || kind === "both") {
    const backCanvas = getMirroredBack();
    const backImg = backCanvas.toDataURL("image/png");
    for (let i = 0; i < 9; i++) add(backImg);
  }

  const name =
    kind === "fronts" ? "-fronts.pdf" :
    kind === "backs" ? "-backs.pdf" :
    "-both.pdf";

  pdf.save((state.deckName || state.title || "cards") + name);
}

$id("pdfA4Front")?.addEventListener("click", () => pdfGrid("fronts"));
$id("pdfA4Back")?.addEventListener("click", () => pdfGrid("backs"));
$id("pdfA4Both")?.addEventListener("click", () => pdfGrid("both"));
