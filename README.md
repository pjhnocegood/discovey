# discovey
discovey

DEMO : https://discovey.site/auth/login

Project Description
Discovey is a social networking service that offers survey and recruiting integration.

Discovey serves B2B2C. This is where users can earn money by providing their data and survey data. By purchasing a variety of data, companies can obtain broader and more valuable data to find talent, gain broader insights, and easily utilize the data for a variety of services. Advertisements are also provided to help companies promote their business.

Utilize Next.ID in the Mask Network to issue user data as a DID (Decentralized Identifier).

It provides advertising push notifications using the push protocol, creates a Discovey channel in the push protocol, generates survey data for subscribing to the channel, receives a reward when the survey is completed, and uses the data to send advertisements. Push alarm.

By integrating the AA SDK for Safe, we add technical aspects to account abstraction, use it to distribute reward tokens, and integrate with provide more features in the future.

ZK-Evm is used in Polygon, one of the networks for this service, and the network is used to provide transaction speeds and low gas fees to the network more safely.

How it's Made
To provide a familiar Web2-style UI/UX and avoid giving users a general sense of Web3, we offer Google email login using Web3auth.

Subsequently, we've implemented the automatic generation of DID in the login process by utilizing Next.ID on the Mask Network.

For users who may have reservations about granting gist permissions, Next.ID's previous authentication method, we offer authentication through OAuth to receive authorization for GitHub. To address users' concerns, we function as an issuer, obtaining only read permissions for their GitHub information. We then sign the user's avatar and GitHub data and store this data in the Next.ID's key-value repository. This allows for authentication without needing gist permissions.

In order to enable companies to provide advertisements to users via push notifications, we employ Push Protocol. When users subscribe to channels on Discovey, our channels are utilized to deliver advertisements from companies.

Our proprietary token, DOY, is issued and provided through ZK EVM. Furthermore, we use AA on Safe to deliver our services.
