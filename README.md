# demo_cache_angular1
##1. Cache trong Angular
Angular cache là một tính năng mới vượt ra ngoài những dịch vu tích hợp (build-in services), nó cung cấp cho chúng ta khả năng sử dụng các cơ chế để lưu trữ và tùy chỉnh content trong cache.

##2. $cacheFactory

Angularjs sử dụng $cacheFactory để quản lý, khởi tạo cũng như thao tác với Cache.

$cacheFactory là một dịch vụ để tạo ra một đối tượng cache.
```
var cache = $cacheFactory('demoCache');
```
Trên đây là đoạn code dùng để tạo ra một đối tượng cache. 
Bằng cách khai báo trên ta đã tạo ra một cache Object với ID là "demoCache"


Bạn cũng có thể thêm một số options khi khai báo đối tượng Cache của mình bằng cách thêm options đó vào tham số thứ hai:
```
  var myCache =  $cacheFactory('demoCache', {
        capacity: 3 // optional - turns the cache into LRU cache
    });
```
capacity là một options để quy định số lượng cặp key-value tối đa là 3. nếu xuất hiện cặp giá trị thứ 4 thì cặp giá trị được lưu với thời gian lâu nhất sẽ bị xóa đi.

$cacheFactory sẽ tạo ra một đối tượng Cache. Angularjs cung cấp cho chúng ta một số phương thức để thao tác với Cache Object như: get(), put(), remove(), removeAll(), info(), destroy().

3. Ví dụ minh họa

* Khai báo DemoCache factory thuộc modul 'demoCacheApp'
```
angular.module('demoCacheApp', []).
factory('DemoCache', function($cacheFactory) {
    return $cacheFactory('demoCache', {
        capacity: 3 // optional - turns the cache into LRU cache
    });
}).
```
phần khai báo này giống như giới thiệu ở trên thôi. ko có gì đặc biệt.

* Tôi sẽ tạo một Controller và các function dùng để thực hiện phép tính số học và in ra kết quả rồi tiến hành lưu phép tính và kết quả đó vào cache. Với những lần tính toán tiếp theo, Ta chỉ cần lấy số liệu đã tính trong cache hiển thị ra luôn.

Khai báo Controller

```
var MyCacheController = function($scope, DemoCache) {}
```
viết hàm tính toán:
```
$scope.tinhtoan = function() {
        var equation = $scope.equation,
            result = DemoCache.get(equation),
            status = 'Kết quả lấy ra từ Cache';
        if (!result) {
            status = 'Kết quả đc tính toán';
            result = eval(equation);
            DemoCache.put(equation, result);
        }
        $scope.result = result;
        $scope.status = status;
        $scope.cacheInfo = DemoCache.info();
    }
```
equation là phép toán bạn nhập vào.
result là hết quả của phép toán.

status là cờ giúp bạn nhận biết là kết quả đc lấy ra từ Cache hay không.

$cacheFactory cung cấp phương thức get() để lấy ra value ứng với keys được lưu trữ trong cache. bằng cách:
```
result = DemoCache.get(equation)

```
Nếu phép tính chưa được tính trước đó thì ta sẽ tính toán kết quả và đẩy nó vào trong cache
```
     if (!result) {
            status = 'Kết quả đc tính toán';
            result = eval(equation);
            DemoCache.put(equation, result);
        }
```
Để lưu cache bạn dùng phương thức put() kèm theo hai tham số lần lượt là keys và value của cache.


Lấy Cache info:
```
$scope.cacheInfo = DemoCache.info();
```
Xóa Cache
```
$scope.clearCache = function() {
        DemoCache.removeAll();
}
```
Bạn cũng có thể xóa Cache theo key mà mình mong muốn bằng phương thức remove()

 DemoCache.remove(key);

* View
```
<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.0.2/angular.min.js"></script>
<script src="/app.js"></script>

<div ng-app="demoCacheApp">
  <div ng-controller="MyCacheController">
      <input ng-model="equation" on-enter="tinhtoan()"/>
      <button ng-click="tinhtoan()">Thuc hien</button><br/>
      <input ng-model="result"/> {{status}}<br/>
      {{cacheInfo}}<br/>
      <button ng-click="clearCache()">Xoa cache</button>
  </div>
</div>
```
![Kêt quả tính toán](https://github.com/HoangQuan/demo_cache_angular1/blob/master/1.png)

Lần đầu kết quả sẽ được tính toán. 
Tiếp tục thực hiện phép toán trên kết quả sẽ được lấy ra từ cache
![Kết quả từ cache](https://github.com/HoangQuan/demo_cache_angular1/blob/master/2.png)

