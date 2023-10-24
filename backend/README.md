#init


npm intall


#This is the discovey API server.

#Through the API server, DID registration status, survey inquiry and participation, and linking with other platforms are performed.


node app.js

#Cron for token transfer.
#This cron provides the function of creating a SafeWallet for each user and confirming the safeTx requested through SafeWallet AA.


node -r esm cron.js 
