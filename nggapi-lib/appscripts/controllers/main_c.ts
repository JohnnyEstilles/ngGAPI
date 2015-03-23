/// <reference path="../../../definitely_typed/angular/angular.d.ts"/>
// TODO need to extract all interfaces to a single definition file
/// <reference path="../../../nggapi_interfaces/drive_interfaces.d.ts"/>

class MainCtrl {
	sig = 'MainCtrl';
	filetitle:string = 'foo';
	filetitle2:string = 'foo';
	filetitle3:string = 'foo';
	ro;
	d;
	arry = [];
	getData:any = {media:'mc'};
	inp = 'inp';
	static $inject = ['$scope', '$log', 'DriveService'];

	// make some files, the do stuff with the, then trash them, then delete them


	constructor(private $scope, private $log:ng.ILogService, private DriveService:NgGapi.IDriveService) {
		$scope.vm = this;
		var id = '0Bw3h_yCVtXbbSXhZR00tUDcyWVE';
		var idmedia = '0Bw3h_yCVtXbbU3huUVpjb0FfZ0U';


		DriveService.files.list({q:'title contains "delme"', fields:'nextPageToken,items/title'}, true)
			.promise
			.then(                                                                      // NB the THREE 'then' functions
				(data:any) => {;console.error(data.items.length)},              // called when the final page is fetched
				undefined,                                                              // error
				(data:any) => {;console.error(data.items.length)}               // called after each page (except final page)
			);

		// here the output array is bound to the view model and will be appended to by each page of list results
		// see the ng-repeat in index.html
		this.arry = DriveService.files.list({q:'title contains "delme"', maxResults:5, fields:'nextPageToken,items/title'}, true).data;
return;
		DriveService.files.insert({title: 'delme insert'}).promise.then((data:NgGapi.IDriveFile)=> {
			console.log("controller then inserted id = " + data.id);
			this.filetitle = data.title;
		});
		DriveService.files.get({fileId: id}).promise.then((data:NgGapi.IDriveFile)=> {
			console.log("controller then");
			this.filetitle2 = data.title;
		});

		var prom = DriveService.files.insert({
			title: 'delme media',
			mimeType: 'text/plain'
		}, {uploadType: 'multipart'}, btoa('hello world')).promise;
		prom.then((data:NgGapi.IDriveFile)=> {
			console.log('inserted with mime ' + data.mimeType)
		});
		prom.catch((reason)=> {
			console.error("OMG it failed", reason)
		});

		var title = 'delme chain file title';                   // insert a file
		this.insertFile(title)                   // insert a file
			.then((file)=> {
				return this.getFile(file.id)
			})             // retrieve the newly inserted file
			.then((file)=> {
				this.displayTitle(title, file.title)
			});           // console log the title

		this.insertFile('delme chain file title 2')                 // insert a file
			.then((file)=> {
				return this.getFileContents(file.id)
			})             // retrieve the newly inserted file
			.then((data)=> {
				console.log('inserted content, fetched with GET = ' + data)
			});           // console log the title
		this.d = DriveService.files.get({fileId: id}).data;
		this.getFileContents(idmedia);

		this.insertFile("delme trash me")
			.then((file)=>{
				DriveService.files.trash({fileId:file.id}).promise.then((resp)=>{console.log('trashed '+resp['id'])})
			})
	}


	insertFile(title:string):ng.IPromise<NgGapi.IDriveFile> {
		return this.DriveService.files.insert({
			title: title,
			mimeType: 'text/plain'
		}, {uploadType: 'multipart'}, btoa('some multipart content')).promise;
	}

	getFile(id:string):ng.IPromise<NgGapi.IDriveFile> {
		return this.DriveService.files.get({fileId: id}).promise;
	}
	getFileContents(id:string):ng.IPromise<NgGapi.IDriveFile> {
		var d = this.DriveService.files.get({fileId: id, alt: 'media'});
		// for a media get, the response object is {media: "file contents"} and must be assigned as shown below. SO important to document that this.media = d.data.media WILL NOT WORK!!!!
		this.getData = d.data;
		return d.promise;
	}

	displayTitle(expect:string, title:string) {
		this.$log.info("chained title ("+expect+")= " + title);
	}
}

//angular.module('MyApp')
//  .controller('MainCtrl', function ($scope) {
//    $scope.sig = 'MainCtrl';
//  });
angular.module('MyApp')
	.controller('MainCtrl', MainCtrl);
