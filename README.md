# libraryBackend
<pre>
<h1>Working with logging (code is in the src/other_services folder)</h1>
    - It will auto-generate files in the "logs" folder  on the root path.
    - To log something to the logs and not only the terminal, use the logger variable.
    Example:
        console.log("HELLO WORLD!") // Print the output into the console
        logger.info("HELLO WORLD!") // Also prints the output into the info.log file in logs, with the format I have given it in the logging code. 
    Check the different formats you can use to log in the log code. Currently we have one for "info" and one for "error".
<h1>Setup of mongoDB</h1>
    Ensure that you have the following: 
        - The mongodb server installed, I use it as a docker instance, but you can download the community edition for free. 
        - Have your env updated to use the new configs. 
        - (optional) Have mongoCompass installed for easier config and views
        - BE AWARE: If you use the docker instance and have mongo installed locally on you computer, you will need to ensure that they do not expose the sampe port (default is 27017)
    The app init a connection through app.ts and closes it when the app stops. mongoSeedData.ts is also run to clear the documents and create new seed data. 
<h1>Setup of neo4j</h1>
    Ensure that you have the following:
        - The Neo4j server running. This can be done either through a docker container or neo4j Aura. 
        - Have the env updated with the relevant information. 
    To visualise the nodes, open the neo4j browser. To see all nodes type command "MATCH (x) RETURN x"
</pre> 
