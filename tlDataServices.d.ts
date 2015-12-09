declare module Triarc.Data {
    class DataRequest<TResponse> {
        method: string;
        url: string;
        data: any;
        managedType: string;
        returnType: string;
        sendData: boolean;
        constructor(method: string, url: string, data: any, managedType: string, returnType: string, sendData: boolean);
    }
}
declare module Triarc.Data {
    class DataResponse<T> {
        data: T;
        status: RequestStatus;
        httpReponse: angular.IHttpPromiseCallbackArg<T>;
        constructor(data: T, status?: RequestStatus, httpReponse?: angular.IHttpPromiseCallbackArg<T>);
        isSuccessful(): boolean;
        isFailure(): RequestStatus;
        isValidationSuccessful(): boolean;
        isValidationFailure(): boolean;
    }
    enum RequestStatus {
        Success = 0,
        Failure = 1,
        ValidationFailure = 2,
        ValidationSuccess = 3,
        Unknown = 4,
    }
}
declare module Triarc.Data {
    function appendUrlParameter(url: string, key: string, value: string): string;
}
declare module Triarc.Data {
    function convertDateStringsToDates(input: any): any;
    var mod: ng.IModule;
    class RequestSenderService {
        private urlByService;
        private $http;
        private $q;
        private $location;
        constructor(urlByService: {
            [serviceName: string]: (() => string) | string;
        }, $http: angular.IHttpService, $q: angular.IQService, $location: angular.ILocationService);
        getUrl(serviceName: string): string;
        requestValue<T>(dataRequest: DataRequest<T>): angular.IPromise<DataResponse<T>>;
    }
    class RequestSenderProvider implements angular.IServiceProvider {
        setUrl(newUrl: (() => string) | string, proxyServiceName: string): void;
        $get: (string | (($http: ng.IHttpService, $q: ng.IQService, $location: ng.ILocationService) => RequestSenderService))[];
        urlPerService: {
            [serviceName: string]: (() => string) | string;
        };
    }
}
