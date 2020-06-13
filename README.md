General job tracker to keep of jobs you have applied to in the past.

Services used.
- AWS DynamoDB
- AWS Lambda
- AWS API Gateway
- AWS S3 Static Hosting

To Do:
- Dynamo resources by authorization only
- Enum's of states of applications, ie applied, phone call, in person interview...
- Sorting by date, company, position, location
- Apigateway -> Lambda -> DynamoDb calll ExclusiveStartKey for pageination
- Local Secondary Index on date to order
- Delete Item DyanamoDB

Stretch Goals:
- web scrapper testing to auto fill information
    
