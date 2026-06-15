@REM Maven Wrapper script for Windows
@REM Downloads Maven if not present and runs it

@echo off
setlocal

set MAVEN_PROJECTBASEDIR=%~dp0
set WRAPPER_JAR="%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.jar"
set WRAPPER_URL="https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar"
set MAVEN_URL="https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.6/apache-maven-3.9.6-bin.zip"
set MAVEN_HOME="%MAVEN_PROJECTBASEDIR%.mvn\wrapper\apache-maven-3.9.6"

if not exist %MAVEN_HOME% (
    echo Downloading Maven...
    if not exist %WRAPPER_JAR% (
        powershell -Command "Invoke-WebRequest -Uri %WRAPPER_URL% -OutFile %WRAPPER_JAR%"
    )
    powershell -Command "Invoke-WebRequest -Uri %MAVEN_URL% -OutFile '%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven.zip'"
    powershell -Command "Expand-Archive -Path '%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven.zip' -DestinationPath '%MAVEN_PROJECTBASEDIR%.mvn\wrapper' -Force"
    del "%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven.zip"
)

set PATH=%MAVEN_HOME%\bin;%PATH%
mvn %*
