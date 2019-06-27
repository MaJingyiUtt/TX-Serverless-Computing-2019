# TX-Serverless-Computing-2019
Amazon Simple Storage Service(S3)
=================================
There are two S3 buckets in this project, one is 'tx-picture' for all the original images, another is 'tx-vignette' for thumbnails. 
To create a bucket is simple, in the console, click on Create a bucket, enter the bucket name then click create. 

![](./images/create-bucket.PNG)

Then in the bucket, edit Block public access settings under the Tab Permissions.

![](./images/s3-public-access.PNG)

We also need to edit the bucket policy. 

>`{
    "Version": "2012-10-17",
    "Id": "Policy1557411810501",
    "Statement": [
        {
            "Sid": "Stmt1557411804169",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::user-number:user/upload-s3"
            },
            "Action": [
                "s3:PutObject",
                "s3:PutObjectAcl",
                "s3:GetObject",
                "s3:GetObjectAcl",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::tx-picture/*"
        }
    ]
}`

![](./images/bucket-policy.PNG)

Lambda function
===============
Create a IAM role for Lambda
----------------------------
In the console of IAM, choose Create role. 
The service of the role is Lambda. 

![](./images/create-role-1.PNG)

In the next step, choose all the policies we need : CloudWatchLogsReadOnlyAccess, AmazonS3FullAccess and AmazonDynamoDBFullAccess. For DynamoDb, we need to specifiy the table name. 

![](./images/create-role-2.PNG)

Then review the role and create. 

![](./images/create-role-4.PNG)

Create Lambda function
----------------------
Create a lambda function as following. Use the role that we've created before. 

![](./images/create-lambda.PNG)

After the function created, add a trigger of S3 to Lambda. 

![](./images/add-trigger.PNG)

Set time out to 30 secondes. 

![](./images/set-timeout.PNG)

Then upload the zip file of the folder [lambda function](./lambda-function). Please make sure that you zip all the files in the folder but not the folder itself. 