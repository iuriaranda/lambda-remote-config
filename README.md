lambda-remote-config
====================

## Description

Load JSON configuration files from AWS S3 into your Lambda function. It provides a handler that process the Lambda invocations once the configuration is loaded.

## Usage

```js
var lambdaConfig = require('lambda-remote-config');

var CONFIG = lambdaConfig.fetch({ S3Bucket: 'some-bucket', S3File: 'somefile.json' });

exports.handler = lambdaConfig.handler(function (event, context) {
  // This is your actual lambda invocation handler that will be executed
  // once the configuration is loaded into the CONFIG object
});
```

If an error occurs, `lambdaConfig` will emit an `error` event, but the handler **will be** run regardless. If there is no listener for the `error` event, an exception will be thrown.

When the configuration is loaded successfully, and before calling the handler method, `lambdaConfig` will also emit a `ready` event.

## ToDo

* Add some tests
* Load config from remote urls
* Load config from a DynamoDB table

## License

MIT
