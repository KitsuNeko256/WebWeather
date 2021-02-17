function swap(array, left, right) {
	var t = array[left];
	array[left] = array[right];
	array[right] = t;
}

function partition(array, left, right, pivot) {
	while(left <= right) {
    	while (array[left] < pivot) {
        	left++;
        }
        while (array[right] > pivot) {
        	right--;
        }
        if (left <= right) {
        	swap(array, left, right);
            left++;
            right--;
        }
    }
    return left;
}

function quicksort2(array, left, right) {
	if(left >= right)
    	return;
    var pivot = array[Math.floor((left + right) / 2)];
    var index = partition(array, left, right, pivot);
    quicksort2(array, left, index - 1);
    quicksort2(array, index, right);
}
function quicksort(array) {
	quicksort2(array, 0, array.length - 1)
}

function arrayMin(array) {
	var minVal = array[0];
    for(var i = 1; i < array.length; i++){
    	if(minVal > array[i]) {
        	minVal = array[i];
        }
    }
    return minVal;
}
function arrayMax(array) {
	var maxVal = array[0];
    for(var i = 1; i < array.length; i++){
    	if(maxVal < array[i]) {
        	maxVal = array[i];
        }
    }
    return maxVal;
}
function arrayMedian(array) {
	var t = array.slice();
    quicksort(t);
    return t[Math.floor(t.length /2)];
}


var array = [];
for(var i = 0; i <= 1000; i++) {
	array.push(Math.random());
}
//console.log("MIN: " + arrayMin(array));
//console.log("MEDIAN: " + arrayMedian(array));
//console.log("MAX: " + arrayMax(array));
//quicksort(array);
//for(var i = 0; i <= 1000; i++) {
//    console.log(array[i]);
//}

var list = document.getElementsByTagName('*');  
tagCount = new Map();

for(var i = 0; i < list.length; i++) {
    if(tagCount.get(list[i].tagName) === undefined) {
        tagCount.set(list[i].tagName, 0);
    }
    tagCount.set(list[i].tagName, tagCount.get(list[i].tagName) + 1);
}
for (var [tag, count] of tagCount) {
  console.log(tag + ' - ' + count);
}
