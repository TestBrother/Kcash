/**
 * Created by Qing on 2018/1/28.
 */
var url = 'http://47.75.5.78:8081';
var app = angular.module('kcash',['ionic']);
var user_token = "user_token";
/**
 * 配置状态
 */
app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('start',{
            url:'/myStart',
            templateUrl:'tpl/start.html'
        })
        .state('main',{
            url:'/myMain',
            templateUrl:'tpl/main.html'
        })
        .state('purseTool',{
            url:'/myPurseTool',
            templateUrl:'purseTool/purseTool.html'
        })
        .state('setSystem',{
            url:'/mySetSystem',
            templateUrl:'setSystem/setSystem.html'
        })
        .state('signOut',{
            url:'/mysignOut',
            templateUrl:'tpl/signOut.html'
        })
        .state('register',{
            url:'/myRegister',
            templateUrl:'tpl/register.html'
        })
        .state('login',{
            url:'/myLogin',
            templateUrl:'tpl/login.html'
        })
        .state('addAsset',{
            url:'/myAddAsset',
            templateUrl:'tpl/addAsset.html'
        })
        .state('transaction',{
            url:'/myTransaction?symbol',
            templateUrl:'transaction/transaction.html',
        })
        .state('detail',{
            url:'/detail?fid',
            templateUrl:'transaction/detail.html',
        })
        .state('transactionNext',{
            url:'/transactionNext?symbol',
            templateUrl:'transaction/transactionNext.html',
        })
        .state('receive',{
            url:'/receive?symbol',
            templateUrl:'transaction/receive.html',
        })
        .state('create_wallet',{
            url:'/createWallet',
            templateUrl:'tpl/create_wallet.html',
        })
        .state('import_wallet',{
            url:'/importWallet',
            templateUrl:'tpl/import_wallet.html',
        })
        .state('deletePurse',{
            url:'/deletePurse',
            templateUrl:'purseTool/deletePurse.html',
        })
        .state('deletePursebox',{
            url:'/deletePursebox',
            templateUrl:'purseTool/deletePursebox.html',
        })
          .state('validate_memwords',{
            url:'/validateMemwords',
            templateUrl:'tpl/validate_memwords.html',
         })
        .state('changePassword',{
            url:'/myChangePassword',
            templateUrl:'tpl/changePassword.html'
        })
        .state('resetPassword',{
            url:'/myResetPassword',
            templateUrl:'tpl/resetPassword.html'
        })
        .state('setTradePassword',{
            url:'/mySetTradePassword',
            templateUrl:'tpl/setTradePassword.html'
        })
        .state('inputPassword',{
            url:'/inputPassword',
            templateUrl:'purseTool/inputPassword.html'

        })
        .state('keyInfo',{
            url:'/myKeyInfo?symbol&tradePassword&coinName',
            templateUrl:'purseTool/keyInfo.html'
        })
        .state('exportKey',{
            url:'/exportKey',
            templateUrl:'purseTool/exportKey.html'
        })
        .state('exportKey_next',{
            url:'/exportKey_next?tradePassword',
            templateUrl:'purseTool/exportKey_next.html'
        })
        .state('backups',{
            url:'/backups',
            templateUrl:'purseTool/backups.html'
        })
        .state('backupsbox',{
            url:'/backupsbox',
            templateUrl:'purseTool/backupsbox.html'
        })
        .state('backupsboxNext',{
            url:'/backupsboxNext?tradePassword',
            templateUrl:'purseTool/backupsbox_next.html'
        })

    $urlRouterProvider.otherwise('myMain');
})
/**
 * 刷新网页
 */
.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})
/**
 * 声明控制器
 */
.controller('parentCtrl',
    ['$scope','$state', '$window','$ionicPopup','$interval',function ($scope,$state,$window,$ionicPopup,$interval) {
        //跳转方法
        $scope.jump = function (arg) {
            $state.go(arg);
        };
        //返回功能
        $scope.backWard = function () {
            $window.history.back();
            console.log("返回");
        };
        //判断当前用户是否登录
        //$rootScope.isLogin = false;
        $scope.checkRequestStatus = function (result){
            if(result.status == 403){
                $scope.showAlert(result.msg,"",false);
            }else if(result.status == 401){
                $state.go("login");
            }else if(result.status == 4012){
                $state.go("start");
            }
        };

       $scope.showConfirm = function(c_title,content,goPage) {
         var confirmPopup = $ionicPopup.confirm({
            title: c_title,
            template: content
          });
          confirmPopup.then(function(res) {
            if(res) {
              $state.go(goPage);
            } else {
            }
          });
       };
      $scope.showAlert = function(content,goPage,flag) {
        var alertPopup = $ionicPopup.alert({
          title: '提示信息',
          template: content
        });
        alertPopup.then(function(res) {
            if(flag){
                $state.go(goPage);
            }
        });
      };
    }])
    //起始页
    .controller('startCtrl',['$scope','$timeout','$interval','$state',
        function ($scope,$timeout,$interval,$state) {
    }])
    .controller('mainCtrl',['$scope','$timeout' ,'$http', function ($scope,$timeout,$http) {
          $scope.getWallet = function(){
              $http({
                  method:'post',
                  url:url+'/virtualCoin/getWallet',
                  data:{token:getCookie()},
                  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                  transformRequest: function (obj) {
                      return transformRequest(obj);
                }})
               .success(function (result) {
                  if(result.status == 200){
                     $scope.walletList = result.data.walletList;
                  }else{
                      $scope.checkRequestStatus(result);
                  }
              })
               .finally(function() {
                  $scope.$broadcast('scroll.refreshComplete');
              });
          }
           $scope.getWallet();
            $scope.doRefresh = function() {
               $scope.getWallet();
            };
    }])
    .controller('signOutCtrl',['$scope','$ionicModal', function ($scope,$ionicModal) {
        //模态框
        $ionicModal.fromTemplateUrl('templates/mymodal.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });
    }])
    .controller('purseToolCtrl',['$scope', function ($scope) {

    }])
    .controller('createWalletCtrl',['$scope','$http', '$rootScope', function ($scope,$http,$rootScope) {
         $scope.createWallet = function () {
            $http({
                method:'post',
                url:url+'/user/createWallet',
                data:{token:getCookie(),tradepass:$scope.tradepass,tradepass2:$scope.tradepass2},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    return transformRequest(obj);
                }
            })
            .success(function (result) {
                if(result.status == 200){
                    var memWords = result.data;
                    $rootScope.memWords = memWords;
                    memWords = memWords.replace(/,/g ," ");
                    $scope.showConfirm("务必抄写助记词!",memWords,"validate_memwords");
                }else{
                    $scope.checkRequestStatus(result);
                }
            })}
        }])
     .controller('importWalletCtrl',['$scope','$http', function ($scope,$http) {
         $scope.importWallet = function () {
             var _tradepass = $scope.tradepass;
             var _menWords = $scope.menWords;
             if(typeof(_tradepass) == "undefined" || _tradepass == ""){
                return $scope.showAlert("钱包密码不能为空","",false);
             }
             if(typeof(_menWords) == "undefined" || _menWords == ""){
                return $scope.showAlert("助记词不能为空","",false);
             }
             _menWords = _menWords.replace(/\s+/g ,",");
            $http({
                method:'post',
                url:url+'/user/importWalletByMemWords',
                data:{token:getCookie(),tradepass:_tradepass,menWords:_menWords},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    return transformRequest(obj);
                }
            })
            .success(function (result) {
                if(result.status == 200){
                    return $scope.showAlert("导入成功","main",true);
                }else{
                    $scope.checkRequestStatus(result);
                }
            })}
        }])
    .controller('deletePurseController',['$scope','$http', function ($scope,$http) {
        $scope.deletePursebox = function () {
            $scope.jump('deletePursebox');
        }
    }])
    .controller('deletePurseboxController',['$scope','$http', function ($scope,$http) {
        $scope.confirmDeleteWallet = function () {
            var _menWords = $("#delMemWords").val();
            if(typeof(_menWords) == "undefined" || _menWords == ""){
                return $scope.showAlert("助记词不能为空","",false);
            }
            _menWords = _menWords.replace(/\s+/g ,",");
            $http({
                method:'post',
                url:url+'/user/deleteWalletByMemWords',
                data:{token:getCookie(),menWords:_menWords},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    return transformRequest(obj);
                }
            })
            .success(function (result) {
                if(result.status == 200){
                    return $scope.showAlert("删除成功","start",true);
                }else{
                    $scope.checkRequestStatus(result);
                }
            })}
    }])

    .controller('validateMemwordsCtrl',['$scope','$http','$rootScope', function ($scope,$http,$rootScope) {
        var memWords = $rootScope.memWords;
        $rootScope.memWords = "";
        if(typeof(memWords) != "undefined" && memWords != ""){
            var tempArr = memWords.split(",");
            tempArr.sort(function(){ return 0.5 - Math.random() })
            $scope.memWordsArr = tempArr;
        }

        $scope.selectMemwords = function(value) {
          if(typeof($("#"+value).attr("style")) == "undefined" || $("#"+value).attr("style") == ""){
             $("#"+value).attr("style","background:#a07118");
             $("#mem_words_div").append("<span style='background:#a07118' id="+value+"-a>"+$("#"+value).text()+"</span>");
          }else{
            $("#"+value).attr("style","");
            $("#"+value+"-a").remove();
          }
      }

         $scope.confirmCreateWallet = function () {
            var spanObj = $("#mem_words_div").children();
            var memWords = "";
            for(var i = 0 ; i<spanObj.length ; i++){
                memWords = memWords + $(spanObj[i]).text()+",";
            }
            memWords = memWords.substring(0,memWords.length-1);
            $http({
                method:'post',
                url:url+'/user/confirmCreateWallet',
                data:{token:getCookie(),memWords:memWords},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    return transformRequest(obj);
                }
            })
            .success(function (result) {
                if(result.status == 200){
                    $scope.showAlert("创建成功","main",true);
                }else{
                    $scope.checkRequestStatus(result);
                }
            })}
        }])
    //注册
    .controller('registerCtrl', ['$scope','$http', function ($scope,$http) {
        //验证码
        $scope.verification = function () {
            $http({
                method: 'post',
                url: url+'/user/authCode',
                data: {phone:$scope.phone},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    return transformRequest(obj);
                }
            })
                .success(function (result) {
                    if(result.status == 200){
                        console.log(result.data);
                        $("#codeContent").parent().attr("disabled","disabled");
                        var secondNumber = 60;
                        $("#codeContent").text(secondNumber+"s");
                        var name = setInterval(function () {
                            if(secondNumber>0){
                                secondNumber--;
                                $("#codeContent").text(secondNumber+"s");
                            }else {
                                $("#codeContent").parent().removeAttr("disabled");
                                $("#codeContent").text("重新获取");
                                clearInterval(name);
                            }
                        },1000);
                    }else{
                        $scope.checkRequestStatus(result);
                    }

                })
        }
        //注册

        $scope.register = function () {
            $http({
                method:'post',
                url:url+'/user/register',
                data:{floginName:$scope.phone,floginPassword:$scope.floginPassword,authCode:$scope.authCode},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    return transformRequest(obj);
                }
            })
                .success(function (result) {
                    console.log(result);
                    if(result.status == 200){
                        setCookie('user_token',result.data,7);
                        $scope.jump("login");
                        console.log('success')
                    }else{
                        checkRequestStatus(result);
                        console.log('success')
                    }
                })
        }
    }])
    .controller('loginCtrl',['$scope','$http', function ($scope,$http) {
        //实现登录
        $scope.login = function () {
            $http({
                method:'post',
                url:url+'/user/login',
                data:{floginName:$scope.floginName,floginPassword:$scope.floginPassword},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    return transformRequest(obj);
                }
            })
                .success(function (result) {
                    if(result.status == 200){
                        setCookie('user_token',result.data,7);
                        $scope.jump("main");
                    }else{
                        $scope.checkRequestStatus(result);
                    }
                })
        }

    }])
    .controller('setSystemCtrl',['$scope', function ($scope) {

    }])
    .controller('addAssetCtrl',['$scope','$http', function ($scope,$http) {
         $scope.getWalletCoinType = function(){
              $http({
                  method:'post',
                  url:url+'/virtualCoin/getWalletCoinType',
                  data:{token:getCookie()},
                  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                  transformRequest: function (obj) {
                      return transformRequest(obj);
                }})
               .success(function (result) {
                  if(result.status == 200){
                     $scope.walletList = result.data;
                  }else{
                      $scope.checkRequestStatus(result);
                  }
              })
               .finally(function() {
                  $scope.$broadcast('scroll.refreshComplete');
              });
          }
           $scope.checked = function(){
             var data = $scope.walletList;
             for (var i=0 ; i < data.length; i++){
                  if(data[i].swithflag != "off"){
                      $("#symbol-"+data[i].symbol).attr("checked","checked");
                  }
             }
         }
           $scope.getWalletCoinType();
           setTimeout(function () { $scope.checked(); }, 300);

           $scope.updateWallatOrAddress = function(_symbol,_type){
                 $http({
                     method:'post',
                     url:url+'/virtualCoin/updateWallatOrAddress',
                     data:{symbol:_symbol,type:_type,token:getCookie()},
                     headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                     transformRequest: function (obj) {
                         return transformRequest(obj);
                   }})
                  .success(function (result) {
                     if(result.status != 200){
                        $scope.checkRequestStatus(result);
                     }
                 })
             }

           $scope.checkCoinSwitch = function(symbol){
               var flag = $("#symbol-"+symbol).val();
               if(flag == 'no'){
                    $("#symbol-"+symbol).attr("checked","checked");
               }else if(flag == "off"){
                    $("#symbol-"+symbol).val("open");
                    $("#symbol-"+symbol).attr("checked","checked");
                    $scope.updateWallatOrAddress(symbol,"open");
               }else{
                    $("#symbol-"+symbol).val("off");
                    $("#symbol-"+symbol).removeAttr("checked");
                    $scope.updateWallatOrAddress(symbol,"off");
               }
           }

    }])
    .controller('transactionCtrl',['$scope','$http','$stateParams', function ($scope,$http,$stateParams) {
       var _symbol = $stateParams.symbol;
       $scope.getCoinOperateDetail = function(){
          $http({
              method:'post',
              url:url+'/virtualCoin/getCoinOperateDetail',
              data:{token:getCookie(),currentPage:1,pageSize:10,status:-1,symbol:_symbol},
              headers: {'Content-Type': 'application/x-www-form-urlencoded'},
              transformRequest: function (obj) {
                  return transformRequest(obj);
            }})
           .success(function (result) {
              if(result.status == 200){
                 $scope.wallet = result.data;
                  $scope.wallet.symbol = _symbol;
                 $scope.operationList = result.data.tradeList;
              }else{
                  $scope.checkRequestStatus(result);
              }
          })
      }
      $scope.getCoinOperateDetail();
      $scope.transaction = function(){
        window.location.href="#/transactionNext?symbol="+ _symbol;
      }
      $scope.receive = function(){
          window.location.href="#/receive?symbol="+ _symbol;
        }
        $scope.showDetail = function(fid){
            window.location.href="#/detail?fid="+ fid;
        }
    }])
    .controller('detailController',['$scope','$http','$stateParams', function ($scope,$http,$stateParams) {
        var _symbol = $stateParams.fid;
        $scope.getOperateDetail = function(){
            $http({
                method:'post',
                url:url+'/virtualCoin/findCoinOperateDetailById',
                data:{token:getCookie(),fid:_symbol},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    return transformRequest(obj);
                }})
                .success(function (result) {
                    if(result.status == 200){
                        $scope.operationDetail = result.data;
                        makeCode("urlQRCode",result.data,104,104);
                    }else{
                        $scope.checkRequestStatus(result);
                    }
                })
        }
        $scope.getOperateDetail();
    }])
    .controller('transactionNextCtrl',['$scope','$http','$stateParams', function ($scope,$http,$stateParams) {
           var _symbol = $stateParams.symbol;
           $scope.getOutBtcAddress = function(){
              $http({
                  method:'post',
                  url:url+'/virtualCoin/getOutBtcAddress',
                  data:{token:getCookie(),symbol:_symbol},
                  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                  transformRequest: function (obj) {
                      return transformRequest(obj);
                }})
               .success(function (result) {
                  if(result.status == 200){
                     $scope.wallet = result.data;
                     var temp = $scope.wallet.maxfees - $scope.wallet.minfees;
                      $scope.wallet.middle1 = (parseFloat($scope.wallet.minfees) + temp/3).toFixed(5);
                      $scope.wallet.middle2 = (parseFloat($scope.wallet.minfees) + temp/2).toFixed(5);
                      setTimeout(function () { $("#selectfees").children("option").eq(0).remove(); }, 300);
                     $scope.tradeList = result.data.tradeList;
                  }else{
                      $scope.checkRequestStatus(result);
                  }
              })
          }
          $scope.getOutBtcAddress();

          $scope.withdrawBtc = function(){
               var _tradepass = $scope.tradePassword;
               var _withdrawAmount = $scope.withdrawAmount;
               var _address = $scope.address;
               var _fees = $scope.fees;
               if(typeof(_address) == "undefined" || _address == ""){
                  return $scope.showAlert("地址不能为空","",false);
               }
               if(typeof(_withdrawAmount) == "undefined" || _withdrawAmount == ""){
                  return $scope.showAlert("数量不能为空","",false);
               }
               if(typeof(_tradepass) == "undefined" || _tradepass == ""){
                  return $scope.showAlert("钱包密码不能为空","",false);
               }
               if(typeof(_fees) == "undefined" || _fees == ""){
                  return $scope.showAlert("手续费不能为空","",false);
               }
                $http({
                  method:'post',
                  url:url+'/virtualCoin/withdrawBtc',
                  data:{token:getCookie(),
                        symbol:_symbol,
                        address:_address,
                        withdrawAmount:_withdrawAmount,
                        tradePassword:_tradepass,
                        fees:_fees
                        },
                  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                  transformRequest: function (obj) {
                      return transformRequest(obj);
                }})
               .success(function (result) {
                  if(result.status == 200){
                     $scope.showAlert("转账成功","main",true);
                  }else{
                      $scope.checkRequestStatus(result);
                  }
              })
          }
        }])

    .controller('receiveCtrl',['$scope','$http','$stateParams', function ($scope,$http,$stateParams) {
           var _symbol = $stateParams.symbol;
           $scope.getRecharge = function(){
              $http({
                  method:'post',
                  url:url+'/virtualCoin/recharge',
                  data:{token:getCookie(),symbol:_symbol},
                  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                  transformRequest: function (obj) {
                      return transformRequest(obj);
                }})
               .success(function (result) {
                  if(result.status == 200){
                     $scope.receive = result.data;
                     makeCode("qrcodeDiv",result.data,150,150);
                  }else{
                      $scope.checkRequestStatus(result);
                  }
              })
          }
          $scope.getRecharge();
          $scope.copyAddress = function(textAreaId,msgDiv){
            copyAddress($scope.receive,textAreaId,msgDiv);
          }
        }])
    .controller('changePasswordCtrl',['$scope','$http', function ($scope,$http) {
            //验证码
            $scope.verification = function () {
                if(typeof($scope.phone) == "undefined" || $scope.phone == ""){
                    return $scope.showAlert("手机号不能为空","",false);
                }
                $http({
                    method: 'post',
                    url:url+'/user/authCode',
                    data: {phone:$scope.phone},
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function (obj) {
                        return transformRequest(obj);
                    }
                })
                .success(function (result) {
                    if (result.status == 200) {
                        console.log(result.data);
                        $("#changeCode").parent().attr("disabled", "disabled");
                        var secondNumber = 60;
                        $("#changeCode").text(secondNumber + "s");
                        var name = setInterval(function () {
                            if (secondNumber > 0) {
                                secondNumber--;
                                $("#changeCode").text(secondNumber + "s");
                            } else {
                                $("#changeCode").parent().removeAttr("disabled");
                                $("#changeCode").text("重新获取");
                                clearInterval(name);
                            }
                        }, 1000);
                    } else {
                        $scope.checkRequestStatus(result);
                    }
                })
        }
        $scope.changePassword = function () {
            var _authCode = $scope.authCode;
            var _newPassword = $scope.newPassword;
            if(typeof(_authCode) == "undefined" || _authCode == ""){
                return $scope.showAlert("验证码不能为空","",false);
            }
            if(typeof(_newPassword) == "undefined" || _newPassword == ""){
                return $scope.showAlert("密码不能为空","",false);
            }

            $http({
                method:'post',
                url:url+'/user/changePassword',
                data:{token:getCookie(),authCode:_authCode,oldPassword:$scope.oldPassword,newPassword:_newPassword},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    return transformRequest(obj);
                }
            })
                .success(function (result) {
                    if(result.status == 200){
                        $scope.showAlert("密码修改成功","main",true);
                    }else{
                        $scope.checkRequestStatus(result);
                    }
                })
        }
    }])

    .controller('resetPasswordCtrl',['$scope','$http', function ($scope,$http) {
        $scope.verification = function () {
            if(typeof($scope.phone) == "undefined" || $scope.phone == ""){
                return $scope.showAlert("手机号不能为空","",false);
            }
            $http({
                method: 'post',
                url: url+'/user/authCode',
                data: {phone:$scope.phone},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    return transformRequest(obj);
                }
            })
                .success(function (result) {
                    if(result.status == 200){
                        console.log(result.data);
                        $("#codeContent").parent().attr("disabled","disabled");
                        var secondNumber = 60;
                        $("#codeContent").text(secondNumber+"s");
                        var name = setInterval(function () {
                            if(secondNumber>0){
                                secondNumber--;
                                $("#codeContent").text(secondNumber+"s");
                            }else {
                                $("#codeContent").parent().removeAttr("disabled");
                                $("#codeContent").text("重新获取");
                                clearInterval(name);
                            }
                        },1000);
                    }else{
                        $scope.checkRequestStatus(result);
                    }

                })
        }
        $scope.resetPassword = function () {
            var _authCode = $scope.authCode;
            var _phone = $scope.phone;
            var _newPassword = $scope.newPassword;
            var _repeatPassword = $scope.repeatPassword;
            if(typeof(_authCode) == "undefined" || _authCode == ""){
                return $scope.showAlert("验证码不能为空","",false);
            }
            if(typeof(_phone) == "undefined" || _phone == ""){
                return $scope.showAlert("手机号不能为空","",false);
            }
            if(typeof(_newPassword) == "undefined" || _newPassword == ""){
                return $scope.showAlert("密码不能为空","",false);
            }
            if(_newPassword != _repeatPassword){
                return $scope.showAlert("两次密码不一致","",false);
            }
            $http({
                method:'post',
                url:url+'/user/resetPassword',
                data:{token:getCookie(),authCode:_authCode,phone:_phone,newPassword:_newPassword,repeatPassword:_repeatPassword },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    return transformRequest(obj);
                }
            })
                .success(function (result) {
                    if(result.status == 200){
                        $scope.showAlert("密码找回成功","login",true);
                    }else{
                        $scope.checkRequestStatus(result);
                    }

                })
        }
    }])
    //设置交易密码接口
    .controller('setTradePasswordCtrl',['$scope','$http', function ($scope,$http) {
        $scope.setTradePassword = function () {
            $http({
                method:'post',
                url:url+'/user/setTradePassword',
                data:{token:getCookie(),tradePassword:$scope.tradePassword,repeatPassword:$scope.repeatPassword},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    return transformRequest(obj);
                }
            })
                .success(function (result) {
                    console.log(result);
                })
        }
    }])
    //输入交易密码
    .controller('inputPasswordCtrl',['$scope','$http','$state','$ionicPopup', function ($scope,$http,$state,$ionicPopup) {
        $scope.inputPassword = function () {
            $http({
                method:'post',
                url:url+'/user/vilidateTradePassword',
                data:{token:getCookie(),tradePassword:$scope.tradePassword},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    return transformRequest(obj);
                }
            })
                .success(function (result) {
                    console.log(result)
                    if(result.status == 200){
                        $scope.showConfirm('重要提示','拥有钱包备份就能完全控制钱包' +
                            '资产，因此强烈建议你在使用钱包之前做好备份，并将钱包备' +
                            '份保存到安全的地方','backupsbox_next');
                    }else{
                        $scope.checkRequestStatus(result);
                    }
                })
        }
    }])
    //获取私钥
    .controller('keyInfoCtrl',['$scope','$http','$stateParams', function ($scope,$http,$stateParams) {
        var _symbol = $stateParams.symbol;
        var _tradePassword = $stateParams.tradePassword;
        console.log(_symbol+_tradePassword)
        $scope.keyInfo = function () {
            $http({
                method:'post',
                url:url+'/user/dumpPrivkey',
                data:{token:getCookie(),symbol:_symbol,tradePassword:_tradePassword},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    return transformRequest(obj);
                }
            })
                .success(function (result) {
                    if(result.status == 200){
                        $scope.wallet = result.data;
                        $scope.wallet.fshortname = $stateParams.coinName;
                    }
                })
        }
        $scope.keyInfo();
        $scope.copyAddress = function(textAreaId,msgDiv){
            copyAddress($scope.wallet.address,textAreaId,msgDiv);
        }
        $scope.copyKey = function(textAreaId,msgDiv){
            copyAddress($scope.wallet.privkey,textAreaId,msgDiv);
        }
        //$scope.info = function(symbol){
        //    window.location.href="#/transactionNext?symbol="+ _symbol;
        //}
    }])
    //导出输入密钥密码
    .controller('exportKeyCtrl',['$scope','$http', function ($scope,$http) {
        $scope.exportKey = function () {
            $http({
                method:'post',
                url:url+'/user/vilidateTradePassword',
                data:{token:getCookie(),tradePassword:$scope.tradePassword},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    return transformRequest(obj);
                }
            })
                .success(function (result) {
                    if(result.status == 200){
                        window.location.href="#/exportKey_next?tradePassword="+$scope.tradePassword;
                    }else{
                        $scope.checkRequestStatus(result);
                    }
                })
        }
    }])
    //导出密钥
    .controller('exportkeyNextCtrl',['$scope','$http','$stateParams', function ($scope,$http,$stateParams) {
        $scope.password = $stateParams.tradePassword;
        $scope.getWallet = function(){
              $http({
                  method:'post',
                  url:url+'/virtualCoin/getWallet',
                  data:{token:getCookie()},
                  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                  transformRequest: function (obj) {
                      return transformRequest(obj);
                }})
               .success(function (result) {
                  if(result.status == 200){
                     $scope.walletList = result.data.walletList;
                  }else{
                      $scope.checkRequestStatus(result);
                  }
              })
               .finally(function() {
                  $scope.$broadcast('scroll.refreshComplete');
              });
          }
           $scope.getWallet();
    }])
    .controller('backups',['$scope','$http', function ($scope,$http) {
        $scope.backups = function () {
            $http({
                method:'post',
                url:url+'/user/vilidateTradePassword',
                data:{token:getCookie(),tradePassword:$scope.tradePassword},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    return transformRequest(obj);
                }
            })
                .success(function (result) {
                    if(result.status == 200){
                        window.location.href="#/backupsboxNext?tradePassword="+$scope.tradePassword;
                    }else{
                        //$scope.checkRequestStatus(result);
                    }
                    console.log(result)
                })
        }
    }])
    .controller('backupsbox',['$scope', function ($scope) {
        }])
    .controller('backupsboxNext',['$scope','$http','$stateParams','$rootScope', function ($scope,$http,$stateParams,$rootScope) {
        $scope.password = $stateParams.tradePassword;
        $scope.backupsboxNext = function () {
            $http({
                method:'post',
                url:url+'/user/getMemWords',
                data:{token:getCookie(),tradePassword:$scope.password},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    return transformRequest(obj);
                }
            })
                .success(function (result) {
                    console.log(result);
                    var memWords = result.data;
                    $rootScope.memWords = memWords;
                    memWords = memWords.replace(/,/g ," ");
                    console.log(memWords)
                }
            )}
        $scope.backupsboxNext()

    }])
//Cookie存储token
function getCookie(){
    var c_name = user_token;
    if (document.cookie.length>0){
        var c_start=document.cookie.indexOf(c_name + "=");
        if (c_start!=-1){
            c_start=c_start + c_name.length+1;
            var c_end=document.cookie.indexOf(";",c_start);
            if (c_end==-1) {
                c_end=document.cookie.length;
            }
            console.log(document.cookie.substring(c_start,c_end));
            return document.cookie.substring(c_start,c_end);
        }
    }
    return "";
}
function setCookie(c_name,value,expiredays){
    var exdate=new Date();
    exdate.setDate(exdate.getDate()+expiredays);
    document.cookie=c_name+ "=" +value+((expiredays==null) ? "" : "; expires="+exdate.toGMTString())
}

function delCookie(c_name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(c_name);
    if(cval!=null)
    document.cookie= c_name + "="+cval+";expires="+exp.toUTCString();
}

//拼接
function transformRequest(obj){
    var str = [];
    for (var p in obj) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
    return str.join("&");
}


function makeCode (boxId,content,width,height) {
	new QRCode(document.getElementById(""+boxId), {
    	width : width,
    	height : height
    }).makeCode(content);
}
function copyAddress(content,textAreaId,msgDiv){
  var input = document.getElementById(""+textAreaId);
  input.value = content; // 修改文本框的内容
  input.select(); // 选中文本
  document.execCommand("copy"); // 执行浏览器复制命令
  var secondNumber = 3;
    $("#"+msgDiv).html("复制成功");
    $("#"+msgDiv).show();
  setTimeout(function () {
      $("#"+msgDiv).hide();
  },2000);
  setInterval(function () {
      if(secondNumber>0)
          secondNumber--;
  },1000);
}

function signOut() {
    delCookie(user_token);
   window.location.href = "#/myLogin";
}