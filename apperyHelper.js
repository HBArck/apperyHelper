/*
push(newItem) - adds new value to array's storage variable
pop(index|object) - removes value from array's storage variable
sort(param, asc|desc) - sorts existing array by specified parameter, by default sorts by time if available.

init all new functions - finds all storage variables and if Apperyio.storage.STORAGE_VAR.type == MODEL && MODEL == Array -> add all functions below
*/
// extending Array object
if (!Array.isArray) {
    Array.isArray = function(arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
}

// Adding sortBy function to Array prototype
!function() {
    function _dynSort(property) {
        var sortOrder = 1;
        if (property && property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        } else {
            for (var propr in this)
                if (this.hasOwnProperty(propr)) {
                    property = propr;
                    break; 
                }
        }
    
        return function(a, b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }
    Object.defineProperty(Array.prototype, "sortBy", {
        enumerable: false,
        writable: true,
        value: function() {
            return this.sort(_dynSort.apply(null, arguments));
        }
    });
}();

(function() {

    for (var i in Apperyio.storage) {
        if (Array.isArray(Apperyio.getModel(Apperyio.storage[i].type))) {
            Apperyio.storage[i].push = function(newObj) {
                var arr = this.get();
                var res = null;
                if (newObj) {
                    if (arr && arr.length) {
                        res = arr.push(newObj);
                    } else {
                        arr = [];
                        res = arr.push(newObj);
                    }
                    this.set(arr);
                    return res;
                } else {
                    console.log("You need to pass object inside this function");
                    return null;
                }
            }

            Apperyio.storage[i].pop = function(param) {
                var arr = this.get();
                var res = null;
                if (typeof param == "object") {
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i].prop == param.prop) {
                            res = arr.splice(i, 1);
                            this.set(arr);
                            break;
                        }
                    }
                    return arr;
                } else if (typeof param =="number") {
                    res = arr.splice(param, 1);
                    this.set(arr);
                    return res;
                } else {
                    console.log("You need to pass object or index inside this function");
                    return null;
                }

            }

            Apperyio.storage[i].sort = function(prop) {
                var arr = this.get();
                var res = null;
                res = arr.sortBy(prop);
                this.set(res);
                return res;
            }
        }
    }

}());