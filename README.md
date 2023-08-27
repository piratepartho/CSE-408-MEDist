## Environment Setup
```bash
npm install -g pnpm
```

## Install the project

- if you are using windows, then run the `run_project.bat` file in terminal
```powershell
./run_project.bat
```

- `reminder : ` in the file `run_project.bat` you can comment out the following section to skip installing dependencies every time you run the project
   - this will save you a lot of time if you are running the project multiple times
   - `but` if you are running the project for the `first time`, then you `must install` the dependencies so don't comment out then.
  
```bat
REM ================================ Comment this section if you don't want to install dependencies ================================
REM ##### must be run first time to install dependencies #####

REM Check and install dependencies for each project folder
for %%F in (Auth_Service Patient_Service Doctor_Service Medicine_Service Appointment_Service proxy) do (

    REM open a new cmd window in each folder
    start cmd /k "cd %%~F\"

    REM check if package.json is present in the folder
    if exist %%~F\package.json (
        REM check if node_modules is present in the folder
        if not exist %%~F\node_modules (
            
            REM run pnpm i if node_modules is not present and wait for it to finish
            echo node_modules not found in %%~F, running pnpm i...
            pushd %%~F
            pnpm i
            popd

        ) else (
            echo node_modules found in %%~F
        )
        
    ) else (
        echo package.json not found in %%~F
    ) 
    
)

REM close the current cmd window
taskkill /f /im cmd.exe


REM ================================ to this portion  ================================
```



