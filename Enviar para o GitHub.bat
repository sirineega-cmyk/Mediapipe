@echo off
setlocal
cd /d "%~dp0"

echo ===================================================
echo           Publicar Projeto no GitHub
echo ===================================================
echo.

git --version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] O comando 'git' nao foi encontrado.
    echo Reinicie o terminal ou adicione o Git ao PATH.
    pause
    exit /b 1
)

git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo Nenhum link de repositorio remoto configurado ainda.
    echo.
    echo Crie um repositorio VAZIO no GitHub (sem README nem .gitignore).
    echo Em seguida, cole a URL HTTPS do seu repositorio abaixo:
    echo (Exemplo: https://github.com/seu-usuario/seu-repositorio.git)
    echo.
    set /p REPO_URL="Cole a URL do GitHub e pressione Enter: "
    if "%REPO_URL%"=="" (
        echo Nenhuma URL informada. Operacao cancelada.
        pause
        exit /b 1
    )
    git remote add origin %REPO_URL%
    echo Repositorio remoto vinculado com sucesso!
    echo.
) else (
    echo Repositorio remoto ja configurado:
    git remote get-url origin
    echo.
)

echo Enviando arquivos para a branch 'main' no GitHub...
git push -u origin main

if errorlevel 1 (
    echo.
    echo [AVISO] O envio falhou. Se for a primeira vez, faca o login na janela que o GitHub abrir.
    echo Caso queira trocar a URL do repositorio remoto, execute:
    echo   git remote set-url origin NOVA_URL
) else (
    echo.
    echo ===================================================
    echo  Sucesso! O projeto foi enviado para o GitHub.
    echo ===================================================
)

echo.
pause
