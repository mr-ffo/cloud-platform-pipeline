import * as aws from "@pulumi/aws";

/**
 * Storage Module
 *
 * Responsible for:
 * - S3 Buckets
 * - Lifecycle Rules
 * - Object Storage
 * - Future Backup Policies
 */

export const bucket = new aws.s3.Bucket("platform-storage", {
    forceDestroy: false,
});
// set to false if you dont want to delete the objects mistakenly
export const bucketName = bucket.id;
