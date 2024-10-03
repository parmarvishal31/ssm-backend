import express from "express";
import qrCode from "qrcode";
const router = express.Router();

router.get("/", (req, res) => {
  const url = "https://www.instagram.com/shreeji_shoes_and_menswear";
  qrCode.toDataURL(url, (err, qrCodeUrl) => {
    if (err) {
      res.status(500).send("Server error.");
    } else {
      res.send(`
        <!DOCTYPE html>
<html>
<head>
<title>QR Code</title>
</head>
<body>
<h1>Instagram</h1>
<img src="${qrCodeUrl}" alt="qr code">
</body>
</html>

        `);
    }
  });
});

export default router;
