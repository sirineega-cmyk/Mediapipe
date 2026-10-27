@echo off
cd /d "%~dp0"
where npm >nul 2>nul
if errorlevel 1 (
  echo Node.js e npm nao foram encontrados. Instale o Node.js para iniciar o programa.
  pause
  exit /b 1
)
if not exist "node_modules\vite\bin\vite.js" (
  echo Preparando as dependencias do programa. Isso requer conexao com a internet na primeira vez.
  call npm install
  if errorlevel 1 (
    echo Nao foi possivel instalar as dependencias.
    pause
    exit /b 1
  )
)
powershell -NoProfile -Command "try { (Invoke-WebRequest 'http://127.0.0.1:5173/@vite/client' -TimeoutSec 2).StatusCode -eq 200 } catch { $false }" | findstr /i "True" >nul
if not errorlevel 1 (
  start "" http://127.0.0.1:5173/
  exit /b 0
)
start "Visao Facial - servidor local" /min cmd /c "node_modules\.bin\vite.cmd --host 127.0.0.1 --port 5173 --strictPort"
timeout /t 4 /nobreak >nul
start "" http://127.0.0.1:5173/
