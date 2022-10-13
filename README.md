# Serverless Ikea stock alert

Simple Ikea stock alert function using AWS lambda and [Serverless](https://www.serverless.com/) framework. It send 

## Getting Started

### Setup Serverless

To easily deploy this service, we use Serverless framework. First install and configure it https://www.serverless.com/framework/docs/getting-started

### Clone the repo :

```bash
git clone https://github.com/arkerone/serverless-ikea-stock-alert.git
cd serverless-ikea-stock-alert
```

### Install dependencies:

```bash
npm install
```

### Set environment variables:

Create the .env file :

```bash
cp .env.example .env
```

And set the environment variables :

```
QUEUE_ENDPOINT=''                   # The email which receive the alerts
REGION=''                           # The AWS region
SCHEDULE='cron(* */2 * * ? *)'      # A schedule expressions for alert (more info : https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html)
PRODUCT_LIST=''                     # The list of products to check
LANGUAGE='en'                       # The language used for email ('en' or 'fr')
```

### Product list

The list is in JSON format as follows :

```json
{
  "storeId":"198",
  "city":"Reims",
  "products":[
    {
      "id":"00263850",
      "name":"BILLY, Bookcase, white, 80x28x202 cm"
    },
    {
      "id":"20275814",
      "name":"KALLAX, Shelving unit, white, 77x77 cm"
    }
  ]
```

You can specify severals products if you want.

#### Find store id

Refer to the following list : [store list](resources/stores.csv)

#### Find product id

Use the product reference that you can find on the internet or in stores

### Deployment

To deploy this lambda function, use this command :

```bash
serverless deploy
```

### Remove the function

To remove this lambda function, use this command :

```bash
serverless remove
```
