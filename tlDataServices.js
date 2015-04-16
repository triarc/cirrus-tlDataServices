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
        var regexMs = "^/Date\\((\\d+)\\)/$"; // regex used to identify the dates
        function convertDateStringsToDates(input) {
            // Ignore things that aren't objects.
            if (typeof input !== "object")
                return input;
            for (var key in input) {
                if (!input.hasOwnProperty(key))
                    continue;
                var value = input[key];
                var match;
                // Check for string properties which look like dates.
                // TODO: Improve this regex to better match ISO 8601 date strings.
                if (typeof value === "string" && (match = value.match(regexMs))) {
                    // Assume that Date.parse can parse ISO 8601 strings, or has been shimmed in older browsers to do so.
                    input[key] = new Date(parseInt(match[1])); // eval(value);// Date.parse(match[0]);
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
        Data.mod.provider('$requestSender', [
            function () {
                var url = "api";
                return {
                    setUrl: function (newUrl) {
                        url = newUrl;
                    },
                    $get: [
                        '$http',
                        '$q',
                        '$location',
                        function ($http, $q, $location) {
                            return {
                                getUrl: function () {
                                    return url;
                                },
                                requestValue: function (dataRequest) {
                                    var deferred = $q.defer();
                                    // make the http call
                                    $http({
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
                                }
                            };
                        }
                    ]
                };
            }
        ]);
    })(Data = Triarc.Data || (Triarc.Data = {}));
})(Triarc || (Triarc = {}));

