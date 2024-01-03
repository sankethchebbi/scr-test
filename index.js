import express from 'express';
import multer from 'multer';
import { readPdf, processTextWithGPT4 } from './pdfProcessor.js';

const app = express();
const port = process.env.PORT || 3000;

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.static('public')); // Serving static files from "public" directory

// Upload and process PDFs
app.post('/process-pdf', upload.fields([{ name: 'pdf1' }, { name: 'pdf2' }]), async (req, res) => {
    try {
        const pdf1Text = await readPdf(req.files['pdf1'][0].buffer);
        const pdf2Text = await readPdf(req.files['pdf2'][0].buffer);
        const result = await processTextWithGPT4(pdf1Text, pdf2Text);
        res.json({ message: "Processed Successfully", data: result });
    } catch (error) {
        console.error('Error processing files:', error);
        res.status(500).send('Error processing files');
    }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
