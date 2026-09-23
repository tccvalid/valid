# VALID — interface React

## Executar localmente

1. No repositório `AdrianoBendazzoli10/eocr-pixel-mescla`, instale as dependências de `requirements.txt` e o Tesseract com o idioma português. Execute `python app.py` na porta 5000.
2. Neste repositório, execute `npm install` e `npm run dev`.
3. Abra a página de análise pelo endereço informado pelo Vite.

O proxy de desenvolvimento em `vite.config.js` encaminha `/analisar`, `/valid` e `/results` ao Flask local. Imagens passam pelas análises de pixels/EOCR e de OCR/metadados; PDFs passam apenas por OCR/metadados. Se uma das análises de imagem falhar, o relatório mostra o resultado disponível e o motivo da falha.

## Front publicado

Configure `VITE_API_URL` com a URL pública do servidor Flask, sem barra final, antes de compilar (`npm run build`). O servidor Flask precisa estar em execução e acessível pelo navegador. O proxy do Vite funciona somente durante `npm run dev`; hospedar apenas este front como site estático não inicia a API Python.
