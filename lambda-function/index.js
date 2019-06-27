exports.handler = async (event, context) => {
    console.log('Loading function');
    const aws = require('aws-sdk');
    const s3 = new aws.S3({ apiVersion: '2006-03-01' });
    var fs = require('fs');
    const docClient = new aws.DynamoDB.DocumentClient({ region: 'eu-west-1' });
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const params = {
        Bucket: bucket,
        Key: key,
    };
    /*Hash of the image*/
    const { ETag } = await s3.getObject(params).promise();
    var etag = ETag.split("\"")[1];
    /*get data of the image*/
    const data = await s3.getObject(params).promise();
    console.log(data.Body);
    /*write a temp file, attention, sync*/
    fs.writeFileSync('/tmp/image', data.Body, function (err) {
        if (err) {
            console.log(err.code, "-", err.message);
        }
        else {
            console.log("file saved");
        }
    });
    /*Run linux commands*/
    var process = require('child_process');
    /*Type and encoding of the image*/
    var type = process.execSync('file --mime-type /tmp/image').toString();
    type = type.split(" ")[1];
    var encoding = process.execSync('file --mime-encoding /tmp/image').toString();
    /*Date time original and GPS position of the image*/
    var date = process.execSync('perl exiftool -DateTimeOriginal -d %Y-%m-%d -q -s2 /tmp/image').toString();
    date = date.split(" ")[1];
    encoding = encoding.split(" ")[1];
    var gps = process.execSync('perl exiftool -GPSPosition -q -s2 /tmp/image').toString();
    gps = gps.split(": ")[1];
    /*Make a thumbnail*/
    process.execSync('./anytopnm /tmp/image|./pamscale -height 100|./pnmtojpeg > /tmp/tmpImage');
    /*Get the thumbnail ant put it in to the S3 bucket*/
    var vignette = fs.readFileSync('/tmp/tmpImage');
    console.log(vignette);
    var vParams = {
        Bucket: "tx-vignette",
        Key: etag + '.jpg',
        Body: vignette
    };
    await s3.putObject(vParams).promise();
    /*Data to stock in the database*/
    var dBparams = {
        Item: {
            filename: key,
            etag
        },
        TableName: 'SteatiteName'
    };
    await docClient.put(dBparams).promise();
    var dBmetaparams = {
        Item: {
            etag,
            type,
            encoding,
            date,
            gps
        },
        TableName: 'SteatiteMeta'
    };
    await docClient.put(dBmetaparams).promise();
};
