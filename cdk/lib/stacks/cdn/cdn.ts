import cdk = require('@aws-cdk/core');
import iam = require('@aws-cdk/aws-iam');
import cf = require('@aws-cdk/aws-cloudfront')
import s3 = require('@aws-cdk/aws-s3');

export interface CdnStackProps extends cdk.StackProps {
    cdnWebsiteIndexDocument: string,
    cdnComment: string
}

export class CdnStack extends cdk.Stack {

    constructor(scope: cdk.Construct, id: string, websiteBucket: s3.Bucket, props: CdnStackProps) {
        super(scope, id, props);


        /* Cloudfront CDN Distribution */
        //#region 

        const assetsCdn = new cf.CloudFrontWebDistribution(this, 'AssetsCdn', {
            defaultRootObject: props.cdnWebsiteIndexDocument,
            comment: props.cdnComment,
            originConfigs: [
                {
                    s3OriginSource: {
                        s3BucketSource: websiteBucket,
                        // There is a current but in CDK by which OAE's create a circular dependency
                        // Amazon is aware of this.  The OAE is not required to run the demo app.
                        // originAccessIdentity: new cf.OriginAccessIdentity(this, 'WebsiteBucketOriginAccessIdentity', {
                        //     comment: `OriginAccessIdentity for ${websiteBucket}`
                        // }),
                    },
                    behaviors: [{ isDefaultBehavior: true }]
                }
            ]
        });

        //#endregion

        /* Outputs */
        new cdk.CfnOutput(this, 'CdnUrl', { value: assetsCdn.distributionDomainName });



    }
}