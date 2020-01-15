// require('dotenv').config()
const aws = require('aws-sdk')
const {S3_BUCKET, AWS_REGION} = process.env

aws.config.getCredentials(function(err) {
    if (err) console.log(err.stack);
    // credentials not loaded
    else {
      console.log("Access key:", aws.config.credentials.accessKeyId);
      console.log("Secret access key:", aws.config.credentials.secretAccessKey);
    }
  });

  aws.config.region = AWS_REGION

  console.log("Region: ", aws.config.region);

module.exports = {
    getSigned: (req, res) => {
        const s3 = new aws.S3()
        const {fileName, fileType} = req.query
        const s3Params = {
            Bucket: S3_BUCKET,
            Key: fileName,
            Expires: 60,
            ContentType: fileType,
            ACL: 'public-read'
        }

        s3.getSignedUrl('putObject', s3Params, (err, data) => {
            if(err) {
                console.log('S3 Signed Request Error:', err)
                res.status(500).json({message: 'Error uploading photo'})
            } else {
                const returnData = {
                    signedRequest: data,
                    url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
                }

                res.status(200).json(returnData)
            }
        })
    }
}