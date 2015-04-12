declare module Triarc.Data {
    class DataRequest<TResponse> {
        $http: ng.IHttpService;
        $q: ng.IQService;
        $location: ng.ILocationService;
        method: string;
        url: string;
        data: any;
        managedType: string;
        returnType: string;
        sendData: boolean;
        constructor($http: ng.IHttpService, $q: ng.IQService, $location: ng.ILocationService, method: string, url: string, data: any, managedType: string, returnType: string, sendData: boolean);
    }
}
declare module Triarc.Data {
    class DataResponse<T> {
        data: T;
        status: RequestStatus;
        httpReponse: ng.IHttpPromiseCallbackArg<T>;
        constructor(data: T, status?: RequestStatus, httpReponse?: ng.IHttpPromiseCallbackArg<T>);
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
    function requestValue<T>(dataRequest: DataRequest<T>): ng.IPromise<DataResponse<T>>;
}
