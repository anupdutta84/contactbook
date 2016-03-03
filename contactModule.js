/**
 * 
 */
var contactModuleApp = angular.module('contactModule', [ 'ngMask' ]);

contactModuleApp.factory('appFactory', function() {
	var factory = {};

	factory.saveRecord = function(record) {
		var savedData = JSON.parse(localStorage.getItem("contactbook"));
		var success = true;

		if (savedData == null) {
			savedData = [];
			savedData.push(record);
		} else {
			savedData.push(record);
		}

		try {
			localStorage.setItem("contactbook", JSON.stringify(savedData));
		} catch (err) {
			success = false;
		}
		return success;
	};

	factory.getList = function() {
		var savedata = JSON.parse(localStorage.getItem("contactbook"));
		if (savedata == null) {
			savedata = [];
		}
		return savedata;
	};

	factory.sync = function(records) {
		var success = true;

		var savedata = [];
		for (rec in records) {
			var r = records[rec];
			savedata.push({
				firstName : r.firstName,
				lastName : r.lastName,
				birthday : r.birthday,
				company : r.company,
				email : r.email,
				mobile : r.mobile,
				imgData : r.imgData,
			});
		}
		try {
			localStorage.setItem("contactbook", JSON.stringify(savedata));
		} catch (err) {
			success = false;
		}
		return success;
	};

	return factory;
});

contactModuleApp.controller('cbCtrl', function($scope, appFactory) {

	$scope.contactList = appFactory.getList();

	$scope.currentRecord = {
		firstName : "",
		lastName : "",
		birthday : "",
		company : "",
		email : "",
		mobile : "",
		imgData : "",
	};

	$scope.isEdit = false;
	$scope.currentIndex = 0;
	$scope.lastRecord = null;
	
	$scope.add = function() {
		$("#contactEdit").show();
	}

	$scope.save = function() {
		if ($scope.isEdit) {
			$scope.isEdit = false;
			$scope.contactList[$scope.currentIndex] = $scope.currentRecord;
			if(!appFactory.sync($scope.contactList)){
				$scope.contactList[$scope.currentIndex] = $scope.lastRecord;
				alert("Image too big : Unable to save record");
			}
		} else {
			if(appFactory.saveRecord($scope.currentRecord)){
				$scope.contactList.push($scope.currentRecord);
			}else{
				alert("Image too big : Unable to save record");
			}
		}

		$scope.reset();
	}

	$scope.getRecord = function(index) {
		var obj = this.contactList[index];
		return {
			firstName : obj.firstName,
			lastName : obj.lastName,
			birthday : obj.birthday,
			company : obj.company,
			email : obj.email,
			mobile : obj.mobile,
			imgData : obj.imgData,
		};
	}

	$scope.edit = function(index) {
		$("#contactEdit").show();
		$scope.isEdit = true;
		$scope.currentIndex = index;
		$scope.currentRecord = $scope.getRecord(index);
		$scope.lastRecord = angular.copy($scope.currentRecord);
		
		$("#uploadedImg").hide();
		$("#uploadedImg").css("height", "");
		$("#uploadedImg").css("width", "");
		$("#uploadedImg").css("src", "");

		if ($scope.currentRecord.imgData != "") {
			loadImagefromData("uploadedImg", $scope.currentRecord.imgData);
			$("#uploadedImg").show();
			$("#uploadedImg").height(210);
			$("#uploadedImg").width(150);
		}
	}

	$scope.del = function(index) {
		if (confirm("Do you want to delete current record?")) {
			$scope.contactList.splice(index, 1);
			appFactory.sync($scope.contactList);
			$scope.reset();
		}
	}

	$scope.reset = function() {
		$scope.currentRecord = {
			firstName : "",
			lastName : "",
			birthday : "",
			company : "",
			email : "",
			mobile : "",
			imgData : "",
		};

		$("#uploadedImg").hide();
		$("#uploadedImg").css("height", "");
		$("#uploadedImg").css("width", "");
		$("#uploadedImg").css("src", "");

		$scope.isEdit = false;
		$scope.currentIndex = 0;

		$("#contactEdit").hide();
	}

	$scope.uploadImage = function(e) {
		$("#uploadedImg").hide();
		$("#uploadedImg").css("height", "");
		$("#uploadedImg").css("width", "");
		$("#imagefile").trigger('click');
	}

	$scope.submitForm = function(isValid) {
		if (isValid) {
			$scope.save();
		}
	}

	$("#imagefile").on('change', function() {
		if (this.files && this.files[0]) {
			var reader = new FileReader();
			reader.onload = imageIsLoaded;
			reader.readAsDataURL(this.files[0]);
		}
	});

	function imageIsLoaded(e) {
		$("#uploadedImg").show();
		$('#uploadedImg').attr('src', e.target.result);
		bannerImage = document.getElementById('uploadedImg');
		$scope.currentRecord.imgData = getBase64Image(bannerImage);
		$("#uploadedImg").height(210);
		$("#uploadedImg").width(150);
	}

	function loadImagefromData(id, dataImage) {
		bannerImg = document.getElementById(id);
		bannerImg.src = "data:image/png;base64," + dataImage;
	}
});