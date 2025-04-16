@echo off
:: Enable error handling
setlocal enabledelayedexpansion

:: Define the source and destination paths
set SOURCE_PATH=%~dp0casting
set DEST_PATH=C:\Users\ky969\OneDrive\Pictures\Casting Replies

:: Check if the source path exists
if not exist "%SOURCE_PATH%" (
    echo Source path "%SOURCE_PATH%" does not exist. Exiting.
    exit /b 1
)

:: Create the destination directory if it doesn't exist
if not exist "%DEST_PATH%" (
    echo Destination path "%DEST_PATH%" does not exist. Creating it...
    mkdir "%DEST_PATH%"
)

:: Copy all files and folders from the source to the destination
echo Copying files from "%SOURCE_PATH%" to "%DEST_PATH%"...
xcopy "%SOURCE_PATH%" "%DEST_PATH%" /E /H /C /I
if errorlevel 1 (
    echo File copy failed. Exiting.
    exit /b 1
)

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