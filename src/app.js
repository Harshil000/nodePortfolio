import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import {sendEmail} from './services/mail.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../public')));

app.post('/api/sendMail' , async (req , res) => {
    const response = await sendEmail(req.body);
    if(response.success) {
        res.status(200).json({message: 'Email sent successfully', messageId: response.messageId});
    } else {
        res.status(500).json({error: response.error});
    }
})

app.use('*name', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'))
})

export default app;