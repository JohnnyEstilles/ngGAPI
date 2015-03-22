'use strict';
//
// tests for the DriveService.
describe('Service: DriveService', function () {

	// load the service's module
	beforeEach(module('MyApp'));

	// instantiate service
	var $httpBackend;
	var $rootScope;
	var $q;
	var $timeout;
	var DriveService;
	var authRequestHandlerGet;
	var authRequestHandlerPost;

	beforeEach(inject(function (_$httpBackend_, _DriveService_, _$q_, _$rootScope_, _$timeout_) {
		$httpBackend = _$httpBackend_;
		DriveService = _DriveService_;
		$q = _$q_;
		$rootScope = _$rootScope_;
		$timeout = _$timeout_;
		// mock out the underlyinh getAccessToken to return a test string
		DriveService.getHttpService().getOauthService().getAccessToken = function () {
			return 'testaccesstoken'
		};
	}));

	beforeEach(function () {
		// Set up the mock http service responses
		// backend definition common for all tests
		// this configures the backed to return specified responses in response to specified http calls
		//authRequestHandlerGet = $httpBackend.when('GET', '')
		//	.respond({kind: 'drive#file'}, {'A-Token': 'xxx'});
		//authRequestHandlerPost = $httpBackend.when('POST', '')
		//	.respond(200, {id: 'id_from_mock_httpbackend', title: 'title'});
	});


	afterEach(function () {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});


	it('should be instantiated', function () {
		expect(!!DriveService).toBe(true);
	});

	it('should have the correct sig', function () {
		expect(DriveService.sig).toBe('DriveService');
	});


	// test each method by first defining what we expect it to send to $http
	// and then call the method
	//it('list should call GET on the drive endpoint', function () {
	//	var filesUrl = 'https://www.googleapis.com/drive/v2/files/:id';
	//	$httpBackend.expectGET(filesUrl.replace(':id', 'foo'));
	//	DriveService.files.get({fileId: 'foo'});
	//	$httpBackend.flush();
	//});

	it('get should return a file object', function () {
		var id = 'foo2';
		var filesUrl = 'https://www.googleapis.com/drive/v2/files/'+id;
		$httpBackend
			.whenGET("")
			.respond({id: id}
		);

		var ro = DriveService.files.get({fileId: id});

		$httpBackend.flush();

		expect('a'+DriveService.lastFile.id).toBe('a'+id);
		expect('b'+ro.data.id).toBe('b'+id);
	});



	it('insert should return a file object', function () {
		var id = 'fooi';
		var filesUrl = 'https://www.googleapis.com/drive/v2/files';
		$httpBackend
			.whenPOST("")
			.respond({id: id}
			);

		var ro = DriveService.files.insert({title: 'title-'+id});

		$httpBackend.flush();
		console.log(ro);

		expect(DriveService.lastFile.id).toBe(id);
		expect(ro.data.id).toBe(id);
	});





	/*
	 it('insert should call POST on the tasks endpoint', function() {
	 console.log("test insert");
	 $httpBackend.expectPOST("http://localhost:8080/tasks/v1/lists/MDM4NjIwODI0NzAwNDQwMjQ2MjU6OTEzMzE4NTkxOjA/tasks");
	 DriveService.insert({title:'foo'});
	 $httpBackend.flush();
	 });
	 */

});