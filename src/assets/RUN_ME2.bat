@echo off
:: Enable error handling
setlocal enabledelayedexpansion

:: Run the first command
echo Running first command: git add, commit, and push...
git add . && git commit -m "Changes in assets" && git push origin main
if errorlevel 1 (
    set /p input1="Press Enter to continue... "
    echo First command failed. Exiting.
    exit /b 1
)

:: Run the second command
echo Running second command: npm run deploy...
npm run deploy
if errorlevel 1 (
    echo Second command failed. Exiting.
    exit /b 1
)

:: Wait for two inputs before closing the console
echo All commands executed successfully.
set /p input1="Press Enter to continue... "
set /p input2="Press Enter again to close... "