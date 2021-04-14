import cdk = require('@aws-cdk/core');
import iam = require('@aws-cdk/aws-iam');
import dynamodb = require('@aws-cdk/aws-dynamodb');

export interface DatabaseStackProps extends cdk.StackProps {
    projectName: string,
    tableName: string,
    partitionKeyName: string,
    sortKeyName: string
}

export class DatabaseStack extends cdk.Stack {

    public readonly goalsTable: dynamodb.Table;
    public readonly dynamoDbRole: iam.Role;

    constructor(scope: cdk.Construct, id: string, props: DatabaseStackProps) {
        super(scope, id, props);

        /* Dynamo Objects */
        //#region
        /* Create DynamoDB Goals Table */
        this.goalsTable = new dynamodb.Table(this, 'TGoals', {
            tableName: props.tableName,
            partitionKey: { name: props.partitionKeyName, type: dynamodb.AttributeType.STRING },
            sortKey: { name: props.sortKeyName, type: dynamodb.AttributeType.STRING },
            readCapacity: 1,
            writeCapacity: 1,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });

        /* Create DynamoDB Role/Policy */
        this.dynamoDbRole = new iam.Role(this, 'DynamoDbRole', {
            assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        });

        const goalsPolicy = new iam.Policy(this, 'GoalsPolicy', {
            policyName: 'GoalsPolicy',
            roles: [this.dynamoDbRole],
            statements: [
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: ['dynamodb:*'],
                    resources: [this.goalsTable.tableArn],
                })
            ]
        });

        //#endregion


    }
}