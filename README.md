# libraryBackend

Working with logging (code is in the src/other_services folder)
    - It will auto-generate files in the "logs" folder  on the root path.
    - To log something to the logs and not only the terminal, use the logger variable.
    Example:
        console.log("HELLO WORLD!") // Print the output into the console
        logger.info("HELLO WORLD!") // Also prints the output into the info.log file in logs, with the format I have given it in the logging code. 
    Check the different formats you can use to log in the log code. Currently we have one for "info" and one for "error".
    
