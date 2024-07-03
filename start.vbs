Set objShell = WScript.CreateObject("WScript.Shell")
objShell.Run "cmd /c concurrently ""yarn run client"" ""yarn run server""", 1, False
