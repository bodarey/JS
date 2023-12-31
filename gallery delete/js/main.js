(function() {


var btn = document.getElementById('play');
var statGallery = getGalleryfromData(data);
var gallery = [];
var firstBlock = document.getElementById('first-line');
var lineSelector = document.getElementById('line-selector');

 //#################
function init(){ // main function for eventListener switch the type and number of elements in gallery
    showGalleryText(statGallery);
    insertPicture();
}
function deleteImage(event){
    var elem = event.target;
    btn.classList.remove('disabled');//data-bs-toggle="modal"
    btn.removeAttribute('data-bs-toggle');
    if (elem == elem.parentElement.querySelector('.btn-success') ) {
       var temp = getElementArrayPositionfromHtmlElement(gallery,elem.parentElement);
       if (temp >= 0) {
            deleteFromGallery(gallery,temp);
            elem.parentElement.remove();
       }
    }
    showNumberOfImages();
}
//#################
function showNumberOfImages(){
    var elem = btn.nextElementSibling.nextElementSibling;
    rez = statGallery.length - gallery.length;
    elem.innerHTML = `images to add ${rez}`;
}
//#################
function insertPicture(){    
  
    if (gallery.length < 1) {
        gallery.push(statGallery[0]);
        galleryInterpolation(gallery,0);
    } else if (gallery.length < statGallery.length){
        gallery.push(addToGalleryfromStatGallery());
        galleryInterpolation(gallery,gallery.length-1);
    }
    if (gallery.length >= statGallery.length) { 
    // btn.classList.add('disabled');
       btn.setAttribute("data-bs-toggle","modal");
       console.log(btn);

    }
    showNumberOfImages();
}
//################## // find first available element from statGallery that is not in gallery and can be added => return this element
function addToGalleryfromStatGallery(){
    for (var i = 0; i < statGallery.length; i++) {
        if (gallery.indexOf(statGallery[i]) < 0) {
            return statGallery[i];
        }
    }
}
//#################
function  filterGallery(arr){
    var local = localStorage.getItem('menu') || 0;
    switch (parseInt(local)) {
        case 0:
            lineSelector.value = 0;
            arr.sort(function(a,b){
                if (a.name < b.name) {return -1;}
                if (a.name > b.name) {return 1;}
                return 0;
            });
            break;
            case 1:
                lineSelector.value = 1;
                 arr.sort(function(a,b){
                    if (a.name < b.name) {return 1;}
                    if (a.name > b.name) {return -1;}
                    return 0;
                 });
            
            break;
            case 2:
                lineSelector.value = 2;
                arr.sort(function(a,b){                    
                    return (a.date - b.date);
                 });

            break;
            case 3:
                lineSelector.value = 3;
                arr.sort(function(a,b){
                  return (b.date - a.date);
                 });
            break;
        default:
        break;
    }
}
//#################// show gallery with text depend on array of objects
function  showGalleryText(gallery){ 
    
    if (gallery.length > 0) {
        var block = document.querySelector('.first-group');
        block.classList.remove('hide','show');
        block.classList.add('show');  
    }
}
//################# // from array arr is interpolating in htmml code position i
function galleryInterpolation(arr,i){
    let element = '';
    let obj = arr[i];
    element = `
        <div class = 'col-sm-3 col-6 list' >
            <img src="http://${obj.url}" alt="${obj.name} " class = 'img-thumbnail'> 
            <div class='text-muted'> 
                <div> <b>${obj.name} </b> </div>
                <div> ${obj.description} </div>
                <div> ${getDatefromString(obj.date)} </div>          
            </div>
            <div class="btn btn-success">delete Image</div></br></br>
        </div>`;
    firstBlock.innerHTML += element;   
}
//#################// delete from array arr position i
function deleteFromGallery(arr,i){
    arr.splice(i,1);
}
//#################// return new array of objects for gallery from existing data
function getGalleryfromData(obj){ 
    var arr = [];
    arr = obj.map(function(element){
        var newObj ={};
        newObj.url = element.url;
        newObj.name = element.name;
        newObj.description = element.description;
        newObj.date = element.date;
        return newObj;
    });
    return arr;// get new array of obj from data file
}
//#################
function getDatefromString(date){
    let data = new Date(date);
    return `${data.getDate()}/${data.getMonth()+1}/${data.getFullYear()}   ${data.getHours()}:${data.getMinutes()}`;
}
//################# // element must be class of list return position or -1
function getElementArrayPositionfromHtmlElement(arr,element){
    var a = element.firstElementChild.getAttribute('src');
    a = a.substring(7);
    for(var i = 0;  i < arr.length; i++){
        if (arr[i].url == a) {
            return i;
        }
    }
    return -1;
}
//#################
function changeGallery(){
    var value = lineSelector.value;
    localStorage.setItem('menu', value);
    filterGallery(gallery);
    firstBlock.innerHTML = '';
    for (var i = 0; i < gallery.length; i++) {
        galleryInterpolation(gallery,i);
    }
}
//#################
btn.addEventListener('click',init);
firstBlock.addEventListener('click',deleteImage);
lineSelector.addEventListener('change',changeGallery);
showNumberOfImages();
filterGallery(statGallery);

}() )
