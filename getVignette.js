console.log('Loading function');

const aws = require('aws-sdk');

const s3 = new aws.S3({ apiVersion: '2006-03-01' });


exports.handler = async(event, context) => {
    var etag = event.params.path.etag;
    const bucket = "tx-vignette";
    const params = {
        Bucket: bucket,
        Key: etag+".jpg",
    };
    const data = await s3.getObject(params).promise();
    return data.Body.toString('base64');

};