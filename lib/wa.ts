export const waLink = (text = "Halo, saya mau tanya soal jasa web.") =>
  `https://wa.me/${process.env.WA_NUMBER ?? ""}?text=${encodeURIComponent(text)}`;