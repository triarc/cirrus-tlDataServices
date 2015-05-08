var Triarc;
(function (Triarc) {
    var Data;
    (function (Data) {
        var DataRequest = (function () {
            function DataRequest(method, url, data, managedType, returnType, sendData) {
                this.method = method;
                this.url = url;
                this.data = data;
                this.managedType = managedType;
                this.returnType = returnType;
                this.sendData = sendData;
            }
            return DataRequest;
        })();
        Data.DataRequest = DataRequest;
    })(Data = Triarc.Data || (Triarc.Data = {}));
})(Triarc || (Triarc = {}));
var Triarc;
(function (Triarc) {
    var Data;
    (function (Data) {
        var DataResponse = (function () {
            function DataResponse(data, status, httpReponse) {
                if (status === void 0) { status = 0 /* Success */; }
                this.data = data;
                this.status = status;
                this.httpReponse = httpReponse;
            }
            DataResponse.prototype.isSuccessful = function () {
                return this.status == 0 /* Success */;
            };
            DataResponse.prototype.isFailure = function () {
                return this.status = 1 /* Failure */;
            };
            DataResponse.prototype.isValidationSuccessful = function () {
                return this.status == 3 /* ValidationSuccess */;
            };
            DataResponse.prototype.isValidationFailure = function () {
                return this.status == 2 /* ValidationFailure */;
            };
            return DataResponse;
        })();
        Data.DataResponse = DataResponse;
        (function (RequestStatus) {
            RequestStatus[RequestStatus["Success"] = 0] = "Success";
            RequestStatus[RequestStatus["Failure"] = 1] = "Failure";
            RequestStatus[RequestStatus["ValidationFailure"] = 2] = "ValidationFailure";
            RequestStatus[RequestStatus["ValidationSuccess"] = 3] = "ValidationSuccess";
            RequestStatus[RequestStatus["Unknown"] = 4] = "Unknown";
        })(Data.RequestStatus || (Data.RequestStatus = {}));
        var RequestStatus = Data.RequestStatus;
    })(Data = Triarc.Data || (Triarc.Data = {}));
})(Triarc || (Triarc = {}));
var Triarc;
(function (Triarc) {
    var Data;
    (function (Data) {
        function appendUrlParameter(url, key, value) {
            // best guess, just check the url to see if we already have a ? for parameters
            if (url.indexOf("?") == -1) {
                url = url + "?";
            }
            key = encodeURI(key);
            value = encodeURI(value);
            var kvp = url.split('&');
            var i = kvp.length;
            var x;
            while (i--) {
                x = kvp[i].split('=');
                if (x[0] == key) {
                    x[1] = value;
                    kvp[i] = x.join('=');
                    break;
                }
            }
            if (i < 0) {
                kvp[kvp.length] = [key, value].join('=');
            }
            //this will reload the page, it's likely better to store this until finished
            return kvp.join('&');
        }
        Data.appendUrlParameter = appendUrlParameter;
    })(Data = Triarc.Data || (Triarc.Data = {}));
})(Triarc || (Triarc = {}));
/// <reference path="datarequest.ts" />
/// <reference path="dataresponse.ts" />
/// <reference path="urlfunctions.ts" />
var Triarc;
(function (Triarc) {
    var Data;
    (function (Data) {
        angular.module('ng').config([
            "$httpProvider",
            function ($httpProvider) {
                $httpProvider.defaults.transformResponse.push(function (responseData) {
                    convertDateStringsToDates(responseData);
                    return responseData;
                });
            }
        ]);
        // fixed
        var regexIso8601 = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;
        function convertDateStringsToDates(input) {
            // Ignore things that aren't objects.
            if (typeof input !== "object")
                return input;
            for (var key in input) {
                if (!input.hasOwnProperty(key))
                    continue;
                var value = input[key];
                var match;
                if (typeof value === "string" && (match = value.match(regexIso8601))) {
                    var parsedDate = Date.parse(match[0]);
                    if (!isNaN(parsedDate)) {
                        input[key] = new Date(parsedDate);
                    }
                }
                else if (typeof value === "object") {
                    // Recurse into object
                    convertDateStringsToDates(value);
                }
            }
            return input;
        }
        Data.convertDateStringsToDates = convertDateStringsToDates;
        Data.mod = angular.module("tlDataServices", []);
        Data.mod.config([
            '$httpProvider',
            function ($httpProvider) {
                $httpProvider.defaults.headers.post = {
                    'Content-Type': 'application/json'
                };
            }
        ]);
        var RequestSenderService = (function () {
            function RequestSenderService(urlByService, $http, $q, $location) {
                this.urlByService = urlByService;
                this.$http = $http;
                this.$q = $q;
                this.$location = $location;
            }
            RequestSenderService.prototype.getUrl = function (serviceName) {
                var url = this.urlByService[serviceName];
                if (angular.isString(url))
                    return url;
                return "api";
            };
            RequestSenderService.prototype.requestValue = function (dataRequest) {
                var deferred = this.$q.defer();
                // make the http call
                this.$http({
                    method: dataRequest.method,
                    url: dataRequest.url,
                    data: dataRequest.sendData ? dataRequest.data : null
                }).then(function (response) {
                    var responseData = response.data;
                    if (dataRequest.returnType == "boolean")
                        responseData = (responseData == "true");
                    else if (dataRequest.returnType == "number")
                        responseData = +responseData;
                    else if (dataRequest.returnType != "string" && responseData == "null")
                        responseData = null;
                    deferred.resolve(new Data.DataResponse(responseData, 0 /* Success */, response));
                }, function (response) {
                    deferred.reject(new Data.DataResponse(response.data, 1 /* Failure */, response));
                });
                return deferred.promise;
            };
            return RequestSenderService;
        })();
        Data.RequestSenderService = RequestSenderService;
        var RequestSenderProvider = (function () {
            function RequestSenderProvider() {
                var _this = this;
                this.$get = ['$http', '$q', '$location', function ($http, $q, $location) {
                    return new RequestSenderService(_this.urlPerService, $http, $q, $location);
                }];
                this.urlPerService = {};
            }
            RequestSenderProvider.prototype.setUrl = function (newUrl, proxyServiceName) {
                this.urlPerService[proxyServiceName] = newUrl;
            };
            return RequestSenderProvider;
        })();
        Data.RequestSenderProvider = RequestSenderProvider;
        Data.mod.provider('$requestSender', [RequestSenderProvider]);
    })(Data = Triarc.Data || (Triarc.Data = {}));
})(Triarc || (Triarc = {}));

