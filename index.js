const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');

const app = express();
const port = 3000;
console.log('iniciarndo')
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/run-script', async (req, res) => {
    
    const searchfor = req.body.searchfor;
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        await page.goto('https://agiliblue.agilicloud.com.br/portal/claudia/#/guiasIptu');

        await page.waitForSelector('#cpfcnpjIPTU', { visible: true });

        await delay(2000);

        await page.type('#cpfcnpjIPTU', searchfor);

        await delay(2000);

        await page.click('#btnConsultar');

        await page.waitForSelector('#btnEmitirGuia', { visible: true });

        await delay(5000);

        await page.click('#btnEmitirGuia');
        await page.waitForSelector('#tabelaParcelas', { visible: true });
        await delay(3000);

        const divContent = await page.evaluate(() => {
            const div = document.querySelector('#canvasGuias');
            return div.innerHTML; // Retorna o conteúdo HTML dentro da div
        });

        await browser.close();

        res.json({ output: divContent });
    } catch (error) {
        console.error(`Error executing script: ${error.message}`);
        res.json({ error: error.message });
    }
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});