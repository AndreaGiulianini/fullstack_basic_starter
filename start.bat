@echo off
set ENVIRONMENT=%1

:: Checking if first argument is a valid environment
if "%ENVIRONMENT%"=="staging" goto environment_ok
if "%ENVIRONMENT%"=="production" goto environment_ok

:: Otherwise the default environment is 'development'
set ENVIRONMENT=development

:environment_ok
xcopy /s compose_override\%ENVIRONMENT%.yml docker-compose.override.yml* /Y
docker compose stop && docker compose up --build