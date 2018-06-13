## Azure Cosmos DB - MongoDB API: Astros API Service

Astros is a sample Node.js and TypeScript REST service written for MongoDB API. Through changing an environment variable for database connection, Astros can run locally using MongoDB or as an Azure Web App using Cosmos DB.

## Deploy to Azure

In order to deploy to Azure using the following method, you must have an Azure subscription and a Cosmos DB instance running using the MongoDB API.

If you do not have an Azure subscription, create a [free account](https://azure.microsoft.com/en-us/free/) before you begin.

For instructions on how to create a Cosmos DB account please see [Create An Azure Cosmos DB account](https://docs.microsoft.com/en-us/azure/cosmos-db/create-mongodb-nodejs#create-an-azure-cosmos-db-account).

Click on the button below to deploy this repository to an Azure Web App. You will be prompted to give an appName, referred to as `<app_name>` throughout, which must be globally unique. This parameter will be used in the Web App's URL as `https://<app_name>.azurewebsites.net`. You will also be prompted to supply the primary connection string to your Cosmos DB instance.

<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fcosmosdb-node-mongodb-rest-service%2Fmaster%2Fdeployment%2Fazuredeploy.json" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a>

After provisioning to Azure, you can navigate to `https://<app_name>.azurewebsites.net/docs` to test the core read-write API functionality using Swagger UI. If you prefer to use [Postman](https://www.getpostman.com), use `https://<app_name>.azurewebsites.net/kvpair` as the URL.

## Running this sample

You can run this sample either locally or in Azure. Running it locally supports MongoDB and Cosmos DB. To run locally on Cosmos DB, you can either use an actual Cosmos DB instance, or install the emulator. When running on Azure, Cosmos DB is the supported database option.

### Running the Sample locally with MongoDB

Preform the following steps to run the application locally connected to a Mongo DB instance.

1.  [Download and Install MongoDB](https://docs.mongodb.com/manual/installation) on your local machine. The other alternative is to install MongoDB docker container.
2.  After installing MongoDB, create a database for testing. You can use MongoDB Compass tool to create the database.
3.  Record the database connection, for example:
    ```bash
     http://localhost:27017/testdb
    ```
4.  Clone this repository and change into the new directory
    ```bash
    git clone https://github.com/Azure-Samples/cosmosdb-node-mongodb-rest-service.git
    cd cosmosdb-node-mongodb-rest-service
    ```
5.  Install the required packages.
    ```bash
    npm install
    ```
6.  Create a file named `.env` in the main directory with the database connection string and port number for the app like below.
    ```bash
    DB_CONN_STRING=http://localhost:27017/testdb
    PORT=5000
    ```
7.  To use the environment variables set in the `.env` file, run the app using the `start:dev` script in the package.json like follows. Alternatively, you can manually set the environment variables defined in Step 6 and launch the app using `npm start`.
    ```bash
    npm run-script start:dev
    ```
8.  Navigate to `http://localhost:<port>/docs` to access the swagger UI documentation and test the functionality right away.
9.  Using Postman you can test the functionality using `http://localhost:<port>/kvpair` as the URL.

### Running the Sample locally with Cosmos DB Emulator

1.  [Download and Install Cosmos DB Emulator](https://docs.microsoft.com/en-us/azure/cosmos-db/local-emulator) on your local machine.
2.  Now, you can follow the above steps 2-9 to test the api against Cosmos DB.

Another alternative is to [Create An Azure Cosmos DB account](https://docs.microsoft.com/en-us/azure/cosmos-db/create-mongodb-nodejs#create-an-azure-cosmos-db-account) and to set `DB_CONN_STRING` from step 6 to the primary connection string of your Cosmos DB instance

### Running the Sample using an Azure Web App

Before you can run this sample, you must have the following prerequisites:

1.  Access to an Azure account. If you do not have an Azure subscription, create a [free account](https://azure.microsoft.com/en-us/free/) before you begin.
2.  Access to a Cosmos DB account and database under Azure resources. You need to [Get the MongoDB connection string](https://docs.microsoft.com/en-us/azure/cosmos-db/connect-mongodb-account), which can be found in the `Quick start` blade of your Cosmos DB instance in the Azure Portal.
3.  Azure CLI installed locally. For help [installing Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest), please see the attached link.

Preform the following steps to deploy this app to an Azure Web App from a local git repository.

1.  Clone this repository and change into the newly formed directory.

    ```bash
    git clone https://github.com/Azure-Samples/cosmosdb-node-mongodb-rest-service.git
    cd cosmosdb-node-mongodb-rest-service
    ```

2.  Log in to azure from the command line.

    ```bash
    # Azure CLI
    az login
    ```

    ```PowerShell
    # PowerShell
    Connect-AzureRmAccount
    ```

3.  If you already have Azure deployment credentials you may skip this step. These credentials are required for local Git deployment to a Web App, and are different then your Azure subscription credentials.

    In the following example, replace `<username>` and `<password>` (including brackets) with a new user name and password. The user name must be unique within Azure. The password must be at least eight characters long, with two of the following three elements: letters, numbers, symbols.

    ```bash
    # Azure CLI
    az webapp deployment user set --user-name <username> --password <password>
    ```

    ```PowerShell
    # PowerShell
    $newUserName = "<username>"
    $newPassword = "<password>"
    $PropertiesObject = @{"publishingUserName" = $newUserName; "publishingPassword" = $newPassword;}
    Set-AzureRmResource -PropertyObject $PropertiesObject -ResourceId /providers/Microsoft.Web/publishingUsers/web -ApiVersion 2016-03-01 -Force
    ```

4.  Create a resource group. The following commands will create a resource group named `myResourceGroup`.

    ```bash
    # Azure CLI
    az group create --name myResourceGroup --location "West US"
    ```

    ```PowerShell
    # PowerShell
    # Replace the following variables for use throughout the deployment
    $resourceGroupName = "myResourceGroup"
    $servicePlanName="myAppServicePlan"
    $webAppName="<app_name>"
    $location="West US"
    New-AzureRmResourceGroup -Name $resourceGroupName -Location $location
    ```

5.  Create an App Service plan. You have to use `S1` or greater for the size of the App Service plan because the free tier does not have enough memory for the webpack step of deployment. The following commands will create an App Service plan named `myAppServicePlan` in `myResourceGroup`.

    ```bash
    # Azure CLI
    az appservice plan create --name myAppServicePlan --resource-group myResourceGroup --sku S1
    ```

    ```PowerShell
    # PowerShell
    New-AzureRmAppServicePlan -Name $servicePlanName -Location $location -ResourceGroupName $resourceGroupName -Tier Standard
    ```

    When the App Service plan has been created, the Azure CLI shows information similar to the following example:

    ```json
    {
    "adminSiteName": null,
    "appServicePlanName": "myAppServicePlan",
    "geoRegion": "West US",
    "hostingEnvironmentProfile": null,
    "id": "/subscriptions/0000-0000/resourceGroups/myResourceGroup/providers/Microsoft.Web/serverfarms/myAppServicePlan",
    "kind": "app",
    "location": "West US",
    "maximumNumberOfWorkers": 1,
    "name": "myAppServicePlan",
    < JSON data removed for brevity. >
    "targetWorkerSizeId": 0,
    "type": "Microsoft.Web/serverfarms",
    "workerTierName": null
    }
    ```

6.  Create a web app in the App Service plan. You must use a runtime with node version 8.0 or above. For the Azure CLI code snippet replace `<app_name>` with a unique Web App name containing only letters, numbers and the hyphen character (-). For the PowerShell commands, the Web App name was set in Step 4.

    ```bash
    # Azure CLI
    az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name <app_name> --runtime "node|8.1" --deployment-local-git
    ```

    ```PowerShell
    # PowerShell
    # Create a web app.
    New-AzureRmWebApp -Name $webAppName -Location $location -AppServicePlan $servicePlanName -ResourceGroupName $resourceGroupName
    ```

    This command will return something similar to the following. Save the git url for deploying your code to the Web App in Step 8.

    ```json
    Local git is configured with url of 'https://<username>@<app_name>.scm.azurewebsites.net/<app_name>.git'
    {
    "availabilityState": "Normal",
    "clientAffinityEnabled": true,
    "clientCertEnabled": false,
    "cloningInfo": null,
    "containerSize": 0,
    "dailyMemoryTimeQuota": 0,
    "defaultHostName": "<app_name>.azurewebsites.net",
    "deploymentLocalGitUrl": "https://<username>@<app_name>.scm.azurewebsites.net/<app_name>.git",
    "enabled": true,
    < JSON data removed for brevity. >
    }
    ```

7.  Set the database connection environment variable in the Azure Web App by replacing `<cosmos_connection_string>` in the following code snippet. The connection string should be the primary connection string to your Cosmos DB instance.

    ```bash
    # Azure CLI
    az webapp config appsettings set --resource-group myResourceGroup --name <app_name> --settings DB_CONN_STRING=<cosmos_connection_string>
    ```

    ```PowerShell
    # PowerShell
    $webApp = Get-AzureRMWebAppSlot -ResourceGroupName $resourceGroupName -Name $webAppName -Slot production
    $appSettingList = $webApp.SiteConfig.AppSettings

    $hash = @{}
    ForEach ($kvp in $appSettingList) {
        $hash[$kvp.Name] = $kvp.Value
    }

    $hash['DB_CONN_STRING'] = "<cosmos_connection_string>"
    Set-AzureRMWebAppSlot -ResourceGroupName $resourceGroupName -Name $webAppName -AppSettings $hash -Slot production
    ```

8.  Deploy your local source code to your Azure Web App. First set your Web App as a remote git repository with the URL generated in Step 6.

    ```bash
    git remote add azure https://<username>@<app_name>.scm.azurewebsites.net/<app_name>.git
    ```

    Then push your current branch to the master branch of the remote azure repository. Enter your deployment credential password from Step 3 if prompted. This step will take a few minutes to complete.

    ```bash
    git push azure <local_branch>:master
    ```

9.  Browse to the Swagger UI page for your new Web App to test the functionality. Your first request should be a POST to establish the collection in a new Cosmos DB instance. This will return a 503 error. When you POST a second time, you should receive the expected 201 status code.

    ```
    http://<app name>.azurewebsites.net/docs
    ```

10. Using Postman you can test the functionality using `http://<app name>.azurewebsites.net/kvpair` as the URL.

## Resources

- Azure Free Account : https://azure.microsoft.com/en-us/free/
- Azure App Service : https://azure.microsoft.com/en-us/services/app-service/
- Azure Cosmos DB : https://azure.microsoft.com/en-us/services/cosmos-db/
- Azure Local Git Deployment: https://docs.microsoft.com/en-us/azure/app-service/app-service-deploy-local-git
- Mongo DB Docs : https://docs.mongodb.com/manual/
- TypeScript Docs : https://www.typescriptlang.org/samples/index.html
- Swagger : https://swagger.io/
- Postman : https://www.getpostman.com

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.
