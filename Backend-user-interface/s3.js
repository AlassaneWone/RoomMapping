const dotenv = require('dotenv')
const aws = require('aws-sdk')
require('dotenv').config({path :'.env'});
const {ListObjectsV2Command, S3Client} = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");

dotenv.config()

const region = "eu-north-1"
const bucketName = "roommappingbucket"
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const s3 = new aws.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: 'v4'
})

async function getObject(){
    const params = ({
        Bucket: 'roommappingbucket',
        Key: 'Cat.png'
    })
    s3.getObject(params, function(err, data){
        if (err){console.log(err, err.stack)}
        else console.log(data)
    })
}

async function getObjectsFromS3Bucket() {
    let isTruncated = true;
    let marker;
    while(isTruncated) {
        let params = {Bucket: "roommappingbucket"};
        if (marker) params.Marker = marker;
        const response = await s3.listObjects(params).promise();
        response.Contents.forEach(item => {
            console.log(item.Key);
            getObject(item.key)
        });
        isTruncated = response.IsTruncated
        if (isTruncated) {
            marker = response.Contents.slice(-1)[0].Key;
        }
    }
}

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: "roommappingbucket",
        key: function (req, file, cb) {
            console.log(file);
            cb(null, file.originalname)
        }
    })
})

module.exports = {getObject, getObjectsFromS3Bucket, upload, s3};