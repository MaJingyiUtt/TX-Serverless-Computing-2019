console.log('Loading function');

const aws = require('aws-sdk');
const docClient = new aws.DynamoDB.DocumentClient({ region: 'eu-west-1' });
exports.handler = (event, context, callback) => {
    
    let scanningParameters={
        TableName:'SteatiteName',
        Limit:100
    };
    docClient.scan(scanningParameters,function(err,data){
        if(err){
            callback(err,null);
            
        }else{
            callback(null,data);
        }
    });
          
};