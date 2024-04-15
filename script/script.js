
  var app = angular.module("myapp",['ngRoute']);
  app.config(function($routeProvider){
    $routeProvider
    .when("/",{templateUrl:"Home.html",controller:"myctrl"})
    .when("/DangKi",{templateUrl:"DangKi.html",controller:"myctrl"})
    .when("/DangNhap",{templateUrl:"DangNhap.html",controller:"myctrl"})
    .when("/MonHoc",{templateUrl:"MonHoc.html",controller:"myctrl"})
    .when("/QuenPass",{templateUrl:"QuenMK.html",controller:"myctrl"})
    .when("/LienHe",{templateUrl:"Lienhe.html",controller:"myctrl"})
    .when("/GopY",{templateUrl:"GopY.html",controller:"myctrl"})
    .when("/DoiPass",{templateUrl:"DoiPass.html",controller:"myctrl"})
    .when("/HoiDap",{templateUrl:"HoiDap.html",controller:"myctrl"})
    .when("/TaiKhoan",{templateUrl:"TaiKhoan.html",controller:"myctrl"})
    .when("/tracnghiem/:idMH/:tenMH",{templateUrl:"CauHoi.html",controller:"quizctrl"})
    .otherwise({redirectTo:"/", controller:"myctrl"})
  })
  /////////////////////////////////////////////////////////////////////////////////////
  app.controller("myctrl", function($scope, $rootScope, $http, $location){
    $scope.start = 0;
    $scope.pageSize = 4;
    $scope.Subjects = [];
    $http.get("db/Subjects.js").then(
      function(res){$scope.Subjects =  res.data ; console.log(res.data)},
      function(res){alert("Loi");  console.log(res);}
    );
    $scope. Students = [];
    $scope.Students = JSON. parse(localStorage. getItem( 'students'));
    if ($scope.Students ==null) 
      $http.get("db/Students.js"). then(
      function (res) {
      $scope. Students = res.data;
      localStorage.setItem( 'students', JSON. stringify (res.data))
      },
      function(res) { alert("Lỗi khi lấy students");} 
    )
    console.log("Students=", $scope.Students);
    $scope.dangky = function(){
      $scope.Students.push( $scope.Student );
      localStorage. setItem( 'students', JSON.stringify($scope.Students));
      alert ("Đã đăng ký thành công tài khoản:" + $scope.Student.username);
      $location.path('/');
    }
    $rootScope.username = sessionStorage.getItem('username');
    $scope.dangnhap = function() {
      $rootScope.username = "";
      $rootScope.fullname = ""; // Thêm dòng này để khởi tạo fullname
      $rootScope.email = "";
      $rootScope.gender = "";
      $rootScope.birthday = "";
      $rootScope.schoolfee = "";
      $rootScope.marks = "";
      u = $scope.u;
      p = $scope.p;
      index = $scope.Students.findIndex(st => st.username == u && st.password == p);
      if (index >= 0) {
          $rootScope.username = u;
          $rootScope.fullname = $scope.Students[index].fullname; // Lấy giá trị fullname
          $rootScope.email = $scope.Students[index].email;
          $rootScope.gender = $scope.Students[index].gender;
          $rootScope.birthday = $scope.Students[index].birthday;
          $rootScope.schoolfee = $scope.Students[index].schoolfee;
          $rootScope.marks = $scope.Students[index].marks;
          sessionStorage.setItem('username', u);
          $location.path('/');
          alert("Đăng nhập thành công");
      } else {
          alert("Đăng nhập thất bại");
      }
      }  
      $scope.quenpass = function() {
        const user = $scope.Students.find(s => s.email === $scope.email);
        if (user) {
        alert("Mật khẩu bạn là : " + user.password);
        }else alert("Không có email là " +  $scope.email)
      }
      $scope.doipass=function(){
      user = $scope.Students.find( s => s.username == $rootScope.username);
      if (user == null) { alert("không có username trong db"); return; } 
      if (user. password != $scope.pass_old) { alert("Pass cũ không đúng"); return; } 
      if ($scope. pass_new1!= $scope.pass_new2) { alert("2 Pass mới không giống"); return;}
      user. password= $scope.pass_new1 
      localStorage. setItem( 'students', JSON. stringify ($scope.Students)); 
      alert(" Đổi mật khẩu thành công");
      $location.path('/');
      }
      $scope.thoat=function(){
        if(confirm("Bạn có chắc chắn muốn đăng xuất?")){
          $rootScope.username="";
          sessionStorage.removeItem("username");
          localStorage.removeItem("username");
          $location.path('/');
          alert("Đăng xuất thành công");
        }
      }
      $rootScope.test = function() {
        if ($rootScope.username == null) {
            alert("Bạn chưa đăng nhập");
            $location.path('/DangNhap');
        } else {
            $location.path('/tracnghiem/' + $rootScope.idMH + '/' + $rootScope.tenMH);
        }
      }
      $scope. next = function(){
        if ($scope.start<$scope.Subjects.length - $scope.pageSize)
        $scope. start+=$scope .pageSize;
      }
      $scope. prev = function(){
        if ($scope.start > 0) $scope.start-=$scope.pageSize;
      }
      $scope.first = function() { 
        $scope.start = 0;
      }
      $scope.last = function(){
        sotrang = Math.ceil($scope.Subjects.length / $scope.pageSize)
        $scope. start=(sotrang-1)*$scope.pageSize;
      }
    
  })
  /////////////////////////quizctrl///////////////////////////////////////////
  app.controller("quizctrl", function($scope, $http, $routeParams, $interval){
    $scope.idMH = $routeParams.idMH;
    $scope.tenMH = $routeParams.tenMH;
    $scope.caccauhoi = [];
    $http.get("db/Quizs/"+ $scope.idMH +".js").then(
      function(res) {$scope.caccauhoi = res.data; console.log(res.data)},
      function(res) {console.log(res)}
    );
    $scope.start = 0;
    $scope.pageSize = 1;
    $scope. next = function(){
      if ($scope.start<$scope.caccauhoi.length - $scope.pageSize)
      $scope. start+=$scope .pageSize;
    }
    $scope. prev = function(){
      if ($scope.start > 0) $scope.start-=$scope.pageSize;
    }
    $scope.first = function() { 
      $scope.start = 0;
    }
    $scope.last = function(){
      sotrang = Math.ceil($scope.caccauhoi.length / $scope.pageSize)
      $scope. start=(sotrang-1)*$scope.pageSize;
    }
    $scope.diem=0;
    $scope.soCauDung = 0; // Số câu trả lời đúng
    // Hàm kiểm tra câu trả lời và cập nhật số câu đúng
    $scope.kiemtraPA = function (idPA, idPADung, diem){
      if (idPA == idPADung) {
          $scope.diem += diem;
          $scope.soCauDung++;
      }
    }
    // Hàm tính tỷ lệ phần trăm câu trả lời đúng
    $scope.tyLePhanTram = function () {
        return ($scope.soCauDung / $scope.caccauhoi.length) * 100;
    };
    // Hàm cập nhật tỷ lệ phần trăm trong giao diện người dùng
    function updatePercentage() {
        $scope.phanTramDung = $scope.tyLePhanTram();
    }
    // Sử dụng $interval để cập nhật tỷ lệ phần trăm mỗi giây
    var percentageInterval = $interval(updatePercentage, 1000);

    $scope.isKetThuc = true;
    $scope.ketThucBaiKiemTra = function() {
      // Hiển thị cửa sổ xác nhận
      if (confirm("Bạn có chắc chắn muốn kết thúc bài kiểm tra?")) {
          // Nếu người dùng xác nhận, chuyển sang tab điểm
          $scope.isKetThuc = false; 
          clearInterval(countdownInterval);
      } 
    };
    $scope.hetthoigian = function (){
      $scope.isKetThuc = false;
    }
    var countdownMinutes = 1  ;// số phút đếm ngược
    var countdownSeconds = countdownMinutes * 60;
    function updateCountdown() {
        var countdownElement = document.getElementById("countdown");
        var progressElement = document.getElementById("progress");

        var minutes = Math.floor(countdownSeconds / 60);
        var seconds = countdownSeconds % 60;

        countdownElement.innerText = "Thời gian còn lại: " + minutes + " phút " + seconds + " giây";

        var progressPercentage = (countdownMinutes * 60 - countdownSeconds) / (countdownMinutes * 60) * 100;
        progressElement.style.width = progressPercentage + "%";

        countdownSeconds--;
        if (countdownSeconds < 0) {
            countdownElement.innerText = "Hết thời gian!";
            clearInterval(countdownInterval);
            $scope.hetthoigian();
        }
    }
    var countdownInterval = setInterval(updateCountdown, 1000);
  })

  