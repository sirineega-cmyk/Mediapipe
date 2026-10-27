# Visão Facial — MediaPipe

Site para detectar rostos e desenhar os 478 pontos faciais com MediaPipe. O processamento das imagens acontece no navegador; elas não são enviadas para um servidor.

## Abrir pelo GitHub Pages

Depois de enviar estes arquivos para um repositório no GitHub:

1. Abra **Settings → Pages** no repositório.
2. Em **Build and deployment**, escolha **GitHub Actions** como origem.
3. Envie (push) para a branch `main` ou `master`. A ação deste projeto compila e publica o site automaticamente.
4. Abra o endereço publicado em **Settings → Pages**. Esse link é o que a pessoa usa; não precisa baixar nem executar o projeto.
5. Para usar a câmera, abra o link em HTTPS e permita o acesso quando o navegador perguntar. O envio de imagens e a imagem de demonstração também funcionam pelo site.

Cada novo envio para a branch principal publica uma atualização.

## Desenvolvimento local

Requer Node.js 20 ou superior. Na pasta do projeto:

```bash
npm ci
npm run dev
```

Abra o endereço local informado pelo Vite. Para compilar e conferir a versão de publicação:

```bash
npm run build
npm run preview
```

O `index.html` faz parte do site gerado, mas não deve ser aberto por duplo clique como `file://`: navegadores bloqueiam módulos, WebAssembly e acesso à câmera nesse modo. Para a pessoa usuária, compartilhe o link HTTPS do GitHub Pages.

## Arquivos do MediaPipe

A biblioteca JavaScript está em `vendor/mediapipe/`; os arquivos WebAssembly, os modelos e a imagem de demonstração estão em `public/`. Eles são copiados para o site compilado, então o reconhecimento não depende de baixar arquivos do MediaPipe de um CDN em tempo de uso.
